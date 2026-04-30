import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";

export default function UpdateGuru() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nip: "",
    nama: "",
    jenis_kelamin: "L",
    jenis_guru: "",
  });

  // MENGUBAH STRING MENJADI OBJECT UNTUK ERROR PER KOLOM
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: { popup: "rounded-2xl shadow-xl border border-slate-100" },
  });

  useEffect(() => {
    api.get("/admin/guru").then((res) => {
      const guru = res.data.find((g) => g.id.toString() === id);
      if (guru)
        setFormData({
          nip: guru.nip,
          nama: guru.nama,
          jenis_kelamin: guru.jenis_kelamin,
          jenis_guru: guru.jenis_guru || "Guru Mapel",
        });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset error setiap submit

    let validationErrors = {};
    const nipRegex = /^\d+$/; // Validasi HANYA ANGKA

    // VALIDASI KHUSUS NIP
    if (!formData.nip) {
      validationErrors.nip = "NIP wajib diisi.";
    } else if (!nipRegex.test(formData.nip)) {
      validationErrors.nip =
        "NIP hanya boleh berisi angka (tidak boleh ada huruf).";
    } else if (formData.nip.length !== 18) {
      validationErrors.nip = "NIP harus terdiri dari tepat 18 digit angka.";
    }

    // VALIDASI KHUSUS NAMA
    if (!formData.nama.trim()) {
      validationErrors.nama = "Nama lengkap wajib diisi.";
    } else if (formData.nama.trim().length < 3) {
      validationErrors.nama = "Nama lengkap minimal 3 karakter.";
    }

    // JIKA ADA ERROR VALIDASI, TAMPILKAN POP-UP DAN HENTIKAN PROSES
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({
        icon: "warning",
        title: "Formulir Belum Sempurna",
        text: "Silakan periksa kembali kolom yang berwarna merah.",
        confirmButtonColor: "#0d9488", // Warna teal
        customClass: { popup: "rounded-3xl" },
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/admin/guru/${id}`, formData);
      Toast.fire({ icon: "success", title: "Perubahan Profil Disimpan!" });
      navigate(`/admin/guru`);
    } catch (error) {
      // TAMPILKAN POP-UP JIKA ERROR DARI DATABASE (Contoh: NIP Duplikat)
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan Data",
        text:
          error.response?.data?.message ||
          "Terjadi kesalahan sistem saat memperbarui data.",
        confirmButtonColor: "#ef4444",
        customClass: { popup: "rounded-3xl" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Menghilangkan pesan error di bawah kolom secara otomatis saat user mulai mengetik ulang
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
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
            Edit Data Guru
          </h1>
          <p className="text-slate-500 mt-1">
            Perbarui profil tenaga pendidik.
          </p>
        </div>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-3xl -z-10 opacity-60"></div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* INPUT NIP */}
            <div>
              <div className="flex justify-between items-end mb-2">
                <label
                  className={`block text-sm font-bold ${errors.nip ? "text-red-500" : "text-slate-700"}`}>
                  NIP (18 Digit Angka)
                </label>
                <span
                  className={`text-xs font-bold ${formData.nip?.length === 18 ? "text-teal-500" : "text-slate-400"}`}>
                  {formData.nip?.length || 0}/18 Angka
                </span>
              </div>
              <input
                type="text"
                name="nip"
                value={formData.nip}
                onChange={handleChange}
                maxLength="18"
                className={`w-full px-5 py-4 bg-white/50 border rounded-2xl outline-none transition-all font-medium text-slate-700 focus:ring-4 ${
                  errors.nip
                    ? "border-red-500 focus:ring-red-500/10 focus:border-red-500 bg-red-50/50"
                    : "border-slate-200 focus:ring-teal-500/10 focus:border-teal-500"
                }`}
              />
              {/* PESAN ERROR NIP */}
              {errors.nip && (
                <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {errors.nip}
                </p>
              )}
            </div>

            {/* INPUT NAMA */}
            <div>
              <label
                className={`block text-sm font-bold mb-2 ${errors.nama ? "text-red-500" : "text-slate-700"}`}>
                Nama Lengkap & Gelar
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className={`w-full px-5 py-4 bg-white/50 border rounded-2xl outline-none transition-all font-medium text-slate-700 focus:ring-4 ${
                  errors.nama
                    ? "border-red-500 focus:ring-red-500/10 focus:border-red-500 bg-red-50/50"
                    : "border-slate-200 focus:ring-teal-500/10 focus:border-teal-500"
                }`}
              />
              {/* PESAN ERROR NAMA */}
              {errors.nama && (
                <p className="text-red-500 text-xs mt-2 font-semibold flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {errors.nama}
                </p>
              )}
            </div>

            {/* JENIS KELAMIN */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Jenis Kelamin
              </label>
              <select
                name="jenis_kelamin"
                value={formData.jenis_kelamin}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-slate-700 cursor-pointer">
                <option value="L">Laki-Laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* JENIS TUGAS GURU */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Jenis Tugas Guru
              </label>
              <select
                name="jenis_guru"
                value={formData.jenis_guru}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none transition-all font-medium text-slate-700 cursor-pointer">
                <option value="Guru Mapel">Guru Mata Pelajaran</option>
                <option value="Guru Kelas">Guru Kelas (Wali Kelas)</option>
              </select>
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
              className={`px-10 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-transform transform hover:-translate-y-0.5 ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}>
              {isLoading ? "Memproses..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
