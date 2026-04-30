import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";

export default function AddKelas() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_kelas: "",
    wali_kelas_id: "",
  });
  const [listGuru, setListGuru] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    // Tarik data Guru dan Kelas secara bersamaan
    Promise.all([api.get("/admin/guru"), api.get("/admin/kelas")])
      .then(([resGuru, resKelas]) => {
        // 1. Dapatkan daftar ID Guru yang SUDAH menjadi wali kelas di tabel kelas
        const assignedWaliIds = resKelas.data
          .map((k) => k.wali_kelas_id)
          .filter((id) => id != null); // Buang yang null/kosong

        // 2. Filter Guru: Hanya "Guru Kelas" DAN yang ID-nya BELUM ada di assignedWaliIds
        const availableGuru = resGuru.data.filter(
          (guru) =>
            guru.jenis_guru === "Guru Kelas" &&
            !assignedWaliIds.includes(guru.id),
        );

        setListGuru(availableGuru);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/admin/kelas", formData);
      Toast.fire({ icon: "success", title: "Kelas berhasil ditambahkan!" });
      navigate("/admin/kelas");
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

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
            Tambah Kelas Baru
          </h1>
          <p className="text-slate-500 mt-1">
            Buat data rombongan belajar baru.
          </p>
        </div>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nama Kelas
              </label>
              <input
                type="text"
                name="nama_kelas"
                onChange={(e) =>
                  setFormData({ ...formData, nama_kelas: e.target.value })
                }
                required
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                placeholder="Contoh: Kelas 1-A"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Pilih Wali Kelas
              </label>
              <select
                name="wali_kelas_id"
                onChange={(e) =>
                  setFormData({ ...formData, wali_kelas_id: e.target.value })
                }
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 cursor-pointer">
                <option value="">-- Pilih Guru Kelas --</option>
                {listGuru.map((guru) => (
                  <option key={guru.id} value={guru.id}>
                    {guru.nama}
                  </option>
                ))}
              </select>
              {listGuru.length === 0 && (
                <p className="text-xs text-amber-600 mt-2 font-semibold">
                  *Semua Guru Kelas sudah ditugaskan ke kelas lain.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-10 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5">
              {isLoading ? "Menyimpan..." : "Simpan Kelas"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
