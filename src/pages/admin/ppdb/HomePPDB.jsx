import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';
import { io } from 'socket.io-client'; 
import { exportToExcel, exportToPDF } from '../../../utils/exportData';

const socket = io(import.meta.env.VITE_BACKEND_URL); 

export default function HomePPDB() {
  const [ppdb, setPpdb] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const dt = new Date();
  const currentYear = dt.getFullYear();
  const currentMonth = dt.getMonth() + 1;
  const optionTahun1 = `${currentYear - 1}/${currentYear}`;
  const optionTahun2 = `${currentYear}/${currentYear + 1}`;
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTahun, setExportTahun] = useState(currentMonth <= 6 ? optionTahun1 : optionTahun2);
  const [exportSemester, setExportSemester] = useState(currentMonth <= 6 ? 'Genap' : 'Ganjil');

  const fetchPPDB = () => {
    if (ppdb.length === 0) setIsLoading(true); 
    api.get('/admin/ppdb').then(res => setPpdb(res.data)).finally(() => setIsLoading(false));
  };

  useEffect(() => { 
    fetchPPDB(); 
    socket.on('ppdb_baru', (data) => {
        Swal.mixin({ toast: true, position: "bottom-end", showConfirmButton: false, timer: 3500, timerProgressBar: true })
            .fire({ icon: "success", title: `Dokumen Masuk: ${data.no_pendaftaran}`, text: data.nama_lengkap });
        fetchPPDB(); 
    });
    return () => socket.off('ppdb_baru');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredPPDB = ppdb.filter(p => 
    p.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) && (filterStatus === '' || p.status === filterStatus)
  );

  const getFormattedTime = () => `${String(dt.getDate()).padStart(2, '0')}-${String(dt.getMonth() + 1).padStart(2, '0')}-${dt.getFullYear()}_${String(dt.getHours()).padStart(2, '0')}-${String(dt.getMinutes()).padStart(2, '0')}`;

  const handleExportExcel = () => {
    if(filteredPPDB.length === 0) return Swal.fire('Kosong', 'Tidak ada data untuk diekspor', 'info');
    const data = filteredPPDB.map((p, i) => ({"No": i + 1, "No Pendaftaran": p.no_pendaftaran, "Nama Calon Siswa": p.nama_lengkap, "Status Seleksi": p.status}));
    exportToExcel(data, `Data_PPDB_${getFormattedTime()}`, "LAPORAN PENDAFTARAN PPDB MI MUHAMMADIYAH TROKETON", exportTahun, exportSemester);
    setIsExportModalOpen(false);
  };

  const handleExportPDF = () => {
    if(filteredPPDB.length === 0) return Swal.fire('Kosong', 'Tidak ada data untuk diekspor', 'info');
    const headers = ["No", "No Pendaftaran", "Nama Calon Siswa", "Status Seleksi"];
    const data = filteredPPDB.map((p, i) => [i + 1, p.no_pendaftaran, p.nama_lengkap, p.status]);
    exportToPDF(headers, data, `Data_PPDB_${getFormattedTime()}`, "LAPORAN PENDAFTARAN PPDB MI MUHAMMADIYAH TROKETON", 'p', exportTahun, exportSemester);
    setIsExportModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola PPDB</h1>
          <p className="text-slate-500 mt-1">Tinjau dan seleksi berkas pendaftaran calon siswa.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {/* TOMBOL BUKA MODAL EKSPOR */}
          <button onClick={() => setIsExportModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-all border border-emerald-200 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Ekspor Data
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-5">
        <input type="text" placeholder="Cari Nama Calon Siswa..." onChange={e => setSearchTerm(e.target.value)} className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl focus:border-fuchsia-500 outline-none text-slate-700" />
        <select onChange={e => setFilterStatus(e.target.value)} className="w-full md:w-56 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-slate-700">
          <option value="">Semua Status</option><option value="Menunggu">Menunggu Review</option><option value="Diterima">Lolos / Diterima</option><option value="Ditolak">Ditolak</option>
        </select>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-8 py-5 font-bold">No. Daftar</th><th className="px-8 py-5 font-bold">Nama Calon Siswa</th><th className="px-8 py-5 font-bold">Status</th><th className="px-8 py-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? ( <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-400">Memuat...</td></tr>
              ) : filteredPPDB.length === 0 ? ( <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-400">Kosong.</td></tr>
              ) : (
                filteredPPDB.map((p) => (
                  <tr key={p.id} className="hover:bg-fuchsia-50/30 transition-colors">
                    <td className="px-8 py-5 font-bold text-fuchsia-600">{p.no_pendaftaran}</td><td className="px-8 py-5 font-bold text-slate-800">{p.nama_lengkap}</td>
                    <td className="px-8 py-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${p.status === 'Diterima' ? 'bg-emerald-100 text-emerald-700' : p.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span></td>
                    <td className="px-8 py-5 text-center"><Link to={`/admin/ppdb/detail/${p.id}`} className="px-5 py-2 bg-white border border-slate-200 hover:border-fuchsia-400 text-sm font-bold rounded-xl transition-all">Review Berkas</Link></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-slide-up">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h3 className="text-lg font-black text-slate-800">Cetak Data PPDB</h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-red-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tahun Ajaran</label>
                <select value={exportTahun} onChange={e => setExportTahun(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold">
                  <option value={optionTahun1}>{optionTahun1}</option><option value={optionTahun2}>{optionTahun2}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Semester</label>
                <select value={exportSemester} onChange={e => setExportSemester(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-semibold">
                  <option value="Ganjil">Ganjil</option><option value="Genap">Genap</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-5 bg-slate-50/80 border-t border-slate-100 flex gap-3">
              <button onClick={handleExportExcel} className="flex-1 py-3 bg-white text-emerald-600 border border-emerald-200 font-bold rounded-xl hover:bg-emerald-50">Excel</button>
              <button onClick={handleExportPDF} className="flex-1 py-3 bg-white text-rose-600 border border-rose-200 font-bold rounded-xl hover:bg-rose-50">PDF</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}