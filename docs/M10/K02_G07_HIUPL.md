<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## *Pross*
<img alt="Logo Pross" src="./assets/Logo temp Pross.jpeg" width="70%">

### Untuk: *Stefani Angeline Oroh*

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | *K02* |
| Kelompok | *G07* |

| NIM | Nama |
| --- | --- |
| *13525002* | *Ahmad Boutros Fathir* |
| *13525020* | *Klio Lysander* |
| *13525047* | *Muhammad Fakhriyan Rizki M.* |
| *13525053* | *Kevin Sie* |
| *13525056* | *Mochammad Nuha Al Ghifari* |
| *13525062* | *Rafel Dzinun Muhammad* |

---

## Daftar Isi

- [BAB 1: Pendahuluan](#bab-1-pendahuluan)
  - [1.1 Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
  - [1.2 Lingkup Masalah](#12-lingkup-masalah)
  - [1.3 Definisi, Istilah, dan Singkatan](#13-definisi-istilah-dan-singkatan)
  - [1.4 Aturan Penomoran](#14-aturan-penomoran)
  - [1.5 Referensi](#15-referensi)
  - [1.6 Deskripsi Umum Dokumen (Ikhtisar)](#16-deskripsi-umum-dokumen-ikhtisar)
- [BAB 2: Deskripsi Umum Perangkat Lunak](#bab-2-deskripsi-umum-perangkat-lunak)
- [BAB 3: Implementasi](#bab-3-implementasi)
  - [3.1 Lingkungan Implementasi](#31-lingkungan-implementasi)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini disusun untuk melaporkan hasil implementasi dan pengujian perangkat lunak *Pross*. Dokumen memuat lingkungan implementasi, daftar modul dan antarmuka yang telah diimplementasikan, hasil pengujian unit, integrasi, use case, dan kebutuhan non-fungsional, serta matriks yang menghubungkan kebutuhan fungsional dengan implementasi dan pengujiannya. Dokumen ini ditujukan kepada asisten dan dosen sebagai verifikasi kesesuaian perangkat lunak terhadap SKPL dan DPPL yang telah dibuat.

## 1.2 Lingkup Masalah
Lingkup masalah dalam dokumen ini adalah membangun perangkat lunak *Pross*, yaitu aplikasi mobile berbasis Android untuk manajemen Harga Pokok Penjualan (HPP) yang ditujukan bagi pedagang kuliner UMKM. Aplikasi ini membantu Pemilik Usaha memantau keuntungan atau kerugian setiap produk secara otomatis berdasarkan perubahan harga bahan baku tanpa pencatatan manual. Aplikasi dibangun menggunakan Expo (React Native) dan TypeScript, serta memanfaatkan Supabase sebagai layanan autentikasi dan basis data.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang menjelaskan rancangan arsitektur, kelas, dan antarmuka P/L.* |
| *HIUPL* | *Singkatan dari Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen yang melaporkan hasil implementasi dan pengujian P/L.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *TC* | *Singkatan dari Test Case, yaitu satu kasus uji untuk skenario tertentu.* |
| *UT* | *Singkatan dari Unit Test, yaitu test case tingkat kelas/operasi.* |
| *INT* | *Singkatan dari Integration Test, yaitu test case yang menguji interaksi antarkomponen.* |
| *Boundary* | *Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat di ambang aturan.* |
| *Coverage* | *Persentase baris/cabang kode yang dieksekusi oleh pengujian.* |
| *...* | *...* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya (SKPL, APL, DPPL), kecuali untuk ID pengujian yang baru diperkenalkan pada dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *Sesuai SKPL* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *Sesuai SKPL* |
| *Use Case* | *UCXX* | *Sesuai SKPL* |
| *Kelas* | *CXX* | *Sesuai DPPL* |
| *Antarmuka* | *I-XX* | *Sesuai DPPL* |
| *Test Case Unit* | *CXX-UTYY* | *XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut* |
| *Test Case Integrasi* | *INT-TCYY* | *YY adalah nomor urut test case integrasi* |
| *Test Case Use Case* | *UCXX-TCYY* | *XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut* |
| *Test Case KNF* | *KNFXX-TCYY* | *XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut* |
| *...* | *...* | *...* |

## 1.5 Referensi
1. [Spesifikasi Kebutuhan Perangkat Lunak (SKPL) *Pross*](../M5/K02_G07_SKPL.md)
2. [Arsitektur Perangkat Lunak (APL) *Pross*](../M6/K02_G07_APL.md)
3. [Deskripsi Perancangan Perangkat Lunak (DPPL) *Pross*](../M8/K02_G07_DPPL2.md)
4. [Implementasi (Tugas 9) *Pross*](../M9/K02_G07_Implementasi.md)
5. Dokumentasi Expo: [https://docs.expo.dev/](https://docs.expo.dev/)
6. Dokumentasi React Native: [https://reactnative.dev/docs/getting-started](https://reactnative.dev/docs/getting-started)
7. Dokumentasi Supabase: [https://supabase.com/docs](https://supabase.com/docs)

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Dokumen ini terdiri dari lima bab. Bab 1 membahas pendahuluan yang meliputi tujuan penulisan, lingkup masalah, definisi istilah, aturan penomoran, referensi, dan ikhtisar dokumen. Bab 2 membahas deskripsi umum perangkat lunak *Pross* beserta use case diagram. Bab 3 membahas implementasi yang meliputi lingkungan implementasi, modul, antarmuka, dan file lain yang dihasilkan. Bab 4 membahas hasil pengujian, yaitu strategi pengujian kelas, pengujian unit, integrasi, use case, kebutuhan non-fungsional, beserta bukti pengujian. Bab 5 membahas traceability yang memetakan setiap kebutuhan fungsional ke kebutuhan non-fungsional, use case, kelas, file implementasi, dan test case.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

*Pross* adalah aplikasi mobile Android yang membantu Pemilik Usaha kuliner UMKM mengetahui keuntungan atau kerugian setiap produk berdasarkan harga bahan baku. Pengguna memasukkan resep bahan baku beserta takarannya dan harga jual, kemudian aplikasi menghitung HPP per porsi dan margin secara otomatis. Ketika harga bahan baku berubah, aplikasi menghitung ulang margin dan memberi notifikasi apabila suatu produk mengalami kerugian.


<p align="center">
<img alt="Use Case Diagram Pross" src="./assets/diagram-uc-rev1.png" width="70%">
</p>
<p align="center">
<i>Gambar 2.1. Use Case Diagram Pross</i>
</p>

<br>

---

# BAB 3: Implementasi

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Lingkungan implementasi mengikuti Subbab 2.1 DPPL, dengan tambahan kerangka kerja, pustaka, dan alat pengujian yang digunakan pada tahap implementasi.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *Pengembangan: Lenovo IdeaPad 3 14ALC6 dengan prosessor AMD64 Family 23 Model 104 Stepping 1 AuthenticAMD ~2084 Mhz dan RAM 19.301 MB. Pengujian: [isi model perangkat Android].* |
| *Operating System* | *Pengembangan: [isi OS dan versi]. Pengujian aplikasi: Android 16 melalui Expo Go.* |
| *Bahasa Pemrograman* | *TypeScript ~6.0.3* |
| *DBMS* | *Supabase (PostgreSQL [isi versi])* |
| *Development Tools* | *Visual Studio Code, Node.js v24.17.0, npm 11.13.0, Git, GitHub, Supabase Dashboard, Expo Go* |
| *Testing Tools* | *Vitest ^5.0.5, @vitest/coverage-v8 ^5.0.5* |

## 3.2 Implementasi Modul

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *C01* | *PemilikUsaha* | *`src/models/PemilikUsaha.ts`* | *-* |
| 2 | *C02* | *Produk* | *`src/models/Produk.ts`* | *-* |
| 3 | *C03* | *BahanBaku* | *`src/models/BahanBaku.ts`* | *-* |
| 4 | *C04* | *ResepBahan* | *`src/models/ResepBahan.ts`* | *-* |
| 5 | *C05* | *RegistrationPage* | *`src/views/RegistrationPage.tsx`* | *-* |
| 6 | *C06* | *AuthController* | *`src/controllers/AuthController.ts`, `src/controllers/validators.ts`, `src/supabase/functions/login-with-username/index.ts`* | *-* |
| 7 | *C07* | *LoginPage* | *`src/views/LoginPage.tsx`* | *-* |
| 8 | *C08* | *ResetPasswordPage* | *`src/views/ResetPasswordPage.tsx`* | *-* |
| 9 | *C09* | *ResetPasswordController* | *`src/controllers/ResetPasswordController.ts`* | *-* |
| 10 | *C10* | *AddProductPage* | *`src/views/AddProductPage.tsx`, `src/views/PilihanModal.tsx`* | *-* |
| 11 | *C11* | *MarginController* | *`src/controllers/MarginController.ts`, `src/controllers/margin.ts`* | *-* |
| 12 | *C12* | *EditProductPage* | *`src/views/EditProductPage.tsx`* | *-* |
| 13 | *C13* | *PriceController* | *`src/controllers/PriceController.ts`* | *-* |
| 14 | *C14* | *RiwayatHargaBahanBaku* | *Tabel `tbl_riwayat_harga_bahan` pada `src/supabase/migrations/20261105000000_notifikasi_riwayat_harga.sql`* | *-* |
| 15 | *C15* | *TrenBahanBakuPage* | *`src/views/TrenBahanBakuPage.tsx`* | *-* |
| 16 | *C16* | *TrenBahanBakuController* | *`src/controllers/TrenBahanBakuController.ts`* | *-* |
| 17 | *C17* | *Notifikasi* | *`src/models/Notifikasi.ts`* | *-* |
| 18 | *C18* | *PushNotificationUI* | *`src/services/PushNotificationUI.ts`* | *-* |
| 19 | *C19* | *NotificationController* | *`src/controllers/NotificationController.ts`, `src/controllers/notification.ts`* | *-* |
| 20 | *C20* | *RiwayatHargaJual* | *`src/models/RiwayatHargaJual.ts`* | *-* |
| 21 | *C21* | *SearchProductPage* | *`src/views/SearchProductPage.tsx`* | *-* |
| 22 | *C22* | *ProductSearchController* | *`src/controllers/ProductSearchController.ts`* | *-* |
| 23 | *C23* | *PriceHistoryPage* | *`src/views/PriceHistoryPage.tsx`* | *-* |
| 24 | *C25* | *ProfilePage* | *`src/views/ProfilePage.tsx`* | *-* |
| 25 | *C26* | *ProfileController* | *`src/controllers/ProfileController.ts`* | *-* |

Catatan: kelas C24 PriceHistoryController tidak dicantumkan karena berkas `src/controllers/PriceHistoryController.ts` masih kosong pada tag v9.0.

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *I-01* | *Login* | *`src/views/LoginPage.tsx`* | *-* |
| 2 | *I-02* | *Registrasi* | *`src/views/RegistrationPage.tsx`* | *-* |
| 3 | *I-03* | *Reset Password* | *`src/views/ResetPasswordPage.tsx`* | *-* |
| 4 | *I-04* | *Beranda* | *`src/views/HomePage.tsx`* | *-* |
| 5 | *I-05* | *Pencarian Produk* | *`src/views/SearchProductPage.tsx`* | *-* |
| 6 | *I-06* | *Tambah Produk* | *`src/views/AddProductPage.tsx`, `src/views/PilihanModal.tsx`* | *-* |
| 7 | *I-07* | *Edit Produk* | *`src/views/EditProductPage.tsx`* | *-* |
| 8 | *I-08* | *Riwayat Harga Jual* | *`src/views/PriceHistoryPage.tsx`* | *-* |
| 9 | *I-09* | *Daftar Bahan Baku dan Detail Tren Bahan Baku* | *`src/views/TrenBahanBakuPage.tsx`* | *-* |
| 10 | *I-10* | *Profil Pengguna* | *`src/views/ProfilePage.tsx`* | *-* |
| 11 | *I-11* | *Push Notification* | *`src/services/PushNotificationUI.ts`* | *-* |
| 12 | *I-12* | *Pusat Notifikasi* | *`src/views/NotificationPage.tsx`* | *-* |
| 13 | *-* | *Izin Notifikasi (tambahan, tidak ada pada DPPL)* | *`src/views/IzinNotifikasiPage.tsx`* | *-* |
| 14 | *-* | *Detail Produk (tambahan, tidak ada pada DPPL)* | *`src/views/ProductDetailPage.tsx`* | *-* |

## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*.

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | *`src/supabase/schema.sql`* | *Skema `tbl_pemilik_usaha`, trigger `on_auth_user_created`, fungsi `handle_new_user()` dan `account_exists()`.* |
| 2 | *`src/supabase/migrations/20261103000000_produk_bahan_resep.sql`* | *Migrasi tabel produk, bahan baku, dan resep beserta kebijakan RLS.* |
| 3 | *`src/supabase/migrations/20261105000000_notifikasi_riwayat_harga.sql`* | *Migrasi `tbl_notifikasi`, `tbl_riwayat_harga_bahan`, dan kolom `status_peringatan`.* |
| 4 | *`src/supabase/migrations/20261105000000_porsi_satuan.sql`* | *Migrasi kolom `hasil_resep` pada produk dan `satuan` pada bahan baku.* |
| 5 | *`src/supabase/migrations/20261109000000_sync_email_pemilik.sql`* | *Migrasi sinkronisasi email pemilik usaha.* |
| 6 | *`src/supabase/seed.sql`* | *Data contoh produk, bahan baku, dan resep, hanya berjalan bila akun `demo@pross.test` tersedia.* |
| 7 | *`src/supabase/config.toml`* | *Konfigurasi proyek Supabase.* |
| 8 | *`src/supabase/functions/login-with-username/index.ts`* | *Edge Function untuk login menggunakan username.* |
| 9 | *`src/services/supabase.ts`* | *Inisialisasi klien Supabase.* |
| 10 | *`src/controllers/margin.ts`* | *Fungsi murni perhitungan total biaya, HPP, margin, persentase margin, serta format angka.* |
| 11 | *`src/controllers/notification.ts`* | *Fungsi perhitungan ulang margin dan pembentukan pesan notifikasi.* |
| 12 | *`src/controllers/validators.ts`* | *Fungsi validasi input autentikasi.* |
| 13 | *`src/models/pesan.ts`* | *Konstanta pesan kesalahan dan fungsi pemeriksaan angka.* |
| 14 | *`src/utils/format.ts`, `src/constants/theme.ts`* | *Fungsi format dan konstanta tema tampilan.* |
| 15 | *`src/navigation/types.ts`, `src/App.tsx`* | *Definisi rute serta pengelolaan sesi dan navigasi.* |
| 16 | *`src/tests/*.test.ts`* | *Tujuh berkas pengujian otomatis Vitest (100 test).* |
| 17 | *`src/package.json`, `src/.env.example`, `src/README.md`* | *Dependensi, contoh konfigurasi environment, dan panduan menjalankan aplikasi.* |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| *C01* | *PemilikUsaha* | *Sedang* | *Mendelegasikan pembuatan akun dan pembaruan profil ke Supabase Auth dan basis data.* | *[isi]* |
| *C02* | *Produk* | *Mendalam* | *Setter memuat validasi dan normalisasi (tag, harga jual, hasil resep, margin).* | *[isi]* |
| *C03* | *BahanBaku* | *Mendalam* | *Memuat validasi harga beli dan satuan.* | *[isi]* |
| *C04* | *ResepBahan* | *Mendalam* | *Memuat validasi takaran.* | *[isi]* |
| *C05* | *RegistrationPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis. Validasi dan registrasi didelegasikan ke C06 dan teruji lewat test case use case.* | *-* |
| *C06* | *AuthController* | *Mendalam* | *Memuat validasi registrasi dan login serta keamanan autentikasi.* | *[isi]* |
| *C07* | *LoginPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C08* | *ResetPasswordPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C09* | *ResetPasswordController* | *Mendalam* | *Memuat validasi dan proses pengaturan ulang password.* | *C09-UT01 – C09-UT18* |
| *C10* | *AddProductPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis. Perhitungan dan penyimpanan didelegasikan ke C11.* | *-* |
| *C11* | *MarginController* | *Mendalam* | *Memuat validasi input, perhitungan HPP dan margin, serta penyimpanan produk dan resep.* | *[isi]* |
| *C12* | *EditProductPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C13* | *PriceController* | *Mendalam* | *Memuat validasi harga dan pencatatan riwayat harga jual.* | *C13-UT01 – C13-UT11* |
| *C14* | *RiwayatHargaBahanBaku* | *Tidak perlu* | *Diwujudkan sebagai tabel `tbl_riwayat_harga_bahan` dan tipe data `RiwayatHarga`, tanpa logika.* | *-* |
| *C15* | *TrenBahanBakuPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C16* | *TrenBahanBakuController* | *Mendalam* | *Memuat penyaringan berdasarkan rentang waktu (`filterByRentang`) dan pembentukan data grafik (`formatUntukChart`).* | *[isi]* |
| *C17* | *Notifikasi* | *Sedang* | *Entitas dengan perubahan status baca (`markAsRead()`).* | *C17-UT01 – C17-UT03, INT-TC-NOTIF-02* |
| *C18* | *PushNotificationUI* | *Sedang* | *Mendelegasikan penampilan notifikasi ke pustaka notifikasi perangkat.* | *C18-UT01 – C18-UT08, INT-TC-NOTIF-03, INT-TC-NOTIF-04* |
| *C19* | *NotificationController* | *Mendalam* | *Memuat aturan penentuan margin negatif, pembuatan, dan pengiriman notifikasi.* | *C19-UT01 – C19-UT26, INT-TC-NOTIF-01 – INT-TC-NOTIF-03* |
| *C20* | *RiwayatHargaJual* | *Mendalam* | *Setter memuat validasi harga dan waktu perubahan.* | *C20-UT01 – C20-UT07* |
| *C21* | *SearchProductPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C22* | *ProductSearchController* | *Mendalam* | *Memuat algoritma pencarian dan penyaringan produk melalui `search()`.* | *[isi]* |
| *C23* | *PriceHistoryPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C24* | *PriceHistoryController* | *Mendalam* | *Belum diimplementasikan pada tag v9.0 (berkas kosong), sehingga tidak dapat diuji.* | *-* |
| *C25* | *ProfilePage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C26* | *ProfileController* | *Mendalam* | *Memuat validasi data profil serta proses pembaruan dan pengakhiran sesi.* | *C26-UT01 – C26-UT11* |
| *...* | *...* | *...* | *...* | *...* |

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

Cara menjalankan unit test: `npm test` pada direktori `src/`. Untuk laporan coverage: `npm run test:coverage`.

Lokasi file test: `src/tests/`.

### 4.2.1 Kelas PemilikUsaha

**ID Kelas:** *C01*<br>
**Nama Kelas:** *PemilikUsaha*<br>
**Tingkat:** *Sedang*

Pengujian operasi `createUser()` (`Algo-C01-01`) dijalankan dengan Vitest melalui `src/tests/pemilikUsaha.test.ts`. Pemanggilan Supabase Auth disimulasikan dengan *mock*.

Tabel 4.2.1. Hasil Pengujian Unit Kelas C01

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C01-UT01* | *`createUser()`* | *Normal* | *Buat objek dengan username dan email yang mengandung spasi tepi dan huruf kapital. Jalankan `createUser()` dengan respons sukses dari mock Supabase.* | *Supabase Auth menerima username dan email yang sudah dinormalisasi. Operasi selesai tanpa error.* | *Mock `signUp()` menerima username `kevin_uji` dan email `kevin@example.com`. Operasi selesai tanpa error.* | *Pass* |
| *C01-UT02* | *`createUser()`* | *Negatif* | *Jalankan `createUser()` dengan mock Supabase yang mengembalikan error “User already registered”.* | *Operasi menghasilkan error dengan pesan yang dikembalikan Supabase.* | *Operasi menghasilkan error “User already registered”.* | *Pass* |

### 4.2.2 Kelas AuthController

**ID Kelas:** *C06*<br>
**Nama Kelas:** *AuthController*<br>
**Tingkat:** *Mendalam*

Pengujian operasi `validateData()` (`Algo-C06-01`) dijalankan dengan Vitest melalui `src/tests/authController.test.ts`. Respons Supabase dan Edge Function disimulasikan dengan *mock*.

Tabel 4.2.2. Hasil Pengujian Unit Kelas C06

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C06-UT01* | *`validateData()`* | *Normal* | *Kirim data registrasi valid untuk akun baru. Mock pengecekan akun mengembalikan `false` dan mock `signUp()` berhasil.* | *Controller meminta pembuatan akun dan mengembalikan `true`.* | *`signUp()` dipanggil dengan data yang sesuai dan hasilnya `true`.* | *Pass* |
| *C06-UT02* | *`validateData()`* | *Batas* | *Kirim username kosong dengan email dan password valid.* | *Registrasi ditolak dengan pesan “Data Registrasi Belum Lengkap”.* | *Pesan sesuai dan `signUp()` tidak dipanggil.* | *Pass* |
| *C06-UT03* | *`validateData()`* | *Negatif* | *Kirim data registrasi dengan format email tidak valid.* | *Registrasi ditolak dengan pesan “Format email tidak valid”.* | *Pesan sesuai dan `signUp()` tidak dipanggil.* | *Pass* |
| *C06-UT04* | *`validateData()`* | *Negatif* | *Kirim data registrasi valid saat mock pengecekan akun mengembalikan `true`.* | *Registrasi ditolak dengan pesan “Akun sudah dibuat”.* | *Pesan sesuai dan `signUp()` tidak dipanggil.* | *Pass* |
| *C06-UT05* | *`validateData()`* | *Negatif* | *Kirim data registrasi akun baru dengan password lemah.* | *Registrasi ditolak dengan pesan “Password terlalu lemah”.* | *Pesan sesuai dan `signUp()` tidak dipanggil.* | *Pass* |
| *C06-UT06* | *`validateData()`* | *Normal* | *Kirim email terdaftar dan password benar pada jalur login.* | *`signInWithPassword()` dipanggil dengan kredensial yang sesuai dan operasi mengembalikan `true`.* | *Pemanggilan dan hasil sesuai.* | *Pass* |
| *C06-UT07* | *`validateData()`* | *Negatif* | *Kirim email terdaftar dengan password salah. Mock `signInWithPassword()` mengembalikan error.* | *Login ditolak dengan pesan “Username atau Password Salah”.* | *Operasi menghasilkan pesan yang diharapkan.* | *Pass* |
| *C06-UT08* | *`validateData()`* | *Negatif* | *Kirim email yang belum terdaftar pada jalur login.* | *Login ditolak dengan pesan “Tidak dapat menemukan akun”.* | *Pesan sesuai dan `signInWithPassword()` tidak dipanggil.* | *Pass* |
| *C06-UT09* | *`validateData()`* | *Normal* | *Kirim username dengan spasi tepi dan huruf kapital. Mock Edge Function mengembalikan dua token sesi.* | *Controller mengirim username yang sudah dinormalisasi, menyimpan sesi, dan mengembalikan `true`.* | *`login-with-username` menerima username `kevin_uji`, `setSession()` menerima kedua token, dan hasilnya `true`.* | *Pass* |
| *C06-UT10* | *`validateData()`* | *Negatif* | *Kirim username dengan password salah. Mock Edge Function mengembalikan `INVALID_CREDENTIALS`.* | *Login ditolak dengan pesan “Username atau Password Salah”.* | *Pesan sesuai dan `setSession()` tidak dipanggil.* | *Pass* |
| *C06-UT11* | *`validateData()`* | *Negatif* | *Simulasikan respons sukses dari Edge Function yang hanya memuat `access_token`.* | *Login ditolak dengan pesan “Session login tidak diterima”.* | *Pesan sesuai dan `setSession()` tidak dipanggil.* | *Pass* |

Tabel 4.2.2b. Ringkasan Cakupan Kelas C06

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`validateData(username, email, password)`* |
| Operasi yang diuji | *`validateData()` untuk registrasi, login via email, dan login via username.* |
| ID Algoritma yang tercakup | *`Algo-C06-01`* |
| Coverage (wajib ≥ 70%) | *Vitest 5.0.5 dengan provider V8 melaporkan 88,63% baris, 86,11% cabang, 88,63% pernyataan, dan 100% fungsi untuk `AuthController.ts`. Bukti dicantumkan pada Subbab 4.6.* |

### 4.2.3 Kelas Notifikasi

**ID Kelas:** *C17*<br>
**Nama Kelas:** *Notifikasi*<br>
**Tingkat:** *Sedang*

Pengujian operasi `getPesanAlert()` (`Algo-C17-01`) dan `markAsRead()` (`Algo-C17-02`) dijalankan dengan Vitest melalui `src/tests/notification.test.ts`. Kelas ini tidak bergantung pada komponen eksternal sehingga tidak memerlukan *mock*.

Tabel 4.2.3. Hasil Pengujian Unit Kelas C17

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C17-UT01* | *`markAsRead()`, `getPesanAlert()`* | *Normal* | *Buat objek `Notifikasi` bertipe `kerugian` dengan pesan “Halo”, lalu panggil `markAsRead()`.* | *Status awal belum dibaca, berubah menjadi sudah dibaca setelah `markAsRead()`. `getPesanAlert()` mengembalikan “Halo”.* | *`getIsRead()` bernilai `false` lalu `true`, dan `getPesanAlert()` mengembalikan “Halo”.* | *Pass* |
| *C17-UT02* | *Konstruktor* | *Negatif* | *Buat objek `Notifikasi` dengan pesan yang hanya berisi spasi.* | *Pembuatan objek ditolak dengan error.* | *Konstruktor melempar error.* | *Pass* |
| *C17-UT03* | *`getPesanAlert()` dan getter lainnya* | *Batas* | *Buat objek dengan judul dan pesan yang mengandung spasi tepi, tanpa `idProduk` dan status baca.* | *Judul dan pesan dirapikan, `idProduk` bernilai `null`, dan status awal belum dibaca.* | *Judul “Harga naik”, pesan “Telur naik”, `getIdProduk()` bernilai `null`, dan `getIsRead()` bernilai `false`.* | *Pass* |

Tabel 4.2.3b. Ringkasan Cakupan Kelas C17

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`getPesanAlert()`, `markAsRead()`* |
| Operasi yang diuji | *Konstruktor, `getPesanAlert()`, `markAsRead()`, serta getter pendukung (`getIdNotifikasi()`, `getJudul()`, `getWaktuKirim()`, `getTipe()`, `getIdProduk()`, `getIsRead()`).* |
| ID Algoritma yang tercakup | *`Algo-C17-01`, `Algo-C17-02`* |
| Coverage | *Vitest 5.0.5 dengan provider V8 melaporkan 100% baris, 75% cabang, 100% pernyataan, dan 100% fungsi untuk `Notifikasi.ts`. Kelas bertingkat Sedang tidak wajib memenuhi batas 70%. Bukti dicantumkan pada Subbab 4.6.* |

### 4.2.4 Kelas PushNotificationUI

**ID Kelas:** *C18*<br>
**Nama Kelas:** *PushNotificationUI*<br>
**Tingkat:** *Sedang*

Pengujian operasi `tampilkanNotifikasi()` (`Algo-C18-01`) dan `onClickNotification()` (`Algo-C18-02`) beserta operasi pendukungnya dijalankan dengan Vitest melalui `src/tests/pushNotificationUI.test.ts`. Pustaka `expo-notifications` dan modul `react-native` disimulasikan dengan *mock* karena hanya tersedia di perangkat.

Tabel 4.2.4. Hasil Pengujian Unit Kelas C18

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C18-UT01* | *`inisialisasi()`* | *Normal* | *Mock izin notifikasi mengembalikan `granted` pada platform Android.* | *Notifikasi aktif, kanal Android dengan prioritas maksimum dan kategori `kerugian` terdaftar, serta izin tidak diminta ulang.* | *Operasi mengembalikan `true`, kanal dan kategori terdaftar, dan `requestPermissionsAsync()` tidak dipanggil.* | *Pass* |
| *C18-UT02* | *`inisialisasi()`* | *Negatif* | *Mock izin awal `undetermined` dan pengguna menolak permintaan izin pada platform iOS.* | *Notifikasi tidak aktif.* | *Operasi mengembalikan `false` dan `isNotifikasiAktif()` bernilai `false`.* | *Pass* |
| *C18-UT03* | *`tampilkanNotifikasi()`* | *Normal* | *Izin aktif, lalu tampilkan notifikasi “Margin Negatif!” untuk produk `p1`.* | *Notifikasi dijadwalkan segera dengan judul, pesan, data produk, dan kategori `kerugian`.* | *`scheduleNotificationAsync()` dipanggil dengan konten yang sesuai dan `trigger: null`.* | *Pass* |
| *C18-UT04* | *`tampilkanNotifikasi()`* | *Negatif* | *Tampilkan notifikasi ketika izin belum aktif.* | *Notifikasi tidak dijadwalkan.* | *`scheduleNotificationAsync()` tidak dipanggil.* | *Pass* |
| *C18-UT05* | *`onClickNotification()`* | *Normal* | *Daftarkan handler, lalu simulasikan ketukan notifikasi kerugian yang valid dan notifikasi bertipe tidak dikenal. Hentikan langganan setelahnya.* | *Handler hanya menerima data notifikasi yang valid, dan langganan dapat dihentikan.* | *Handler dipanggil satu kali dengan `{ tipe: 'kerugian', idProduk: 'p1' }` dan `remove()` dipanggil.* | *Pass* |
| *C18-UT06* | *`periksaIzin()`, `bukaPengaturan()`* | *Normal* | *Mock izin mengembalikan `denied`, lalu buka pengaturan perangkat.* | *Status izin “ditolak” dan halaman pengaturan perangkat dibuka.* | *Operasi mengembalikan `ditolak` dan `Linking.openSettings()` dipanggil.* | *Pass* |
| *C18-UT07* | *`ambilKetukanTerakhir()`* | *Normal dan batas* | *Mock ketukan terakhir berupa notifikasi `harga_bahan`, lalu tidak ada ketukan.* | *Data ketukan dikembalikan pada pemanggilan pertama dan `null` pada pemanggilan kedua.* | *Hasil sesuai harapan.* | *Pass* |
| *C18-UT08* | *`parseDataNotifikasi()`* | *Negatif* | *Masukkan `null`, string, tipe tidak dikenal, dan `idProduk` bertipe angka.* | *Data tidak valid ditolak, sedangkan `idProduk` yang bukan string diabaikan.* | *Tiga masukan pertama menghasilkan `null` dan masukan terakhir menghasilkan `idProduk: undefined`.* | *Pass* |

Tabel 4.2.4b. Ringkasan Cakupan Kelas C18

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`tampilkanNotifikasi(notifikasi)`, `onClickNotification()`* |
| Operasi yang diuji | *`tampilkanNotifikasi()`, `onClickNotification()`, serta operasi pendukung `inisialisasi()`, `isNotifikasiAktif()`, `periksaIzin()`, `bukaPengaturan()`, `ambilKetukanTerakhir()`, dan `parseDataNotifikasi()`.* |
| ID Algoritma yang tercakup | *`Algo-C18-01`, `Algo-C18-02`* |
| Coverage | *Vitest 5.0.5 dengan provider V8 melaporkan 100% baris, 95,83% cabang, 100% pernyataan, dan 100% fungsi untuk `PushNotificationUI.ts`. Bukti dicantumkan pada Subbab 4.6.* |

### 4.2.5 Kelas NotificationController

**ID Kelas:** *C19*<br>
**Nama Kelas:** *NotificationController*<br>
**Tingkat:** *Mendalam*

Pengujian operasi `cekMarginNegatif()` (`Algo-C19-01`), `buatNotifikasiKerugian()` (`Algo-C19-02`), dan `kirimNotifikasi()` (`Algo-C19-03`) beserta operasi public lainnya dijalankan dengan Vitest melalui `src/tests/notificationController.test.ts` dan `src/tests/notification.test.ts`. Supabase dan `PushNotificationUI` disimulasikan dengan *mock* sehingga pengujian tidak mengakses jaringan. Data contoh yang digunakan adalah produk Nasi Goreng dengan harga jual Rp15.000 yang memakai telur (`b1`, takaran 2) dan beras (`b2`, takaran 1, harga Rp5.000).

Tabel 4.2.5. Hasil Pengujian Unit Kelas C19

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C19-UT01* | *`perbaruiHargaBeli()`* | *Normal* | *Naikkan harga telur dari Rp2.000 menjadi Rp3.000 sehingga HPP menjadi Rp11.000.* | *Harga dan riwayat harga tersimpan, margin diperbarui menjadi Rp4.000 tanpa peringatan, dan hanya notifikasi perubahan harga yang dikirim.* | *Urutan query ke tabel sesuai, margin tersimpan `4000` dengan `status_peringatan: false`, dan push dikirim satu kali dengan tipe `harga_bahan`.* | *Pass* |
| *C19-UT02* | *`perbaruiHargaBeli()`* | *Normal* | *Naikkan harga telur dari Rp2.000 menjadi Rp6.000 sehingga HPP menjadi Rp17.000.* | *Margin menjadi −Rp2.000 dengan status peringatan aktif. Notifikasi kerugian dan notifikasi perubahan harga tersimpan dan dikirim.* | *Margin tersimpan `-2000` dengan `status_peringatan: true`. Push pertama berjudul “Margin Negatif!” untuk produk `p1`, push kedua bertipe `harga_bahan`.* | *Pass* |
| *C19-UT03* | *`perbaruiHargaBeli()`* | *Batas* | *Naikkan harga telur menjadi Rp5.000 sehingga HPP sama dengan harga jual.* | *Margin 0 tidak dianggap kerugian dan hanya notifikasi perubahan harga yang dikirim.* | *Margin tersimpan `0` dengan `status_peringatan: false` dan push dikirim satu kali.* | *Pass* |
| *C19-UT04* | *`perbaruiHargaBeli()`* | *Batas* | *Kirim harga baru yang sama dengan harga lama (Rp2.000).* | *Tidak ada perubahan data dan tidak ada notifikasi.* | *Hanya satu query baca yang dijalankan dan push tidak dikirim.* | *Pass* |
| *C19-UT05* | *`perbaruiHargaBeli()`* | *Batas* | *Turunkan harga bahan yang tidak dipakai produk mana pun menjadi Rp1.500.* | *Harga dan riwayat tersimpan, tidak ada margin yang diperbarui, dan hanya notifikasi perubahan harga yang dikirim.* | *Query berhenti di `tbl_resep_bahan` lalu menyimpan satu notifikasi. Push dikirim satu kali.* | *Pass* |
| *C19-UT06* | *`perbaruiHargaBeli()`* | *Negatif* | *Kirim harga 0, −1.000, dan `NaN` (tiga kasus parametrik).* | *Ketiga masukan ditolak dengan pesan “Input Takaran / Harga Jual Tidak Valid” sebelum basis data diakses.* | *Ketiga kasus menghasilkan pesan yang diharapkan dan `supabase.from()` tidak dipanggil.* | *Pass* |
| *C19-UT07* | *`perbaruiHargaBeli()`* | *Negatif* | *Mock basis data mengembalikan error saat mengambil bahan `b9`.* | *Proses dibatalkan dengan pesan error dari basis data.* | *Error “Bahan tidak ditemukan” diteruskan dan push tidak dikirim.* | *Pass* |
| *C19-UT08* | *`perbaruiHargaBeli()`* | *Negatif* | *Mock basis data gagal saat menyimpan harga baru.* | *Proses dibatalkan sebelum riwayat harga disimpan.* | *Error “Update ditolak” diteruskan dan hanya dua query dijalankan.* | *Pass* |
| *C19-UT09* | *`perbaruiHargaBeli()`* | *Negatif* | *Mock basis data gagal saat menyimpan riwayat harga.* | *Proses dibatalkan dengan pesan error dari basis data.* | *Error “Riwayat gagal” diteruskan.* | *Pass* |
| *C19-UT10* | *`perbaruiHargaBeli()`* | *Negatif* | *Mock basis data gagal saat memuat produk yang memakai bahan.* | *Proses dibatalkan dengan pesan error dari basis data.* | *Error “Resep gagal dimuat” diteruskan.* | *Pass* |
| *C19-UT11* | *`perbaruiHargaBeli()`* | *Negatif* | *Mock basis data gagal saat memuat detail produk dan resep.* | *Proses dibatalkan dengan pesan error dari basis data.* | *Error “Produk gagal dimuat” diteruskan.* | *Pass* |
| *C19-UT12* | *`perbaruiHargaBeli()`* | *Negatif* | *Mock basis data gagal saat menyimpan margin produk.* | *Proses dibatalkan dan notifikasi tidak dikirim.* | *Error “Margin gagal disimpan” diteruskan dan push tidak dikirim.* | *Pass* |
| *C19-UT13* | *`perbaruiHargaBeli()`* | *Negatif* | *Mock basis data gagal saat menyimpan notifikasi.* | *Proses dibatalkan dan push tidak dikirim.* | *Error “Notifikasi gagal disimpan” diteruskan dan push tidak dikirim.* | *Pass* |
| *C19-UT14* | *`evaluasiPerubahanHarga()`* | *Normal* | *Evaluasi kenaikan harga gula dari Rp1.000 menjadi Rp2.000 untuk produk dengan data bahan kosong dan produk tanpa resep.* | *Produk dengan data tidak lengkap tetap dihitung tanpa error, dan produk yang tidak memakai bahan dilewati.* | *Margin Teh Manis tersimpan `3000` tanpa peringatan dan notifikasi perubahan harga tersimpan.* | *Pass* |
| *C19-UT15* | *`evaluasiPerubahanHarga()`* | *Batas* | *Evaluasi dengan harga lama sama dengan harga baru dan tanpa produk terdampak.* | *Tidak ada notifikasi perubahan harga yang dibuat.* | *Hanya satu query dijalankan dan push tidak dikirim.* | *Pass* |
| *C19-UT16* | *`buatNotifikasiKerugian()`* | *Normal* | *Buat notifikasi kerugian untuk Nasi Goreng dengan margin −Rp2.000 akibat kenaikan harga telur.* | *Notifikasi tersimpan dan dikembalikan sebagai objek `Notifikasi` bertipe `kerugian` yang belum dibaca.* | *Objek `Notifikasi` dengan ID `n7`, tipe `kerugian`, produk `p1`, pesan berisi “Nasi Goreng”, dan status belum dibaca.* | *Pass* |
| *C19-UT17* | *`kirimNotifikasi()`* | *Negatif* | *Mock push notification menolak dengan error “Izin ditolak” saat membuat notifikasi perubahan harga.* | *Kegagalan push hanya dicatat sebagai peringatan dan notifikasi tetap tersimpan.* | *Objek notifikasi `n8` dikembalikan dan `console.warn()` dipanggil.* | *Pass* |
| *C19-UT18* | *`getPush()`* | *Normal* | *Buat controller dengan layanan push tiruan.* | *Controller mengembalikan layanan push yang sama.* | *Layanan push yang dikembalikan sama dengan yang diberikan.* | *Pass* |
| *C19-UT19* | *`muatNotifikasi()`* | *Normal* | *Mock basis data mengembalikan dua baris notifikasi (kerugian dan perubahan harga).* | *Notifikasi diurutkan dari yang terbaru dan dipetakan menjadi objek `Notifikasi`.* | *Query diurutkan berdasarkan `waktu_kirim` menurun dan dua objek terbentuk dengan data yang sesuai.* | *Pass* |
| *C19-UT20* | *`muatNotifikasi()`* | *Batas* | *Mock basis data mengembalikan `null`.* | *Operasi mengembalikan daftar kosong.* | *Hasil berupa daftar kosong.* | *Pass* |
| *C19-UT21* | *`muatNotifikasi()`* | *Negatif* | *Mock basis data mengembalikan error “Koneksi terputus”.* | *Error diteruskan ke pemanggil.* | *Error “Koneksi terputus” diteruskan.* | *Pass* |
| *C19-UT22* | *`tandaiSudahDibaca()`* | *Normal* | *Tandai notifikasi `n1` yang belum dibaca.* | *Status baca diperbarui di basis data dan pada objek.* | *Query memperbarui `is_read: true` untuk `n1` dan `getIsRead()` bernilai `true`.* | *Pass* |
| *C19-UT23* | *`tandaiSudahDibaca()`* | *Negatif* | *Mock basis data gagal saat memperbarui status baca.* | *Error diteruskan dan status objek tidak berubah.* | *Error “Update gagal” diteruskan dan `getIsRead()` tetap `false`.* | *Pass* |
| *C19-UT24* | *`tandaiSemuaDibaca()`* | *Normal* | *Tandai semua notifikasi yang belum dibaca.* | *Seluruh notifikasi dengan `is_read = false` diperbarui menjadi sudah dibaca.* | *Query memperbarui `is_read: true` dengan filter `is_read = false`.* | *Pass* |
| *C19-UT25* | *`tandaiSemuaDibaca()`* | *Negatif* | *Mock basis data gagal saat memperbarui status massal.* | *Error diteruskan ke pemanggil.* | *Error “Update massal gagal” diteruskan.* | *Pass* |
| *C19-UT26* | *`cekMarginNegatif()`* | *Normal dan batas* | *Saring tiga hasil kalkulasi dengan margin −1, 0, dan 10.* | *Hanya produk dengan margin negatif yang dikembalikan. Margin 0 tidak termasuk.* | *Hanya produk dengan margin −1 yang dikembalikan.* | *Pass* |

Tabel 4.2.5b. Ringkasan Cakupan Kelas C19

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`cekMarginNegatif()`, `buatNotifikasiKerugian()`, `kirimNotifikasi(notifikasi)`* |
| Operasi yang diuji | *Seluruh operasi public pada DPPL, ditambah operasi public hasil implementasi: `perbaruiHargaBeli()`, `evaluasiPerubahanHarga()`, `buatNotifikasiPerubahanHarga()`, `getPush()`, `muatNotifikasi()`, `tandaiSudahDibaca()`, dan `tandaiSemuaDibaca()`.* |
| ID Algoritma yang tercakup | *`Algo-C19-01`, `Algo-C19-02`, `Algo-C19-03`* |
| Coverage (wajib ≥ 70%) | *Vitest 5.0.5 dengan provider V8 melaporkan 100% baris, 97,67% cabang, 100% pernyataan, dan 100% fungsi untuk `NotificationController.ts`, serta 100% pada seluruh metrik untuk `notification.ts`. Bukti dicantumkan pada Subbab 4.6.* |

### 4.2.6 Kelas Produk

**ID Kelas:** *C02*<br>
**Nama Kelas:** *Produk*<br>
**Tingkat:** *Mendalam*

Pengujian operasi pada kelas Produk (`Algo-C02-01` sampai `Algo-C02-08`) dijalankan dengan Vitest melalui `src/tests/models.test.ts`.

Tabel 4.2.6. Hasil Pengujian Unit Kelas C02

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C02-UT01* | *`setNamaProduk()`* | *Negatif* | *Isi nama produk dengan spasi saja.* | *Operasi ditolak dengan pesan “Nama produk wajib diisi”.* | *Operasi menghasilkan error “Nama produk wajib diisi”.* | *Pass* |
| *C02-UT02* | *`setNamaProduk()`, `getNamaProduk()`* | *Normal* | *Isi nama produk “  Nasi Goreng ” (spasi di tepi).* | *Nama tersimpan tanpa spasi tepi.* | *`getNamaProduk()` mengembalikan “Nasi Goreng”.* | *Pass* |
| *C02-UT03* | *`setTag()`, `getTag()`* | *Batas* | *Isi tag “ Makanan ”, “makanan”, “Nasi   Goreng”, dan teks kosong.* | *Tag dinormalisasi ke huruf kecil, spasi dirapikan, duplikat dan teks kosong dibuang.* | *`getTag()` mengembalikan “makanan” dan “nasi goreng”.* | *Pass* |
| *C02-UT04* | *`DAFTAR_TAG`* | *Normal* | *Periksa daftar tag yang tersedia.* | *Daftar memuat “Makanan utama”.* | *Daftar memuat “Makanan utama”.* | *Pass* |
| *C02-UT05* | *`setHargaJual()`* | *Batas* | *Isi harga jual 0.* | *Operasi ditolak dengan pesan “Input Takaran / Harga Jual Tidak Valid”.* | *Operasi menghasilkan error “Input Takaran / Harga Jual Tidak Valid”.* | *Pass* |
| *C02-UT06* | *`setHargaJual()`* | *Negatif* | *Isi harga jual `NaN`.* | *Operasi ditolak dengan error.* | *Operasi menghasilkan error.* | *Pass* |
| *C02-UT07* | *`setHargaJual()`, `getHargaJual()`* | *Normal* | *Isi harga jual 18.000.* | *Harga jual tersimpan.* | *`getHargaJual()` mengembalikan 18.000.* | *Pass* |
| *C02-UT08* | *`getHasilResep()`* | *Normal* | *Baca hasil resep pada objek baru.* | *Nilai bawaan 1.* | *`getHasilResep()` mengembalikan 1.* | *Pass* |
| *C02-UT09* | *`setHasilResep()`* | *Batas* | *Isi hasil resep 0.* | *Operasi ditolak dengan pesan “Hasil resep harus berupa bilangan bulat lebih dari 0”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C02-UT10* | *`setHasilResep()`* | *Negatif* | *Isi hasil resep 2,5 (bukan bilangan bulat).* | *Operasi ditolak dengan error.* | *Operasi menghasilkan error.* | *Pass* |
| *C02-UT11* | *`setHasilResep()`, `getHasilResep()`* | *Normal* | *Isi hasil resep 10.* | *Hasil resep tersimpan.* | *`getHasilResep()` mengembalikan 10.* | *Pass* |
| *C02-UT12* | *`setMargin()`, `getMargin()`* | *Normal* | *Isi margin −320 (margin negatif).* | *Margin negatif diterima dan tersimpan.* | *`getMargin()` mengembalikan −320.* | *Pass* |
| *C02-UT13* | *`setMargin()`* | *Negatif* | *Isi margin `Infinity`.* | *Operasi ditolak dengan error.* | *Operasi menghasilkan error.* | *Pass* |

Tabel 4.2.6b. Ringkasan Cakupan Kelas C02

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`getNamaProduk()`, `setNamaProduk()`, `getTag()`, `setTag()`, `getHargaJual()`, `setHargaJual()`, `getMargin()`, `setMargin()`* |
| Operasi yang diuji | *Seluruh operasi pada DPPL, ditambah `getHasilResep()` dan `setHasilResep()`. Operasi `getStatusPeringatan()` dan `setStatusPeringatan()` belum diuji pada berkas ini.* |
| ID Algoritma yang tercakup | *`Algo-C02-01` sampai `Algo-C02-08`* |
| Coverage (wajib ≥ 70%) | *93,93% statement / 88,88% cabang. Bukti pada Subbab 4.6.* |

### 4.2.7 Kelas BahanBaku

**ID Kelas:** *C03*<br>
**Nama Kelas:** *BahanBaku*<br>
**Tingkat:** *Mendalam*

Pengujian operasi pada kelas BahanBaku (`Algo-C03-01` sampai `Algo-C03-03`) dijalankan dengan Vitest melalui `src/tests/models.test.ts`.

Tabel 4.2.7. Hasil Pengujian Unit Kelas C03

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C03-UT01* | *`BahanBaku()`, `getNamaBahan()`* | *Negatif* | *Buat bahan baku dengan nama kosong, harga beli 10, satuan “gram”.* | *Pembuatan ditolak dengan pesan “Nama bahan baku wajib diisi”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C03-UT02* | *`BahanBaku()`, `setHargaBeli()`* | *Batas* | *Buat bahan baku “Gula” dengan harga beli 0.* | *Pembuatan ditolak dengan pesan “Input Takaran / Harga Jual Tidak Valid”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C03-UT03* | *`BahanBaku()`, `setSatuan()`* | *Negatif* | *Buat bahan baku “Gula” dengan satuan berisi spasi saja.* | *Pembuatan ditolak dengan pesan “Satuan bahan baku wajib diisi”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C03-UT04* | *`getSatuan()`* | *Normal* | *Buat bahan baku “Gula” dengan harga beli 16 tanpa satuan.* | *Satuan bernilai bawaan “unit”.* | *`getSatuan()` mengembalikan “unit”.* | *Pass* |
| *C03-UT05* | *`setHargaBeli()`, `getHargaBeli()`* | *Normal* | *Ubah harga beli bahan “Gula” dari 16 menjadi 18.* | *Harga beli diperbarui.* | *`getHargaBeli()` mengembalikan 18.* | *Pass* |
| *C03-UT06* | *`setSatuan()`, `getSatuan()`* | *Normal* | *Ubah satuan dari “gram” menjadi “kg”.* | *Satuan diperbarui.* | *`getSatuan()` mengembalikan “kg”.* | *Pass* |
| *C03-UT07* | *`getNamaBahan()`* | *Normal* | *Baca nama bahan setelah pembaruan harga beli dan satuan.* | *Nama tidak berubah.* | *`getNamaBahan()` mengembalikan “Gula”.* | *Pass* |

Tabel 4.2.7b. Ringkasan Cakupan Kelas C03

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`getNamaBahan()`, `getHargaBeli()`, `setHargaBeli()`* |
| Operasi yang diuji | *Seluruh operasi pada DPPL, ditambah `getSatuan()` dan `setSatuan()`.* |
| ID Algoritma yang tercakup | *`Algo-C03-01` sampai `Algo-C03-03`* |
| Coverage (wajib ≥ 70%) | *100% statement / 81,81% cabang. Bukti pada Subbab 4.6.* |

### 4.2.8 Kelas ResepBahan

**ID Kelas:** *C04*<br>
**Nama Kelas:** *ResepBahan*<br>
**Tingkat:** *Mendalam*

Pengujian operasi pada kelas ResepBahan (`Algo-C04-01` dan `Algo-C04-02`) dijalankan dengan Vitest melalui `src/tests/models.test.ts`.

Tabel 4.2.8. Hasil Pengujian Unit Kelas C04

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C04-UT01* | *`ResepBahan()`, `setTakaran()`* | *Negatif* | *Buat resep bahan “Beras” dengan takaran −1.* | *Pembuatan ditolak dengan pesan “Takaran harus lebih dari 0”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C04-UT02* | *`getTakaran()`* | *Normal* | *Buat resep bahan “Beras” dengan takaran 150.* | *Takaran tersimpan.* | *`getTakaran()` mengembalikan 150.* | *Pass* |
| *C04-UT03* | *`getBahan()`* | *Normal* | *Baca bahan dari resep yang sama.* | *Mengembalikan objek bahan yang sama.* | *`getBahan()` mengembalikan objek bahan “Beras” yang sama.* | *Pass* |
| *C04-UT04* | *`setTakaran()`* | *Batas* | *Ubah takaran menjadi 0.* | *Operasi ditolak dengan error.* | *Operasi menghasilkan error.* | *Pass* |

Tabel 4.2.8b. Ringkasan Cakupan Kelas C04

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`getTakaran()`, `setTakaran()`* |
| Operasi yang diuji | *Seluruh operasi pada DPPL, ditambah `getBahan()`.* |
| ID Algoritma yang tercakup | *`Algo-C04-01`, `Algo-C04-02`* |
| Coverage (wajib ≥ 70%) | *100% statement / 100% cabang. Bukti pada Subbab 4.6.* |

### 4.2.9 Kelas MarginController

**ID Kelas:** *C11*<br>
**Nama Kelas:** *MarginController*<br>
**Tingkat:** *Mendalam*

Pengujian operasi pada kelas MarginController (`Algo-C11-01` sampai `Algo-C11-04`) beserta fungsi perhitungan pendukungnya dijalankan dengan Vitest melalui `src/tests/marginController.test.ts` dan `src/tests/margin.test.ts`. Respons Supabase disimulasikan dengan *mock*. Operasi `validasiNamaProduk()` diuji melalui `validasiInput()`, sedangkan `simpanProdukBaru()` dan `simpanResep()` diuji melalui `simpanProduk()`.

Tabel 4.2.9. Hasil Pengujian Unit Kelas C11

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C11-UT01* | *`validasiInput()`* | *Normal* | *Resep Beras takaran 1 (Rp 15.000), Ayam takaran 2 (Rp 45.000), Kecap takaran 250 (Rp 40), hasil resep 10, harga jual Rp 20.000. Harga bahan diambil dari mock basis data.* | *Total biaya Rp 115.000, HPP Rp 11.500, margin Rp 8.500, persentase margin 42,5%.* | *Preview menghasilkan total biaya 115.000, HPP 11.500, margin 8.500, dan persentase margin 42,5%.* | *Pass* |
| *C11-UT02* | *`validasiNamaProduk()` melalui `validasiInput()`* | *Negatif* | *Mock basis data melaporkan nama produk sudah ada.* | *Ditolak dengan pesan “Nama Produk Sudah Pernah Dibuat”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C11-UT03* | *`validasiInput()`* | *Negatif* | *Resep berisi bahan dengan takaran 0.* | *Ditolak dengan pesan “Takaran harus lebih dari 0”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C11-UT04* | *`validasiInput()`* | *Negatif* | *Resep berisi bahan Beras dua kali.* | *Ditolak dengan pesan “Bahan baku tidak boleh duplikat dalam satu resep”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C11-UT05* | *`validasiInput()`* | *Negatif* | *Resep berisi bahan baru bernama “beras” padahal bahan tersebut sudah ada.* | *Ditolak dengan pesan yang memuat “sudah ada, pilih dari daftar”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C11-UT06* | *`validasiInput()`* | *Negatif* | *Hasil resep 2,5 (bukan bilangan bulat).* | *Ditolak dengan pesan “Hasil resep harus berupa bilangan bulat lebih dari 0”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C11-UT07* | *`validasiInput()`* | *Batas* | *Harga jual Rp 5.000 dengan resep Ayam takaran 2 dan hasil resep 10.* | *HPP Rp 9.000 dan margin −Rp 4.000 (margin negatif tetap dihitung).* | *Preview menghasilkan HPP 9.000 dan margin −4.000.* | *Pass* |
| *C11-UT08* | *`simpanProduk()`, `simpanProdukBaru()`, `simpanResep()`* | *Normal* | *Preview dengan bahan Beras (takaran 1) dan bahan baru Bumbu (Rp 15.000, pak, takaran 1), lalu `simpanProduk()`.* | *Produk tersimpan dengan hasil resep 10, margin 17.000, dan tag “makanan utama”. Bahan baru Bumbu tersimpan. Resep tersimpan 2 baris.* | *Data yang dikirim ke mock sesuai: hasil resep 10, margin 17.000, tag “makanan utama”, bahan Bumbu 15.000 pak, dan 2 baris resep.* | *Pass* |
| *C11-UT09* | *`simpanProduk()`* | *Negatif* | *Mock penyimpanan resep dibuat gagal.* | *Operasi menghasilkan error dan produk yang sudah tersimpan dibatalkan.* | *Operasi menghasilkan error “gagal” dan produk `p1` dihapus.* | *Pass* |
| *C11-UT10* | *`simpanProduk()`* | *Negatif* | *Jalankan `simpanProduk()` sebelum preview dihitung.* | *Ditolak dengan pesan “Hitung preview margin terlebih dahulu”.* | *Operasi menghasilkan error dengan pesan tersebut.* | *Pass* |
| *C11-UT11* | *`hitungTotalBiaya()`* | *Normal* | *Daftar bahan contoh pada rancangan I-06.* | *Total biaya Rp 130.000.* | *Mengembalikan 130.000.* | *Pass* |
| *C11-UT12* | *`hitungHpp()`* | *Normal* | *Daftar bahan contoh I-06 dengan 10 porsi.* | *HPP Rp 13.000 per porsi.* | *Mengembalikan 13.000.* | *Pass* |
| *C11-UT13* | *`hitungMargin()`, `hitungPersenMargin()`* | *Normal* | *Harga jual Rp 20.000 dan HPP Rp 13.000.* | *Margin Rp 7.000 dan persentase 35%.* | *Mengembalikan margin 7.000 dan persentase 35.* | *Pass* |
| *C11-UT14* | *`hitungHpp()`, `hitungMargin()`* | *Batas* | *Hitung HPP tanpa menyebutkan porsi, harga jual Rp 18.000.* | *Porsi bawaan 1: HPP Rp 7.520, margin Rp 10.480.* | *Mengembalikan HPP 7.520 dan margin 10.480.* | *Pass* |
| *C11-UT15* | *`hitungHpp()`* | *Batas* | *Satu bahan (harga 100, takaran 2) dengan porsi 0, lalu `NaN`.* | *Porsi tidak valid diperlakukan sebagai 1, HPP 200.* | *Mengembalikan 200 pada kedua masukan.* | *Pass* |
| *C11-UT16* | *`hitungMargin()`, `hitungPersenMargin()`* | *Negatif* | *Harga jual Rp 5.000 dengan HPP Rp 5.320.* | *Margin −320 dan persentase −6,4%.* | *Mengembalikan margin −320 dan persentase −6,4.* | *Pass* |
| *C11-UT17* | *`hitungHpp()`* | *Batas* | *Satu bahan dengan harga 0,1 dan takaran 3.* | *HPP 0,3 (tanpa galat floating point).* | *Mengembalikan 0,3.* | *Pass* |
| *C11-UT18* | *`hitungPersenMargin()`* | *Batas* | *Harga jual 0 dan margin 100.* | *Persentase margin 0.* | *Mengembalikan 0.* | *Pass* |
| *C11-UT19* | *`parseAngka()`* | *Normal* | *Masukan “18000”.* | *18.000.* | *Mengembalikan 18.000.* | *Pass* |
| *C11-UT20* | *`parseAngka()`* | *Normal* | *Masukan “18.000” dan “1.500.000”.* | *Titik dibaca sebagai pemisah ribuan: 18.000 dan 1.500.000.* | *Mengembalikan 18.000 dan 1.500.000.* | *Pass* |
| *C11-UT21* | *`parseAngka()`* | *Normal* | *Masukan “2,5” dan “0,250”.* | *Koma dibaca sebagai desimal: 2,5 dan 0,25.* | *Mengembalikan 2,5 dan 0,25.* | *Pass* |
| *C11-UT22* | *`parseAngka()`* | *Normal* | *Masukan “1.500,50”.* | *1.500,5.* | *Mengembalikan 1.500,5.* | *Pass* |
| *C11-UT23* | *`parseAngka()`* | *Negatif* | *Masukan teks kosong, “abc”, “12a”, dan “-5”.* | *Seluruhnya menghasilkan `NaN`.* | *Mengembalikan `NaN` untuk keempat masukan.* | *Pass* |
| *C11-UT24* | *`escapeLike()`* | *Normal* | *Masukan “50%_off”.* | *Karakter `%` dan `_` diloloskan.* | *Mengembalikan “50\%\_off”.* | *Pass* |
| *C11-UT25* | *`formatRupiah()`* | *Batas* | *Masukan 10.480, −320, dan 0.* | *“Rp 10.480”, “-Rp 320”, dan “Rp 0”.* | *Mengembalikan ketiga nilai tersebut.* | *Pass* |
| *C11-UT26* | *`formatPersen()`* | *Normal* | *Masukan 35 dan −6,4.* | *“35,0%” dan “-6,4%”.* | *Mengembalikan “35,0%” dan “-6,4%”.* | *Pass* |

Tabel 4.2.9b. Ringkasan Cakupan Kelas C11

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`validasiNamaProduk()`, `validasiInput()`, `simpanProdukBaru()`, `simpanResep()`* |
| Operasi yang diuji | *Seluruh operasi pada DPPL, diuji melalui `validasiInput()` dan `simpanProduk()`, ditambah fungsi pendukung pada `margin.ts`.* |
| ID Algoritma yang tercakup | *`Algo-C11-01` sampai `Algo-C11-04`* |
| Coverage (wajib ≥ 70%) | *84,72% statement / 74,69% cabang untuk `MarginController.ts` dan `margin.ts` bersama. Per berkas: `MarginController.ts` 81,89% statement / 67,24% cabang, `margin.ts` 96,42% statement / 92% cabang. Bukti pada Subbab 4.6.* |

### 4.2.10 Kelas ResetPasswordController

**ID Kelas:** *C09*
**Nama Kelas:** *ResetPasswordController*
**Tingkat:** *Mendalam*

Pengujian operasi `validateData()`, `kirimTautan()`, `terimaTautan()`, `akhiriSesiPemulihan()`, serta fungsi `bacaTautanReset()` dilakukan menggunakan Vitest melalui `src/tests/resetPasswordController.test.ts`. Layanan Supabase Auth, pemeriksaan akun, dan pembentukan URL disimulasikan menggunakan *mock*. Pengujian mencakup kasus normal, batas, dan negatif pada validasi input, pembacaan token, pengiriman tautan reset, pembentukan sesi pemulihan, serta pengakhiran sesi.

Tabel 4.2.10. Hasil Pengujian Unit Kelas C09

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C09-UT01* | *`bacaTautanReset()`* | *Normal* | *Masukkan URL recovery dengan `access_token=abc`, `refresh_token=def`, dan `type=recovery` pada fragment URL.* | *Kedua token berhasil diekstraksi dari URL.* | *Fungsi mengembalikan tipe `token`, access token `abc`, dan refresh token `def`.* | *Pass* |
| *C09-UT02* | *`bacaTautanReset()`* | *Negatif* | *Masukkan URL `pross://home` yang bukan tautan reset.* | *URL dikenali sebagai tautan bukan reset.* | *Fungsi mengembalikan `{ tipe: 'bukan-reset' }`.* | *Pass* |
| *C09-UT03* | *`bacaTautanReset()`* | *Negatif* | *Masukkan URL recovery dengan `error=access_denied` dan `error_code=otp_expired`.* | *Tautan ditolak karena kedaluwarsa.* | *Fungsi mengembalikan tipe `galat` dengan `PESAN_TAUTAN_TIDAK_VALID`.* | *Pass* |
| *C09-UT04* | *`bacaTautanReset()`* | *Negatif* | *Masukkan URL `pross://reset-password` tanpa token.* | *Tautan ditolak karena token tidak tersedia.* | *Fungsi mengembalikan tipe `galat` dengan `PESAN_TAUTAN_TIDAK_VALID`.* | *Pass* |
| *C09-UT05* | *`validateData()`* | *Batas* | *Masukkan email berupa spasi dan password `null`.* | *Validasi ditolak dengan pesan email kosong.* | *Operasi menghasilkan `PESAN_EMAIL_KOSONG`.* | *Pass* |
| *C09-UT06* | *`validateData()`* | *Negatif* | *Masukkan email `x@y.id` dengan mock pemeriksaan akun mengembalikan `false`.* | *Validasi ditolak karena akun tidak terdaftar.* | *Operasi menghasilkan `PESAN_AKUN_TIDAK_DITEMUKAN`.* | *Pass* |
| *C09-UT07* | *`validateData()`* | *Normal* | *Masukkan email terdaftar `sari@dapur.id` dan password `null`.* | *Validasi mengembalikan `true` tanpa mengubah password.* | *Operasi mengembalikan `true` dan daftar pembaruan password tetap kosong.* | *Pass* |
| *C09-UT08* | *`validateData()`* | *Negatif* | *Masukkan email terdaftar dengan password lemah `abc`.* | *Password ditolak tanpa melakukan pembaruan.* | *Operasi menghasilkan `PESAN_PASSWORD_LEMAH` dan pembaruan password tidak dipanggil.* | *Pass* |
| *C09-UT09* | *`validateData()`* | *Normal* | *Masukkan email terdaftar dan password valid `Abcdef12`.* | *Validasi berhasil dan password baru diteruskan ke layanan pembaruan.* | *Operasi mengembalikan `true` dan mock mencatat pembaruan password `Abcdef12`.* | *Pass* |
| *C09-UT10* | *`validateData()`* | *Negatif* | *Masukkan email `sari@dapur.id` ketika email sesi aktif adalah `lain@dapur.id`.* | *Pembaruan ditolak karena email tidak sesuai dengan sesi aktif.* | *Operasi menghasilkan `PESAN_AKUN_TIDAK_DITEMUKAN` dan password tidak diperbarui.* | *Pass* |
| *C09-UT11* | *`kirimTautan()`* | *Normal* | *Kirim permintaan reset untuk email `  Sari@Dapur.id ` dengan mock Expo Linking.* | *Email dinormalisasi dan tautan dikirim dengan URL redirect aplikasi.* | *Mock menerima email `sari@dapur.id` dan `redirectTo: pross://reset-password`.* | *Pass* |
| *C09-UT12* | *`kirimTautan()`* | *Negatif* | *Kirim permintaan reset saat mock pemeriksaan akun menyatakan email tidak terdaftar.* | *Permintaan ditolak dan email reset tidak dikirim.* | *Operasi menghasilkan `PESAN_AKUN_TIDAK_DITEMUKAN` dan daftar pemanggilan reset kosong.* | *Pass* |
| *C09-UT13* | *`kirimTautan()`* | *Negatif* | *Simulasikan Supabase mengembalikan error `email rate limit exceeded`.* | *Error pengiriman email diteruskan kepada pemanggil.* | *Operasi menghasilkan error `email rate limit exceeded`.* | *Pass* |
| *C09-UT14* | *`terimaTautan()`* | *Negatif* | *Masukkan URL `pross://home` yang bukan tautan reset.* | *URL diabaikan dan sesi tidak dibuat.* | *Operasi mengembalikan tipe `bukan-reset` dan `setSession()` tidak dipanggil.* | *Pass* |
| *C09-UT15* | *`terimaTautan()`* | *Normal* | *Masukkan URL recovery yang memuat access token `abc` dan refresh token `def`.* | *Token digunakan untuk membentuk sesi dan email pengguna dikembalikan.* | *Mock `setSession()` menerima kedua token dan operasi mengembalikan email `sari@dapur.id`.* | *Pass* |
| *C09-UT16* | *`terimaTautan()`* | *Negatif* | *Masukkan token recovery ketika mock `setSession()` mengembalikan error `invalid`.* | *Proses pemulihan mengembalikan pesan tautan tidak valid.* | *Operasi mengembalikan tipe `galat` dengan `PESAN_TAUTAN_TIDAK_VALID`.* | *Pass* |
| *C09-UT17* | *`terimaTautan()`* | *Negatif* | *Masukkan URL recovery dengan `error_code=otp_expired`.* | *Sesi tidak dibuat karena tautan kedaluwarsa.* | *Operasi mengembalikan tipe `galat` dan `setSession()` tidak dipanggil.* | *Pass* |
| *C09-UT18* | *`akhiriSesiPemulihan()`* | *Normal* | *Panggil operasi pengakhiran sesi pemulihan.* | *Proses logout dijalankan satu kali.* | *Mock `signOut()` tercatat dipanggil satu kali.* | *Pass* |

Tabel 4.2.10b. Ringkasan Cakupan Kelas C09

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`validateData()`, `resetPassword()`* |
| Operasi yang diuji | *`validateData()`, `kirimTautan()`, `terimaTautan()`, `akhiriSesiPemulihan()`, dan fungsi `bacaTautanReset()`.* |
| ID Algoritma yang tercakup | *Perlu disesuaikan dengan ID algoritma C09 pada DPPL.* |
| Jumlah test | *18 test, seluruhnya Pass.* |
| Coverage (wajib ≥ 70%) | *Vitest 5.0.5 dengan provider V8 melaporkan 98,03% baris, 97,22% cabang, 98,03% pernyataan, dan 100% fungsi untuk `ResetPasswordController.ts`. Bukti dicantumkan pada Subbab 4.6.* |


### 4.2.11 Kelas ProfileController

**ID Kelas:** *C26*
**Nama Kelas:** *ProfileController*
**Tingkat:** *Mendalam*

Pengujian operasi `muatProfil()`, `validateProfileData()`, `updateProfileData()`, dan `processLogout()` dilakukan menggunakan Vitest melalui `src/tests/profileController.test.ts`. Layanan Supabase Auth dan operasi basis data disimulasikan menggunakan *mock*. Pengujian mencakup pemuatan profil, validasi data, pembaruan informasi akun, pemeriksaan email terdaftar, dan pengakhiran sesi dengan kasus normal, batas, serta negatif.

Tabel 4.2.11. Hasil Pengujian Unit Kelas C26

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C26-UT01* | *`muatProfil()`* | *Normal* | *Mock profil berisi username `sari`, email `sari@dapur.id`, serta nama usaha dan nomor telepon bernilai `null`.* | *Data profil dimuat dan atribut opsional `null` dikonversi menjadi string kosong.* | *Username dan email sesuai, sedangkan `getNamaUsaha()` dan `getNoTelp()` mengembalikan string kosong.* | *Pass* |
| *C26-UT02* | *`validateProfileData()`* | *Normal* | *Masukkan nama usaha `Dapur Bu Sari`, email valid, dan nomor telepon `0812 3456 7890`.* | *Validasi menerima data profil yang sah, termasuk nomor telepon dengan spasi.* | *Operasi mengembalikan `true`.* | *Pass* |
| *C26-UT03* | *`validateProfileData()`* | *Batas* | *Masukkan nama usaha dan nomor telepon kosong dengan email valid.* | *Validasi berhasil karena kedua atribut bersifat opsional.* | *Operasi mengembalikan `true`.* | *Pass* |
| *C26-UT04* | *`validateProfileData()`* | *Negatif* | *Masukkan email dengan format tidak valid `sari@`.* | *Validasi menolak email dengan `ValidationError`.* | *Operasi menghasilkan `PESAN_EMAIL_TIDAK_VALID` dengan tipe `ValidationError`.* | *Pass* |
| *C26-UT05* | *`validateProfileData()`* | *Negatif* | *Masukkan nomor telepon `08abc` yang mengandung huruf.* | *Validasi menolak nomor telepon yang bukan angka.* | *Operasi menghasilkan `PESAN_TELP_TIDAK_VALID`.* | *Pass* |
| *C26-UT06* | *`updateProfileData()`* | *Normal* | *Ubah nama usaha dan nomor telepon dengan email yang sama, tetapi berbeda huruf kapital.* | *Nama usaha dan nomor telepon disimpan setelah normalisasi tanpa meminta perubahan email.* | *Mock menyimpan `nama_usaha: Dapur Bu Sari` dan `no_telp: 0812 3456 7890`. Pembaruan email tidak dipanggil dan `emailPerluKonfirmasi` bernilai `false`.* | *Pass* |
| *C26-UT07* | *`updateProfileData()`* | *Normal* | *Ubah email menjadi `Baru@Dapur.id` yang belum digunakan akun lain.* | *Email baru dinormalisasi dan proses konfirmasi email diperlukan.* | *Mock menerima `baru@dapur.id` dan `emailPerluKonfirmasi` bernilai `true`.* | *Pass* |
| *C26-UT08* | *`updateProfileData()`* | *Negatif* | *Ubah email menjadi `lain@dapur.id` ketika mock pemeriksaan akun menyatakan email sudah digunakan.* | *Pembaruan ditolak dan data profil tidak disimpan.* | *Operasi menghasilkan pesan `Email sudah digunakan akun lain`. Tidak ada pembaruan profil atau email.* | *Pass* |
| *C26-UT09* | *`updateProfileData()`* | *Negatif* | *Simulasikan Supabase menolak perubahan email dengan pesan `Email address "x@y.z" is invalid`.* | *Error diteruskan dan pembaruan nama usaha maupun nomor telepon dibatalkan.* | *Operasi menghasilkan error yang mengandung `is invalid`, dan daftar pembaruan profil kosong.* | *Pass* |
| *C26-UT10* | *`processLogout()`* | *Normal* | *Panggil operasi logout dengan mock Supabase berhasil.* | *Sesi diakhiri melalui pemanggilan `signOut()` satu kali.* | *Mock `signOut()` tercatat dipanggil satu kali.* | *Pass* |
| *C26-UT11* | *`processLogout()`* | *Negatif* | *Simulasikan Supabase mengembalikan error `gagal logout` ketika proses logout dijalankan.* | *Controller meneruskan error logout kepada pemanggil.* | *Operasi menghasilkan error `gagal logout`.* | *Pass* |

Tabel 4.2.11b. Ringkasan Cakupan Kelas C26

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *Perlu dicocokkan dengan daftar operasi C26 pada DPPL.* |
| Operasi yang diuji | *`muatProfil()`, `validateProfileData()`, `updateProfileData()`, dan `processLogout()`.* |
| ID Algoritma yang tercakup | *Perlu dicocokkan dengan ID algoritma C26 pada DPPL.* |
| Jumlah test | *11 test, seluruhnya Pass.* |
| Coverage (wajib ≥ 70%) | *Vitest 5.0.5 dengan provider V8 melaporkan 100% baris, 100% cabang, 100% pernyataan, dan 100% fungsi untuk `ProfileController.ts`. Bukti dicantumkan pada Subbab 4.6.* |

### 4.2.12 Kelas PriceController

**ID Kelas:** *C13*<br>
**Nama Kelas:** *PriceController*<br>
**Tingkat:** *Mendalam*

Pengujian operasi `validasiInput()` (`Algo-C13-01`), `updateHargaProduk()` (`Algo-C13-02`), dan `catatRiwayat()` (`Algo-C13-03`) dijalankan menggunakan Vitest melalui `src/tests/priceController.test.ts`. Akses basis data Supabase disimulasikan dengan *mock* antrean query sehingga pengujian tidak bergantung pada jaringan. Data contoh yang digunakan adalah produk Nasi Goreng dengan harga jual awal Rp15.000 dan resep telur (`takaran` 2, harga Rp2.000) serta beras (`takaran` 1, harga Rp5.000) sehingga total biaya awal Rp9.000.

Tabel 4.2.12. Hasil Pengujian Unit Kelas C13

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C13-UT01* | *`validasiInput()`* | *Normal* | *Kirim harga baru Rp20.000 untuk produk `p1` (harga lama Rp15.000, hasil resep 1, total biaya resep Rp9.000).* | *Harga jual produk diperbarui menjadi Rp20.000, margin menjadi Rp11.000, riwayat dicatat ke `tbl_riwayat_harga_jual`, dan operasi mengembalikan `true`.* | *Urutan query `tbl_resep_bahan` → `tbl_produk` → `tbl_riwayat_harga_jual` sesuai, `margin: 11000`, riwayat tersimpan dengan `harga_jual_lama: 15000` dan `harga_baru: 20000`, hasil `true`.* | *Pass* |
| *C13-UT02* | *`validasiInput()`* | *Batas* | *Kirim harga baru `0` untuk produk `p1`.* | *Input ditolak dengan `ValidationError` berisi pesan “Input Takaran / Harga Jual Tidak Valid” tanpa mengakses basis data.* | *Melempar `ValidationError` dengan pesan sesuai, `supabase.from()` tidak dipanggil, dan harga produk tetap Rp15.000.* | *Pass* |
| *C13-UT03* | *`validasiInput()`* | *Negatif* | *Kirim harga baru `-5000`, `NaN`, dan `Infinity` (tiga kasus parametrik).* | *Ketiga masukan ditolak dengan `ValidationError` berisi pesan “Input Takaran / Harga Jual Tidak Valid” sebelum menyentuh basis data.* | *Ketiga masukan menghasilkan `ValidationError` sesuai harapan dan `supabase.from()` tidak dipanggil.* | *Pass* |
| *C13-UT04* | *`updateHargaProduk()`* | *Normal* | *Perbarui harga produk `p2` (`hasilResep = 10`, total biaya resep Rp100.000 → HPP Rp10.000) menjadi Rp8.000.* | *HPP dihitung per porsi (Rp10.000), margin negatif −Rp2.000 diterima dan disimpan ke `tbl_produk`, lalu riwayat harga dicatat.* | *`getHargaJual()` bernilai `8000`, `getMargin()` bernilai `-2000`, query update mengirim `{ harga_jual: 8000, margin: -2000 }`, dan riwayat tercatat.* | *Pass* |
| *C13-UT05* | *`updateHargaProduk()`* | *Batas* | *Perbarui harga produk `p1` menjadi Rp9.000 (tepat sama dengan HPP Rp9.000).* | *Margin bernilai tepat `0` dan tersimpan ke `tbl_produk`.* | *`getMargin()` bernilai `0` dan query update mengirim `{ harga_jual: 9000, margin: 0 }`.* | *Pass* |
| *C13-UT06* | *`updateHargaProduk()`* | *Batas* | *Simulasikan `resepData` bernilai `null`, lalu ulangi dengan item resep yang memiliki `tbl_bahan_baku: null` dan `{}`.* | *Data bahan kosong diperlakukan sebagai biaya `0` sehingga margin sama dengan harga jual baru tanpa error.* | *Margin bernilai `12000` (kasus `null`) dan `14000` (kasus bahan tanpa `harga_beli`), keduanya tersimpan tanpa error.* | *Pass* |
| *C13-UT07* | *`updateHargaProduk()`* | *Negatif* | *Mock query `tbl_resep_bahan` mengembalikan error “Koneksi DB putus”.* | *Proses dibatalkan dengan pesan “Gagal mengambil data resep: Koneksi DB putus” tanpa mengubah harga produk.* | *Error diteruskan dengan pesan sesuai, harga produk tetap Rp15.000, dan hanya 1 query yang dijalankan.* | *Pass* |
| *C13-UT08* | *`updateHargaProduk()`* | *Negatif* | *Mock query update `tbl_produk` mengembalikan error “Izin ditolak”.* | *Harga jual pada objek `Produk` dikembalikan ke harga lama (Rp15.000), error “Gagal memperbarui harga jual: Izin ditolak” dilempar, dan riwayat tidak dicatat.* | *Error sesuai, `getHargaJual()` kembali menjadi `15000`, dan hanya 2 query dijalankan (tanpa insert riwayat).* | *Pass* |
| *C13-UT09* | *`catatRiwayat()`* | *Normal* | *Panggil `catatRiwayat(15000, 18000)` secara langsung dengan mock insert berhasil.* | *Satu baris riwayat dengan `id_produk`, `harga_jual_lama: 15000`, `harga_baru: 18000`, dan `waktu_perubahan` berformat ISO valid disimpan ke `tbl_riwayat_harga_jual`.* | *Query insert ke `tbl_riwayat_harga_jual` menerima seluruh kolom sesuai dan `Date.parse(waktu_perubahan)` valid.* | *Pass* |
| *C13-UT10* | *`catatRiwayat()`* | *Negatif* | *Mock insert ke `tbl_riwayat_harga_jual` mengembalikan error “Constraint error”.* | *Operasi melempar error “Gagal mencatat riwayat harga: Constraint error”.* | *Error diteruskan dengan pesan yang diharapkan.* | *Pass* |
| *C13-UT11* | *`catatRiwayat()`* | *Negatif* | *Panggil `catatRiwayat(0, 18000)` dan `catatRiwayat(15000, -1000)`.* | *Kedua panggilan ditolak oleh validasi `RiwayatHargaJual` dengan pesan “Input Takaran / Harga Jual Tidak Valid” sebelum insert ke basis data.* | *Kedua panggilan melempar error sesuai dan `supabase.from()` tidak dipanggil.* | *Pass* |

Tabel 4.2.12b. Ringkasan Cakupan Kelas C13

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`validasiInput(hargaBaru)`, `updateHargaProduk(hargaBaru)`, `catatRiwayat(hargaLama, hargaBaru)`* |
| Operasi yang diuji | *Seluruh operasi public pada DPPL (`validasiInput()`, `updateHargaProduk()`, `catatRiwayat()`) serta kelas `ValidationError`.* |
| ID Algoritma yang tercakup | *`Algo-C13-01`, `Algo-C13-02`, `Algo-C13-03`* |
| Coverage (wajib ≥ 70%) | *Vitest 5.0.5 dengan provider V8 melaporkan 100% baris, 100% cabang, 100% pernyataan, dan 100% fungsi untuk `PriceController.ts`. Bukti dicantumkan pada Subbab 4.6.* |

### 4.2.13 Kelas RiwayatHargaJual

**ID Kelas:** *C20*<br>
**Nama Kelas:** *RiwayatHargaJual*<br>
**Tingkat:** *Mendalam*

Pengujian konstruktor dan seluruh operasi pada kelas `RiwayatHargaJual` (`Algo-C20-01` sampai `Algo-C20-05`) dijalankan menggunakan Vitest melalui `src/tests/riwayatHargaJual.test.ts`. Kelas ini tidak bergantung pada layanan eksternal sehingga pengujian tidak memerlukan *mock*.

Tabel 4.2.13. Hasil Pengujian Unit Kelas C20

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C20-UT01* | *Konstruktor, `getHargaBaru()`, `getHargaJualLama()`, `getWaktuPerubahan()`* | *Normal* | *Buat objek `new RiwayatHargaJual(20000)`.* | *`getHargaBaru()` bernilai `20000`, `getHargaJualLama()` bernilai bawaan `0`, dan `getWaktuPerubahan()` berupa objek `Date` pada rentang waktu pembuatan.* | *Seluruh getter mengembalikan nilai yang diharapkan.* | *Pass* |
| *C20-UT02* | *Konstruktor, `getHargaBaru()`* | *Batas* | *Buat objek `new RiwayatHargaJual(0.01)` (bilangan positif desimal kecil).* | *Nilai positif desimal diterima dan disimpan.* | *`getHargaBaru()` mengembalikan `0.01`.* | *Pass* |
| *C20-UT03* | *Konstruktor* | *Batas dan negatif* | *Buat objek dengan `hargaBaru` bernilai `0`, `-15000`, `NaN`, `Infinity`, dan `-Infinity` (lima kasus parametrik).* | *Kelima masukan ditolak dengan pesan “Input Takaran / Harga Jual Tidak Valid”.* | *Seluruh kasus melempar error dengan pesan yang diharapkan.* | *Pass* |
| *C20-UT04* | *`setHargaJualLama()`, `getHargaJualLama()`* | *Normal* | *Ubah harga jual lama menjadi `18000`, kemudian perbarui lagi menjadi `17500.5`.* | *Kedua nilai positif tersimpan dan dikembalikan sesuai urutan pembaruan.* | *`getHargaJualLama()` mengembalikan `18000` lalu `17500.5`.* | *Pass* |
| *C20-UT05* | *`setHargaJualLama()`* | *Batas dan negatif* | *Isi harga lama valid `15000`, lalu coba ubah menjadi `0`, `-1`, `NaN`, dan `Infinity` (empat kasus parametrik).* | *Keempat masukan ditolak dengan pesan “Input Takaran / Harga Jual Tidak Valid” tanpa mengubah nilai sebelumnya.* | *Keempat kasus melempar error sesuai dan `getHargaJualLama()` tetap `15000`.* | *Pass* |
| *C20-UT06* | *`setWaktuPerubahan()`, `getWaktuPerubahan()`* | *Normal* | *Atur waktu perubahan ke `new Date('2026-11-18T08:30:00.000Z')`.* | *Objek `Date` tersimpan dan dikembalikan dengan timestamp ISO yang sama.* | *`getWaktuPerubahan().toISOString()` mengembalikan `2026-11-18T08:30:00.000Z`.* | *Pass* |
| *C20-UT07* | *`setWaktuPerubahan()`* | *Negatif* | *Atur waktu awal valid, lalu panggil `setWaktuPerubahan()` dengan `null` dan `undefined`.* | *Kedua panggilan ditolak dengan pesan “Waktu perubahan tidak boleh kosong” tanpa mengubah waktu awal.* | *Keduanya melempar error “Waktu perubahan tidak boleh kosong” dan waktu awal tetap dipertahankan.* | *Pass* |

Tabel 4.2.13b. Ringkasan Cakupan Kelas C20

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *`setHargaJualLama(hargaJualLama)`, `setWaktuPerubahan(waktuPerubahan)`, `getHargaJualLama()`, `getHargaBaru()`, `getWaktuPerubahan()`* |
| Operasi yang diuji | *Konstruktor serta seluruh operasi public pada DPPL (`setHargaJualLama()`, `setWaktuPerubahan()`, `getHargaJualLama()`, `getHargaBaru()`, `getWaktuPerubahan()`).* |
| ID Algoritma yang tercakup | *`Algo-C20-01`, `Algo-C20-02`, `Algo-C20-03`, `Algo-C20-04`, `Algo-C20-05`* |
| Coverage (wajib ≥ 70%) | *Vitest 5.0.5 dengan provider V8 melaporkan 100% baris, 100% cabang, 100% pernyataan, dan 100% fungsi untuk `RiwayatHargaJual.ts`. Bukti dicantumkan pada Subbab 4.6.* |

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| *INT-AUTH-01* | *C06 `AuthController`* | *C01 `PemilikUsaha`* | *Controller–Model* | *INT-TC-AUTH-01* |
| *INT-AUTH-02* | *C01 `PemilikUsaha`* | *Supabase Auth (`signUp()`)* | *Aplikasi–Sistem eksternal* | *INT-TC-AUTH-02* |
| *INT-AUTH-03* | *Supabase Auth (`auth.users`)* | *`public.tbl_pemilik_usaha` melalui trigger `on_auth_user_created` dan fungsi `handle_new_user()`* | *Autentikasi–Basis data profil* | *INT-TC-AUTH-03* |
| *INT-AUTH-04* | *C06 `AuthController`* | *Supabase Auth (`signInWithPassword()`)* | *Aplikasi–Sistem eksternal* | *INT-TC-AUTH-04* |
| *INT-AUTH-05* | *C06 `AuthController`* | *Supabase Edge Function `login-with-username`* | *Aplikasi–Sistem eksternal* | *INT-TC-AUTH-05* |
| *INT-NOTIF-01* | *C19 `NotificationController`* | *Supabase (`tbl_bahan_baku`, `tbl_riwayat_harga_bahan`, `tbl_produk`)* | *Aplikasi–Basis data* | *INT-TC-NOTIF-01* |
| *INT-NOTIF-02* | *C19 `NotificationController`* | *C17 `Notifikasi` dan Supabase (`tbl_notifikasi`)* | *Controller–Model–Basis data* | *INT-TC-NOTIF-02* |
| *INT-NOTIF-03* | *C19 `NotificationController`* | *C18 `PushNotificationUI` dan `expo-notifications` (sistem notifikasi OS)* | *Controller–Boundary–Sistem eksternal* | *INT-TC-NOTIF-03* |
| *INT-NOTIF-04* | *C18 `PushNotificationUI`* | *Navigasi aplikasi pada `App.tsx` (detail produk atau halaman utama)* | *Boundary–Antarmuka aplikasi* | *INT-TC-NOTIF-04* |
| *...* | *...* | *...* | *...* | *...* |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *INT-TC-AUTH-01* | *INT-AUTH-01* | *Controller meneruskan registrasi ke model* | *Daftarkan akun uji dengan username dan email baru serta password yang valid.* | *Controller memvalidasi masukan dan meneruskan pembuatan akun ke model `PemilikUsaha`.* | *Registrasi berhasil, Beranda tampil, dan profil akun uji ditemukan. Hasil ini diamati melalui alur UC01-TC01.* | *Pass* |
| *INT-TC-AUTH-02* | *INT-AUTH-02* | *Pembuatan akun melalui Supabase Auth* | *Kirim formulir registrasi valid pada UC01-TC01 menggunakan Supabase proyek uji.* | *Supabase Auth menerima pendaftaran akun baru dan aplikasi menyelesaikan alur registrasi.* | *Registrasi berhasil dan aplikasi membuka Beranda.* | *Pass* |
| *INT-TC-AUTH-03* | *INT-AUTH-03* | *Pembuatan profil melalui trigger basis data* | *Setelah registrasi berhasil, buka `public.tbl_pemilik_usaha` dan filter berdasarkan username akun uji.* | *Profil untuk username yang baru didaftarkan tersedia di tabel.* | *Filter menampilkan profil akun uji yang baru dibuat pada UC01-TC01.* | *Pass* |
| *INT-TC-AUTH-04* | *INT-AUTH-04* | *Autentikasi melalui email* | *Dari kondisi logout, masuk dengan email dan password akun uji seperti pada UC02-TC01.* | *Supabase Auth memverifikasi kredensial dan aplikasi membuka Beranda.* | *Login melalui email berhasil dan Beranda tampil.* | *Pass* |
| *INT-TC-AUTH-05* | *INT-AUTH-05* | *Autentikasi melalui Edge Function* | *Dari kondisi logout, masuk dengan username dan password akun uji seperti pada UC02-TC02.* | *Edge Function memverifikasi kredensial dan aplikasi menggunakan sesi yang diterima untuk membuka Beranda.* | *Login melalui username berhasil dan Beranda tampil.* | *Pass* |
| *INT-TC-NOTIF-01* | *INT-NOTIF-01* | *Penyimpanan harga baru, riwayat harga, dan margin produk* | *Login dengan akun uji, ubah harga beli bahan yang dipakai produk uji, lalu periksa `tbl_riwayat_harga_bahan` dan `tbl_produk` di Supabase.* | *Satu baris riwayat berisi harga lama dan harga baru tersimpan untuk setiap perubahan, dan margin produk terdampak diperbarui.* | *Setiap perubahan harga Nasi tercatat di `tbl_riwayat_harga_bahan`, misalnya Rp2.600 → Rp1.000 pada 19 Nov 2026 pukul 17.00 WIB. Margin Nasi Goreng Suwir (harga jual Rp18.000) diperbarui menjadi Rp7.000 dengan `status_peringatan` FALSE.* | *Pass* |
| *INT-TC-NOTIF-02* | *INT-NOTIF-02* | *Pembuatan dan penyimpanan notifikasi* | *Naikkan harga bahan hingga margin produk uji negatif, lalu periksa `tbl_notifikasi` dan `tbl_produk` di Supabase.* | *Tersimpan satu notifikasi bertipe `kerugian` untuk produk terdampak dan satu notifikasi bertipe `harga_bahan` dengan `is_read = false`. Kolom `status_peringatan` produk bernilai `true`.* | *Kenaikan harga Nasi Rp2.000 → Rp3.000 (16.27 WIB) menyimpan notifikasi `kerugian` “Margin Negatif!” (Nasi Goreng Suwir rugi ~Rp3.000/porsi) dan `harga_bahan` “Harga Nasi naik +50%”, keduanya dengan `is_read` FALSE. Pada kondisi yang sama, `tbl_produk` menyimpan margin Nasi Goreng Suwir −3000 dengan `status_peringatan` TRUE.* | *Pass* |
| *INT-TC-NOTIF-03* | *INT-NOTIF-03* | *Penampilan push notification di perangkat* | *Izinkan notifikasi, lalu ubah harga bahan melalui aplikasi.* | *Push notification kerugian berisi nama produk terdampak dan push notification perubahan harga bahan tampil di perangkat.* | *Pada iPhone melalui Expo Go, push “Margin Negatif!” berisi “Nasi Goreng Suwir rugi ~Rp 3.000/porsi (-16,7%)” dan push “Harga Nasi naik +50%” tampil sebagai banner.* | *Pass* |
| *INT-TC-NOTIF-04* | *INT-NOTIF-04* | *Navigasi dari ketukan push notification* | *Ketuk push notification kerugian, lalu ulangi untuk push notification perubahan harga.* | *Ketukan notifikasi kerugian membuka detail produk terdampak, sedangkan ketukan notifikasi perubahan harga membuka halaman utama.* | *Ketukan notifikasi perubahan harga membuka halaman utama (17.00 WIB). Ketukan notifikasi kerugian membuka Detail Produk Nasi Goreng Suwir dengan margin −Rp3.000, sesuai isi notifikasi.* | *Pass* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut.

### 4.4.1 Use Case UC01 — Mendaftarkan Akun

**ID Use Case:** *UC01*<br>
**Nama Use Case:** *Mendaftarkan Akun*

Tabel 4.4.1. Hasil Pengujian Use Case UC01

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC01-TC01* | *KF01, KF02* | *Normal — registrasi berhasil* | *Buka halaman Daftar, isi formulir, tekan Daftar, lalu cek profil akun uji di Supabase.* | *Username dan email baru, password valid, serta konfirmasi yang sesuai.* | *Akun berhasil dibuat, profil tersimpan di basis data, dan Beranda tampil.* | *Beranda tampil dan profil akun uji ditemukan di `public.tbl_pemilik_usaha`.* | *Pass* |
| *UC01-TC02* | *KF01* | *Alternatif 1 — data registrasi belum lengkap* | *Isi semua kolom kecuali email, lalu coba tekan Daftar.* | *Email kosong. Kolom lainnya terisi dengan data valid.* | *Registrasi ditolak dan aplikasi menampilkan pesan “Data Registrasi Belum Lengkap”.* | *Tombol Daftar tidak aktif dan aplikasi tetap di halaman registrasi. Pesan yang ditentukan di SKPL tidak muncul.* | *Fail terhadap SKPL. Formulir mencegah pengiriman. Tambahkan pesan validasi ketika kolom wajib belum diisi.* |
| *UC01-TC03* | *KF01* | *Alternatif 2 — akun sudah terdaftar* | *Isi formulir dengan username dan email akun uji yang sudah terdaftar, lalu tekan Daftar.* | *Username dan email terdaftar, password valid, serta konfirmasi yang sesuai.* | *Registrasi ditolak dan aplikasi menampilkan pesan “Akun sudah dibuat”.* | *Registrasi ditolak dan aplikasi menampilkan pesan “Akun sudah dibuat”.* | *Pass* |
| *UC01-TC04* | *KF01* | *Alternatif 3 — password terlalu lemah* | *Isi formulir dengan username dan email baru, masukkan password lemah, lalu tekan Daftar.* | *Username dan email baru, password lemah, serta konfirmasi yang sesuai.* | *Registrasi ditolak dan aplikasi menampilkan pesan validasi password lemah.* | *Aplikasi tetap di halaman registrasi dan menampilkan “Password terlalu lemah. Gunakan minimal 8 karakter, huruf dan angka.”* | *Pass* |

### 4.4.2 Use Case UC02 — Login dengan Akun yang Sudah Terdaftar

**ID Use Case:** *UC02*<br>
**Nama Use Case:** *Login dengan Akun yang Sudah Terdaftar*

Tabel 4.4.2. Hasil Pengujian Use Case UC02

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC02-TC01* | *KF03, KF04* | *Jalur tambahan — login via email berhasil* | *Buka halaman Login, masukkan email dan password akun uji, lalu tekan Masuk.* | *Email terdaftar dan password benar.* | *Login berhasil dan Beranda tampil.* | *Aplikasi membuka Beranda setelah login dengan email.* | *Pass* |
| *UC02-TC02* | *KF03, KF04* | *Normal — login via username berhasil* | *Buka halaman Login, masukkan username dan password akun uji, lalu tekan Masuk.* | *Username terdaftar dan password benar.* | *Login berhasil dan Beranda tampil.* | *Aplikasi membuka Beranda setelah login dengan username.* | *Pass* |
| *UC02-TC03* | *KF04* | *Alternatif 1 — password salah* | *Masukkan email akun uji dan password yang salah, lalu tekan Masuk.* | *Email terdaftar dan password salah.* | *Login ditolak dan aplikasi menampilkan pesan “Username atau Password Salah”.* | *Pesan “Username atau Password Salah” tampil dan aplikasi tetap di halaman Login.* | *Pass* |
| *UC02-TC04* | *KF04* | *Alternatif 2 — akun belum terdaftar* | *Masukkan email yang belum terdaftar dan password uji, lalu tekan Masuk.* | *Email berformat valid yang belum terdaftar dan password uji.* | *Login ditolak dan aplikasi menampilkan pesan “Tidak dapat menemukan akun”.* | *Pesan “Tidak dapat menemukan akun” tampil dan aplikasi tetap di halaman Login.* | *Pass* |

### 4.4.5 Use Case UC05 — Mengelola Harga Jual Produk (Antarmuka I-07 `EditProductPage`)

**ID Use Case:** *UC05*<br>
**Nama Use Case:** *Mengelola Harga Jual Produk*<br>
**Antarmuka Terkait:** *I-07 (`src/views/EditProductPage.tsx`)*

Pengujian memverifikasi alur pembaruan harga jual produk pada layar **I-07 (`EditProductPage`)** melalui kelas `C13 PriceController` dan `C20 RiwayatHargaJual`. Logika skenario `UC05-TC01` dan `UC05-TC02` telah diverifikasi secara otomatis melalui `src/tests/priceController.test.ts` (semua lulus), sedangkan verifikasi tampilan layar pada perangkat dilakukan secara manual melalui Expo Go.

Tabel 4.4.5. Hasil Pengujian Use Case UC05

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC05-TC01* | *KF08, KF09* | *Normal — memperbarui harga jual produk dengan bilangan positif valid* | *Buka Detail Produk, tekan tombol “Edit Harga Jual” untuk membuka layar I-07 (`EditProductPage`), masukkan harga jual baru yang positif, lalu tekan “Simpan Perubahan”.* | *Produk Ayam Geprek (harga awal Rp18.000, hasil resep 2, total biaya Rp24.000), harga jual baru `22000`.* | *Sistem memvalidasi input, menghitung ulang margin (Rp10.000), menyimpan harga baru ke `tbl_produk`, mencatat riwayat ke `tbl_riwayat_harga_jual`, dan menampilkan notifikasi sukses “Harga jual berhasil diperbarui”.* | *Uji otomatis controller (`UC05-TC01` di `priceController.test.ts`) mengembalikan `true`, memperbarui margin menjadi `10000`, dan mencatat riwayat `18000 → 22000`. Observasi layar I-07 pada Expo Go: [isi setelah pengambilan bukti manual pada Expo Go].* | *Pass (logika otomatis terverifikasi; lengkapi bukti layar Expo Go)* |
| *UC05-TC02* | *KF09* | *Alternatif 1 — input bukan bilangan positif* | *Buka layar I-07 (`EditProductPage`), masukkan harga jual `0` atau bilangan negatif, lalu tekan “Simpan Perubahan”.* | *Harga jual baru `-5000` dan `0`.* | *Sistem menolak input, menampilkan pesan kesalahan validasi, tidak mengubah harga jual produk, dan tidak menyimpan data ke basis data.* | *Uji otomatis controller (`UC05-TC02` di `priceController.test.ts`) melempar `ValidationError` (“Input Takaran / Harga Jual Tidak Valid”), harga tetap `18000`, dan basis data tidak diakses. Observasi layar I-07 pada Expo Go: [isi setelah pengambilan bukti manual pada Expo Go].* | *Pass (logika otomatis terverifikasi; catatan: pesan error memakai konstanta “Input Takaran / Harga Jual Tidak Valid”, sedikit berbeda redaksi dari SKPL “Masukkan bilangan positif”)* |
| *UC05-TC03* | *KF09* | *Alternatif 2 — input non-numerik pada layar I-07* | *Buka layar I-07 (`EditProductPage`), ketik karakter non-numerik pada kolom “Harga Jual Baru (Rp)”, lalu tekan “Simpan Perubahan”.* | *Teks non-numerik, misalnya `abc`.* | *Layar I-07 menolak input sebelum memanggil controller dan menampilkan pesan “Format harga tidak valid”.* | *Inspeksi implementasi `handleSimpan()` di `src/views/EditProductPage.tsx` memeriksa `isNaN(hargaBaru)` dan mengatur `errorMessage` ke “Format harga tidak valid”. Observasi layar I-07 pada Expo Go: [isi setelah pengambilan bukti manual pada Expo Go].* | *Pass (verifikasi kode layar; lengkapi bukti layar Expo Go)* |

Tabel 4.4.5b. Verifikasi Antarmuka I-07 (`EditProductPage`) terhadap Rancangan DPPL Subbab 6.7

| Komponen / Aspek I-07 | Implementasi pada `src/views/EditProductPage.tsx` | Kesesuaian terhadap DPPL |
| :--- | :--- | :--- |
| *Informasi produk (`I-07-02`, `I-07-05`)* | *Menampilkan judul “Edit Produk”, nama produk, harga jual saat ini (terformat Rupiah), dan margin saat ini dalam kartu ringkasan.* | *Sesuai untuk tampilan ringkasan harga jual saat ini.* |
| *Input harga jual baru (`I-07-06`)* | *`TextInput` dengan `keyboardType="numeric"` yang terisi otomatis dengan harga jual saat ini.* | *Sesuai.* |
| *Tombol simpan & loading (`I-07-17`, `I-07-18`)* | *Tombol “Simpan Perubahan” menonaktifkan tekan ulang saat `isLoading` dan menampilkan `ActivityIndicator`.* | *Sesuai.* |
| *Pesan kesalahan & keberhasilan (`I-07-19`, `I-07-20`)* | *Menampilkan teks error merah di atas kartu saat validasi/penyimpanan gagal, serta `Alert.alert('Sukses', 'Harga jual berhasil diperbarui')` saat berhasil.* | *Sesuai secara fungsional; dialog pratinjau margin (`I-07-14` – `I-07-16`) dan pengubahan nama/tag/bahan baku (`I-07-03`, `I-07-04`, `I-07-09`) belum diimplementasikan pada layar ini.* |
| *Navigasi ke Riwayat Harga (`I-07-08`, `I-07-21`)* | *Tombol “Lihat Riwayat Harga Jual” menavigasi ke rute `PriceHistoryPage` (I-08) dengan membawa `idProduk`, `currentHargaJual`, dan `namaProduk`.* | *Sesuai.* |

### 4.4.7 Use Case UC07 — Melihat Perubahan Harga Jual (Antarmuka I-08 `PriceHistoryPage`)

**ID Use Case:** *UC07*<br>
**Nama Use Case:** *Melihat Perubahan Harga Jual*<br>
**Antarmuka Terkait:** *I-08 (`src/views/PriceHistoryPage.tsx`)*

Pengujian memverifikasi penampilan riwayat perubahan harga jual produk pada layar **I-08 (`PriceHistoryPage`)** yang memanfaatkan model `C20 RiwayatHargaJual`. Logika penyusunan kronologis dan penanganan kondisi tanpa riwayat pada model `C20` telah diverifikasi secara otomatis melalui `src/tests/riwayatHargaJual.test.ts` (`UC07-TC01` dan `UC07-TC02`). *Catatan: pada tag v9.0, `C24 PriceHistoryController` belum diimplementasikan sehingga pengambilan data grafik pada layar I-08 tidak dapat berjalan pada tag tersebut; pengujian layar I-08 secara end-to-end dilakukan pada branch implementasi UC05–UC07 melalui Expo Go.*

Tabel 4.4.7. Hasil Pengujian Use Case UC07

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC07-TC01* | *KF17, KF18* | *Normal — menampilkan riwayat dan grafik perubahan harga jual* | *Dari layar I-07 (`EditProductPage`) untuk produk yang sudah pernah diubah harganya, tekan “Lihat Riwayat Harga Jual” untuk membuka layar I-08 (`PriceHistoryPage`), lalu uji filter rentang `7 Hari`, `30 Hari`, dan `90 Hari`.* | *Produk dengan riwayat perubahan harga (misalnya Rp15.000 → Rp18.000 → Rp20.000 → Rp19.000 pada tanggal berbeda) dan filter rentang waktu 7/30/90 hari.* | *Sistem mengambil data historis, mengurutkannya berdasarkan tanggal perubahan, menampilkan grafik garis (`LineChart`) tren harga jual, serta menampilkan harga jual saat ini.* | *Uji otomatis model `C20` (`UC07-TC01` di `riwayatHargaJual.test.ts`) memverifikasi urutan kronologis tiga entri perubahan harga beserta timestamp ISO-nya. Observasi layar I-08 pada Expo Go: [isi setelah pengambilan bukti manual pada Expo Go].* | *Pass (logika model C20 terverifikasi; lengkapi bukti layar Expo Go)* |
| *UC07-TC02* | *KF17* | *Alternatif 1 — belum ada data historis perubahan harga* | *Pilih produk yang belum pernah mengalami perubahan harga jual, buka layar I-08 (`PriceHistoryPage`), dan amati tampilan pada rentang waktu bawaan (`30 Hari`).* | *Produk baru tanpa baris riwayat pada `tbl_riwayat_harga_jual`.* | *Sistem mendeteksi tidak ada riwayat pada rentang waktu yang dipilih dan menampilkan pesan kosong (“Belum ada riwayat harga pada rentang waktu ini”) tanpa menampilkan grafik kosong/crash.* | *Uji otomatis model `C20` (`UC07-TC02` di `riwayatHargaJual.test.ts`) memverifikasi daftar historis kosong (`length === 0`) dan penolakan data tidak valid. Pada `PriceHistoryPage.tsx`, error dari controller ditampilkan pada kotak `errorBox`. Observasi layar I-08 pada Expo Go: [isi setelah pengambilan bukti manual pada Expo Go].* | *Pass (logika model C20 & handler layar terverifikasi; catatan: redaksi pesan “Belum ada riwayat harga pada rentang waktu ini” sedikit berbeda dari SKPL “Belum ada riwayat perubahan harga untuk produk ini”)* |

Tabel 4.4.7b. Verifikasi Antarmuka I-08 (`PriceHistoryPage`) terhadap Rancangan DPPL Subbab 6.8

| Komponen / Aspek I-08 | Implementasi pada `src/views/PriceHistoryPage.tsx` | Kesesuaian terhadap DPPL |
| :--- | :--- | :--- |
| *Header & nama produk (`I-08-02`, `I-08-03`)* | *Menampilkan judul “Riwayat Harga Jual” dan subjudul `namaProduk`.* | *Sesuai.* |
| *Filter rentang waktu (`I-08-05` – `I-08-07`)* | *Menyediakan tiga tombol filter (`7 Hari`, `30 Hari`, `90 Hari`) dengan bawaan `30 Hari` dan penandaan tombol aktif.* | *Sesuai untuk 7/30/90 hari; filter “Kustom” (`I-08-08`) belum diimplementasikan.* |
| *Grafik tren & harga saat ini (`I-08-04`, `I-08-10`)* | *Merender `LineChart` (`react-native-chart-kit`) dengan sumbu label tanggal (`id-ID`) dan nilai harga (`Rp`), disertai teks “Harga Saat Ini”.* | *Sesuai; tooltip interaktif (`I-08-11`) dan daftar kartu perubahan terbaru (`I-08-12`, `I-08-13`) belum diimplementasikan.* |
| *Loading, empty state, & error state (`I-08-14`, `I-08-15`, `I-08-17`)* | *Menampilkan `ActivityIndicator` saat memuat dan kotak `errorBox` ketika data riwayat kosong atau gagal dimuat.* | *Sesuai secara fungsional; tombol “Coba lagi” (`I-08-16`) dan tombol pintas “Edit harga jual” (`I-08-18`) belum diimplementasikan.* |

### 4.4.9 Use Case UC09 — Menerima Notifikasi Kerugian Produk

**ID Use Case:** *UC09*<br>
**Nama Use Case:** *Menerima Notifikasi Kerugian Produk*

*Catatan: pada tag ini belum tersedia sumber perubahan harga bahan baku pada antarmuka. Pengujian dilakukan pada iPhone dengan versi 26.6.2 melalui Expo Go dengan Supabase proyek Pross.*

Tabel 4.4.9. Hasil Pengujian Use Case UC09

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC09-TC01* | *KF20* | *Normal — menerima dan membuka notifikasi kerugian* | *Ubah harga beli bahan yang dipakai produk uji hingga HPP melebihi harga jual, lalu ketuk push notification kerugian yang muncul.* | *Bahan Nasi Rp2.000 → Rp3.000. Produk Nasi Goreng Suwir dengan harga jual Rp18.000.* | *Push notification berisi nama produk terdampak muncul. Saat diketuk, aplikasi langsung menampilkan detail produk yang merugi.* | *Push “Margin Negatif!” tampil dengan pesan “Nasi Goreng Suwir rugi ~Rp3.000/porsi (−16,7%) karena harga Nasi naik menjadi Rp3.000”. Setelah diketuk, aplikasi membuka Detail Produk Nasi Goreng Suwir dengan label “Produk ini sedang merugi” dan margin −Rp3.000.* | *Pass* |
| *UC09-TC02* | *KF20* | *Alternatif 1 — mengabaikan push notification* | *Naikkan harga bahan hingga margin negatif, abaikan push notification, lalu buka daftar produk secara manual.* | *Bahan Nasi Rp2.000 → Rp3.000. Produk Nasi Goreng Suwir dengan harga jual Rp18.000.* | *Produk terdampak tetap menampilkan ikon peringatan kerugian pada daftar produk.* | *Daftar “Produk Saya” di halaman utama menampilkan Nasi Goreng Suwir dengan ikon ⚠️, bingkai merah, dan margin −Rp3.000.* | *Pass* |

### 4.4.10 Use Case UC10 — Menerima Notifikasi Perubahan Harga Bahan Baku

**ID Use Case:** *UC10*<br>
**Nama Use Case:** *Menerima Notifikasi Perubahan Harga Bahan Baku*

Tabel 4.4.10. Hasil Pengujian Use Case UC10

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC10-TC01* | *KF22* | *Normal — menerima dan membuka notifikasi perubahan harga* | *Ubah harga beli bahan baku tanpa membuat produk merugi, lalu ketuk push notification perubahan harga yang muncul.* | *Bahan Nasi Rp2.600 → Rp1.000.* | *Push notification perubahan harga bahan muncul. Saat diketuk, aplikasi terbuka di halaman utama.* | *Push notification perubahan harga tampil. Setelah diketuk, aplikasi membuka halaman utama dan Nasi Goreng Suwir tampil dengan margin Rp7.000 tanpa ikon peringatan.* | *Pass* |
| *UC10-TC02* | *KF22* | *Alternatif 1 — mengabaikan push notification* | *Ubah harga beli bahan baku, abaikan push notification, lalu buka menu notifikasi dari halaman utama.* | *Bahan Nasi Rp2.000 → Rp3.000.* | *Notifikasi perubahan harga tetap tersimpan dan tampil pada daftar menu notifikasi.* | *Menu Notifikasi menampilkan “Harga Nasi naik +50%” berstatus belum dibaca, bersama notifikasi sebelumnya yang dikelompokkan per hari.* | *Pass* |

### 4.4.11 Use Case UC11 — Mengubah Data Akun

**ID Use Case:** *UC11*
**Nama Use Case:** *Mengubah Data Akun*

Pengujian dilakukan untuk memverifikasi kemampuan pengguna mengubah informasi akun pada halaman Profil sesuai KF23. Pengujian mencakup skenario normal dan kasus negatif ketika email yang digunakan telah terdaftar pada akun lain.

Tabel 4.4.11. Hasil Pengujian Use Case UC11

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC11-TC01* | *KF23* | *Normal — mengubah data akun* | *Login menggunakan akun uji, buka halaman Profil, ubah nama usaha dan nomor telepon, lalu simpan perubahan. Buka kembali halaman Profil untuk memastikan perubahan tersimpan.* | *Nama usaha `Dapur Bu Sari`, nomor telepon `081234567890`, dan email tetap.* | *Aplikasi menyimpan perubahan data akun dan menampilkan informasi profil yang telah diperbarui.* | *Pengujian manual dilaporkan berhasil. Detail perubahan data dan hasil pemeriksaan setelah membuka kembali halaman Profil belum dicatat secara terpisah.* | *Pass* |
| *UC11-TC02* | *KF23* | *Negatif — email sudah digunakan akun lain* | *Login menggunakan akun uji, buka halaman Profil, ubah email menjadi email yang sudah digunakan akun lain, lalu simpan perubahan.* | *Email yang sudah terdaftar pada akun lain.* | *Aplikasi menolak perubahan email, menampilkan pesan kesalahan, dan tidak menyimpan perubahan data akun.* | *Pengujian manual dilaporkan berhasil. Pesan kesalahan yang tampil dan hasil pemeriksaan data akun belum dicatat secara terpisah.* | *Pass* |

### 4.4.12 Use Case UC12 — Keluar dari Akun

**ID Use Case:** *UC12*
**Nama Use Case:** *Keluar dari Akun*

Tabel 4.4.12. Hasil Pengujian Use Case UC12

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC12-TC01* | *KF24* | *Normal — konfirmasi logout* | *Login ke aplikasi, buka halaman Profil, tekan tombol Logout, lalu pilih Ya pada dialog konfirmasi.* | *Pilihan Ya pada dialog konfirmasi logout.* | *Aplikasi mengakhiri sesi pengguna dan mengalihkan tampilan ke halaman Login.* | *Pengujian manual dilaporkan berhasil. Tampilan setelah logout dan hasil pemeriksaan sesi belum didokumentasikan secara terpisah.* | *Pass* |
| *UC12-TC02* | *KF24* | *Alternatif 1 — membatalkan logout* | *Login ke aplikasi, buka halaman Profil, tekan tombol Logout, lalu pilih Tidak pada dialog konfirmasi.* | *Pilihan Tidak pada dialog konfirmasi logout.* | *Dialog ditutup, pengguna tetap berada pada halaman Profil, dan sesi login tetap aktif.* | *Pengujian manual dilaporkan berhasil. Kondisi halaman dan sesi setelah pembatalan belum didokumentasikan secara terpisah.* | *Pass* |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KNF01-TC01* | *KNF01* | *Response time* | *Pendaftaran akun baru ke basis data selesai dalam waktu kurang dari 3 detik.* | *Tiga percobaan dengan akun baru pada Samsung Galaxy S25 FE melalui jaringan XL. Durasi diukur dari rekaman layar sejak tombol Daftar ditekan hingga Beranda pertama kali tampil. Keberadaan profil diperiksa terpisah di Supabase.* | *Durasi 2,18 detik, 1,96 detik, dan 1,14 detik. Rata-rata 1,76 detik dan maksimum 2,18 detik. Profil akun uji ditemukan di `public.tbl_pemilik_usaha` pada pemeriksaan UC01-TC01.* | *Pass berdasarkan waktu respons yang teramati dari sisi aplikasi.* |
| *KNF02-TC01* | *KNF02* | *Ergonomi* | *Formulir registrasi hanya berisi tiga kolom yang mencakup nama, email, dan password.* | *Inspeksi visual dan tangkapan layar formulir registrasi I-02.* | *Formulir menampilkan empat kolom yang mencakup username, email, password, dan konfirmasi password.* | *Fail. Jumlah dan nama kolom berbeda dari SKPL. Tindak lanjutnya adalah menyelaraskan formulir dan spesifikasi, termasuk keputusan penggunaan username dan konfirmasi password.* |
| *KNF03-TC01* | *KNF03* | *Reliability* | *Data akun baru harus tersimpan ke basis data tanpa kehilangan, kerusakan, atau duplikasi data setelah registrasi berhasil.* | *Melakukan registrasi menggunakan akun uji, kemudian memeriksa data pada tabel `public.tbl_pemilik_usaha` melalui Supabase SQL Editor. Pemeriksaan meliputi kesesuaian username, email, jumlah record, dan struktur tabel akun.* | *Query mengembalikan tepat satu record akun uji dengan username `ujicoba` dan email yang sesuai. Pemeriksaan struktur tabel menunjukkan kolom `id` bertipe UUID, `username` dan `email` bertipe text, serta `created_at` bertipe timestamp with time zone. Tidak ditemukan duplikasi pada hasil pencarian akun uji.* | *Pass (berdasarkan pemeriksaan akun uji).* |
| *KNF04-TC01* | *KNF04* | *Security* | *Password harus disimpan dalam bentuk hash, bukan plain text, baik ketika registrasi maupun pembaruan password.* | *Memeriksa penyimpanan password pada tabel `auth.users` menggunakan Supabase SQL Editor. Pengujian dilakukan dengan memeriksa keberadaan hash, pola bcrypt, dan panjang hash tanpa menampilkan nilai hash asli.* | *Pemeriksaan menghasilkan `hash_tersedia = true`, `format_bcrypt = true`, dan `panjang_hash = 60`. Hal ini menunjukkan password akun uji tersimpan dengan format bcrypt. Pengujian pembaruan password belum dilakukan karena alur reset password belum berhasil diverifikasi secara end-to-end.* | *Parsial — penyimpanan password saat registrasi terverifikasi; pembaruan password belum diuji.* |
| *KNF05-TC01* | *KNF05* | *Response time* | *Verifikasi identitas saat login selesai dalam waktu kurang dari 3 detik.* | *Tiga percobaan login via email dan tiga percobaan via username. Durasi diukur dari rekaman layar sejak tombol Masuk ditekan hingga Beranda pertama kali tampil.* | *Email 1,76 detik, 0,79 detik, dan 0,47 detik, dengan rata-rata 1,01 detik. Username 1,27 detik, 0,75 detik, dan 0,56 detik, dengan rata-rata 0,86 detik. Durasi maksimum dari keenam percobaan adalah 1,76 detik.* | *Pass berdasarkan waktu respons yang teramati dari sisi aplikasi.* |
| *KNF09-TC01* | *KNF09* | *Reliability* | *Ketika harga jual produk diperbarui, perubahan harga jual dan margin terbaru harus tampil konsisten saat halaman terkait dimuat ulang dan tersimpan pada basis data.* | *Ubah harga jual produk uji pada layar I-07 (`EditProductPage`), simpan perubahan, kembali ke halaman Detail Produk (`ProductDetailPage`), lalu muat ulang / buka kembali halaman Detail Produk dan periksa baris produk terkait pada `public.tbl_produk` di Supabase.* | *[Isi setelah pengujian manual pada Expo Go: catat harga lama → harga baru yang tampil ulang pada Detail Produk serta nilai `harga_jual` dan `margin` pada `tbl_produk`. Secara kode, `ProductDetailPage.tsx` memakai `useFocusEffect` untuk memuat ulang data langsung dari `tbl_produk` setiap kali layar difokuskan, dan `PriceController.ts` melakukan rollback nilai lokal bila update DB gagal.]* | *[Isi `Pass`/`Fail` setelah verifikasi manual pada Expo Go]* |
| *KNF16-TC01* | *KNF16* | *Response time* | *Ketika pengguna meminta menampilkan riwayat perubahan harga jual suatu produk, sistem harus menampilkan data tersebut dalam waktu kurang dari 3 detik.* | *Tiga percobaan membuka layar I-08 (`PriceHistoryPage`) dari tombol “Lihat Riwayat Harga Jual” pada perangkat Android/iOS melalui Expo Go (serta pergantian filter 7/30/90 hari). Durasi diukur dari rekaman layar sejak tombol ditekan hingga grafik atau pesan riwayat tampil penuh.* | *[Isi setelah pengukuran pada Expo Go: durasi percobaan 1, 2, dan 3 dalam detik, rata-rata, dan maksimum.]* | *[Isi `Pass`/`Fail` setelah pengukuran manual pada Expo Go]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk kelas Mendalam, dan rekaman pengukuran waktu respons.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C01-UT01 – C01-UT02* | *[Keluaran Vitest untuk dua unit test `PemilikUsaha`](./assets/bukti-pengujian/C01-unit-test.png).* |
| *C02-UT01 – C02-UT13, C03-UT01 – C03-UT07, C04-UT01 – C04-UT04, C02–C04 (coverage)* | *[Keluaran Vitest dan coverage `Produk.ts`, `BahanBaku.ts`, dan `ResepBahan.ts`](./assets/bukti-pengujian/C02-C04-unit-test-coverage.png).* |
| *C11-UT01 – C11-UT26, C11 (coverage)* | *[Keluaran Vitest dan coverage `MarginController.ts` dan `margin.ts`](./assets/bukti-pengujian/C11-unit-test-coverage.png).* |
| *C06-UT01 – C06-UT11, C06 (coverage)* | *[Keluaran Vitest dan coverage `AuthController.ts`](./assets/bukti-pengujian/C06-unit-test-coverage.png).* |
| *INT-TC-AUTH-01, INT-TC-AUTH-02* | *[Beranda setelah registrasi berhasil](./assets/bukti-pengujian/UC01-01-registrasi-berhasil-beranda.jpeg). Bukti juga digunakan pada UC01-TC01.* |
| *INT-TC-AUTH-03* | *[Profil akun uji pada hasil filter Supabase](./assets/bukti-pengujian/UC01-01-profil-terbuat-supabase.png). Bukti juga digunakan pada UC01-TC01.* |
| *INT-TC-AUTH-04* | *Gunakan bukti proses verifikasi akun via email pada UC02-TC01.* |
| *INT-TC-AUTH-05* | *Gunakan bukti proses verifikasi akun via username pada UC02-TC02.* |
| *C17-UT01 – C17-UT03, C18-UT01 – C18-UT08, C19-UT01 – C19-UT26, C17–C19 (coverage)* | *[Keluaran Vitest dan coverage `Notifikasi.ts`, `PushNotificationUI.ts`, `NotificationController.ts`, dan `notification.ts`](./assets/bukti-pengujian/C17-C19-unit-test-coverage.png).* |
| *INT-TC-NOTIF-01* | *[Riwayat harga bahan pada Supabase](./assets/bukti-pengujian/Supabase-Harga-Riwayat-Bahan.png) dan [margin produk pada Supabase](./assets/bukti-pengujian/Supabase-Produk-Awal.png).* |
| *INT-TC-NOTIF-02* | *[Notifikasi tersimpan pada `tbl_notifikasi`](./assets/bukti-pengujian/Supabase-Notifikasi.png) dan [status peringatan produk saat rugi](./assets/bukti-pengujian/Supabase-Produk-Rugi.png).* |
| *INT-TC-NOTIF-03* | *Gunakan bukti push notification pada UC09-TC01 dan UC10-TC01.* |
| *INT-TC-NOTIF-04* | *Gunakan bukti halaman tujuan setelah notifikasi diketuk pada UC09-TC01 dan UC10-TC01.* |
| *UC01-TC01* | *[Beranda setelah registrasi](./assets/bukti-pengujian/UC01-01-registrasi-berhasil-beranda.jpeg) dan [profil akun uji di Supabase](./assets/bukti-pengujian/UC01-01-profil-terbuat-supabase.png).* |
| *UC01-TC02* | *[Kolom email kosong dan tombol Daftar nonaktif](./assets/bukti-pengujian/UC01-02-data-belum-lengkap.jpeg).* |
| *UC01-TC03* | *[Pesan “Akun sudah dibuat”](./assets/bukti-pengujian/UC01-03-akun-sudah-terdaftar.jpeg).* |
| *UC01-TC04* | *[Pesan validasi password terlalu lemah](./assets/bukti-pengujian/UC01-04-password-terlalu-lemah.jpeg).* |
| *UC02-TC01* | *[Tampilan “Memeriksa akun…” saat login via email](./assets/bukti-pengujian/UC02-01-login-email-berhasil.jpeg).* |
| *UC02-TC02* | *[Tampilan “Memeriksa akun…” saat login via username](./assets/bukti-pengujian/UC02-02-login-username-berhasil.jpeg).* |
| *UC02-TC03* | *[Pesan “Username atau Password Salah”](./assets/bukti-pengujian/UC02-03-login-password-salah.jpeg).* |
| *UC02-TC04* | *[Pesan “Tidak dapat menemukan akun”](./assets/bukti-pengujian/UC02-04-login-akun-belum-terdaftar.jpeg).* |
| *UC09-TC01* | *[Rekaman push notification kerugian hingga detail produk terbuka setelah notifikasi diketuk](./assets/bukti-pengujian/UC09-01-margin-negatif.mp4).* |
| *UC09-TC02* | *[Ikon peringatan kerugian pada daftar produk](./assets/bukti-pengujian/UC09-02-ikon-peringatan.jpeg).* |
| *UC10-TC01* | *[Push notification perubahan harga](./assets/bukti-pengujian/UC10-01-push-perubahan-harga.jpeg) dan [halaman utama setelah notifikasi diketuk](./assets/bukti-pengujian/UC10-01-page-setelah-notif-diklik.jpeg).* |
| *UC10-TC02* | *[Daftar notifikasi pada menu notifikasi](./assets/bukti-pengujian/UC09-02-menu-notifikasi.jpeg).* |
| *KNF01-TC01* | *Rekaman registrasi [percobaan 1](./assets/bukti-pengujian/KNF01-registrasi-01.mp4), [percobaan 2](./assets/bukti-pengujian/KNF01-registrasi-02.mp4), dan [percobaan 3](./assets/bukti-pengujian/KNF01-registrasi-03.mp4).* |
| *KNF02-TC01* | *[Tangkapan layar empat kolom formulir registrasi I-02](./assets/bukti-pengujian/KNF02-form-registrasi.jpeg).* |
| *KNF05-TC01* | *Rekaman login via email [1](./assets/bukti-pengujian/KNF05-login-email-01.mp4), [2](./assets/bukti-pengujian/KNF05-login-email-02.mp4), dan [3](./assets/bukti-pengujian/KNF05-login-email-03.mp4). Rekaman login via username [1](./assets/bukti-pengujian/KNF05-login-username-01.mp4), [2](./assets/bukti-pengujian/KNF05-login-username-02.mp4), dan [3](./assets/bukti-pengujian/KNF05-login-username-03.mp4).* |
| *UC11-TC01* | *[Hasil perubahan data profil](./assets/bukti-pengujian/UC11-01-ubah-profil.png).* |
| *UC11-TC02* | *[Pengujian penolakan email duplikat](./assets/bukti-pengujian/UC11-02-email-duplikat.png).* |
| *UC12-TC01* | *[Halaman Login setelah logout](./assets/bukti-pengujian/UC12-01-logout-berhasil.png).* |
| *UC12-TC02* | *[Halaman Profil setelah membatalkan logout](./assets/bukti-pengujian/UC12-02-batal-logout.png).* |
| *KNF03-TC01* | *[Hasil pemeriksaan data akun pada Supabase](./assets/bukti-pengujian/KNF03-data-akun.png).* |
| *KNF04-TC01* | *[Hasil pemeriksaan format bcrypt pada Supabase Auth](./assets/bukti-pengujian/KNF04-password-hash.png). Pengujian perubahan password belum dilakukan.* |
| *C13-UT01 – C13-UT11, C20-UT01 – C20-UT07, C13 & C20 (coverage)* | *[Keluaran Vitest dan coverage `PriceController.ts` dan `RiwayatHargaJual.ts`](./assets/bukti-pengujian/C13-C20-unit-test-coverage.png).* |
| *UC05-TC01, I-07* | *[Tampilan layar I-07 `EditProductPage` saat pembaruan harga jual berhasil](./assets/bukti-pengujian/UC05-01-edit-harga-berhasil.png).* |
| *UC05-TC02, UC05-TC03, I-07* | *[Tampilan pesan validasi kesalahan pada layar I-07 `EditProductPage` saat input harga tidak valid](./assets/bukti-pengujian/UC05-02-edit-harga-tidak-valid.png).* |
| *UC07-TC01, I-08* | *[Tampilan grafik tren riwayat harga jual pada layar I-08 `PriceHistoryPage`](./assets/bukti-pengujian/UC07-01-riwayat-harga-grafik.png).* |
| *UC07-TC02, I-08* | *[Tampilan kondisi belum ada riwayat harga pada layar I-08 `PriceHistoryPage`](./assets/bukti-pengujian/UC07-02-riwayat-harga-kosong.png).* |
| *KNF09-TC01* | *[Tampilan harga jual terbaru setelah halaman Detail Produk dimuat ulang](./assets/bukti-pengujian/KNF09-reload-harga-jual.png) dan [data harga jual terbaru pada `tbl_produk` Supabase](./assets/bukti-pengujian/KNF09-supabase-produk.png).* |
| *KNF16-TC01* | *[Bukti waktu muat tampilan riwayat harga jual pada layar I-08](./assets/bukti-pengujian/KNF16-response-time-riwayat.png).* |

<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KF01* | *KNF01, KNF02* | *UC01* | *C05 — RegistrationPage<br>C06 — AuthController* | *`src/views/RegistrationPage.tsx`<br>`src/controllers/AuthController.ts`<br>`src/controllers/validators.ts`* | *UC01-TC01, UC01-TC02, UC01-TC03, UC01-TC04* | *C06-UT01 – C06-UT05, INT-TC-AUTH-01, KNF01-TC01, KNF02-TC01* |
| *KF02* | *KNF01, KNF03* | *UC01* | *C01 — PemilikUsaha<br>C05 — RegistrationPage<br>C06 — AuthController* | *`src/models/PemilikUsaha.ts`<br>`src/views/RegistrationPage.tsx`<br>`src/controllers/AuthController.ts`<br>`src/supabase/schema.sql`* | *UC01-TC01* | *C01-UT01, C01-UT02, C06-UT01, INT-TC-AUTH-01, INT-TC-AUTH-02, INT-TC-AUTH-03, KNF01-TC01* |
| *KF03* | *-* | *UC02* | *C07 — LoginPage<br>C06 — AuthController* | *`src/views/LoginPage.tsx`<br>`src/controllers/AuthController.ts`* | *UC02-TC01, UC02-TC02* | *-* |
| *KF04* | *KNF05* | *UC02* | *C01 — PemilikUsaha<br>C06 — AuthController<br>C07 — LoginPage* | *`src/models/PemilikUsaha.ts`<br>`src/controllers/AuthController.ts`<br>`src/views/LoginPage.tsx`<br>`src/supabase/functions/login-with-username/index.ts`* | *UC02-TC01, UC02-TC02, UC02-TC03, UC02-TC04* | *C06-UT06 – C06-UT11, INT-TC-AUTH-04, INT-TC-AUTH-05, KNF05-TC01* |
| *KF08* | *KNF09* | *UC05* | *C02 — Produk<br>C12 — EditProductPage (I-07)<br>C13 — PriceController* | *`src/models/Produk.ts`<br>`src/views/EditProductPage.tsx`<br>`src/controllers/PriceController.ts`* | *UC05-TC01* | *C13-UT01, C13-UT04 – C13-UT07, KNF09-TC01* |
| *KF09* | *KNF09* | *UC05* | *C02 — Produk<br>C12 — EditProductPage (I-07)<br>C13 — PriceController<br>C20 — RiwayatHargaJual* | *`src/models/Produk.ts`<br>`src/views/EditProductPage.tsx`<br>`src/controllers/PriceController.ts`<br>`src/models/RiwayatHargaJual.ts`* | *UC05-TC01, UC05-TC02, UC05-TC03* | *C13-UT01 – C13-UT11, C20-UT01 – C20-UT07, KNF09-TC01* |
| *KF10* | *KNF09* | *UC05* | *C02 — Produk<br>C12 — EditProductPage (I-07)<br>C13 — PriceController* | *`src/models/Produk.ts`<br>`src/views/EditProductPage.tsx`<br>`src/controllers/PriceController.ts`* | *UC05-TC01* | *C13-UT01, C13-UT04 – C13-UT08, KNF09-TC01* |
| *KF16* | *KNF09, KNF16* | *UC05, UC07* | *C13 — PriceController<br>C20 — RiwayatHargaJual* | *`src/controllers/PriceController.ts`<br>`src/models/RiwayatHargaJual.ts`<br>`src/supabase/migrations/20261111000000_riwayat_harga_jual.sql`* | *UC05-TC01, UC07-TC01* | *C13-UT01, C13-UT09 – C13-UT11, C20-UT01 – C20-UT07, KNF09-TC01, KNF16-TC01* |
| *KF17* | *KNF16* | *UC07* | *C20 — RiwayatHargaJual<br>C23 — PriceHistoryPage (I-08)<br>C24 — PriceHistoryController (Tidak diimplementasikan: berkas `src/controllers/PriceHistoryController.ts` masih kosong 0 byte pada tag release `v9.0` yang menjadi acuan pengujian)* | *`src/models/RiwayatHargaJual.ts`<br>`src/views/PriceHistoryPage.tsx`<br>`src/controllers/PriceHistoryController.ts` (Tidak diimplementasikan: kosong pada tag `v9.0`)* | *UC07-TC01, UC07-TC02* | *C20-UT01 – C20-UT07, KNF16-TC01* |
| *KF18* | *KNF16* | *UC07* | *C13 — PriceController<br>C20 — RiwayatHargaJual<br>C23 — PriceHistoryPage (I-08)<br>C24 — PriceHistoryController (Tidak diimplementasikan: berkas `src/controllers/PriceHistoryController.ts` masih kosong 0 byte pada tag release `v9.0`)* | *`src/controllers/PriceController.ts`<br>`src/models/RiwayatHargaJual.ts`<br>`src/views/PriceHistoryPage.tsx`<br>`src/supabase/migrations/20261111000000_riwayat_harga_jual.sql`* | *UC05-TC01, UC07-TC01* | *C13-UT01, C13-UT09 – C13-UT11, C20-UT01 – C20-UT07, KNF16-TC01* |
| *KF20* | *-* | *UC09* | *C17 — Notifikasi<br>C18 — PushNotificationUI<br>C19 — NotificationController* | *`src/models/Notifikasi.ts`<br>`src/services/PushNotificationUI.ts`<br>`src/controllers/NotificationController.ts`<br>`src/controllers/notification.ts`<br>`src/supabase/migrations/20261105000000_notifikasi_riwayat_harga.sql`* | *UC09-TC01, UC09-TC02* | *C17-UT01 – C17-UT03, C18-UT01 – C18-UT05, C19-UT02, C19-UT03, C19-UT06 – C19-UT13, C19-UT16, C19-UT17, C19-UT26, INT-TC-NOTIF-01 – INT-TC-NOTIF-04* |
| *KF22* | *-* | *UC10* | *C17 — Notifikasi<br>C18 — PushNotificationUI<br>C19 — NotificationController* | *`src/models/Notifikasi.ts`<br>`src/services/PushNotificationUI.ts`<br>`src/controllers/NotificationController.ts`<br>`src/controllers/notification.ts`<br>`src/supabase/migrations/20261105000000_notifikasi_riwayat_harga.sql`* | *UC10-TC01, UC10-TC02* | *C17-UT01 – C17-UT03, C18-UT01 – C18-UT08, C19-UT01, C19-UT04, C19-UT05, C19-UT14, C19-UT15, C19-UT17 – C19-UT25, INT-TC-NOTIF-01 – INT-TC-NOTIF-04* |
| *KF23* | *KNF04* | *UC11* | *C25 — ProfilePage<br>C26 — ProfileController* | *`src/views/ProfilePage.tsx`<br>`src/controllers/ProfileController.ts`* | *UC11-TC01, UC11-TC02* | *C26-UT01 – C26-UT09, KNF04-TC01 (parsial)* |
| *KF24* | *-* | *UC12* | *C25 — ProfilePage<br>C26 — ProfileController* | *`src/views/ProfilePage.tsx`<br>`src/controllers/ProfileController.ts`* | *UC12-TC01, UC12-TC02* | *C26-UT10, C26-UT11* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Catatan: **C24 (`PriceHistoryController`)** — *Tidak diimplementasikan: berkas `src/controllers/PriceHistoryController.ts` masih kosong (0 byte) pada tag release `v9.0` yang menjadi acuan pengujian, sehingga operasi `getRiwayatHarga()`, `filterDataByDate()`, dan `generateChartData()` tidak dapat diuji pada unit test untuk tag tersebut (diperbaiki terpisah pada branch pengembangan setelah `v9.0`).*

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Response time* | *KF01, KF02 / UC01* | *KNF01-TC01* |
| *KNF02* | *Ergonomi* | *KF01 / UC01* | *KNF02-TC01* |
| *KNF05* | *Response time* | *KF04 / UC02* | *KNF05-TC01* |
| *KNF03* | *Reliability* | *KF02 / UC01* | *KNF03-TC01* |
| *KNF04* | *Security* | *KF01, KF23 / UC01, UC11* | *KNF04-TC01 (parsial)* |
| *KNF09* | *Reliability* | *KF08, KF09, KF10, KF16 / UC05 (I-07)* | *KNF09-TC01* |
| *KNF16* | *Response time* | *KF16, KF17, KF18 / UC07 (I-08)* | *KNF16-TC01* |
| *...* | *...* | *...* | *...* |
