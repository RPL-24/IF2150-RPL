create table if not exists public.tbl_riwayat_harga_jual (
  id_riwayat uuid primary key default gen_random_uuid(),
  id_produk uuid not null references public.tbl_produk (id_produk) on delete cascade,
  harga_jual_lama numeric(14, 2) not null check (harga_jual_lama > 0),
  harga_baru numeric(14, 2) not null check (harga_baru > 0),
  waktu_perubahan timestamptz not null default now()
);

alter table public.tbl_riwayat_harga_jual enable row level security;

drop policy if exists "riwayat harga jual milik sendiri" on public.tbl_riwayat_harga_jual;
create policy "riwayat harga jual milik sendiri"
  on public.tbl_riwayat_harga_jual
  for all to authenticated
  using (
    exists (
      select 1 from public.tbl_produk p
      where p.id_produk = tbl_riwayat_harga_jual.id_produk
        and p.id_pemilik = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.tbl_produk p
      where p.id_produk = tbl_riwayat_harga_jual.id_produk
        and p.id_pemilik = (select auth.uid())
    )
  );

grant select, insert, update, delete on table public.tbl_riwayat_harga_jual to authenticated;