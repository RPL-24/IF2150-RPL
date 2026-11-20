-- =========================================================================
-- L4 · Migration 1: skema awal LaporKota (enum, tabel, index, view, helper, RLS)
-- Trigger status/notifikasi/upvote/riwayat ada di migration L7, bukan di sini.
-- =========================================================================

-- ── ENUM ─────────────────────────────────────────────────────────────────
-- Nilai disimpan huruf kecil; label tampilan ada di src/lib/constants.ts.
create type public.peran_user         as enum ('warga','admin','eksekutor');
create type public.status_laporan     as enum ('diterima','ditolak','dikerjakan','berhasil');
create type public.tahap_penanganan   as enum ('menunggu_eksekusi','menunggu_evaluasi');
create type public.kategori_kerusakan as enum ('jalan_berlubang','lampu_jalan_mati',
  'saluran_air_tersumbat','trotoar_rusak','rambu_marka_rusak');
create type public.keputusan_evaluasi as enum ('selesai','belum_selesai','minta_ulang_bukti');

-- ── TABEL ────────────────────────────────────────────────────────────────
-- C01 User: profil 1-1 dengan auth.users, role default warga.
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nama       text not null,
  role       public.peran_user not null default 'warga',
  created_at timestamptz not null default now()
);

-- Nomor tiket laporan (LK-0001, LK-0002, ...).
create sequence public.laporan_tiket_seq;
-- Fungsi format tiket: lpad biasa MEMOTONG string > 4 digit (LK-10000 → LK-1000, bentrok unique),
-- jadi panjangnya pakai greatest(4, length(n)).
create function public.format_tiket(n bigint) returns text
language sql immutable set search_path = ''
as $$ select 'LK-' || lpad(n::text, greatest(4, length(n::text)), '0') $$;

-- C02 Laporan + C03 Lokasi (latitude/longitude). tahap hanya terisi saat status = dikerjakan.
create table public.laporan (
  id               uuid primary key default gen_random_uuid(),
  id_tiket         text not null unique
                   default public.format_tiket(nextval('public.laporan_tiket_seq')),
  id_pelapor       uuid not null references public.profiles(id),
  kategori         public.kategori_kerusakan not null,
  deskripsi        text not null check (length(trim(deskripsi)) > 0),
  latitude         double precision not null check (latitude between -90 and 90),
  longitude        double precision not null check (longitude between -180 and 180),
  status           public.status_laporan not null default 'diterima',
  tahap            public.tahap_penanganan,
  jumlah_upvote    integer not null default 0,
  skor_prioritas   numeric(5,2) not null default 0,
  alasan_penolakan text,
  waktu_masuk      timestamptz not null default now(),
  waktu_selesai    timestamptz,
  constraint tahap_hanya_saat_dikerjakan check ((status = 'dikerjakan') = (tahap is not null))
);

-- C08 HasilPerbaikan: bukti perbaikan yang diunggah eksekutor.
create table public.hasil_perbaikan (
  id_hasil     uuid primary key default gen_random_uuid(),
  id_laporan   uuid not null references public.laporan(id) on delete cascade,
  id_eksekutor uuid not null references public.profiles(id),
  catatan      text not null check (length(trim(catatan)) > 0),
  waktu_unggah timestamptz not null default now()
);

-- C04 Foto: milik laporan ATAU hasil perbaikan (tepat satu induk). Berkas ada di bucket media.
create table public.foto (
  id         uuid primary key default gen_random_uuid(),
  id_laporan uuid references public.laporan(id) on delete cascade,
  id_hasil   uuid references public.hasil_perbaikan(id_hasil) on delete cascade,
  path       text not null,
  format     text not null check (format in ('jpg','png')),
  ukuran     integer not null check (ukuran > 0 and ukuran <= 10485760),
  created_at timestamptz not null default now(),
  constraint foto_tepat_satu_induk check (num_nonnulls(id_laporan, id_hasil) = 1)
);

-- C05 Video: sama dengan foto, format video.
create table public.video (
  id         uuid primary key default gen_random_uuid(),
  id_laporan uuid references public.laporan(id) on delete cascade,
  id_hasil   uuid references public.hasil_perbaikan(id_hasil) on delete cascade,
  path       text not null,
  format     text not null check (format in ('mp4','mov','mkv')),
  ukuran     integer not null check (ukuran > 0 and ukuran <= 10485760),
  created_at timestamptz not null default now(),
  constraint video_tepat_satu_induk check (num_nonnulls(id_laporan, id_hasil) = 1)
);

-- C06 Upvote: satu dukungan per user per laporan.
create table public.upvote (
  id_upvote    uuid primary key default gen_random_uuid(),
  id_laporan   uuid not null references public.laporan(id) on delete cascade,
  id_user      uuid not null references public.profiles(id),
  waktu_upvote timestamptz not null default now(),
  unique (id_laporan, id_user)
);

-- C09 Evaluasi: keputusan admin atas hasil perbaikan; catatan wajib jika dikembalikan.
create table public.evaluasi (
  id_evaluasi    uuid primary key default gen_random_uuid(),
  id_laporan     uuid not null references public.laporan(id) on delete cascade,
  id_hasil       uuid not null references public.hasil_perbaikan(id_hasil),
  id_admin       uuid not null references public.profiles(id),
  keputusan      public.keputusan_evaluasi not null,
  catatan        text,
  waktu_evaluasi timestamptz not null default now(),
  constraint catatan_wajib_jika_dikembalikan
    check (keputusan = 'selesai' or length(trim(coalesce(catatan, ''))) > 0)
);

-- C10 Notifikasi: diisi trigger (L7), user hanya bisa menandai dibaca.
create table public.notifikasi (
  id_notifikasi uuid primary key default gen_random_uuid(),
  id_user       uuid not null references public.profiles(id) on delete cascade,
  id_laporan    uuid references public.laporan(id) on delete cascade,
  isi_pesan     text not null,
  waktu_kirim   timestamptz not null default now(),
  status_baca   boolean not null default false
);

-- Linimasa status (I02-08) + log audit (KF17), diisi trigger (L7).
create table public.riwayat_status (
  id         uuid primary key default gen_random_uuid(),
  id_laporan uuid not null references public.laporan(id) on delete cascade,
  status     public.status_laporan not null,
  tahap      public.tahap_penanganan,
  catatan    text,
  waktu      timestamptz not null default now()
);

-- ── INDEX ────────────────────────────────────────────────────────────────
-- FK yang belum tertutup index lain. upvote(id_laporan) sengaja tidak dibuat:
-- sudah tertutup unique (id_laporan, id_user).
create index foto_id_laporan_idx              on public.foto (id_laporan);
create index foto_id_hasil_idx                on public.foto (id_hasil);
create index video_id_laporan_idx             on public.video (id_laporan);
create index video_id_hasil_idx               on public.video (id_hasil);
create index hasil_perbaikan_id_laporan_idx   on public.hasil_perbaikan (id_laporan);
create index hasil_perbaikan_id_eksekutor_idx on public.hasil_perbaikan (id_eksekutor);
create index evaluasi_id_laporan_idx          on public.evaluasi (id_laporan);
create index evaluasi_id_hasil_idx            on public.evaluasi (id_hasil);
create index evaluasi_id_admin_idx            on public.evaluasi (id_admin);
create index upvote_id_user_idx               on public.upvote (id_user);
create index notifikasi_id_laporan_idx        on public.notifikasi (id_laporan);
create index laporan_id_pelapor_idx           on public.laporan (id_pelapor);

-- Pola query: daftar notifikasi terbaru, linimasa laporan, filter status/tahap.
create index notifikasi_id_user_waktu_kirim_idx on public.notifikasi (id_user, waktu_kirim desc);
create index riwayat_status_id_laporan_waktu_idx on public.riwayat_status (id_laporan, waktu);
create index laporan_status_tahap_idx            on public.laporan (status, tahap);

-- ── VIEW PUBLIK ──────────────────────────────────────────────────────────
-- View untuk peta publik (KF20). Sengaja TANPA security_invoker: view berjalan sebagai pemiliknya,
-- jadi anon bisa membaca tanpa membuka RLS tabel laporan. Kolom pelapor TIDAK disertakan.
-- Advisor Supabase akan memberi peringatan "security definer view". Itu disengaja, catat di B.1.
-- Catatan: Realtime postgres_changes TIDAK jalan di view (lihat keputusan terbuka no. 5).
create view public.laporan_publik as
  select id, id_tiket, kategori, deskripsi, latitude, longitude, status, tahap,
         jumlah_upvote, skor_prioritas, waktu_masuk, waktu_selesai
  from public.laporan
  where status <> 'ditolak';
-- View sederhana bisa di-UPDATE/DELETE dan berjalan sebagai pemiliknya (lewati RLS).
-- Auto-expose memberi semua izin, jadi cabut semua lalu sisakan SELECT.
revoke all on public.laporan_publik from anon, authenticated;
grant select on public.laporan_publik to anon, authenticated;

-- ── FUNGSI HELPER ────────────────────────────────────────────────────────
-- Helper (security definer supaya bisa dipakai di policy tanpa rekursi RLS).
-- Role user yang sedang login (null untuk anon).
create function public.peran_saya() returns public.peran_user
language sql stable security definer set search_path = ''
as $$ select role from public.profiles where id = (select auth.uid()) $$;

-- True jika laporan ada dan tidak ditolak (dipakai policy foto/video untuk publik).
create function public.laporan_terbuka(p_id uuid) returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.laporan where id = p_id and status <> 'ditolak') $$;

-- True jika laporan masih aktif dan bukan milik user yang login (aturan dukungan).
create function public.boleh_dukung(p_id uuid) returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.laporan
                     where id = p_id and status in ('diterima','dikerjakan')
                       and id_pelapor <> (select auth.uid())) $$;

-- ── TRIGGER PROFIL ───────────────────────────────────────────────────────
-- Profil otomatis saat user daftar (role default warga)
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nama)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nama', split_part(new.email, '@', 1)));
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── RLS: AKTIFKAN DI SEMUA TABEL ─────────────────────────────────────────
-- Eksplisit walau project memakai auto RLS.
alter table public.profiles        enable row level security;
alter table public.laporan         enable row level security;
alter table public.hasil_perbaikan enable row level security;
alter table public.foto            enable row level security;
alter table public.video           enable row level security;
alter table public.upvote          enable row level security;
alter table public.evaluasi        enable row level security;
alter table public.notifikasi      enable row level security;
alter table public.riwayat_status  enable row level security;

-- ── POLICY: profiles ─────────────────────────────────────────────────────
-- Insert lewat trigger handle_new_user; tidak ada update/delete dari client.
create policy "profiles: lihat diri sendiri" on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy "profiles: admin lihat semua" on public.profiles for select to authenticated
  using ((select public.peran_saya()) = 'admin');

-- ── POLICY: laporan ──────────────────────────────────────────────────────
-- Publik membaca lewat view laporan_publik, bukan tabel ini.
create policy "laporan: warga lihat milik sendiri" on public.laporan for select to authenticated
  using (id_pelapor = (select auth.uid()));
create policy "laporan: admin lihat semua" on public.laporan for select to authenticated
  using ((select public.peran_saya()) = 'admin');
create policy "laporan: eksekutor lihat yang dikerjakan" on public.laporan for select to authenticated
  using ((select public.peran_saya()) = 'eksekutor' and status = 'dikerjakan');
create policy "laporan: warga membuat" on public.laporan for insert to authenticated
  with check (id_pelapor = (select auth.uid()) and (select public.peran_saya()) = 'warga'
              and status = 'diterima' and tahap is null
              and jumlah_upvote = 0 and skor_prioritas = 0);
-- Transisi status dijaga trigger cek_transisi_status (L7).
create policy "laporan: admin mengubah" on public.laporan for update to authenticated
  using ((select public.peran_saya()) = 'admin')
  with check ((select public.peran_saya()) = 'admin');
-- Warga hanya boleh mengisi kolom form; id_tiket, status, waktu_masuk, dll. wajib pakai default.
revoke insert on public.laporan from anon, authenticated;
grant insert (id_pelapor, kategori, deskripsi, latitude, longitude) on public.laporan to authenticated;

-- ── POLICY: foto ─────────────────────────────────────────────────────────
-- Baca: bukti hasil perbaikan, foto laporan yang tidak ditolak, atau laporan yang terlihat via RLS
-- (mis. pelapor melihat foto laporannya sendiri yang ditolak).
create policy "foto: lihat publik atau laporan terlihat" on public.foto for select to anon, authenticated
  using (id_hasil is not null
         or public.laporan_terbuka(id_laporan)
         or exists (select 1 from public.laporan l where l.id = foto.id_laporan));
create policy "foto: pelapor unggah ke laporannya" on public.foto for insert to authenticated
  with check (id_laporan is not null
              and exists (select 1 from public.laporan l
                          where l.id = foto.id_laporan and l.id_pelapor = (select auth.uid())
                            and l.status = 'diterima'));
create policy "foto: eksekutor unggah ke hasil miliknya" on public.foto for insert to authenticated
  with check (id_hasil is not null
              and exists (select 1 from public.hasil_perbaikan h
                          where h.id_hasil = foto.id_hasil and h.id_eksekutor = (select auth.uid())));

-- ── POLICY: video ────────────────────────────────────────────────────────
-- Sama dengan foto.
create policy "video: lihat publik atau laporan terlihat" on public.video for select to anon, authenticated
  using (id_hasil is not null
         or public.laporan_terbuka(id_laporan)
         or exists (select 1 from public.laporan l where l.id = video.id_laporan));
create policy "video: pelapor unggah ke laporannya" on public.video for insert to authenticated
  with check (id_laporan is not null
              and exists (select 1 from public.laporan l
                          where l.id = video.id_laporan and l.id_pelapor = (select auth.uid())
                            and l.status = 'diterima'));
create policy "video: eksekutor unggah ke hasil miliknya" on public.video for insert to authenticated
  with check (id_hasil is not null
              and exists (select 1 from public.hasil_perbaikan h
                          where h.id_hasil = video.id_hasil and h.id_eksekutor = (select auth.uid())));

-- ── POLICY: upvote ───────────────────────────────────────────────────────
-- Counter jumlah_upvote/skor_prioritas diurus trigger (L7).
create policy "upvote: lihat milik sendiri" on public.upvote for select to authenticated
  using (id_user = (select auth.uid()));
create policy "upvote: admin lihat semua" on public.upvote for select to authenticated
  using ((select public.peran_saya()) = 'admin');
create policy "upvote: user mendukung" on public.upvote for insert to authenticated
  with check (id_user = (select auth.uid())
              and (select public.peran_saya()) = 'warga'
              and public.boleh_dukung(id_laporan));

-- ── POLICY: hasil_perbaikan ──────────────────────────────────────────────
create policy "hasil_perbaikan: admin dan eksekutor lihat" on public.hasil_perbaikan for select to authenticated
  using ((select public.peran_saya()) in ('admin','eksekutor'));
create policy "hasil_perbaikan: pelapor lihat laporan terkait" on public.hasil_perbaikan for select to authenticated
  using (exists (select 1 from public.laporan l
                 where l.id = hasil_perbaikan.id_laporan and l.id_pelapor = (select auth.uid())));
-- Hanya untuk laporan yang sedang menunggu eksekusi.
create policy "hasil_perbaikan: eksekutor mengunggah" on public.hasil_perbaikan for insert to authenticated
  with check ((select public.peran_saya()) = 'eksekutor'
              and id_eksekutor = (select auth.uid())
              and exists (select 1 from public.laporan l
                          where l.id = hasil_perbaikan.id_laporan
                            and l.status = 'dikerjakan' and l.tahap = 'menunggu_eksekusi'));

-- ── POLICY: evaluasi ─────────────────────────────────────────────────────
create policy "evaluasi: admin dan eksekutor lihat" on public.evaluasi for select to authenticated
  using ((select public.peran_saya()) in ('admin','eksekutor'));
create policy "evaluasi: admin mengevaluasi" on public.evaluasi for insert to authenticated
  with check ((select public.peran_saya()) = 'admin'
              and id_admin = (select auth.uid())
              and exists (select 1 from public.hasil_perbaikan h
                          join public.laporan l on l.id = h.id_laporan
                          where h.id_hasil = evaluasi.id_hasil
                            and h.id_laporan = evaluasi.id_laporan
                            and l.status = 'dikerjakan' and l.tahap = 'menunggu_evaluasi'));

-- ── POLICY: notifikasi ───────────────────────────────────────────────────
-- Insert lewat trigger (L7). User hanya boleh mengubah kolom status_baca miliknya.
create policy "notifikasi: lihat milik sendiri" on public.notifikasi for select to authenticated
  using (id_user = (select auth.uid()));
create policy "notifikasi: tandai dibaca milik sendiri" on public.notifikasi for update to authenticated
  using (id_user = (select auth.uid()))
  with check (id_user = (select auth.uid()));
revoke update on public.notifikasi from anon, authenticated;
grant update (status_baca) on public.notifikasi to authenticated;

-- ── POLICY: riwayat_status ───────────────────────────────────────────────
-- Insert lewat trigger (L7). Terlihat jika laporan induknya terlihat via RLS.
create policy "riwayat_status: ikut laporan induk" on public.riwayat_status for select to authenticated
  using (exists (select 1 from public.laporan l where l.id = riwayat_status.id_laporan));

-- ── GRANT SEQUENCE ───────────────────────────────────────────────────────
-- Default id_tiket memanggil nextval, jadi warga butuh usage sequence.
grant usage on sequence public.laporan_tiket_seq to authenticated;
