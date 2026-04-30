import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";

export default function AddGuru() {
  const navigate = useNavigate();
  // TAMBAHKAN jenis_guru PADA STATE INITIAL
  const [formData, setFormData] = useState({
    nip: "",
    nama: "",
    jenis_kelamin: "L",
    jenis_guru: "Guru Mapel",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: { popup: "rounded-2xl shadow-xl border border-slate-100" },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const nipRegex = /^\d{18}$/;
    if (!nipRegex.test(formData.nip))
      return setErrorMsg("NIP harus terdiri dari tepat 18 digit angka.");
    if (formData.nama.trim().length < 3)
      return setErrorMsg("Nama lengkap minimal 3 karakter.");

    setIsLoading(true);
    try {
      await api.post("/admin/guru", formData);
      Toast.fire({
        icon: "success",
        title: "Profil Tenaga Pendidik berhasil dibuat!",
      });
      navigate("/admin/guru");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Gagal menambahkan profil guru.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center gap-4 w-full">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 border border-slate-100 text-slate-500 transition-all">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Tambah Guru Baru
          </h1>
          <p className="text-slate-500 mt-1">
            Daftarkan profil tenaga pendidik MI Muhammadiyah Troketon.
          </p>
        </div>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        {/* Dekorasi Visual Emerald */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 opacity-60"></div>

        {errorMsg && (
          <div className="mb-6 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 text-red-700 p-4 rounded-xl text-sm flex items-start space-x-3 shadow-sm animate-fade-in-up">
            <svg
              className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
            <h3 className="text-xl font-bold text-slate-800">
              Informasi Profil Pendidik
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input NIP */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-bold text-slate-700">
                  NIP (Nomor Induk Pegawai)
                </label>
                <span
                  className={`text-xs font-bold ${formData.nip.length === 18 ? "text-emerald-500" : "text-slate-400"}`}>
                  {formData.nip.length}/18 Digit
                </span>
              </div>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                required
                maxLength="18"
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                placeholder="Contoh: 198001012005011001"
              />
            </div>

            {/* Input Nama */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nama Lengkap & Gelar
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                placeholder="Contoh: Budi Santoso, S.Pd"
              />
            </div>

            {/* Input Gender */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Jenis Kelamin
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, jenis_kelamin: "L" })
                  }
                  className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 ${formData.jenis_kelamin === "L" ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-md shadow-emerald-500/10" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}>
                  Laki-Laki
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, jenis_kelamin: "P" })
                  }
                  className={`flex-1 py-4 rounded-2xl border-2 transition-all font-bold flex items-center justify-center gap-2 ${formData.jenis_kelamin === "P" ? "bg-rose-50 border-rose-500 text-rose-700 shadow-md shadow-rose-500/10" : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"}`}>
                  Perempuan
                </button>
              </div>
            </div>

            {/* TAMBAHAN INPUT JENIS TUGAS GURU */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Jenis Tugas Guru
              </label>
              <select
                name="jenis_guru"
                value={formData.jenis_guru}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium text-slate-700 cursor-pointer">
                <option value="Guru Mapel">Guru Mata Pelajaran</option>
                <option value="Guru Kelas">Guru Kelas (Wali Kelas)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}>
              {isLoading ? "Menyimpan..." : "Simpan Profil Guru"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
