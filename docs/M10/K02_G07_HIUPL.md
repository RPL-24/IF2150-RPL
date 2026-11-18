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

Tuliskan *hardware* dan *software* yang digunakan untuk implementasi, mencakup *operating system*, bahasa pemrograman beserta versinya, *framework*/*library*, DBMS, *development tools*, dan *version control*. Lingkungan ini harus konsisten dengan **Subbab 2.1 DPPL**; jelaskan jika ada perubahan. Cantumkan juga *framework* dan alat pengujian yang dipakai.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *Android 16 melalui Expo Go* |
| *Bahasa Pemrograman* | *TypeScript ~6.0.3** |
| *Framework/Library* | *Expo ~58.0.23, React Native 0.88.1, React 19.3.0, React Navigation ^7, @supabase/supabase-js ^2.118.0, expo-notifications ~58.1.8, expo-linking ~58.0.16, @expo/vector-icons ^15.0.2, react-native-chart-kit ^7.0.4, react-native-svg 15.16.0, AsyncStorage 2.2.0* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *Visual Studio Code, Git, GitHub, Supabase Dashboard, Expo Go* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |

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

#C24 belum ada

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
| *C17* | *Notifikasi* | *Sedang* | *Entitas dengan perubahan status baca (`markAsRead()`).* | *[isi]* |
| *C18* | *PushNotificationUI* | *Sedang* | *Mendelegasikan penampilan notifikasi ke pustaka notifikasi perangkat.* | *[isi]* |
| *C19* | *NotificationController* | *Mendalam* | *Memuat aturan penentuan margin negatif, pembuatan, dan pengiriman notifikasi.* | *[isi]* |
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

Cara menjalankan unit test: `npm test` pada direktori `src/`.

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
| *...* | *...* | *...* | *...* | *...* |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *INT-TC-AUTH-01* | *INT-AUTH-01* | *Controller meneruskan registrasi ke model* | *Daftarkan akun uji dengan username dan email baru serta password yang valid.* | *Controller memvalidasi masukan dan meneruskan pembuatan akun ke model `PemilikUsaha`.* | *Registrasi berhasil, Beranda tampil, dan profil akun uji ditemukan. Hasil ini diamati melalui alur UC01-TC01.* | *Pass* |
| *INT-TC-AUTH-02* | *INT-AUTH-02* | *Pembuatan akun melalui Supabase Auth* | *Kirim formulir registrasi valid pada UC01-TC01 menggunakan Supabase proyek uji.* | *Supabase Auth menerima pendaftaran akun baru dan aplikasi menyelesaikan alur registrasi.* | *Registrasi berhasil dan aplikasi membuka Beranda.* | *Pass* |
| *INT-TC-AUTH-03* | *INT-AUTH-03* | *Pembuatan profil melalui trigger basis data* | *Setelah registrasi berhasil, buka `public.tbl_pemilik_usaha` dan filter berdasarkan username akun uji.* | *Profil untuk username yang baru didaftarkan tersedia di tabel.* | *Filter menampilkan profil akun uji yang baru dibuat pada UC01-TC01.* | *Pass* |
| *INT-TC-AUTH-04* | *INT-AUTH-04* | *Autentikasi melalui email* | *Dari kondisi logout, masuk dengan email dan password akun uji seperti pada UC02-TC01.* | *Supabase Auth memverifikasi kredensial dan aplikasi membuka Beranda.* | *Login melalui email berhasil dan Beranda tampil.* | *Pass* |
| *INT-TC-AUTH-05* | *INT-AUTH-05* | *Autentikasi melalui Edge Function* | *Dari kondisi logout, masuk dengan username dan password akun uji seperti pada UC02-TC02.* | *Edge Function memverifikasi kredensial dan aplikasi menggunakan sesi yang diterima untuk membuka Beranda.* | *Login melalui username berhasil dan Beranda tampil.* | *Pass* |
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
| *UC01-TC01* | *[Beranda setelah registrasi](./assets/bukti-pengujian/UC01-01-registrasi-berhasil-beranda.jpeg) dan [profil akun uji di Supabase](./assets/bukti-pengujian/UC01-01-profil-terbuat-supabase.png).* |
| *UC01-TC02* | *[Kolom email kosong dan tombol Daftar nonaktif](./assets/bukti-pengujian/UC01-02-data-belum-lengkap.jpeg).* |
| *UC01-TC03* | *[Pesan “Akun sudah dibuat”](./assets/bukti-pengujian/UC01-03-akun-sudah-terdaftar.jpeg).* |
| *UC01-TC04* | *[Pesan validasi password terlalu lemah](./assets/bukti-pengujian/UC01-04-password-terlalu-lemah.jpeg).* |
| *UC02-TC01* | *[Tampilan “Memeriksa akun…” saat login via email](./assets/bukti-pengujian/UC02-01-login-email-berhasil.jpeg).* |
| *UC02-TC02* | *[Tampilan “Memeriksa akun…” saat login via username](./assets/bukti-pengujian/UC02-02-login-username-berhasil.jpeg).* |
| *UC02-TC03* | *[Pesan “Username atau Password Salah”](./assets/bukti-pengujian/UC02-03-login-password-salah.jpeg).* |
| *UC02-TC04* | *[Pesan “Tidak dapat menemukan akun”](./assets/bukti-pengujian/UC02-04-login-akun-belum-terdaftar.jpeg).* |
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
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Response time* | *KF01, KF02 / UC01* | *KNF01-TC01* |
| *KNF02* | *Ergonomi* | *KF01 / UC01* | *KNF02-TC01* |
| *KNF05* | *Response time* | *KF04 / UC02* | *KNF05-TC01* |
| *...* | *...* | *...* | *...* |
