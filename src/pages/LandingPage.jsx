import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navLinks = ["Beranda", "Visi Misi", "Fasilitas", "PPDB"];
  const navIds = ["hero", "visi-misi", "fasilitas", "ppdb"];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, type: "spring" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled || isMobileMenuOpen
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => scrollToSection("hero")}
          className="flex items-center gap-3 cursor-pointer group">
          <img
            src="/logo-sekolah.png"
            alt="Logo MIM Troketon"
            className="h-10 w-auto group-hover:scale-110 transition-transform"
          />
          <div className="flex flex-col">
            <span
              className={`text-xl font-black tracking-tight leading-tight ${scrolled || isMobileMenuOpen ? "text-emerald-800" : "text-slate-800"}`}>
              MIM TROKETON
            </span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest -mt-1">
              Unggul & Berkarakter
            </span>
          </div>
        </div>

        {/* Menu Tengah (Desktop) */}
        <div
          className={`hidden md:flex items-center gap-8 text-sm font-bold ${scrolled ? "text-slate-600" : "text-slate-700"}`}>
          {navLinks.map((menu, index) => (
            <button
              key={menu}
              onClick={() => scrollToSection(navIds[index])}
              className="hover:text-emerald-600 transition-colors relative group py-1">
              {menu}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          ))}
        </div>

        {/* Tombol Login (Desktop) */}
        <Link
          to="/login"
          className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-full shadow-lg shadow-emerald-200 transition-all active:scale-95 group">
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Login atau Daftar
        </Link>

        {/* Tombol Hamburger (Mobile) */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 focus:outline-none transition-colors ${scrolled || isMobileMenuOpen ? "text-emerald-700" : "text-slate-800"}`}>
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Dropdown Menu Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden shadow-2xl absolute top-full left-0 w-full">
            <div className="flex flex-col px-6 py-4 space-y-4">
              {navLinks.map((menu, index) => (
                <button
                  key={menu}
                  onClick={() => scrollToSection(navIds[index])}
                  className="text-left font-bold text-slate-700 hover:text-emerald-600 py-2 border-b border-slate-50">
                  {menu}
                </button>
              ))}
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-lg mt-2 active:scale-95 transition-transform">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Login atau Daftar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// ==========================================
// 2. MAIN LANDING PAGE
// ==========================================
export default function LandingPage() {
  // LOGIKA TAHUN AJARAN DINAMIS (OTOMATIS UPDATE TIAP TAHUN)
  const dt = new Date();
  const currentYear = dt.getFullYear();
  const currentMonth = dt.getMonth() + 1; // 1-12
  const tahunAjaran =
    currentMonth <= 6
      ? `${currentYear - 1}/${currentYear}`
      : `${currentYear}/${currentYear + 1}`;

  // Animasi Dasar
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar />

      {/* ==========================================
          SECTION 1: HERO
          ========================================== */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center pt-28 pb-12 overflow-hidden bg-gradient-to-b from-[#fdfdfd] to-slate-50">
        {/* Ornamen Latar */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-[100px] opacity-70 translate-x-1/3 -translate-y-1/4 z-0"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-50 rounded-full blur-[80px] opacity-60 -translate-x-1/3 translate-y-1/3 z-0"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-start pt-10">
            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
              Mendidik Generasi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                Unggul & Islami
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-slate-600 mb-10 max-w-xl font-medium leading-relaxed">
              MI Muhammadiyah Troketon memadukan kurikulum nasional dan
              nilai-nilai Al-Qur'an untuk mencetak siswa yang cerdas secara
              akademik dan mulia secara akhlak.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 w-full sm:w-auto">
              <button
                onClick={() =>
                  document
                    .getElementById("ppdb")
                    .scrollIntoView({ behavior: "smooth" })
                }
                className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3">
                Daftar PPDB Sekarang
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </motion.div>
          </motion.div>

          {/* Gambar Ilustrasi Kanan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="relative lg:h-[500px] flex items-center justify-center mt-10 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-[3rem] rotate-3 opacity-20 blur-lg hidden sm:block"></div>
            <div className="relative w-full max-w-sm sm:max-w-md aspect-square bg-white border-4 border-white shadow-2xl rounded-[3rem] overflow-hidden flex items-center justify-center p-8 z-10">
              <img
                src="/logo-sekolah.png"
                alt="MI Muhammadiyah"
                className="w-3/4 h-auto object-contain animate-float"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          SECTION 2: VISI & MISI
          ========================================== */}
      <section
        id="visi-misi"
        className="py-24 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 border-[40px] border-emerald-800 rounded-full blur-sm -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 border-[60px] border-emerald-800 rounded-full blur-sm translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}>
            <span className="text-emerald-400 font-black tracking-widest uppercase text-sm mb-4 block">
              Visi Sekolah
            </span>
            <h2 className="text-3xl md:text-5xl font-black leading-tight mb-6">
              "Terwujudnya Peserta Didik yang{" "}
              <span className="text-amber-400">
                Beriman, Berilmu, dan Beramal Shaleh
              </span>
              "
            </h2>
            <p className="text-emerald-100/80 leading-relaxed font-medium">
              Kami bercita-cita menjadi lembaga pendidikan dasar yang unggul
              dalam melahirkan generasi yang tidak hanya cerdas secara
              intelektual, tetapi juga memiliki fondasi tauhid yang kuat serta
              akhlak yang terpuji sesuai dengan ajaran Islam.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="space-y-4">
            <span className="text-emerald-400 font-black tracking-widest uppercase text-sm mb-4 block">
              Misi Sekolah
            </span>
            {[
              "Menyelenggarakan pendidikan dasar yang bermutu dan berorientasi pada kemajuan IPTEK.",
              "Menanamkan nilai-nilai keislaman dan Kemuhammadiyahan dalam kehidupan sehari-hari.",
              "Membiasakan budaya bersih, tertib, disiplin, dan santun dalam lingkungan sekolah.",
              "Mengembangkan minat, bakat, dan potensi siswa melalui kegiatan ekstrakurikuler.",
            ].map((misi, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex gap-4 bg-emerald-800/50 p-5 rounded-2xl border border-emerald-700/50 hover:bg-emerald-800 transition-colors">
                <div className="w-8 h-8 shrink-0 bg-amber-400 text-emerald-900 rounded-full flex items-center justify-center font-black">
                  {i + 1}
                </div>
                <p className="text-emerald-50 text-sm md:text-base font-medium">
                  {misi}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: FASILITAS
          ========================================== */}
      <section id="fasilitas" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-3 block">
              Sarana & Prasarana
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Fasilitas Penunjang Belajar
            </h2>
            <div className="w-24 h-1.5 bg-emerald-500 rounded-full mt-6 mx-auto"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Fasilitas 1 */}
            <div className="group rounded-[2rem] overflow-hidden bg-slate-50 relative aspect-[4/3] cursor-pointer">
              <div className="absolute inset-0 bg-slate-800/20 group-hover:bg-slate-900/60 transition-colors duration-500 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop"
                alt="Ruang Kelas"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-black text-white mb-2 shadow-sm">
                  Ruang Kelas Nyaman
                </h3>
                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                  Dilengkapi ventilasi udara yang baik, pencahayaan optimal, dan
                  media pembelajaran interaktif.
                </p>
              </div>
            </div>

            {/* Fasilitas 2 */}
            <div className="group rounded-[2rem] overflow-hidden bg-slate-50 relative aspect-[4/3] cursor-pointer lg:translate-y-8">
              <div className="absolute inset-0 bg-slate-800/20 group-hover:bg-slate-900/60 transition-colors duration-500 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop"
                alt="Perpustakaan"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-black text-white mb-2 shadow-sm">
                  Perpustakaan Mini
                </h3>
                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                  Menyediakan berbagai koleksi buku fiksi dan non-fiksi untuk
                  meningkatkan budaya literasi siswa.
                </p>
              </div>
            </div>

            {/* Fasilitas 3 */}
            <div className="group rounded-[2rem] overflow-hidden bg-slate-50 relative aspect-[4/3] cursor-pointer sm:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-slate-800/20 group-hover:bg-slate-900/60 transition-colors duration-500 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1564182842519-8a3b2af3e228?q=80&w=800&auto=format&fit=crop"
                alt="Halaman Olahraga"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-black text-white mb-2 shadow-sm">
                  Halaman Luas
                </h3>
                <p className="text-white/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                  Area bermain dan lapangan olahraga yang aman untuk menunjang
                  aktivitas fisik anak.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 4: ALUR PPDB
          ========================================== */}
      <section id="ppdb" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] p-6 md:p-16 shadow-xl border border-slate-100 relative overflow-hidden">
            {/* Latar Dekorasi */}
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg
                className="w-64 h-64 text-emerald-900"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
              </svg>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                {/* TAHUN AJARAN DINAMIS */}
                <span className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-3 block">
                  Pendaftaran Tahun Ajaran {tahunAjaran}
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                  Cara Mendaftar PPDB
                </h2>
                <p className="text-slate-500 mt-4 max-w-xl mx-auto text-sm md:text-base">
                  Kami menyediakan sistem pendaftaran online yang mudah agar
                  orang tua tidak perlu repot datang ke sekolah.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {/* Garis Penghubung (Hanya Desktop) */}
                <div className="hidden lg:block absolute top-[20%] left-[10%] right-[10%] h-1 bg-slate-100 -z-10"></div>

                {/* Step 1 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl mb-4 border-4 border-white shadow-md relative z-10">
                    1
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">
                    Buat Akun Wali
                  </h4>
                  <p className="text-sm text-slate-500 px-4">
                    Daftar akun di portal sekolah menggunakan alamat Email aktif
                    Anda.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl mb-4 border-4 border-white shadow-md relative z-10">
                    2
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">
                    Login Portal
                  </h4>
                  <p className="text-sm text-slate-500 px-4">
                    Masuk ke sistem, lalu pilih menu "Pendaftaran PPDB Baru".
                  </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-black text-xl mb-4 border-4 border-white shadow-md relative z-10">
                    3
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">
                    Isi Formulir
                  </h4>
                  <p className="text-sm text-slate-500 px-4">
                    Isi data anak dan upload dokumen persyaratan (KK, Akte,
                    dll).
                  </p>
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-black text-xl mb-4 border-4 border-white shadow-md relative z-10">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <h4 className="font-extrabold text-slate-800 mb-2">
                    Tunggu Hasil
                  </h4>
                  <p className="text-sm text-slate-500 px-4">
                    Admin akan memverifikasi berkas. Status lolos bisa dipantau
                    dari akun.
                  </p>
                </div>
              </div>

              <div className="mt-12 md:mt-16 text-center">
                <Link
                  to="/login"
                  state={{ isRegister: true }}
                  className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full shadow-xl transition-all hover:scale-105 active:scale-95 text-lg tracking-wide">
                  Mulai Pendaftaran
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </Link>
                <p className="text-xs text-slate-400 mt-4 font-medium uppercase tracking-widest">
                  *Kuota siswa terbatas!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: FOOTER
          ========================================== */}
      <footer className="pt-16 pb-8 bg-[#0f172a] text-slate-400">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 border-b border-slate-800 pb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-xl p-2 flex items-center justify-center">
                <img
                  src="/logo-sekolah.png"
                  alt="Logo"
                  className="opacity-80"
                />
              </div>
              <span className="text-xl font-black text-white tracking-widest">
                MIM TROKETON
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Pusat pendidikan dasar Islam yang mengintegrasikan IPTEK dan IMTAQ
              untuk membentuk generasi masa depan yang rahmatan lil alamin.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">
              Alamat Sekolah
            </h4>
            <p className="text-sm leading-relaxed mb-4 flex items-start gap-3">
              <svg
                className="w-5 h-5 text-emerald-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>
                Desa Troketon, Kecamatan Pedan
                <br />
                Kabupaten Klaten, Jawa Tengah
                <br />
                Kode Pos: 57468
              </span>
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">
              Kontak Informasi
            </h4>
            <div className="space-y-4 text-sm">
              <p className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                info@mimtroketon.sch.id
              </p>
              <p className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                (0272) 1234567
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center text-xs font-semibold flex flex-col md:flex-row justify-between items-center gap-4">
          <span>
            Copyright © {new Date().getFullYear()} MIM Troketon. All Rights
            Reserved.
          </span>
          <span className="text-slate-600">
            Sistem Informasi Manajemen Sekolah v1.0
          </span>
        </div>
      </footer>
    </div>
  );
}
