do $$
declare
  v_pemilik uuid;
begin
  select id into v_pemilik
  from public.tbl_pemilik_usaha
  where lower(email) = 'demo@pross.test';

  if v_pemilik is null then
    raise notice 'Akun uji demo@pross.test belum ada, seed produk dilewati.';
    return;
  end if;

  insert into public.tbl_bahan_baku (id_pemilik, nama_bahan, harga_beli) values
    (v_pemilik, 'Beras', 14),
    (v_pemilik, 'Telur', 2500),
    (v_pemilik, 'Kecap Manis', 20),
    (v_pemilik, 'Minyak Goreng', 18),
    (v_pemilik, 'Bawang', 35),
    (v_pemilik, 'Ayam Suwir', 38),
    (v_pemilik, 'Mie', 12),
    (v_pemilik, 'Teh Celup', 600),
    (v_pemilik, 'Gula', 16),
    (v_pemilik, 'Es Batu', 5),
    (v_pemilik, 'Kopi', 120),
    (v_pemilik, 'Susu', 18)
  on conflict do nothing;

  insert into public.tbl_produk (id_pemilik, nama_produk, tag, harga_jual, margin) values
    (v_pemilik, 'Nasi Goreng Spesial', array['makanan', 'nasi'], 18000, 0),
    (v_pemilik, 'Mie Ayam', array['makanan', 'mie'], 15000, 0),
    (v_pemilik, 'Es Teh Manis', array['minuman'], 5000, 0),

    (v_pemilik, 'Kopi Susu', array['minuman', 'kopi'], 5000, 0)
  on conflict do nothing;

  insert into public.tbl_resep_bahan (id_produk, id_bahan, takaran)
  select p.id_produk, b.id_bahan, r.takaran
  from (values
    ('Nasi Goreng Spesial', 'Beras', 150),
    ('Nasi Goreng Spesial', 'Telur', 1),
    ('Nasi Goreng Spesial', 'Kecap Manis', 20),
    ('Nasi Goreng Spesial', 'Minyak Goreng', 15),
    ('Nasi Goreng Spesial', 'Bawang', 10),
    ('Nasi Goreng Spesial', 'Ayam Suwir', 50),
    ('Mie Ayam', 'Mie', 100),
    ('Mie Ayam', 'Ayam Suwir', 50),
    ('Mie Ayam', 'Kecap Manis', 10),
    ('Mie Ayam', 'Bawang', 5),
    ('Es Teh Manis', 'Teh Celup', 1),
    ('Es Teh Manis', 'Gula', 25),
    ('Es Teh Manis', 'Es Batu', 100),
    ('Kopi Susu', 'Kopi', 15),
    ('Kopi Susu', 'Susu', 150),
    ('Kopi Susu', 'Gula', 20),
    ('Kopi Susu', 'Es Batu', 100)
  ) as r (nama_produk, nama_bahan, takaran)
  join public.tbl_produk p
    on p.id_pemilik = v_pemilik and lower(p.nama_produk) = lower(r.nama_produk)
  join public.tbl_bahan_baku b
    on b.id_pemilik = v_pemilik and lower(b.nama_bahan) = lower(r.nama_bahan)
  on conflict do nothing;

  update public.tbl_produk p
  set margin = p.harga_jual - coalesce((
    select sum(rb.takaran * bb.harga_beli)
    from public.tbl_resep_bahan rb
    join public.tbl_bahan_baku bb on bb.id_bahan = rb.id_bahan
    where rb.id_produk = p.id_produk
  ), 0)
  where p.id_pemilik = v_pemilik;
end;
$$;
