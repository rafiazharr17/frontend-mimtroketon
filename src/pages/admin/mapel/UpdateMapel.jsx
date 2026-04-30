import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";

export default function UpdateMapel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [namaPelajaran, setNamaPelajaran] = useState("");
  const [listMapel, setListMapel] = useState([]); // Untuk cek duplikat
  const [errorMsg, setErrorMsg] = useState(""); // Pesan error per kolom
  const [isLoading, setIsLoading] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    // Ambil semua data mapel untuk pengecekan duplikat dan set data form
    api
      .get("/admin/mapel")
      .then((res) => {
        setListMapel(res.data);
        const mapel = res.data.find((m) => m.id.toString() === id);
        if (mapel) {
          setNamaPelajaran(mapel.nama_pelajaran);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Reset error

    const namaTrimmed = namaPelajaran.trim();

    // 1. VALIDASI KOSONG
    if (!namaTrimmed) {
      setErrorMsg("Nama mata pelajaran wajib diisi.");
      return;
    }

    // 2. VALIDASI PANJANG KARAKTER
    if (namaTrimmed.length < 3) {
      setErrorMsg("Nama pelajaran minimal terdiri dari 3 karakter.");
      return;
    }

    // 3. VALIDASI DUPLIKASI MAPEL (Kecualikan mapel yang sedang diedit ini)
    const isDuplicate = listMapel.some(
      (m) =>
        m.nama_pelajaran.toLowerCase() === namaTrimmed.toLowerCase() &&
        m.id.toString() !== id,
    );
    if (isDuplicate) {
      setErrorMsg("Mata pelajaran ini sudah terdaftar di sistem.");
      return;
    }

    setIsLoading(true);
    try {
      await api.put(`/admin/mapel/${id}`, { nama_pelajaran: namaTrimmed });
      Toast.fire({
        icon: "success",
        title: "Perubahan berhasil disimpan!",
      });
      navigate("/admin/mapel");
    } catch (error) {
      Swal.fire(
        "Gagal",
        "Terjadi kesalahan sistem saat memperbarui data.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setNamaPelajaran(e.target.value);
    if (errorMsg) setErrorMsg(""); // Hilangkan error otomatis saat user mengetik
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
            Edit Mata Pelajaran
          </h1>
          <p className="text-slate-500 mt-1">
            Perbarui nama mata pelajaran yang sudah terdaftar.
          </p>
        </div>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -z-10 opacity-60"></div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 max-w-2xl relative z-10">
          <div>
            <label
              className={`block text-sm font-bold mb-2 ${errorMsg ? "text-red-500" : "text-slate-700"}`}>
              Nama Mata Pelajaran
            </label>
            <input
              type="text"
              value={namaPelajaran}
              onChange={handleChange}
              className={`w-full px-5 py-4 bg-white/50 border rounded-2xl focus:ring-4 outline-none transition-all font-medium text-slate-700 placeholder-slate-400 ${errorMsg ? "border-red-500 focus:ring-red-500/10 focus:border-red-500 bg-red-50/50" : "border-slate-200 focus:ring-rose-500/10 focus:border-rose-500"}`}
              placeholder="Contoh: Matematika Dasar"
            />
            {/* PESAN ERROR MERAH DI BAWAH KOLOM */}
            {errorMsg && (
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
                {errorMsg}
              </p>
            )}
          </div>

          <div className="flex justify-start gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors">
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-10 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 ${isLoading ? "opacity-75" : ""}`}>
              {isLoading ? "Memproses..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
