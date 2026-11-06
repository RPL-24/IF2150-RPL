alter table public.tbl_produk
  add column if not exists hasil_resep integer not null default 1;

alter table public.tbl_produk
  drop constraint if exists tbl_produk_hasil_resep_check;

alter table public.tbl_produk
  add constraint tbl_produk_hasil_resep_check check (hasil_resep > 0);

alter table public.tbl_bahan_baku
  add column if not exists satuan text not null default 'unit';

alter table public.tbl_bahan_baku
  drop constraint if exists tbl_bahan_baku_satuan_check;

alter table public.tbl_bahan_baku
  add constraint tbl_bahan_baku_satuan_check check (length(trim(satuan)) > 0);
