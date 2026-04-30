# 🏫 Frontend — Aplikasi Website MIM Troketon

Frontend Sistem Informasi Manajemen Sekolah **MI Muhammadiyah Troketon**, dibangun menggunakan **React 19**, **Vite**, dan **Tailwind CSS**. Mendukung tiga role pengguna: **Admin**, **Guru**, dan **Wali Murid**, dilengkapi notifikasi real-time via Socket.io, ekspor data ke Excel & PDF, serta proteksi rute berbasis role.

---

## 🗂️ Struktur Direktori

    frontend/
    ├── public/
    │   └── logo-sekolah.png        # Logo MIM Troketon
    ├── src/
    │   ├── components/
    │   │   ├── NavbarAdmin.jsx      # Navbar untuk layout Admin
    │   │   ├── NavbarGuru.jsx       # Navbar untuk layout Guru
    │   │   ├── NavbarWali.jsx       # Navbar untuk layout Wali Murid
    │   │   ├── SidebarAdmin.jsx     # Sidebar navigasi Admin
    │   │   ├── SidebarGuru.jsx      # Sidebar navigasi Guru
    │   │   └── ProtectedRoute.jsx   # Guard rute berbasis role JWT
    │   ├── layouts/
    │   │   ├── AdminLayout.jsx      # Layout wrapper halaman Admin
    │   │   ├── GuruLayout.jsx       # Layout wrapper halaman Guru
    │   │   └── WaliLayout.jsx       # Layout wrapper halaman Wali Murid
    │   ├── pages/
    │   │   ├── LandingPage.jsx      # Halaman beranda publik
    │   │   ├── AuthPage.jsx         # Halaman login & registrasi
    │   │   ├── ForgotPassword.jsx   # Halaman lupa password (OTP)
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx
    │   │   │   ├── siswa/           # CRUD Siswa + Kenaikan Kelas
    │   │   │   ├── guru/            # CRUD Guru
    │   │   │   ├── kelas/           # CRUD Kelas
    │   │   │   ├── mapel/           # CRUD Mata Pelajaran
    │   │   │   ├── jadwal/          # Kelola Jadwal Pelajaran
    │   │   │   ├── fasilitas/       # CRUD Sarana & Prasarana
    │   │   │   ├── ppdb/            # Kelola Pendaftaran PPDB
    │   │   │   └── users/           # CRUD Akun Pengguna
    │   │   ├── guru/
    │   │   │   ├── GuruDashboard.jsx
    │   │   │   ├── JadwalMengajar.jsx
    │   │   │   └── KelolaNilai.jsx
    │   │   └── wali/
    │   │       ├── WaliDashboard.jsx
    │   │       ├── FormPPDB.jsx
    │   │       └── NilaiAnak.jsx
    │   ├── service/
    │   │   └── api.js               # Instance Axios + interceptor token
    │   ├── utils/
    │   │   └── exportData.js        # Fungsi ekspor Excel & PDF
    │   ├── App.jsx                  # Routing utama aplikasi
    │   ├── main.jsx                 # Entry point React
    │   └── index.css                # Global styles (Tailwind)
    ├── .env                         # Variabel lingkungan (tidak di-commit)
    ├── index.html
    ├── tailwind.config.js
    ├── vite.config.js
    └── package.json

---

## ⚙️ Teknologi yang Digunakan

| Teknologi | Versi | Kegunaan |
|---|---|---|
| React | ^19.2.0 | UI library utama |
| Vite | ^7.3.1 | Build tool & dev server |
| Tailwind CSS | ^3.4.19 | Utility-first CSS framework |
| React Router DOM | ^7.13.0 | Client-side routing |
| Axios | ^1.13.5 | HTTP client untuk request ke API |
| Socket.io Client | ^4.8.3 | Notifikasi real-time dari server |
| Recharts | ^3.7.0 | Grafik & chart interaktif |
| Framer Motion | ^12.34.4 | Animasi UI |
| SweetAlert2 | ^11.26.20 | Dialog konfirmasi & notifikasi |
| jsPDF + AutoTable | ^4.2.0 / ^5.0.7 | Ekspor data ke format PDF |
| XLSX | ^0.18.5 | Ekspor data ke format Excel |

---

## 🚀 Cara Menjalankan

### 1. Clone & Install Dependensi

```bash
git clone <url-repository>
cd frontend
npm install
```

### 2. Konfigurasi File `.env`

Buat file `.env` di root folder `frontend/` dan isi dengan variabel berikut:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_API_URL=http://localhost:5000/api
```

> Sesuaikan URL jika backend berjalan di port atau host yang berbeda.

### 3. Pastikan Backend Sudah Berjalan

Frontend membutuhkan backend aktif. Jalankan backend terlebih dahulu sebelum menjalankan frontend. Lihat dokumentasi backend untuk cara menjalankannya.

### 4. Jalankan Aplikasi

**Mode Development:**
```bash
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5173`

**Build untuk Production:**
```bash
npm run build
```

**Preview hasil build:**
```bash
npm run preview
```

---

## 🗺️ Daftar Halaman & Rute

### Rute Publik (Tanpa Login)

| Path | Komponen | Deskripsi |
|---|---|---|
| `/` | `LandingPage` | Halaman beranda publik MIM Troketon |
| `/login` | `AuthPage` | Halaman login & registrasi Wali Murid |
| `/forgot-password` | `ForgotPassword` | Reset password melalui OTP via email |

---

### 🛡️ Rute Admin (`/admin/*`)

Semua rute admin dilindungi oleh `ProtectedRoute` dengan role `admin`.

| Path | Deskripsi |
|---|---|
| `/admin` | Dashboard Admin (statistik, grafik, PPDB terbaru) |
| `/admin/siswa` | Daftar siswa aktif |
| `/admin/siswa/add` | Tambah data siswa |
| `/admin/siswa/detail/:id` | Detail data siswa |
| `/admin/siswa/update/:id` | Edit data siswa |
| `/admin/siswa/restore` | Recycle Bin siswa |
| `/admin/siswa/naik-kelas` | Proses kenaikan kelas massal |
| `/admin/guru` | Daftar guru aktif |
| `/admin/guru/add` | Tambah data guru |
| `/admin/guru/detail/:id` | Detail data guru |
| `/admin/guru/update/:id` | Edit data guru |
| `/admin/guru/restore` | Recycle Bin guru |
| `/admin/kelas` | Daftar kelas |
| `/admin/kelas/add` | Tambah kelas baru |
| `/admin/kelas/detail/:id` | Detail kelas & daftar siswa |
| `/admin/kelas/update/:id` | Edit data kelas |
| `/admin/kelas/restore` | Recycle Bin kelas |
| `/admin/mapel` | Daftar mata pelajaran |
| `/admin/mapel/add` | Tambah mata pelajaran |
| `/admin/mapel/detail/:id` | Detail mata pelajaran |
| `/admin/mapel/update/:id` | Edit mata pelajaran |
| `/admin/mapel/restore` | Recycle Bin mata pelajaran |
| `/admin/jadwal` | Kelola jadwal pelajaran |
| `/admin/fasilitas` | Daftar sarana & prasarana |
| `/admin/fasilitas/add` | Tambah data fasilitas |
| `/admin/fasilitas/detail/:id` | Detail fasilitas |
| `/admin/fasilitas/update/:id` | Edit data fasilitas |
| `/admin/fasilitas/restore` | Recycle Bin fasilitas |
| `/admin/ppdb` | Daftar pendaftar PPDB |
| `/admin/ppdb/detail/:id` | Detail & proses pendaftaran PPDB |
| `/admin/users` | Daftar akun pengguna |
| `/admin/users/add` | Tambah akun pengguna baru |
| `/admin/users/detail/:id` | Detail akun pengguna |
| `/admin/users/update/:id` | Edit akun pengguna |
| `/admin/users/restore` | Recycle Bin akun pengguna |

---

### 👨‍🏫 Rute Guru (`/guru/*`)

Semua rute guru dilindungi oleh `ProtectedRoute` dengan role `guru`.

| Path | Deskripsi |
|---|---|
| `/guru` | Dashboard Guru (statistik mengajar, jadwal hari ini, grafik) |
| `/guru/jadwal` | Jadwal mengajar lengkap per hari dengan status real-time |
| `/guru/nilai` | Kelola & input nilai siswa (Tugas, UTS, UAS) per kelas & mapel |

---

### 👨‍👩‍👦 Rute Wali Murid (`/wali/*`)

Semua rute wali murid dilindungi oleh `ProtectedRoute` dengan role `wali_murid`.

| Path | Deskripsi |
|---|---|
| `/wali` | Dashboard Wali Murid (data anak, status PPDB, pengumuman) |
| `/wali/ppdb` | Formulir pendaftaran PPDB online |
| `/wali/nilai` | Melihat nilai akademik anak per semester |

---

## 🔒 Sistem Proteksi Rute

Aplikasi menggunakan komponen `ProtectedRoute` yang membaca dan mendekode **JWT** dari `localStorage` untuk memverifikasi role pengguna sebelum mengizinkan akses ke halaman tertentu.

**Alur proteksi:**
1. Cek keberadaan `token` di `localStorage`.
2. Dekode payload JWT dan baca nilai `role`.
3. Bandingkan role dengan `allowedRole` yang dibutuhkan halaman.
4. Jika tidak sesuai → redirect ke halaman utama (`/`).

**Nilai role yang digunakan:**

| Role | Nilai Token | Akses |
|---|---|---|
| Admin | `admin` | `/admin/*` |
| Guru | `guru` | `/guru/*` |
| Wali Murid | `wali_murid` | `/wali/*` |

---

## 🌐 Komunikasi dengan Backend

Semua request HTTP ke backend menggunakan **Axios** melalui instance terpusat di `src/service/api.js`.

- Base URL dikonfigurasi dari variabel `VITE_API_URL` di file `.env`.
- **Request interceptor** secara otomatis menyertakan token JWT dari `localStorage` ke setiap header request:
  Authorization: Bearer <token>

---

## 📊 Fitur Ekspor Data

Tersedia di `src/utils/exportData.js`, mendukung dua format ekspor:

### Ekspor Standar (Siswa, Guru, Kelas, dll.)

| Fungsi | Format | Deskripsi |
|---|---|---|
| `exportToExcel()` | `.xlsx` | Ekspor tabel data dengan kop surat (judul, tahun ajaran, semester) |
| `exportToPDF()` | `.pdf` | Ekspor tabel data bergaya grid dengan header berwarna hijau |

### Ekspor Jadwal (Format Matriks)

| Fungsi | Format | Deskripsi |
|---|---|---|
| `exportJadwalSekolahExcel()` | `.xlsx` | Ekspor jadwal dalam format matriks (kelas × hari) dengan merge cells |
| `exportJadwalSekolahPDF()` | `.pdf` | Ekspor jadwal orientasi landscape dengan rowspan per kelas |

---

## 🔌 Real-time dengan Socket.io

Frontend terhubung ke server Socket.io backend menggunakan URL dari variabel `VITE_BACKEND_URL`. Fitur real-time yang tersedia:

- Notifikasi otomatis di dashboard Admin ketika ada pendaftar PPDB baru masuk, tanpa perlu refresh halaman.
- Status jadwal mengajar Guru diperbarui secara otomatis (Berlangsung / Segera / Selesai / Mendatang) berdasarkan waktu saat ini.

---

## 📋 Catatan Pengembangan

- Token JWT disimpan di `localStorage` dan dibaca otomatis oleh Axios interceptor di setiap request.
- Setiap modul data (Siswa, Guru, Kelas, dll.) mendukung pola **soft delete** — data yang dihapus dapat dipulihkan melalui halaman Recycle Bin.
- Halaman ekspor data hanya mengekspor data yang sedang **tampil di layar** termasuk hasil filter yang aktif.
- Proses **kenaikan kelas** memiliki mekanisme konfirmasi ganda untuk mencegah eksekusi yang tidak disengaja.

---

## 👨‍💻 Developer

**Rafi Alif Azhar** — 20220140048  
Program Studi Teknologi Informasi  
Fakultas Teknik, Universitas Muhammadiyah Yogyakarta  
2026
