import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";

export default function UpdateFasilitas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nama_fasilitas: "",
    kategori: "",
    jumlah: 1,
    kondisi: "",
    keterangan: "",
  });
  const [errors, setErrors] = useState({}); // STATE UNTUK ERROR PER KOLOM
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get("/admin/fasilitas").then((res) => {
      const f = res.data.find((item) => item.id.toString() === id);
      if (f)
        setFormData({
          nama_fasilitas: f.nama_fasilitas,
          kategori: f.kategori,
          jumlah: f.jumlah,
          kondisi: f.kondisi,
          keterangan: f.keterangan || "",
        });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset error

    let validationErrors = {};

    // 1. VALIDASI NAMA FASILITAS
    if (!formData.nama_fasilitas.trim()) {
      validationErrors.nama_fasilitas = "Nama fasilitas wajib diisi.";
    } else if (formData.nama_fasilitas.trim().length < 3) {
      validationErrors.nama_fasilitas = "Nama fasilitas minimal 3 karakter.";
    }

    // 2. VALIDASI JUMLAH
    if (!formData.jumlah || formData.jumlah < 1) {
      validationErrors.jumlah = "Jumlah minimal adalah 1.";
    }

    // JIKA ADA ERROR, CEGAH SUBMIT
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Swal.fire({
        icon: "warning",
        title: "Formulir Belum Sempurna",
        text: "Silakan periksa kembali kolom yang berwarna merah.",
        confirmButtonColor: "#06b6d4",
        customClass: { popup: "rounded-3xl" },
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/admin/fasilitas/${id}`, formData);
      Swal.fire({
        icon: "success",
        title: "Diperbarui!",
        text: "Data fasilitas berhasil diupdate.",
        customClass: { popup: "rounded-3xl" },
      });
      navigate(`/admin/fasilitas/detail/${id}`);
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            Edit Data Inventaris
          </h1>
        </div>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-50 rounded-full blur-3xl -z-10 opacity-60"></div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* INPUT NAMA FASILITAS */}
            <div className="lg:col-span-2">
              <label
                className={`block text-sm font-bold mb-2 ${errors.nama_fasilitas ? "text-red-500" : "text-slate-700"}`}>
                Nama Barang
              </label>
              <input
                type="text"
                name="nama_fasilitas"
                value={formData.nama_fasilitas}
                onChange={handleChange}
                className={`w-full px-5 py-4 bg-white/50 border rounded-2xl outline-none transition-all font-medium text-slate-700 focus:ring-4 ${errors.nama_fasilitas ? "border-red-500 focus:ring-red-500/10 focus:border-red-500 bg-red-50/50" : "border-slate-200 focus:ring-cyan-500/10 focus:border-cyan-500"}`}
              />
              {errors.nama_fasilitas && (
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
                  {errors.nama_fasilitas}
                </p>
              )}
            </div>

            {/* INPUT KATEGORI */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Kategori
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium text-slate-700">
                <option value="Sarana">Sarana (Alat Pembelajaran)</option>
                <option value="Prasarana">Prasarana (Ruang/Bangunan)</option>
                <option value="Elektronik">Alat Elektronik</option>
                <option value="Furniture">Furniture / Mebel</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="flex gap-4">
              {/* INPUT KONDISI */}
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Kondisi Saat Ini
                </label>
                <select
                  name="kondisi"
                  value={formData.kondisi}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium text-slate-700">
                  <option value="Baik">Baik</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                </select>
              </div>

              {/* INPUT JUMLAH */}
              <div className="w-32">
                <label
                  className={`block text-sm font-bold mb-2 ${errors.jumlah ? "text-red-500" : "text-slate-700"}`}>
                  Jumlah
                </label>
                <input
                  type="number"
                  name="jumlah"
                  min="1"
                  value={formData.jumlah}
                  onChange={handleChange}
                  className={`w-full px-5 py-4 bg-white/50 border rounded-2xl outline-none transition-all font-black text-slate-700 text-center focus:ring-4 ${errors.jumlah ? "border-red-500 focus:ring-red-500/10 focus:border-red-500 bg-red-50/50" : "border-slate-200 focus:ring-cyan-500/10 focus:border-cyan-500"}`}
                />
                {errors.jumlah && (
                  <p className="text-red-500 text-[10px] mt-2 font-semibold text-center">
                    {errors.jumlah}
                  </p>
                )}
              </div>
            </div>

            {/* INPUT KETERANGAN */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Keterangan Tambahan
              </label>
              <textarea
                name="keterangan"
                rows="3"
                value={formData.keterangan}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all font-medium text-slate-700"></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-10 py-3.5 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg hover:from-cyan-600 hover:to-sky-600 transition-transform transform hover:-translate-y-0.5 ${isLoading ? "opacity-70" : ""}`}>
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
