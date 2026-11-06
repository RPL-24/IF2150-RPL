alter table public.tbl_produk
  add column if not exists status_peringatan boolean not null default false;

create table if not exists public.tbl_notifikasi (
  id_notifikasi uuid primary key default gen_random_uuid(),
  id_pemilik uuid not null default auth.uid()
    references public.tbl_pemilik_usaha (id) on delete cascade,
  id_produk uuid
    references public.tbl_produk (id_produk) on delete cascade,
  id_bahan uuid
    references public.tbl_bahan_baku (id_bahan) on delete set null,
  tipe text not null check (tipe in ('kerugian', 'harga_bahan')),
  pesan_alert text not null check (length(trim(pesan_alert)) > 0),
  waktu_kirim timestamptz not null default now(),
  is_read boolean not null default false
);

alter table public.tbl_notifikasi
  add column if not exists judul text not null default '';

create index if not exists tbl_notifikasi_pemilik_waktu_idx
  on public.tbl_notifikasi (id_pemilik, waktu_kirim desc);

create table if not exists public.tbl_riwayat_harga_bahan (
  id_riwayat uuid primary key default gen_random_uuid(),
  id_bahan uuid not null
    references public.tbl_bahan_baku (id_bahan) on delete cascade,
  harga_beli_lama numeric(14, 2) not null check (harga_beli_lama > 0),
  harga_beli_baru numeric(14, 2) not null check (harga_beli_baru > 0),
  waktu_perubahan timestamptz not null default now()
);

create index if not exists tbl_riwayat_harga_bahan_bahan_waktu_idx
  on public.tbl_riwayat_harga_bahan (id_bahan, waktu_perubahan desc);

alter table public.tbl_notifikasi enable row level security;
alter table public.tbl_riwayat_harga_bahan enable row level security;

drop policy if exists "notifikasi milik sendiri" on public.tbl_notifikasi;
create policy "notifikasi milik sendiri"
  on public.tbl_notifikasi
  for all to authenticated
  using ((select auth.uid()) = id_pemilik)
  with check ((select auth.uid()) = id_pemilik);

drop policy if exists "riwayat harga bahan milik sendiri" on public.tbl_riwayat_harga_bahan;
create policy "riwayat harga bahan milik sendiri"
  on public.tbl_riwayat_harga_bahan
  for all to authenticated
  using (
    exists (
      select 1 from public.tbl_bahan_baku b
      where b.id_bahan = tbl_riwayat_harga_bahan.id_bahan
        and b.id_pemilik = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.tbl_bahan_baku b
      where b.id_bahan = tbl_riwayat_harga_bahan.id_bahan
        and b.id_pemilik = (select auth.uid())
    )
  );

grant select, insert, update, delete on table public.tbl_notifikasi to authenticated;
grant select, insert, update, delete on table public.tbl_riwayat_harga_bahan to authenticated;
