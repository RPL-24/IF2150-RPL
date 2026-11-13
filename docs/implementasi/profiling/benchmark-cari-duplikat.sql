-- =========================================================================
-- Benchmark RPC cari_laporan_duplikat (KF05, issue #104)
--
-- Cara pakai: tempel SELURUH isi file ini ke Supabase SQL Editor, lalu Run.
-- Skrip TIDAK mengubah apa pun: semua langkah ada di satu transaksi yang diakhiri
-- RAISE EXCEPTION, jadi data dummy, drop/create index, dan statistik ikut di-rollback.
-- Hasil (tabel perbandingan + cuplikan EXPLAIN) tampil sebagai pesan error di akhir.
--
-- Syarat: akun seed warga1@laporkota.test sudah ada (npm run seed).
-- Catatan: DROP/CREATE INDEX di dalam transaksi mengunci tabel laporan sampai skrip selesai
-- (± beberapa detik). Jalankan saat aplikasi tidak sedang dipakai.
-- Penjelasan lengkap: docs/implementasi/profiling/README.md
-- =========================================================================

begin;

-- Klaim service_role: trigger laporan dilewati (public.dari_service_role), jadi data dummy
-- bisa langsung berstatus apa pun tanpa membuat riwayat_status/notifikasi.
select set_config('request.jwt.claims', '{"role":"service_role"}', true);
-- Statement yang di-PREPARE memakai generic plan, sama seperti isi fungsi SQL saat dipanggil.
set local plan_cache_mode = force_generic_plan;

-- ── PARAMETER ────────────────────────────────────────────────────────────
create temp table bench_param as
select (select id from auth.users where email = 'warga1@laporkota.test') as id_warga,
       pg_current_xact_id() as id_transaksi,
       10000 as jumlah_dummy,
       50    as n_ulang;   -- pengulangan per metode per titik (≥ 30)

do $$
begin
  if (select id_warga from bench_param) is null then
    raise exception 'Akun warga1@laporkota.test tidak ditemukan. Jalankan npm run seed dulu.';
  end if;
  -- Pengaman: kalau statement dijalankan satu per satu (autocommit), berhenti sebelum insert.
  if (select id_transaksi from bench_param) <> pg_current_xact_id() then
    raise exception 'Skrip harus dijalankan utuh dalam satu transaksi (Run seluruh isi file sekaligus).';
  end if;
  -- PREPARE tidak ikut di-rollback; hapus sisa dari run sebelumnya di sesi yang sama.
  if exists (select 1 from pg_prepared_statements where name = 'bench_isi_rpc') then
    execute 'deallocate bench_isi_rpc';
  end if;
end $$;

-- Titik uji (semua di dalam batas kota, kategori jalan_berlubang).
create temp table bench_titik (urut int, nama text, lat float8, lng float8, kategori public.kategori_kerusakan);
insert into bench_titik values
  (1, 'pusat kota',   -6.9175, 107.6191, 'jalan_berlubang'),  -- PUSAT_PETA (Alun-alun)
  (2, 'pinggir kota', -6.9300, 107.5600, 'jalan_berlubang'),  -- dekat batas barat
  (3, 'ada duplikat', -6.9020, 107.6350, 'jalan_berlubang');  -- diberi tetangga ≤ 20 m di bawah

-- ── DATA DUMMY ───────────────────────────────────────────────────────────
-- id_tiket diisi manual (BENCH-xxxxx) supaya sequence laporan_tiket_seq tidak terpakai:
-- nextval tidak ikut di-rollback.
-- Koordinat di bbox batas kota (lat -6.9696..-6.8369, lng 107.5454..107.7395), lebih rapat
-- di tengah (jumlah dua random). Status: 30% diterima, 15% ditolak, 15% menunggu eksekusi,
-- 5% menunggu evaluasi, 35% berhasil.
select setseed(0.104);
insert into public.laporan (id_tiket, id_pelapor, kategori, deskripsi, latitude, longitude,
                            status, tahap, alasan_penolakan, jumlah_upvote, skor_prioritas,
                            waktu_masuk, waktu_selesai)
select format('BENCH-%s', lpad(d.g::text, 5, '0')),
       (select id_warga from bench_param),
       (enum_range(null::public.kategori_kerusakan))[1 + floor(d.k * 5)::int],
       'Data dummy benchmark',
       -6.90322 + (d.a + d.b - 1) * 0.06637,
       107.64244 + (d.c + d.e - 1) * 0.09708,
       case when d.r < 0.30 then 'diterima'
            when d.r < 0.45 then 'ditolak'
            when d.r < 0.65 then 'dikerjakan'
            else 'berhasil' end::public.status_laporan,
       case when d.r >= 0.45 and d.r < 0.60 then 'menunggu_eksekusi'
            when d.r >= 0.60 and d.r < 0.65 then 'menunggu_evaluasi' end::public.tahap_penanganan,
       case when d.r >= 0.30 and d.r < 0.45 then 'Data dummy: foto tidak jelas' end,
       d.u, least(100, d.u * 10),
       now() - d.w * interval '180 days',
       case when d.r >= 0.65 then now() - d.w * interval '170 days' end
from (select g, random() as k, random() as a, random() as b, random() as c, random() as e,
             random() as r, random() as w, floor(random() * 15)::int as u
      from generate_series(1, (select jumlah_dummy from bench_param)) g) d;

-- Tetangga titik "ada duplikat". 1° lintang ≈ 111 195 m; 1° bujur ≈ 110 390 m di -6.9°.
-- Yang harus ditemukan: BENCH-D1, D2, D3. Sisanya jebakan (status/kategori/jarak).
insert into public.laporan (id_tiket, id_pelapor, kategori, deskripsi, latitude, longitude,
                            status, tahap, alasan_penolakan)
select v.tiket, (select id_warga from bench_param), v.kategori::public.kategori_kerusakan,
       'Data dummy benchmark', -6.9020 + v.dlat, 107.6350 + v.dlng,
       v.status::public.status_laporan, v.tahap::public.tahap_penanganan, v.alasan
from (values
  ('BENCH-D1', 'jalan_berlubang',   0.0000450,  0.0000000, 'diterima',   null,                null),  --  5 m
  ('BENCH-D2', 'jalan_berlubang',   0.0000000,  0.0001087, 'dikerjakan', 'menunggu_eksekusi', null),  -- 12 m
  ('BENCH-D3', 'jalan_berlubang',  -0.0001145, -0.0001153, 'diterima',   null,                null),  -- 18 m
  ('BENCH-X1', 'jalan_berlubang',   0.0000900,  0.0000000, 'ditolak',    null, 'Data dummy'),         -- 10 m, ditolak
  ('BENCH-X2', 'lampu_jalan_mati',  0.0000720,  0.0000000, 'diterima',   null,                null),  --  8 m, kategori lain
  ('BENCH-X3', 'jalan_berlubang',   0.0002248,  0.0000000, 'diterima',   null,                null),  -- 25 m, di kotak tapi > 20 m
  ('BENCH-X4', 'jalan_berlubang',  -0.0001349,  0.0000000, 'berhasil',   null,                null)   -- 15 m, sudah selesai
) as v(tiket, kategori, dlat, dlng, status, tahap, alasan);

analyze public.laporan;

-- ── QUERY YANG DIBANDINGKAN ──────────────────────────────────────────────
-- NAIF: haversine ke SEMUA laporan aktif sekategori, tanpa kotak (implementasi langsung DPPL).
create function pg_temp.sql_naif(p_lat float8, p_lng float8, p_kat public.kategori_kerusakan)
returns text language sql immutable as $f$
  select format($q$
    select l.id_tiket, l.status, j.jarak_m
    from public.laporan l
    cross join lateral (
      select 2 * 6371000 * asin(least(1, sqrt(
               power(sin(radians(l.latitude - %1$s) / 2), 2)
               + cos(radians(%1$s)) * cos(radians(l.latitude))
                 * power(sin(radians(l.longitude - %2$s) / 2), 2)
             ))) as jarak_m
    ) j
    where l.status in ('diterima', 'dikerjakan')
      and l.kategori = %3$L
      and j.jarak_m <= 20
    order by j.jarak_m$q$, p_lat, p_lng, p_kat)
$f$;

-- RPC: dipanggil persis seperti dari aplikasi (Function Scan, isinya tidak terlihat di EXPLAIN).
create function pg_temp.sql_rpc(p_lat float8, p_lng float8, p_kat public.kategori_kerusakan)
returns text language sql immutable as $f$
  select format('select * from public.cari_laporan_duplikat(%s, %s, %L)', p_lat, p_lng, p_kat)
$f$;

-- Isi RPC (salinan body public.cari_laporan_duplikat) untuk melihat jenis scan di dalamnya.
prepare bench_isi_rpc(float8, float8, public.kategori_kerusakan) as
  select l.id_tiket, l.status, j.jarak_m
  from public.laporan l
  cross join lateral (
    select 2 * 6371000 * asin(least(1, sqrt(
             power(sin(radians(l.latitude - $1) / 2), 2)
             + cos(radians($1)) * cos(radians(l.latitude))
               * power(sin(radians(l.longitude - $2) / 2), 2)
           ))) as jarak_m
  ) j
  where l.status in ('diterima', 'dikerjakan')
    and l.kategori = $3
    and l.latitude  between $1 - 0.0003 and $1 + 0.0003
    and l.longitude between $2 - 0.0003 / cos(radians($1))
                        and $2 + 0.0003 / cos(radians($1))
    and j.jarak_m <= 20
  order by j.jarak_m;

create function pg_temp.sql_isi_rpc(p_lat float8, p_lng float8, p_kat public.kategori_kerusakan)
returns text language sql immutable as $f$
  select format('execute bench_isi_rpc(%s, %s, %L)', p_lat, p_lng, p_kat)
$f$;

-- ── ALAT UKUR ────────────────────────────────────────────────────────────
create temp table bench_hasil (
  urut serial, titik text, metode text, scan text,
  median_ms float8, p95_ms float8, rows_removed bigint, n int
);
create temp table bench_tiket (titik text, metode text, tiket text);
create temp table bench_explain (fase text, isi text);

-- Jalankan EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) sebanyak n kali → median & p95
-- Execution Time. Jenis scan & rows removed diambil dari p_sql_rencana (default p_sql).
create function pg_temp.bench(p_titik text, p_metode text, p_sql text, p_warga boolean,
                              p_sql_rencana text default null)
returns void language plpgsql as $f$
declare
  v_n     int := (select n_ulang from bench_param);
  v_plan  jsonb;
  v_waktu float8[] := '{}';
  v_node  jsonb;
  v_tiket text;
  v_claims text := json_build_object('role', 'authenticated',
                                     'sub', (select id_warga from bench_param))::text;
begin
  -- Warga = role authenticated + klaim sub warga1, seperti request dari aplikasi.
  -- Selama itu jangan sentuh tabel temp (milik postgres).
  if p_warga then
    perform set_config('request.jwt.claims', v_claims, true);
    perform set_config('role', 'authenticated', true);
  end if;
  execute format('select string_agg(id_tiket, '','' order by id_tiket) from (%s) q', p_sql)
    into v_tiket;                                            -- sekaligus pemanasan cache
  for i in 1 .. v_n loop
    execute 'explain (analyze, buffers, format json) ' || p_sql into v_plan;
    v_waktu := v_waktu || (v_plan -> 0 ->> 'Execution Time')::float8;
  end loop;
  perform set_config('role', 'none', true);   -- kembali ke peran sesi (postgres)
  perform set_config('request.jwt.claims', '{"role":"service_role"}', true);

  if p_sql_rencana is not null then
    execute 'explain (analyze, buffers, format json) ' || p_sql_rencana into v_plan;
  end if;
  v_node := jsonb_path_query_first(v_plan -> 0 -> 'Plan',
              'strict $.** ? (exists (@."Relation Name") && @."Relation Name" == "laporan")');

  insert into bench_tiket values (p_titik, p_metode, coalesce(v_tiket, '(kosong)'));
  insert into bench_hasil (titik, metode, scan, median_ms, p95_ms, rows_removed, n)
  select p_titik, p_metode,
         coalesce(v_node ->> 'Node Type' || coalesce(' (' || (v_node ->> 'Index Name') || ')', ''),
                  v_plan -> 0 -> 'Plan' ->> 'Node Type'),
         (select percentile_cont(0.5)  within group (order by w) from unnest(v_waktu) w),
         (select percentile_cont(0.95) within group (order by w) from unnest(v_waktu) w),
         (select coalesce(sum(x::numeric), 0)::bigint from jsonb_path_query(v_plan -> 0 -> 'Plan',
            'strict $.** ? (exists (@."Rows Removed by Filter"))."Rows Removed by Filter"') x),
         v_n;
end $f$;

-- Cuplikan EXPLAIN teks untuk laporan.
create function pg_temp.simpan_explain(p_fase text, p_sql text) returns void language plpgsql as $f$
declare
  v_baris text;
  v_isi   text := '';
begin
  for v_baris in execute 'explain (analyze, buffers, costs off) ' || p_sql loop
    v_isi := v_isi || v_baris || E'\n';
  end loop;
  insert into bench_explain values (p_fase, v_isi);
end $f$;

-- ── FASE SEBELUM: tanpa index laporan_cari_duplikat_idx ──────────────────
drop index if exists public.laporan_cari_duplikat_idx;

do $$
declare t record;
begin
  for t in select * from bench_titik order by urut loop
    perform pg_temp.bench(t.nama, '1 naif (tanpa kotak, tanpa index)',
                          pg_temp.sql_naif(t.lat, t.lng, t.kategori), false);
    perform pg_temp.bench(t.nama, '2 RPC tanpa index',
                          pg_temp.sql_rpc(t.lat, t.lng, t.kategori), true,
                          pg_temp.sql_isi_rpc(t.lat, t.lng, t.kategori));
  end loop;
  perform pg_temp.simpan_explain('SEBELUM (naif, titik ada duplikat)',
                                 pg_temp.sql_naif(-6.9020, 107.6350, 'jalan_berlubang'));
end $$;

-- ── FASE SESUDAH: index dari migration 20261110140216_index_cari_duplikat.sql ──
-- Definisi harus sama dengan migration.
create index laporan_cari_duplikat_idx on public.laporan (kategori, latitude, longitude)
  where status in ('diterima', 'dikerjakan');
analyze public.laporan;

do $$
declare t record;
begin
  for t in select * from bench_titik order by urut loop
    perform pg_temp.bench(t.nama, '3 RPC + index',
                          pg_temp.sql_rpc(t.lat, t.lng, t.kategori), true,
                          pg_temp.sql_isi_rpc(t.lat, t.lng, t.kategori));
  end loop;
  perform pg_temp.simpan_explain('SESUDAH (isi RPC + index, titik ada duplikat)',
                                 pg_temp.sql_isi_rpc(-6.9020, 107.6350, 'jalan_berlubang'));
end $$;

-- ── LAPORAN (pesan exception → rollback) ─────────────────────────────────
do $$
declare
  v_pesan text;
begin
  select E'HASIL BENCHMARK cari_laporan_duplikat (' || (select jumlah_dummy from bench_param)
         || ' laporan dummy, n = ' || (select n_ulang from bench_param) || E' per baris)\n\n'
         || E'titik | metode | scan | median ms | p95 ms | percepatan (x) | rows removed by filter\n'
         || string_agg(format('%s | %s | %s | %s | %s | %s | %s',
              h.titik, h.metode, h.scan,
              round(h.median_ms::numeric, 3), round(h.p95_ms::numeric, 3),
              round((naif.median_ms / nullif(h.median_ms, 0))::numeric, 1),
              h.rows_removed), E'\n' order by t.urut, h.metode)
  into v_pesan
  from bench_hasil h
  join bench_titik t on t.nama = h.titik
  join bench_hasil naif on naif.titik = h.titik and naif.metode like '1 %';

  select v_pesan || E'\n\nCEK HASIL (id_tiket naif = RPC)\ntitik | naif | RPC + index | cocok\n'
         || string_agg(format('%s | %s | %s | %s', t.nama, a.tiket, b.tiket,
              case when a.tiket = b.tiket then 'YA' else 'TIDAK' end), E'\n' order by t.urut)
  into v_pesan
  from bench_titik t
  join bench_tiket a on a.titik = t.nama and a.metode like '1 %'
  join bench_tiket b on b.titik = t.nama and b.metode like '3 %';

  select v_pesan || string_agg(E'\n\n── EXPLAIN ' || fase || E' ──\n' || isi, '' order by fase)
  into v_pesan
  from bench_explain;

  execute 'deallocate bench_isi_rpc';
  raise exception '%', v_pesan
    using hint = 'Pesan ini disengaja: transaksi di-rollback, database tidak berubah.';
end $$;

rollback;  -- tidak tercapai (exception di atas); jaga-jaga.
