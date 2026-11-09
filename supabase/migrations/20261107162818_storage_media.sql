-- =========================================================================
-- Bucket media, policy unggah, RPC kirim laporan/hasil, Realtime notifikasi
-- =========================================================================

-- ── BUCKET media ─────────────────────────────────────────────────────────
-- PUBLIC: berkas dibaca lewat URL publik /storage/v1/object/public/media/<path>, jadi tidak perlu
-- policy SELECT. Trade-off: siapa pun yang tahu path (uuid acak) bisa membuka berkas, termasuk
-- foto laporan yang ditolak. Dicatat di docs/implementasi/perubahan-dppl.md.
-- Batas = MAX_FILE_SIZE dan MIME = FORMAT_FOTO + FORMAT_VIDEO di src/lib/constants.ts.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760,
        array['image/jpeg','image/png','video/mp4','video/quicktime','video/x-matroska'])
on conflict (id) do update
  set public             = excluded.public,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ── POLICY storage.objects ───────────────────────────────────────────────
-- Path wajib {laporan|hasil}/{auth.uid()}/{uuid}.{ext}:
--   laporan/ hanya untuk warga (bukti laporan, UC01), hasil/ hanya untuk eksekutor (UC04).
-- Hanya INSERT. Tidak ada SELECT/UPDATE/DELETE: bucket public tidak butuh SELECT,
-- client upload dengan upsert:false (upsert butuh SELECT + UPDATE), dan berkas tidak bisa
-- dihapus/ditimpa dari client.
create policy "media: unggah ke folder sendiri sesuai peran" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'media'
    and array_length(storage.foldername(name), 1) = 2
    and (storage.foldername(name))[2] = (select auth.uid())::text
    and (
      ((storage.foldername(name))[1] = 'laporan' and (select public.peran_saya()) = 'warga')
      or ((storage.foldername(name))[1] = 'hasil' and (select public.peran_saya()) = 'eksekutor')
    )
    and lower(storage.extension(name)) in ('jpg','png','mp4','mov','mkv')
  );

-- ── POLICY RESTRICTIVE foto/video: path harus milik pengunggah ───────────
-- Ditambahkan (AND) ke policy insert permissive yang sudah ada. Mencegah baris foto/video
-- menunjuk berkas user lain atau folder yang salah: laporan/ untuk id_laporan, hasil/ untuk id_hasil,
-- folder kedua = auth.uid(), dan ekstensi path sama dengan kolom format.
create policy "foto: path milik pengunggah" on public.foto as restrictive
  for insert to authenticated
  with check (
    split_part(path, '/', 1) = case when id_laporan is not null then 'laporan' else 'hasil' end
    and split_part(path, '/', 2) = (select auth.uid())::text
    and lower(path) like '%.' || format
  );
create policy "video: path milik pengunggah" on public.video as restrictive
  for insert to authenticated
  with check (
    split_part(path, '/', 1) = case when id_laporan is not null then 'laporan' else 'hasil' end
    and split_part(path, '/', 2) = (select auth.uid())::text
    and lower(path) like '%.' || format
  );

-- ── RPC kirim_laporan (UC01) ─────────────────────────────────────────────
-- Laporan + foto/video dalam SATU transaksi: kalau satu media gagal (RLS, CHECK), laporan ikut batal.
-- SECURITY INVOKER: grant kolom, RLS, dan trigger tabel tetap berlaku seperti insert biasa.
-- p_media = [{path, format, ukuran, tipe: 'foto'|'video'}], hasil unggahMedia() di src/lib/media.ts.
create function public.kirim_laporan(
  p_kategori  public.kategori_kerusakan,
  p_deskripsi text,
  p_latitude  double precision,
  p_longitude double precision,
  p_media     jsonb
) returns table (id uuid, id_tiket text)
language plpgsql security invoker set search_path = ''
as $$
declare
  v_id    uuid;
  v_tiket text;
begin
  if (case when jsonb_typeof(p_media) = 'array' then jsonb_array_length(p_media) else 0 end) = 0 then
    raise exception 'Lampirkan minimal satu foto atau video.';
  end if;
  if exists (select 1 from jsonb_array_elements(p_media) m
             where coalesce(m ->> 'tipe', '') not in ('foto','video')) then
    raise exception 'Tipe media harus foto atau video.';
  end if;

  insert into public.laporan as l (id_pelapor, kategori, deskripsi, latitude, longitude)
  values ((select auth.uid()), p_kategori, p_deskripsi, p_latitude, p_longitude)
  returning l.id, l.id_tiket into v_id, v_tiket;

  insert into public.foto (id_laporan, path, format, ukuran)
  select v_id, m ->> 'path', m ->> 'format', (m ->> 'ukuran')::integer
  from jsonb_array_elements(p_media) m where m ->> 'tipe' = 'foto';

  insert into public.video (id_laporan, path, format, ukuran)
  select v_id, m ->> 'path', m ->> 'format', (m ->> 'ukuran')::integer
  from jsonb_array_elements(p_media) m where m ->> 'tipe' = 'video';

  return query select v_id, v_tiket;
end; $$;

-- ── RPC kirim_hasil_perbaikan (UC04) ─────────────────────────────────────
-- Hasil perbaikan + foto/video dalam satu transaksi. Minimal satu FOTO (I06-08); video opsional.
create function public.kirim_hasil_perbaikan(
  p_id_laporan uuid,
  p_catatan    text,
  p_media      jsonb
) returns uuid
language plpgsql security invoker set search_path = ''
as $$
declare
  v_id_hasil uuid;
begin
  -- IF terpisah: OR di SQL tidak dijamin short-circuit, jsonb_array_elements error pada non-array.
  if jsonb_typeof(p_media) is distinct from 'array' or length(trim(coalesce(p_catatan, ''))) = 0 then
    raise exception 'Gagal terkirim: foto dan deskripsi wajib diisi.';
  end if;
  if not exists (select 1 from jsonb_array_elements(p_media) m where m ->> 'tipe' = 'foto') then
    raise exception 'Gagal terkirim: foto dan deskripsi wajib diisi.';
  end if;
  if exists (select 1 from jsonb_array_elements(p_media) m
             where coalesce(m ->> 'tipe', '') not in ('foto','video')) then
    raise exception 'Tipe media harus foto atau video.';
  end if;

  insert into public.hasil_perbaikan (id_laporan, id_eksekutor, catatan)
  values (p_id_laporan, (select auth.uid()), p_catatan)
  returning id_hasil into v_id_hasil;

  insert into public.foto (id_hasil, path, format, ukuran)
  select v_id_hasil, m ->> 'path', m ->> 'format', (m ->> 'ukuran')::integer
  from jsonb_array_elements(p_media) m where m ->> 'tipe' = 'foto';

  insert into public.video (id_hasil, path, format, ukuran)
  select v_id_hasil, m ->> 'path', m ->> 'format', (m ->> 'ukuran')::integer
  from jsonb_array_elements(p_media) m where m ->> 'tipe' = 'video';

  return v_id_hasil;
end; $$;

revoke execute on function public.kirim_laporan(public.kategori_kerusakan, text, double precision, double precision, jsonb)
  from public, anon;
revoke execute on function public.kirim_hasil_perbaikan(uuid, text, jsonb) from public, anon;
grant execute on function public.kirim_laporan(public.kategori_kerusakan, text, double precision, double precision, jsonb)
  to authenticated;
grant execute on function public.kirim_hasil_perbaikan(uuid, text, jsonb) to authenticated;

-- ── REALTIME ─────────────────────────────────────────────────────────────
-- Notifikasi in-app (C10). postgres_changes menghormati RLS "notifikasi: lihat milik sendiri".
alter publication supabase_realtime add table public.notifikasi;
