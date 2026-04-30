import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";
import {
  exportJadwalSekolahExcel,
  exportJadwalSekolahPDF,
} from "../../../utils/exportData";

export default function HomeJadwal() {
  const [jadwal, setJadwal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [listKelas, setListKelas] = useState([]);
  const [listMapel, setListMapel] = useState([]);
  const [listGuru, setListGuru] = useState([]);

  const [filterKelas, setFilterKelas] = useState("");
  const [filterHari, setFilterHari] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id_kelas: "",
    id_mapel: "",
    id_guru: "",
    hari: "Senin",
    jam_mulai: "",
    jam_selesai: "",
  });

  // =========================================================
  // LOGIKA TAHUN AJARAN & SEMESTER OTOMATIS
  // =========================================================
  const d = new Date();
  const currentYear = d.getFullYear();
  const currentMonth = d.getMonth() + 1; // 1-12

  // Opsi Tahun yang valid (Hanya 1 tahun ke belakang & 1 tahun ke depan)
  const optionTahun1 = `${currentYear - 1}/${currentYear}`; // Cth: 2025/2026
  const optionTahun2 = `${currentYear}/${currentYear + 1}`; // Cth: 2026/2027

  // Default Cerdas: Jika Jan-Jun, masuknya Genap (Tahun1). Jika Jul-Des, masuknya Ganjil (Tahun2)
  const defaultTahun = currentMonth <= 6 ? optionTahun1 : optionTahun2;
  const defaultSemester = currentMonth <= 6 ? "Genap" : "Ganjil";

  // STATE UNTUK MODAL EKSPOR
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTahun, setExportTahun] = useState(defaultTahun);
  const [exportSemester, setExportSemester] = useState(defaultSemester);

  useEffect(() => {
    fetchJadwal();
    Promise.all([
      api.get("/admin/kelas"),
      api.get("/admin/mapel"),
      api.get("/admin/guru"),
    ])
      .then(([resKelas, resMapel, resGuru]) => {
        setListKelas(resKelas.data);
        setListMapel(resMapel.data);
        setListGuru(resGuru.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchJadwal = () => {
    setIsLoading(true);
    api
      .get("/admin/jadwal")
      .then((res) => setJadwal(res.data))
      .finally(() => setIsLoading(false));
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditId(null);
    setFormData({
      id_kelas: "",
      id_mapel: "",
      id_guru: "",
      hari: "Senin",
      jam_mulai: "",
      jam_selesai: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (j) => {
    setModalMode("edit");
    setEditId(j.id);
    setFormData({
      id_kelas: j.id_kelas,
      id_mapel: j.id_mapel,
      id_guru: j.id_guru,
      hari: j.hari,
      jam_mulai: j.jam_mulai.slice(0, 5),
      jam_selesai: j.jam_selesai.slice(0, 5),
    });
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.jam_mulai >= formData.jam_selesai)
      return Swal.fire(
        "Format Salah",
        "Jam Selesai harus lebih besar.",
        "warning",
      );
    setIsSubmitting(true);
    try {
      if (modalMode === "add") await api.post("/admin/jadwal", formData);
      else await api.put(`/admin/jadwal/${editId}`, formData);
      Swal.fire({
        title: "Berhasil!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
      closeModal();
      fetchJadwal();
    } catch (error) {
      Swal.fire(
        "Gagal!",
        error.response?.data?.message || "Terjadi kesalahan.",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Hapus Jadwal?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/jadwal/${id}`);
          fetchJadwal();
        } catch (error) {
          Swal.fire("Gagal", "Terjadi kesalahan.", "error");
        }
      }
    });
  };

  const handleAutoGenerate = () => {
    Swal.fire({
      title: "Generate Jadwal?",
      text: "Sistem akan mereset jadwal lama.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8b5cf6",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Memproses...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        try {
          await api.post("/admin/jadwal/generate");
          fetchJadwal();
          Swal.close();
        } catch (error) {
          Swal.fire("Gagal!", "", "error");
        }
      }
    });
  };

  const listKelasUnik = [...new Set(jadwal.map((j) => j.nama_kelas))].sort();
  const filteredJadwal = jadwal.filter(
    (j) =>
      (filterKelas === "" || j.nama_kelas === filterKelas) &&
      (filterHari === "" || j.hari === filterHari),
  );

  const getFormattedTime = () => {
    const dt = new Date();
    return `${String(dt.getDate()).padStart(2, "0")}-${String(dt.getMonth() + 1).padStart(2, "0")}-${dt.getFullYear()}_${String(dt.getHours()).padStart(2, "0")}-${String(dt.getMinutes()).padStart(2, "0")}`;
  };

  // ========================================================
  // LOGIKA BUILD MATRIX DATA KHUSUS
  // ========================================================
  const buildUnifiedMatrix = () => {
    const kelasList = [
      ...new Set(filteredJadwal.map((j) => j.nama_kelas)),
    ].sort();
    const hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    const allRows = [];
    const merges = [];
    let currentRowIndex = 1;

    kelasList.forEach((kelas) => {
      const jadwalKelas = filteredJadwal.filter((j) => j.nama_kelas === kelas);
      if (jadwalKelas.length === 0) return;

      const uniqueWaktu = [
        ...new Set(
          jadwalKelas.map(
            (j) => `${j.jam_mulai.slice(0, 5)} - ${j.jam_selesai.slice(0, 5)}`,
          ),
        ),
      ].sort();
      const startRow = currentRowIndex;

      uniqueWaktu.forEach((waktu, index) => {
        const rowData = {
          isFirst: index === 0,
          kelas: kelas,
          rowSpan: uniqueWaktu.length,
          jamKe: index + 1,
          waktu: waktu,
          Senin: "-",
          Selasa: "-",
          Rabu: "-",
          Kamis: "-",
          Jumat: "-",
          Sabtu: "-",
        };

        hariList.forEach((hari) => {
          const slot = jadwalKelas.find(
            (j) =>
              `${j.jam_mulai.slice(0, 5)} - ${j.jam_selesai.slice(0, 5)}` ===
                waktu && j.hari === hari,
          );
          rowData[hari] = slot
            ? `${slot.nama_pelajaran}\n(${slot.nama_guru})`
            : "-";
        });

        allRows.push(rowData);
        currentRowIndex++;
      });

      merges.push({
        s: { r: startRow, c: 0 },
        e: { r: currentRowIndex - 1, c: 0 },
      });
    });

    return { allRows, merges };
  };

  const handleExportExcel = () => {
    if (filteredJadwal.length === 0)
      return Swal.fire(
        "Kosong",
        "Tidak ada data jadwal untuk diekspor",
        "info",
      );
    const { allRows, merges } = buildUnifiedMatrix();
    exportJadwalSekolahExcel(
      allRows,
      merges,
      `Jadwal_Pelajaran_MIM_Troketon_${getFormattedTime()}`,
      exportTahun,
      exportSemester,
    );
    setIsExportModalOpen(false);
  };

  const handleExportPDF = () => {
    if (filteredJadwal.length === 0)
      return Swal.fire(
        "Kosong",
        "Tidak ada data jadwal untuk diekspor",
        "info",
      );
    const { allRows } = buildUnifiedMatrix();
    exportJadwalSekolahPDF(
      allRows,
      `Jadwal_Pelajaran_MIM_Troketon_${getFormattedTime()}`,
      "JADWAL PELAJARAN MI MUHAMMADIYAH TROKETON",
      exportTahun,
      exportSemester,
    );
    setIsExportModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Jadwal Pelajaran
          </h1>
          <p className="text-slate-500 mt-1">
            Manajemen jadwal mengajar dan ploting kelas.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          {/* TOMBOL BUKA MODAL EKSPOR */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-all border border-emerald-200 shadow-sm">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Ekspor Jadwal
          </button>

          <div className="w-px h-10 bg-slate-300 hidden lg:block mx-1"></div>

          <button
            onClick={handleAutoGenerate}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 animate-pulse">
            Auto Generate
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5">
            + Tambah
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-5">
        <div className="flex-1">
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-slate-700 cursor-pointer">
            <option value="">Semua Kelas</option>
            {listKelasUnik.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <select
            value={filterHari}
            onChange={(e) => setFilterHari(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all text-slate-700 cursor-pointer">
            <option value="">Semua Hari</option>
            {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-8 py-5 font-bold">Hari & Waktu</th>
                <th className="px-8 py-5 font-bold">Kelas</th>
                <th className="px-8 py-5 font-bold">Mata Pelajaran</th>
                <th className="px-8 py-5 font-bold">Guru Pengampu</th>
                <th className="px-8 py-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-10 text-center text-slate-400 animate-pulse font-medium">
                    Memuat jadwal...
                  </td>
                </tr>
              ) : filteredJadwal.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-8 py-16 text-center text-slate-400">
                    Tidak ada jadwal yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredJadwal.map((j) => (
                  <tr
                    key={j.id}
                    className="hover:bg-amber-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-bold text-slate-800 block">
                        {j.hari}
                      </span>
                      <span className="text-sm text-amber-600 font-semibold">
                        {j.jam_mulai.slice(0, 5)} - {j.jam_selesai.slice(0, 5)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold border border-slate-200">
                        {j.nama_kelas}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-slate-700">
                      {j.nama_pelajaran}
                    </td>
                    <td className="px-8 py-5 text-slate-600">{j.nama_guru}</td>
                    <td className="px-8 py-5 flex justify-center gap-2">
                      <button
                        onClick={() => openEditModal(j)}
                        className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 border border-blue-200 font-bold rounded-xl transition-all shadow-sm">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(j.id)}
                        className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 font-bold rounded-xl transition-all shadow-sm">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POP UP MODAL TAMBAH JADWAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all scale-100 animate-slide-up">
            <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h3 className="text-xl font-black text-slate-800">
                {modalMode === "add"
                  ? "Tambah Jadwal Manual"
                  : "Edit Jadwal Pelajaran"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-red-500">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Pilih Kelas
                  </label>
                  <select
                    name="id_kelas"
                    value={formData.id_kelas}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                    <option value="">-- Kelas --</option>
                    {listKelas.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Mata Pelajaran
                  </label>
                  <select
                    name="id_mapel"
                    value={formData.id_mapel}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                    <option value="">-- Mapel --</option>
                    {listMapel.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nama_pelajaran}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Guru Pengampu
                  </label>
                  <select
                    name="id_guru"
                    value={formData.id_guru}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                    <option value="">-- Guru --</option>
                    {listGuru.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Hari
                  </label>
                  <select
                    name="hari"
                    value={formData.hari}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none">
                    {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map(
                      (h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    name="jam_mulai"
                    value={formData.jam_mulai}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    name="jam_selesai"
                    value={formData.jam_selesai}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl">
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POP UP MODAL EKSPOR JADWAL DINAMIS */}
      {/* ========================================================= */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-slide-up">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h3 className="text-lg font-black text-slate-800">
                Cetak Jadwal Induk
              </h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-red-500 transition-colors">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tahun Ajaran
                </label>
                <select
                  value={exportTahun}
                  onChange={(e) => setExportTahun(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 cursor-pointer font-semibold">
                  {/* OPSI INI DIBUAT OTOMATIS BERDASARKAN TAHUN SEKARANG */}
                  <option value={optionTahun1}>{optionTahun1}</option>
                  <option value={optionTahun2}>{optionTahun2}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Semester
                </label>
                <select
                  value={exportSemester}
                  onChange={(e) => setExportSemester(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 cursor-pointer font-semibold">
                  <option value="Ganjil">Ganjil</option>
                  <option value="Genap">Genap</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-5 bg-slate-50/80 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleExportExcel}
                className="flex-1 flex flex-col items-center justify-center py-3 bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-200 font-bold rounded-xl transition-all shadow-sm group">
                <svg
                  className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Unduh Excel
              </button>
              <button
                onClick={handleExportPDF}
                className="flex-1 flex flex-col items-center justify-center py-3 bg-white text-rose-600 hover:bg-rose-50 border border-rose-200 font-bold rounded-xl transition-all shadow-sm group">
                <svg
                  className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Unduh PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
