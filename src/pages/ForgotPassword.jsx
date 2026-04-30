import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../service/api";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // State untuk mengontrol Langkah UI (1 = Email, 2 = OTP, 3 = Password Baru)
  const [step, setStep] = useState(1);

  // State Data Input
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State Status
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==============================================================
  // Handler Step 1: Minta OTP ke Email
  // ==============================================================
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);

      // Lanjut ke langkah 2 (Input OTP) setelah 1.5 detik
      setTimeout(() => {
        setStep(2);
        setMessage("");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memproses permintaan.");
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================================
  // Handler Step 2: Verifikasi OTP (BARU)
  // ==============================================================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (otp.length !== 6) return setError("Kode OTP harus 6 digit angka!");

    setIsLoading(true);
    try {
      // PERHATIAN: Pastikan Anda memiliki endpoint ini di backend Anda!
      // Endpoint ini hanya mengecek OTP, tidak mereset password.
      const res = await api.post("/auth/verify-otp", { email, otp });

      setMessage("OTP Valid! Silakan buat password baru.");

      // Lanjut ke langkah 3 (Input Password Baru) setelah 1.5 detik
      setTimeout(() => {
        setStep(3);
        setMessage("");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Kode OTP salah atau kedaluwarsa.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================================
  // Handler Step 3: Kirim Password Baru
  // ==============================================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword)
      return setError("Konfirmasi password tidak cocok!");
    if (newPassword.length < 6)
      return setError("Password minimal harus 6 karakter!");

    setIsLoading(true);
    try {
      // Endpoint ini sekarang mengurus penggantian password (bisa menyertakan OTP juga untuk keamanan ganda)
      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message || "Password berhasil diubah!");

      // Arahkan kembali ke halaman login setelah 3 detik
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mereset password.");
    } finally {
      setIsLoading(false);
    }
  };

  // ==============================================================
  // Render UI Dinamis berdasarkan Step
  // ==============================================================
  return (
    <div className="min-h-screen bg-emerald-700 flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="w-full max-w-[500px] bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-600/20 p-8 md:p-12 border border-emerald-100/50 relative overflow-hidden transition-all duration-500">
        {/* Dekorasi Latar */}
        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-emerald-100/50 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 bg-teal-100/50 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 flex flex-col items-center">
          {/* Ikon Dinamis berdasarkan Step */}
          <div className="bg-[#f0fdf4] p-5 rounded-[2rem] shadow-sm mb-6 border border-emerald-50 text-emerald-600">
            {step === 1 && (
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
            )}
            {step === 2 && (
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            )}
            {step === 3 && (
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            )}
          </div>

          {/* Judul & Deskripsi Dinamis */}
          <h2 className="text-2xl font-black text-slate-800 mb-2 text-center tracking-tight">
            {step === 1 && "Lupa Password?"}
            {step === 2 && "Verifikasi OTP"}
            {step === 3 && "Buat Password Baru"}
          </h2>
          <p className="text-slate-500 text-sm text-center font-medium mb-8">
            {step === 1 &&
              "Masukkan alamat email terdaftar, dan kami akan mengirimkan 6-digit kode OTP."}
            {step === 2 && (
              <span>
                Kode OTP telah dikirim ke{" "}
                <b className="text-emerald-600">{email}</b>. Silakan masukkan
                kode untuk verifikasi.
              </span>
            )}
            {step === 3 &&
              "Silakan buat password baru Anda. Pastikan password kuat dan mudah diingat."}
          </p>

          {/* Alert Pesan/Error */}
          {error && (
            <div className="w-full mb-6 py-3 px-4 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100 text-center animate-fade-in">
              {error}
            </div>
          )}
          {message && (
            <div className="w-full mb-6 py-3 px-4 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl border border-emerald-100 text-center animate-fade-in">
              {message}
            </div>
          )}

          {/* ================== STEP 1: FORM EMAIL ================== */}
          {step === 1 && (
            <form
              onSubmit={handleRequestOTP}
              className="w-full space-y-6 animate-fade-in">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-semibold text-center"
                placeholder="Masukkan alamat email Anda"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 text-sm uppercase tracking-widest">
                {isLoading ? "Mengirim OTP..." : "Kirim Kode OTP"}
              </button>
            </form>
          )}

          {/* ================== STEP 2: FORM OTP SAJA ================== */}
          {step === 2 && (
            <form
              onSubmit={handleVerifyOTP}
              className="w-full space-y-4 animate-fade-in">
              <div className="mb-6">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 text-center">
                  Masukkan 6 Digit OTP
                </label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ""))
                  } // Cegah ketik huruf
                  className="w-full px-5 py-4 bg-emerald-50/50 border-2 border-emerald-200 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-2xl font-black text-center tracking-[1rem] text-emerald-700 placeholder-emerald-200"
                  placeholder="------"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || message !== ""}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 text-sm uppercase tracking-widest mt-2">
                {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
              </button>
            </form>
          )}

          {/* ================== STEP 3: FORM PASSWORD BARU SAJA ================== */}
          {step === 3 && (
            <form
              onSubmit={handleResetPassword}
              className="w-full space-y-4 animate-fade-in">
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-semibold"
                placeholder="Password Baru"
              />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm font-semibold"
                placeholder="Konfirmasi Password Baru"
              />
              <button
                type="submit"
                disabled={isLoading || message !== ""}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 text-sm uppercase tracking-widest mt-2">
                {isLoading ? "Menyimpan..." : "Simpan Password Baru"}
              </button>
            </form>
          )}

          {/* TOMBOL NAVIGASI KEMBALI */}
          <button
            type="button"
            onClick={() => {
              if (step === 3)
                setStep(2); // Kembali ke input OTP
              else if (step === 2)
                setStep(1); // Kembali ke input email
              else navigate("/login"); // Kembali ke halaman Login
            }}
            className="mt-8 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {step === 3
              ? "Kembali ke Kode OTP"
              : step === 2
                ? "Ganti Alamat Email"
                : "Kembali ke Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
