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
| 7 | *I-09* | *Daftar Bahan Baku dan Detail Tren Bahan Baku* | *`src/views/TrenBahanBakuPage.tsx`* | *-* |
| 8 | *I-10* | *Profil Pengguna* | *`src/views/ProfilePage.tsx`* | *-* |
| 9 | *I-11* | *Push Notification* | *`src/services/PushNotificationUI.ts`* | *-* |
| 10 | *I-12* | *Pusat Notifikasi* | *`src/views/NotificationPage.tsx`* | *-* |
| 11 | *-* | *Izin Notifikasi (tambahan, tidak ada pada DPPL)* | *`src/views/IzinNotifikasiPage.tsx`* | *-* |
| 12 | *-* | *Detail Produk (tambahan, tidak ada pada DPPL)* | *`src/views/ProductDetailPage.tsx`* | *-* |

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
| *C09* | *ResetPasswordController* | *Mendalam* | *Memuat validasi dan proses pengaturan ulang password.* | *[isi]* |
| *C10* | *AddProductPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis. Perhitungan dan penyimpanan didelegasikan ke C11.* | *-* |
| *C11* | *MarginController* | *Mendalam* | *Memuat validasi input, perhitungan HPP dan margin, serta penyimpanan produk dan resep.* | *[isi]* |
| *C12* | *EditProductPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C13* | *PriceController* | *Mendalam* | *Memuat validasi harga dan pencatatan riwayat harga jual.* | *[isi]* |
| *C14* | *RiwayatHargaBahanBaku* | *Tidak perlu* | *Diwujudkan sebagai tabel `tbl_riwayat_harga_bahan` dan tipe data `RiwayatHarga`, tanpa logika.* | *-* |
| *C15* | *TrenBahanBakuPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C16* | *TrenBahanBakuController* | *Mendalam* | *Memuat penyaringan berdasarkan rentang waktu (`filterByRentang`) dan pembentukan data grafik (`formatUntukChart`).* | *[isi]* |
| *C17* | *Notifikasi* | *Sedang* | *Entitas dengan perubahan status baca (`markAsRead()`).* | *C17-UT01 – C17-UT03, INT-TC-NOTIF-02* |
| *C18* | *PushNotificationUI* | *Sedang* | *Mendelegasikan penampilan notifikasi ke pustaka notifikasi perangkat.* | *C18-UT01 – C18-UT08, INT-TC-NOTIF-03, INT-TC-NOTIF-04* |
| *C19* | *NotificationController* | *Mendalam* | *Memuat aturan penentuan margin negatif, pembuatan, dan pengiriman notifikasi.* | *C19-UT01 – C19-UT26, INT-TC-NOTIF-01 – INT-TC-NOTIF-03* |
| *C20* | *RiwayatHargaJual* | *Mendalam* | *Setter memuat validasi harga dan waktu perubahan.* | *[isi]* |
| *C21* | *SearchProductPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C22* | *ProductSearchController* | *Mendalam* | *Memuat algoritma pencarian dan penyaringan produk melalui `search()`.* | *[isi]* |
| *C23* | *PriceHistoryPage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C24* | *PriceHistoryController* | *Mendalam* | *Belum diimplementasikan pada tag v9.0 (berkas kosong), sehingga tidak dapat diuji.* | *-* |
| *C25* | *ProfilePage* | *Tidak perlu* | *Kelas antarmuka tanpa logika bisnis, teruji lewat test case use case.* | *-* |
| *C26* | *ProfileController* | *Mendalam* | *Memuat validasi data profil serta proses pembaruan dan pengakhiran sesi.* | *[isi]* |
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

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KNF01-TC01* | *KNF01* | *Response time* | *Pendaftaran akun baru ke basis data selesai dalam waktu kurang dari 3 detik.* | *Tiga percobaan dengan akun baru pada Samsung Galaxy S25 FE melalui jaringan XL. Durasi diukur dari rekaman layar sejak tombol Daftar ditekan hingga Beranda pertama kali tampil. Keberadaan profil diperiksa terpisah di Supabase.* | *Durasi 2,18 detik, 1,96 detik, dan 1,14 detik. Rata-rata 1,76 detik dan maksimum 2,18 detik. Profil akun uji ditemukan di `public.tbl_pemilik_usaha` pada pemeriksaan UC01-TC01.* | *Pass berdasarkan waktu respons yang teramati dari sisi aplikasi.* |
| *KNF02-TC01* | *KNF02* | *Ergonomi* | *Formulir registrasi hanya berisi tiga kolom yang mencakup nama, email, dan password.* | *Inspeksi visual dan tangkapan layar formulir registrasi I-02.* | *Formulir menampilkan empat kolom yang mencakup username, email, password, dan konfirmasi password.* | *Fail. Jumlah dan nama kolom berbeda dari SKPL. Tindak lanjutnya adalah menyelaraskan formulir dan spesifikasi, termasuk keputusan penggunaan username dan konfirmasi password.* |
| *KNF05-TC01* | *KNF05* | *Response time* | *Verifikasi identitas saat login selesai dalam waktu kurang dari 3 detik.* | *Tiga percobaan login via email dan tiga percobaan via username. Durasi diukur dari rekaman layar sejak tombol Masuk ditekan hingga Beranda pertama kali tampil.* | *Email 1,76 detik, 0,79 detik, dan 0,47 detik, dengan rata-rata 1,01 detik. Username 1,27 detik, 0,75 detik, dan 0,56 detik, dengan rata-rata 0,86 detik. Durasi maksimum dari keenam percobaan adalah 1,76 detik.* | *Pass berdasarkan waktu respons yang teramati dari sisi aplikasi.* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk kelas Mendalam, dan rekaman pengukuran waktu respons.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C01-UT01 – C01-UT02* | *[Keluaran Vitest untuk dua unit test `PemilikUsaha`](./assets/bukti-pengujian/C01-unit-test.png).* |
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
| *KF20* | *-* | *UC09* | *C17 — Notifikasi<br>C18 — PushNotificationUI<br>C19 — NotificationController* | *`src/models/Notifikasi.ts`<br>`src/services/PushNotificationUI.ts`<br>`src/controllers/NotificationController.ts`<br>`src/controllers/notification.ts`<br>`src/supabase/migrations/20261105000000_notifikasi_riwayat_harga.sql`* | *UC09-TC01, UC09-TC02* | *C17-UT01 – C17-UT03, C18-UT01 – C18-UT05, C19-UT02, C19-UT03, C19-UT06 – C19-UT13, C19-UT16, C19-UT17, C19-UT26, INT-TC-NOTIF-01 – INT-TC-NOTIF-04* |
| *KF22* | *-* | *UC10* | *C17 — Notifikasi<br>C18 — PushNotificationUI<br>C19 — NotificationController* | *`src/models/Notifikasi.ts`<br>`src/services/PushNotificationUI.ts`<br>`src/controllers/NotificationController.ts`<br>`src/controllers/notification.ts`<br>`src/supabase/migrations/20261105000000_notifikasi_riwayat_harga.sql`* | *UC10-TC01, UC10-TC02* | *C17-UT01 – C17-UT03, C18-UT01 – C18-UT08, C19-UT01, C19-UT04, C19-UT05, C19-UT14, C19-UT15, C19-UT17 – C19-UT25, INT-TC-NOTIF-01 – INT-TC-NOTIF-04* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Response time* | *KF01, KF02 / UC01* | *KNF01-TC01* |
| *KNF02* | *Ergonomi* | *KF01 / UC01* | *KNF02-TC01* |
| *KNF05* | *Response time* | *KF04 / UC02* | *KNF05-TC01* |
| *...* | *...* | *...* | *...* |
