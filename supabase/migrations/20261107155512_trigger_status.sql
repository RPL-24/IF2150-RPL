-- =========================================================================
-- L7 · Migration 2: trigger status, riwayat, notifikasi, upvote, RPC duplikat
-- Semua trigger DILEWATI untuk service_role (script seed menulis riwayat,
-- notifikasi, dan counter upvote sendiri).
-- =========================================================================

-- ── A. TAMBAL GRANT ──────────────────────────────────────────────────────
-- Admin hanya boleh mengubah kolom status; kolom lain (upvote, skor, waktu) diurus trigger.
-- Revoke tingkat tabel juga mencabut grant kolom lama, jadi urutannya revoke lalu grant.
revoke update on public.laporan from anon, authenticated;
grant update (status, tahap, alasan_penolakan) on public.laporan to authenticated;

-- User hanya boleh menandai notifikasi dibaca (sudah ada di L4, diulang supaya eksplisit).
revoke update on public.notifikasi from anon, authenticated;
grant update (status_baca) on public.notifikasi to authenticated;

-- kunci_fungsi: default privileges Supabase memberi EXECUTE ke anon & authenticated.
-- laporan_terbuka tetap boleh anon (dipakai policy foto/video publik).
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.peran_saya() from public, anon;
revoke execute on function public.boleh_dukung(uuid) from public, anon;
grant execute on function public.peran_saya() to authenticated;
grant execute on function public.boleh_dukung(uuid) to authenticated;

-- ── B. HELPER: dari_service_role ─────────────────────────────────────────
-- True jika request datang dengan secret key (role JWT = service_role).
-- Sengaja TIDAK memakai current_user: di fungsi security definer nilainya = pemilik fungsi.
-- nullif: setting yang pernah di-set lalu di-reset bernilai '' dan ''::jsonb akan error.
create function public.dari_service_role() returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '')
         = 'service_role'
$$;
revoke execute on function public.dari_service_role() from public, anon, authenticated;

-- ── C. cek_transisi_status (BEFORE INSERT OR UPDATE on laporan) ──────────
-- pg_trigger_depth() = 1 → update langsung (admin lewat ValidasiController).
-- pg_trigger_depth() > 1 → update dari trigger hasil_perbaikan / evaluasi.
create function public.cek_transisi_status() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_dari_trigger boolean := pg_trigger_depth() > 1;
begin
  if public.dari_service_role() then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.status <> 'diterima' or new.tahap is not null then
      raise exception 'Laporan baru harus berstatus diterima tanpa tahap penanganan.';
    end if;
    if new.alasan_penolakan is not null then
      raise exception 'Alasan penolakan hanya boleh diisi untuk laporan yang ditolak.';
    end if;
    return new;
  end if;

  -- Tanpa transisi (mis. update counter oleh trigger upvote): lolos hanya jika alasan tidak diubah.
  if (new.status, new.tahap) is not distinct from (old.status, old.tahap) then
    if new.alasan_penolakan is distinct from old.alasan_penolakan then
      if old.status = 'ditolak' then
        raise exception 'Alasan penolakan tidak bisa diubah setelah laporan ditolak.';
      end if;
      raise exception 'Alasan penolakan hanya boleh diisi untuk laporan yang ditolak.';
    end if;
    return new;
  end if;

  -- Alasan penolakan: wajib untuk ditolak, harus kosong untuk status lain.
  if new.status = 'ditolak' then
    if length(trim(coalesce(new.alasan_penolakan, ''))) = 0 then
      raise exception 'Alasan penolakan wajib diisi saat menolak laporan %.', new.id_tiket;
    end if;
  elsif new.alasan_penolakan is not null then
    raise exception 'Alasan penolakan hanya boleh diisi untuk laporan yang ditolak.';
  end if;

  if not v_dari_trigger then
    if old.status = 'diterima'
       and (new.status = 'ditolak'
            or (new.status = 'dikerjakan' and new.tahap = 'menunggu_eksekusi')) then
      return new;
    end if;
    if old.status = 'dikerjakan' then
      raise exception 'Status laporan % yang sedang dikerjakan hanya bisa berubah lewat unggah hasil perbaikan atau evaluasi.',
        new.id_tiket;
    end if;
  elsif old.status = 'dikerjakan' then
    if old.tahap = 'menunggu_eksekusi' and new.status = 'dikerjakan' and new.tahap = 'menunggu_evaluasi' then
      return new;
    end if;
    if old.tahap = 'menunggu_evaluasi' and new.status = 'berhasil' and new.tahap is null then
      new.waktu_selesai := now();
      return new;
    end if;
    if old.tahap = 'menunggu_evaluasi' and new.status = 'dikerjakan' and new.tahap = 'menunggu_eksekusi' then
      return new;
    end if;
  end if;

  raise exception 'Perubahan status laporan % dari "%" ke "%" tidak diizinkan.',
    new.id_tiket, concat_ws('/', old.status, old.tahap), concat_ws('/', new.status, new.tahap);
end; $$;
revoke execute on function public.cek_transisi_status() from public, anon, authenticated;

create trigger cek_transisi_status before insert or update on public.laporan
  for each row execute function public.cek_transisi_status();

-- ── D. catat_perubahan_status (AFTER INSERT OR UPDATE OF status, tahap) ──
-- Satu perubahan (status, tahap) = satu baris riwayat_status + satu notifikasi ke pelapor.
-- Catatan riwayat hanya terisi alasan penolakan; selain itu null.
-- Template pesan: lihat docs (DPPL Algo-042/043, C23 kirimNotifikasiSelesai) + USULAN.
create function public.catat_perubahan_status() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_catatan text;
  v_pesan   text;
begin
  if public.dari_service_role() then
    return null;
  end if;

  if tg_op = 'INSERT' then
    v_pesan := format('Laporan Anda (%s) diterima dan menunggu validasi petugas.', new.id_tiket);
  elsif (new.status, new.tahap) is not distinct from (old.status, old.tahap) then
    return null;
  elsif new.status = 'ditolak' then
    v_catatan := new.alasan_penolakan;
    v_pesan := format('Laporan Anda (%s) ditolak dengan alasan: %s', new.id_tiket, new.alasan_penolakan);
  elsif old.status = 'diterima' then
    v_pesan := format('Laporan Anda (%s) telah divalidasi dan diteruskan ke tim lapangan.', new.id_tiket);
  elsif new.tahap = 'menunggu_evaluasi' then
    v_pesan := format('Perbaikan laporan Anda (%s) sudah dikerjakan dan sedang dievaluasi.', new.id_tiket);
  elsif old.tahap = 'menunggu_evaluasi' then
    -- Catatan evaluasi untuk eksekutor (dikirim lewat notifikasi di trigger G), tidak masuk riwayat pelapor.
    v_pesan := case when new.status = 'berhasil'
      then format('Laporan kerusakan fasilitas publik Anda (%s) telah selesai diperbaiki.', new.id_tiket)
      else format('Perbaikan laporan Anda (%s) belum dapat diterima dan dikerjakan ulang oleh tim lapangan.', new.id_tiket)
    end;
  else
    -- Tidak terjangkau selama cek_transisi_status aktif; jaga-jaga.
    v_pesan := format('Status laporan Anda (%s) berubah menjadi %s.', new.id_tiket,
                      concat_ws('/', new.status, new.tahap));
  end if;

  insert into public.riwayat_status (id_laporan, status, tahap, catatan)
  values (new.id, new.status, new.tahap, v_catatan);

  insert into public.notifikasi (id_user, id_laporan, isi_pesan)
  values (new.id_pelapor, new.id, v_pesan);

  return null;
end; $$;
revoke execute on function public.catat_perubahan_status() from public, anon, authenticated;

create trigger catat_perubahan_status after insert or update of status, tahap on public.laporan
  for each row execute function public.catat_perubahan_status();

-- ── E. tambah_upvote (AFTER INSERT on upvote) ────────────────────────────
-- Rumus skor (0–100): least(100, jumlah_upvote * 10). Ruas kanan SET memakai nilai lama.
create function public.tambah_upvote() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if public.dari_service_role() then
    return null;
  end if;

  update public.laporan
  set jumlah_upvote  = jumlah_upvote + 1,
      skor_prioritas = least(100, (jumlah_upvote + 1) * 10)
  where id = new.id_laporan;

  return null;
end; $$;
revoke execute on function public.tambah_upvote() from public, anon, authenticated;

create trigger tambah_upvote after insert on public.upvote
  for each row execute function public.tambah_upvote();

-- ── F. terima_hasil_perbaikan (AFTER INSERT on hasil_perbaikan) ──────────
-- UPDATE ber-WHERE sekaligus mengunci baris: unggahan ganda yang bersamaan,
-- yang kedua akan menemukan 0 baris lalu gagal.
create function public.terima_hasil_perbaikan() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  if public.dari_service_role() then
    return null;
  end if;

  update public.laporan
  set tahap = 'menunggu_evaluasi'
  where id = new.id_laporan and status = 'dikerjakan' and tahap = 'menunggu_eksekusi';

  if not found then
    raise exception 'Hasil perbaikan hanya bisa diunggah untuk laporan yang sedang menunggu eksekusi.';
  end if;

  return null;
end; $$;
revoke execute on function public.terima_hasil_perbaikan() from public, anon, authenticated;

create trigger terima_hasil_perbaikan after insert on public.hasil_perbaikan
  for each row execute function public.terima_hasil_perbaikan();

-- ── G. terapkan_evaluasi (AFTER INSERT on evaluasi) ──────────────────────
-- Terapkan keputusan ke laporan, lalu kirim notifikasi ke eksekutor untuk SEMUA keputusan.
create function public.terapkan_evaluasi() returns trigger
language plpgsql security definer set search_path = ''
as $$
declare
  v_tiket     text;
  v_eksekutor uuid;
  v_judul     text;
begin
  if public.dari_service_role() then
    return null;
  end if;

  select h.id_eksekutor into v_eksekutor
  from public.hasil_perbaikan h
  where h.id_hasil = new.id_hasil and h.id_laporan = new.id_laporan;

  if not found then
    raise exception 'Hasil perbaikan yang dievaluasi bukan milik laporan ini.';
  end if;

  if new.keputusan = 'selesai' then
    update public.laporan set status = 'berhasil', tahap = null
    where id = new.id_laporan and status = 'dikerjakan' and tahap = 'menunggu_evaluasi'
    returning id_tiket into v_tiket;
  else
    update public.laporan set tahap = 'menunggu_eksekusi'
    where id = new.id_laporan and status = 'dikerjakan' and tahap = 'menunggu_evaluasi'
    returning id_tiket into v_tiket;
  end if;

  if not found then
    raise exception 'Evaluasi hanya bisa dilakukan untuk laporan yang sedang menunggu evaluasi.';
  end if;

  v_judul := case new.keputusan
    when 'selesai'           then 'Perbaikan dinyatakan selesai'
    when 'belum_selesai'     then 'Perbaikan belum selesai'
    when 'minta_ulang_bukti' then 'Unggah ulang bukti kerja'
  end;

  insert into public.notifikasi (id_user, id_laporan, isi_pesan)
  values (
    v_eksekutor,
    new.id_laporan,
    case when length(trim(coalesce(new.catatan, ''))) = 0
      then format('%s (%s).', v_judul, v_tiket)
      else format('%s (%s): %s', v_judul, v_tiket, new.catatan)
    end
  );

  return null;
end; $$;
revoke execute on function public.terapkan_evaluasi() from public, anon, authenticated;

create trigger terapkan_evaluasi after insert on public.evaluasi
  for each row execute function public.terapkan_evaluasi();

-- ── H. RPC cari_laporan_duplikat (KF05) ──────────────────────────────────
-- Laporan aktif sekategori dalam radius ≤ 20 m. Security definer supaya warga bisa melihat
-- laporan orang lain, tapi hanya id_tiket/status/jarak (TANPA id_pelapor).
-- R = 6371000 m, sama dengan RADIUS_BUMI_M di src/server/entities/Lokasi.ts.
-- Prefilter kotak ±0.0003° (≈33 m) sebelum haversine; least(1, ...) menahan galat float di asin.
create function public.cari_laporan_duplikat(
  p_lat double precision,
  p_lng double precision,
  p_kategori public.kategori_kerusakan
)
returns table (id_tiket text, status public.status_laporan, jarak_m double precision)
language sql stable security definer set search_path = ''
as $$
  select l.id_tiket, l.status, j.jarak_m
  from public.laporan l
  cross join lateral (
    select 2 * 6371000 * asin(least(1, sqrt(
             power(sin(radians(l.latitude - p_lat) / 2), 2)
             + cos(radians(p_lat)) * cos(radians(l.latitude))
               * power(sin(radians(l.longitude - p_lng) / 2), 2)
           ))) as jarak_m
  ) j
  where l.status in ('diterima', 'dikerjakan')
    and l.kategori = p_kategori
    and l.latitude  between p_lat - 0.0003 and p_lat + 0.0003
    and l.longitude between p_lng - 0.0003 / cos(radians(p_lat))
                        and p_lng + 0.0003 / cos(radians(p_lat))
    and j.jarak_m <= 20
  order by j.jarak_m
$$;
revoke execute on function public.cari_laporan_duplikat(double precision, double precision, public.kategori_kerusakan)
  from public, anon;
grant execute on function public.cari_laporan_duplikat(double precision, double precision, public.kategori_kerusakan)
  to authenticated;
