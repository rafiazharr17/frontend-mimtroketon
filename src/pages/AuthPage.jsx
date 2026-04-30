import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // 1. Impor useLocation
import { api } from "../service/api";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation(); // 2. Tangkap lokasi saat ini
  
  // 3. Set default state isLogin. Jika ada state isRegister = true, maka isLogin = false
  const [isLogin, setIsLogin] = useState(location.state?.isRegister ? false : true);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [loginData, setLoginData] = useState({ username: "", password: "" });
  
  const [regData, setRegData] = useState({
    username: "",
    email: "", 
    password: "",
    nama_wali: "",
    no_telepon: "",
  });

  // 4. Efek tambahan: Jika user mengakses /login dengan state isRegister lagi
  useEffect(() => {
    if (location.state?.isRegister) {
      setIsLogin(false);
    }
  }, [location.state]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", loginData);
      const { token, role } = res.data;
      localStorage.setItem("token", token);
      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        if (role === "guru") navigate("/guru");
        if (role === "wali_murid") navigate("/wali");
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || "Kredensial salah.");
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await api.post("/auth/register/wali", regData);
      setMessage(res.data.message);
      
      // Kosongkan form setelah sukses mendaftar
      setRegData({ username: "", email: "", password: "", nama_wali: "", no_telepon: "" });
      
      setTimeout(() => setIsLogin(true), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mendaftar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-700 flex items-center justify-center p-4 font-sans overflow-hidden">
      <div className="relative w-full max-w-[1000px] min-h-[600px] md:h-[650px] bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-600/20 flex flex-col md:flex-row border border-emerald-100/50 overflow-hidden z-10">
        <div
          className={`transition-all duration-700 ease-in-out w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12 z-[1] ${isLogin ? "md:translate-x-full" : "md:translate-x-0"}`}>
          <div className="w-full max-w-[340px] flex flex-col items-center">
            
            {/* LOGO KHUSUS MOBILE */}
            <div className="md:hidden flex flex-col items-center mb-6">
              <img src="/logo-sekolah.png" alt="Logo" className="h-20 w-auto object-contain mb-2" />
              <h1 className="text-xl font-black text-emerald-600 tracking-tight">MIM Troketon</h1>
            </div>

            {/* FORM LOGIN */}
            <div className={`w-full transition-all duration-500 ${isLogin ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute"}`}>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Masuk Akun</h2>
              <p className="text-slate-400 text-xs uppercase tracking-widest font-bold mb-8">Silakan login ke portal</p>

              {error && isLogin && (
                <div className="mb-4 py-2 px-4 bg-red-50 text-red-500 text-[11px] font-bold rounded-xl border border-red-100 text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <input
                  type="text"
                  required
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-sm font-semibold"
                  placeholder="Username atau Email"
                />
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-0 py-3 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-sm font-semibold"
                    placeholder="Password"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => navigate('/forgot-password')}
                      className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-all">
                      Lupa Password?
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 text-sm mt-2">
                  {isLoading ? "Menghubungkan..." : "Masuk Sistem"}
                </button>
              </form>
              <div className="mt-8 text-center md:hidden">
                <button onClick={() => setIsLogin(false)} className="text-emerald-600 font-bold text-xs">
                  Belum punya akun? <span className="underline">Daftar</span>
                </button>
              </div>
            </div>

            {/* FORM REGISTER */}
            <div className={`w-full transition-all duration-500 ${!isLogin ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none absolute"}`}>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Daftar Akun</h2>
              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-6">Lengkapi data pendaftaran</p>

              {error && !isLogin && (
                <div className="mb-4 py-2 px-4 bg-red-50 text-red-500 text-[11px] font-bold rounded-xl border border-red-100 text-center">
                  {error}
                </div>
              )}
              {message && (
                <div className="mb-4 py-2 px-4 bg-emerald-50 text-emerald-600 text-[11px] font-bold rounded-xl border border-emerald-100 text-center">
                  {message}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-3">
                <input
                  type="text"
                  required
                  value={regData.nama_wali}
                  onChange={(e) => setRegData({ ...regData, nama_wali: e.target.value })}
                  className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-sm font-semibold"
                  placeholder="Nama Lengkap"
                />
                <input
                  type="text"
                  required
                  value={regData.no_telepon}
                  onChange={(e) => setRegData({ ...regData, no_telepon: e.target.value })}
                  className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-sm font-semibold"
                  placeholder="No. WhatsApp"
                />
                <input
                  type="text"
                  required
                  value={regData.username}
                  onChange={(e) => setRegData({ ...regData, username: e.target.value })}
                  className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-sm font-semibold"
                  placeholder="Username"
                />
                <input
                  type="email"
                  required
                  value={regData.email}
                  onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                  className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-sm font-semibold"
                  placeholder="Alamat Email (Harus aktif)"
                />
                <input
                  type="password"
                  required
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  className="w-full px-0 py-2 bg-transparent border-b-2 border-slate-100 focus:border-emerald-500 outline-none transition-all text-sm font-semibold"
                  placeholder="Password"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-200 mt-5 text-xs uppercase tracking-widest">
                  Buat Akun Baru
                </button>
              </form>
              <div className="mt-6 text-center md:hidden">
                <button onClick={() => setIsLogin(true)} className="text-emerald-600 font-bold text-xs">
                  Sudah punya akun? <span className="underline">Masuk</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* OVERLAY PANEL BRANDING HIJAU */}
        <div className={`hidden md:flex absolute top-0 w-1/2 h-full transition-all duration-700 ease-in-out z-[10] overflow-hidden ${isLogin ? "left-0" : "left-1/2"}`}>
          <div className={`absolute top-0 w-[200%] h-full bg-[#f0fdf4] transition-all duration-700 ease-in-out ${isLogin ? "left-0" : "-left-full"}`}>
            <div className="flex h-full">
              {/* Branding Login View */}
              <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 text-center relative">
                <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-emerald-300 inline-block mb-8 border border-emerald-50">
                    <img src="/logo-sekolah.png" alt="Logo" className="h-24 w-auto object-contain" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Belum Memiliki Akun?</h1>
                  <p className="text-slate-500 text-sm mb-10 font-medium">Daftarkan akun wali murid untuk mulai memantau perkembangan akademik anak Anda.</p>
                  <button onClick={() => setIsLogin(false)} className="px-10 py-3.5 border-2 border-emerald-600 text-emerald-600 font-bold rounded-2xl hover:bg-emerald-600 hover:text-white transition-all text-xs uppercase tracking-widest">
                    Daftar Wali Murid
                  </button>
                </div>
              </div>

              {/* Branding Register View */}
              <div className="w-1/2 h-full flex flex-col items-center justify-center p-12 text-center relative">
                <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-emerald-300 inline-block mb-8 border border-emerald-50">
                    <img src="/logo-sekolah.png" alt="Logo" className="h-24 w-auto object-contain" />
                  </div>
                  <h1 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Sudah Terdaftar?</h1>
                  <p className="text-slate-500 text-sm mb-10 font-medium">Silakan masuk menggunakan akun Anda untuk mengakses dashboard.</p>
                  <button onClick={() => setIsLogin(true)} className="px-10 py-3.5 border-2 border-emerald-600 text-emerald-600 font-bold rounded-2xl hover:bg-emerald-600 hover:text-white transition-all text-xs uppercase tracking-widest">
                    Masuk Ke Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}