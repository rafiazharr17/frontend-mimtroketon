import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';
import { exportToExcel, exportToPDF } from '../../../utils/exportData';

export default function HomeSiswa() {
  const [siswa, setSiswa] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterKelas, setFilterKelas] = useState('');

  // TAHUN AJARAN & SEMESTER LOGIC
  const dt = new Date();
  const currentYear = dt.getFullYear();
  const currentMonth = dt.getMonth() + 1;
  const optionTahun1 = `${currentYear - 1}/${currentYear}`;
  const optionTahun2 = `${currentYear}/${currentYear + 1}`;
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTahun, setExportTahun] = useState(currentMonth <= 6 ? optionTahun1 : optionTahun2);
  const [exportSemester, setExportSemester] = useState(currentMonth <= 6 ? 'Genap' : 'Ganjil');

  useEffect(() => {
    api.get('/admin/siswa').then(res => setSiswa(res.data)).finally(() => setIsLoading(false));
  }, []);

  const listKelasUnik = [...new Set(siswa.map(s => s.nama_kelas).filter(Boolean))];

  const filteredSiswa = siswa.filter((s) => {
    const matchSearch = s.nama.toLowerCase().includes(searchTerm.toLowerCase()) || s.nis.includes(searchTerm);
    const matchGender = filterGender === '' || s.jenis_kelamin === filterGender;
    const matchKelas = filterKelas === '' || (s.nama_kelas || 'Belum di-set') === filterKelas;
    return matchSearch && matchGender && matchKelas;
  }).sort((a, b) => a.nis.localeCompare(b.nis));

  const getFormattedTime = () => `${String(dt.getDate()).padStart(2, '0')}-${String(dt.getMonth() + 1).padStart(2, '0')}-${dt.getFullYear()}_${String(dt.getHours()).padStart(2, '0')}-${String(dt.getMinutes()).padStart(2, '0')}`;

  const handleExportExcel = () => {
    if(filteredSiswa.length === 0) return Swal.fire('Kosong', 'Tidak ada data untuk diekspor', 'info');
    const data = filteredSiswa.map((s, i) => ({ "No": i + 1, "NIS": s.nis, "Nama Lengkap": s.nama, "Jenis Kelamin": s.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan', "Kelas": s.nama_kelas || 'Belum di-set' }));
    exportToExcel(data, `Data_Siswa_${getFormattedTime()}`, "LAPORAN DATA SISWA AKTIF MI MUHAMMADIYAH TROKETON", exportTahun, exportSemester);
    setIsExportModalOpen(false);
  };

  const handleExportPDF = () => {
    if(filteredSiswa.length === 0) return Swal.fire('Kosong', 'Tidak ada data untuk diekspor', 'info');
    const headers = ["No", "NIS", "Nama Lengkap", "Jenis Kelamin", "Kelas"];
    const data = filteredSiswa.map((s, i) => [ i + 1, s.nis, s.nama, s.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan', s.nama_kelas || 'Belum di-set' ]);
    exportToPDF(headers, data, `Data_Siswa_${getFormattedTime()}`, "LAPORAN DATA SISWA AKTIF MI MUHAMMADIYAH TROKETON", 'p', exportTahun, exportSemester);
    setIsExportModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4 w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kelola Data Siswa</h1>
          <p className="text-slate-500 mt-1">Daftar siswa aktif di sekolah.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full xl:w-auto">
          {/* TOMBOL BUKA MODAL EKSPOR */}
          <button onClick={() => setIsExportModalOpen(true)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-all border border-emerald-200 shadow-sm flex-1 sm:flex-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> 
            <span className="hidden sm:inline">Ekspor Data</span>
          </button>
          
          <div className="w-px h-10 bg-slate-300 hidden md:block mx-1"></div>
          
          <Link to="/admin/siswa/restore" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-600 font-bold rounded-xl shadow-sm transition-all flex-1 sm:flex-none group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Recycle Bin
          </Link>
          
          {/* TOMBOL BARU: KENAIKAN KELAS */}
          <Link to="/admin/siswa/naik-kelas" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all flex-1 sm:flex-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            Kenaikan Kelas
          </Link>
          
          <Link to="/admin/siswa/add" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-0.5 transition-all flex-1 sm:flex-none">
            + Tambah
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-5">
        <input type="text" placeholder="Cari NIS atau Nama..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-700" />
        <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="w-full md:w-56 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-slate-700 cursor-pointer">
          <option value="">Semua Kelas</option>
          {listKelasUnik.map(k => <option key={k} value={k}>{k}</option>)}
          <option value="Belum di-set">Belum di-set</option>
        </select>
        <select value={filterGender} onChange={e => setFilterGender(e.target.value)} className="w-full md:w-48 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-slate-700 cursor-pointer">
          <option value="">Semua Gender</option><option value="L">Laki-Laki</option><option value="P">Perempuan</option>
        </select>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-8 py-5 font-bold">NIS</th><th className="px-8 py-5 font-bold">Nama Siswa</th><th className="px-8 py-5 font-bold">Jenis Kelamin</th><th className="px-8 py-5 font-bold">Kelas</th><th className="px-8 py-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? ( <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-400 animate-pulse">Memuat data...</td></tr>
              ) : filteredSiswa.length === 0 ? ( <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-400">Tidak ada data.</td></tr>
              ) : (
                filteredSiswa.map(s => (
                  <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-8 py-5 font-medium text-slate-600">{s.nis}</td><td className="px-8 py-5 font-bold text-slate-800">{s.nama}</td>
                    <td className="px-8 py-5">{s.jenis_kelamin === 'L' ? <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold">Laki-Laki</span> : <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold">Perempuan</span>}</td>
                    <td className="px-8 py-5"><span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${s.nama_kelas ? 'bg-indigo-50/80 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{s.nama_kelas || 'Belum di-set'}</span></td>
                    <td className="px-8 py-5 text-center"><Link to={`/admin/siswa/detail/${s.id}`} className="px-5 py-2 bg-white border border-slate-200 hover:border-blue-400 text-sm font-bold rounded-xl transition-all">Detail</Link></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POP UP MODAL EKSPOR */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-slide-up">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
              <h3 className="text-lg font-black text-slate-800">Cetak Data Siswa</h3>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tahun Ajaran</label>
                <select value={exportTahun} onChange={e => setExportTahun(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 cursor-pointer font-semibold">
                  <option value={optionTahun1}>{optionTahun1}</option><option value={optionTahun2}>{optionTahun2}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Semester</label>
                <select value={exportSemester} onChange={e => setExportSemester(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 cursor-pointer font-semibold">
                  <option value="Ganjil">Ganjil</option><option value="Genap">Genap</option>
                </select>
              </div>
            </div>
            <div className="px-6 py-5 bg-slate-50/80 border-t border-slate-100 flex gap-3">
              <button onClick={handleExportExcel} className="flex-1 flex flex-col items-center justify-center py-3 bg-white text-emerald-600 border border-emerald-200 font-bold rounded-xl shadow-sm group hover:bg-emerald-50 transition-all"><svg className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>Excel</button>
              <button onClick={handleExportPDF} className="flex-1 flex flex-col items-center justify-center py-3 bg-white text-rose-600 border border-rose-200 font-bold rounded-xl shadow-sm group hover:bg-rose-50 transition-all"><svg className="w-6 h-6 mb-1 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>PDF</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}