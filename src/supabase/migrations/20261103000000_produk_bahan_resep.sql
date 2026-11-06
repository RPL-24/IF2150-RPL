create table if not exists public.tbl_bahan_baku (
  id_bahan uuid primary key default gen_random_uuid(),
  id_pemilik uuid not null default auth.uid()
    references public.tbl_pemilik_usaha (id) on delete cascade,
  nama_bahan text not null check (length(trim(nama_bahan)) > 0),
  harga_beli numeric(14, 2) not null check (harga_beli > 0),
  created_at timestamptz not null default now()
);

create unique index if not exists tbl_bahan_baku_pemilik_nama_key
  on public.tbl_bahan_baku (id_pemilik, lower(nama_bahan));

create table if not exists public.tbl_produk (
  id_produk uuid primary key default gen_random_uuid(),
  id_pemilik uuid not null default auth.uid()
    references public.tbl_pemilik_usaha (id) on delete cascade,
  nama_produk text not null check (length(trim(nama_produk)) > 0),
  tag text[] not null default '{}',
  harga_jual numeric(14, 2) not null check (harga_jual > 0),
  margin numeric(14, 2) not null,
  created_at timestamptz not null default now()
);

create unique index if not exists tbl_produk_pemilik_nama_key
  on public.tbl_produk (id_pemilik, lower(nama_produk));

create table if not exists public.tbl_resep_bahan (
  id_produk uuid not null
    references public.tbl_produk (id_produk) on delete cascade,
  id_bahan uuid not null
    references public.tbl_bahan_baku (id_bahan) on delete restrict,
  takaran numeric(14, 4) not null check (takaran > 0),
  primary key (id_produk, id_bahan)
);

create index if not exists tbl_resep_bahan_id_bahan_idx
  on public.tbl_resep_bahan (id_bahan);

alter table public.tbl_bahan_baku enable row level security;
alter table public.tbl_produk enable row level security;
alter table public.tbl_resep_bahan enable row level security;

drop policy if exists "bahan baku milik sendiri" on public.tbl_bahan_baku;
create policy "bahan baku milik sendiri"
  on public.tbl_bahan_baku
  for all to authenticated
  using ((select auth.uid()) = id_pemilik)
  with check ((select auth.uid()) = id_pemilik);

drop policy if exists "produk milik sendiri" on public.tbl_produk;
create policy "produk milik sendiri"
  on public.tbl_produk
  for all to authenticated
  using ((select auth.uid()) = id_pemilik)
  with check ((select auth.uid()) = id_pemilik);

drop policy if exists "resep milik sendiri" on public.tbl_resep_bahan;
create policy "resep milik sendiri"
  on public.tbl_resep_bahan
  for all to authenticated
  using (
    exists (
      select 1 from public.tbl_produk p
      where p.id_produk = tbl_resep_bahan.id_produk
        and p.id_pemilik = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.tbl_produk p
      where p.id_produk = tbl_resep_bahan.id_produk
        and p.id_pemilik = (select auth.uid())
    )
    and exists (
      select 1 from public.tbl_bahan_baku b
      where b.id_bahan = tbl_resep_bahan.id_bahan
        and b.id_pemilik = (select auth.uid())
    )
  );

grant select, insert, update, delete on table public.tbl_bahan_baku to authenticated;
grant select, insert, update, delete on table public.tbl_produk to authenticated;
grant select, insert, update, delete on table public.tbl_resep_bahan to authenticated;
