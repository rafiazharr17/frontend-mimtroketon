import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { api } from "../../../service/api";
import AdminLayout from "../../../layouts/AdminLayout";

export default function KenaikanKelas() {
  const navigate = useNavigate();

  const [kelas, setKelas] = useState([]);
  const [siswa, setSiswa] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State Pilihan
  const [kelasAsal, setKelasAsal] = useState("");
  const [kelasTujuan, setKelasTujuan] = useState("");
  const [selectedSiswa, setSelectedSiswa] = useState([]);

  // STATE BARU UNTUK VALIDASI SOP
  const [isYearEnded, setIsYearEnded] = useState(false);

  useEffect(() => {
    api
      .get("/admin/kelas")
      .then((res) => setKelas(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (kelasAsal) {
      setIsLoading(true);
      api
        .get(`/admin/kelas/${kelasAsal}/siswa`)
        .then((res) => {
          setSiswa(res.data);
          setSelectedSiswa(res.data.map((s) => s.id));
        })
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    } else {
      setSiswa([]);
      setSelectedSiswa([]);
    }
  }, [kelasAsal]);

  const handleCheckboxChange = (id) => {
    setSelectedSiswa((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedSiswa.length === siswa.length) setSelectedSiswa([]);
    else setSelectedSiswa(siswa.map((s) => s.id));
  };

  const handleSubmit = () => {
    if (!isYearEnded)
      return Swal.fire("Peringatan", "Anda harus mengonfirmasi bahwa Tahun Ajaran telah selesai!", "warning");
    
    if (selectedSiswa.length === 0)
      return Swal.fire("Peringatan", "Pilih minimal 1 siswa!", "warning");
    
    if (!kelasTujuan)
      return Swal.fire("Peringatan", "Pilih kelas tujuan atau opsi Kelulusan!", "warning");
    
    if (kelasAsal === kelasTujuan)
      return Swal.fire("Peringatan", "Kelas Asal dan Tujuan tidak boleh sama!", "warning");

    // ==========================================
    // LOGIKA VALIDASI TINGKAT KELAS (MENCEGAH TURUN KELAS)
    // ==========================================
    const isLulus = kelasTujuan === "LULUS";
    const objKelasAsal = kelas.find((k) => k.id.toString() === kelasAsal);
    const objKelasTujuan = isLulus ? null : kelas.find((k) => k.id.toString() === kelasTujuan);

    if (!isLulus && objKelasAsal && objKelasTujuan) {
      // Mengambil angka dari teks nama kelas menggunakan Regex (Misal: "Kelas 2-A" -> 2)
      const tingkatAsal = parseInt(objKelasAsal.nama_kelas.match(/\d+/) ? objKelasAsal.nama_kelas.match(/\d+/)[0] : 0);
      const tingkatTujuan = parseInt(objKelasTujuan.nama_kelas.match(/\d+/) ? objKelasTujuan.nama_kelas.match(/\d+/)[0] : 0);

      // Jika tingkat kelas tujuan lebih kecil dari asal, blokir!
      if (tingkatTujuan < tingkatAsal) {
        return Swal.fire({
          title: "Aksi Ditolak!",
          text: `Anda tidak bisa memindahkan siswa dari tingkat ${tingkatAsal} turun ke tingkat ${tingkatTujuan}. Pilih kelas yang setara atau lebih tinggi.`,
          icon: "error",
          customClass: { popup: "rounded-3xl" }
        });
      }
    }
    // ==========================================

    const kelasTujuanName = isLulus ? "LULUS (Alumni)" : objKelasTujuan?.nama_kelas;

    Swal.fire({
      title: isLulus ? "Luluskan Siswa?" : "Pindahkan Kelas?",
      text: `Anda akan memindahkan ${selectedSiswa.length} siswa ke ${kelasTujuanName}. Pastikan semua nilai Semester Genap sudah terinput.`,
      icon: "warning", 
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: "Ya, Proses Sekarang!",
      customClass: { popup: "rounded-3xl" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const res = await api.post("/admin/siswa/naik-kelas", {
            siswa_ids: selectedSiswa,
            id_kelas_baru: isLulus ? null : kelasTujuan,
            status_kelulusan: isLulus ? "Lulus" : "Naik",
          });

          Swal.fire({
            title: "Berhasil!",
            text: res.data.message,
            icon: "success",
            customClass: { popup: "rounded-3xl" },
          });

          setKelasAsal("");
          setKelasTujuan("");
          setSiswa([]);
          setSelectedSiswa([]);
          setIsYearEnded(false); 
        } catch (error) {
          Swal.fire("Gagal", error.response?.data?.message || "Terjadi kesalahan sistem", "error");
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center gap-4 w-full">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-emerald-600 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kenaikan Kelas</h1>
          <p className="text-slate-500 mt-1">Pindahkan siswa ke tingkat selanjutnya pada tahun ajaran baru.</p>
        </div>
      </div>

      {/* BANNER PERINGATAN */}
      <div className="mb-8 bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-amber-800">SOP Kenaikan Kelas & Kelulusan</h3>
          <p className="text-sm text-amber-700 mt-1">
            Fitur ini hanya boleh digunakan setelah <strong>Ujian Akhir Semester Genap</strong> selesai dilaksanakan dan nilai Rapor telah dibagikan. Pastikan guru telah menginput nilai semester genap untuk siswa yang akan diproses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* PANEL KIRI: PENGATURAN KELAS */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-white h-fit">
          <h3 className="font-bold text-slate-700 mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
            </svg>
            Alur Perpindahan
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">1. Pilih Kelas Asal</label>
              <select
                value={kelasAsal}
                onChange={(e) => setKelasAsal(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-bold text-slate-700 cursor-pointer">
                <option value="">-- Pilih Kelas Saat Ini --</option>
                {kelas.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-center text-slate-300">
              <svg className="w-8 h-8 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">2. Pilih Tujuan (Naik Ke)</label>
              <select
                value={kelasTujuan}
                onChange={(e) => setKelasTujuan(e.target.value)}
                disabled={!kelasAsal}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-bold text-slate-700 cursor-pointer disabled:opacity-50">
                <option value="">-- Pilih Tujuan --</option>
                {kelas.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama_kelas}</option>
                ))}
                <option value="LULUS" className="font-black text-emerald-600 bg-emerald-50">🎓 LULUS (Jadikan Alumni)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100">
              {/* CHECKBOX KONFIRMASI SOP */}
              <label className="flex items-start gap-3 mb-5 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer group">
                <input type="checkbox" checked={isYearEnded} onChange={(e) => setIsYearEnded(e.target.checked)} className="mt-1 w-5 h-5 rounded cursor-pointer accent-emerald-600 shrink-0" />
                <span className="text-[11px] font-semibold text-slate-600 leading-tight group-hover:text-slate-800 transition-colors">
                  Saya menyatakan bahwa <strong>Tahun Ajaran telah selesai</strong> dan nilai Semester Genap untuk siswa di kelas ini telah terinput.
                </span>
              </label>

              <button
                onClick={handleSubmit}
                disabled={isLoading || !kelasAsal || !kelasTujuan || selectedSiswa.length === 0 || !isYearEnded}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all uppercase tracking-widest text-sm">
                Proses Kenaikan
              </button>
            </div>
          </div>
        </div>

        {/* PANEL KANAN: DAFTAR SISWA */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-white overflow-hidden flex flex-col h-fit max-h-[800px]">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="font-bold text-slate-800">Daftar Siswa</h3>
              <p className="text-xs text-slate-500 mt-1">Hanya centang siswa yang berhak naik kelas.</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-emerald-600">{selectedSiswa.length}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Terpilih</span>
            </div>
          </div>

          <div className="overflow-y-auto p-2 custom-scrollbar">
            {isLoading && (
              <div className="p-10 text-center text-slate-400 font-bold animate-pulse">Memuat data siswa...</div>
            )}

            {!isLoading && !kelasAsal && (
              <div className="p-16 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">Pilih "Kelas Asal" di panel kiri terlebih dahulu.</p>
              </div>
            )}

            {!isLoading && kelasAsal && siswa.length === 0 && (
              <div className="p-10 text-center text-amber-500 font-bold">Kelas ini tidak memiliki siswa.</div>
            )}

            {!isLoading && siswa.length > 0 && (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-xs uppercase tracking-widest text-slate-400">
                    <th className="p-4 w-16 text-center">
                      <input type="checkbox" checked={selectedSiswa.length === siswa.length} onChange={handleSelectAll} className="w-5 h-5 rounded cursor-pointer accent-emerald-600" />
                    </th>
                    <th className="p-4">NIS</th>
                    <th className="p-4">Nama Siswa</th>
                    <th className="p-4 text-center">Status Transisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {siswa.map((s) => {
                    const isSelected = selectedSiswa.includes(s.id);
                    return (
                      <tr key={s.id} className={`transition-colors ${isSelected ? "bg-emerald-50/30" : "bg-red-50/20"}`}>
                        <td className="p-4 text-center">
                          <input type="checkbox" checked={isSelected} onChange={() => handleCheckboxChange(s.id)} className="w-5 h-5 rounded cursor-pointer accent-emerald-600" />
                        </td>
                        <td className="p-4 font-bold text-slate-600 text-sm tracking-wider">{s.nis}</td>
                        <td className="p-4 font-semibold text-slate-800 text-sm">{s.nama}</td>
                        <td className="p-4 text-center">
                          {isSelected ? (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg uppercase tracking-widest">Naik / Lulus</span>
                          ) : (
                            <span className="text-[10px] font-black bg-red-100 text-red-700 px-3 py-1.5 rounded-lg uppercase tracking-widest">Tinggal Kelas</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}