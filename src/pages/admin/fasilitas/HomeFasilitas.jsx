import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';
import { exportToExcel, exportToPDF } from '../../../utils/exportData';

export default function HomeFasilitas() {
  const [fasilitas, setFasilitas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKondisi, setFilterKondisi] = useState('');
  const [filterKategori, setFilterKategori] = useState('');

  const dt = new Date();
  const currentYear = dt.getFullYear();
  const currentMonth = dt.getMonth() + 1;
  const optionTahun1 = `${currentYear - 1}/${currentYear}`;
  const optionTahun2 = `${currentYear}/${currentYear + 1}`;
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTahun, setExportTahun] = useState(currentMonth <= 6 ? optionTahun1 : optionTahun2);
  const [exportSemester, setExportSemester] = useState(currentMonth <= 6 ? 'Genap' : 'Ganjil');

  useEffect(() => {
    api.get('/admin/fasilitas').then(res => setFasilitas(res.data)).finally(() => setIsLoading(false));
  }, []);

  const filteredFasilitas = fasilitas.filter(f => 
    f.nama_fasilitas.toLowerCase().includes(searchTerm.toLowerCase()) && (filterKondisi === '' || f.kondisi === filterKondisi) && (filterKategori === '' || f.kategori === filterKategori)
  );

  const getFormattedTime = () => `${String(dt.getDate()).padStart(2, '0')}-${String(dt.getMonth() + 1).padStart(2, '0')}-${dt.getFullYear()}_${String(dt.getHours()).padStart(2, '0')}-${String(dt.getMinutes()).padStart(2, '0')}`;

  const handleExportExcel = () => {
    if(filteredFasilitas.length === 0) return Swal.fire('Kosong', 'Tidak ada data untuk diekspor', 'info');
    const data = filteredFasilitas.map((f, i) => ({"No": i + 1, "Nama Barang": f.nama_fasilitas, "Kategori": f.kategori, "Kondisi": f.kondisi, "Jumlah": f.jumlah}));
    exportToExcel(data, `Data_Fasilitas_${getFormattedTime()}`, "LAPORAN INVENTARIS FASILITAS MI MUHAMMADIYAH TROKETON", exportTahun, exportSemester);
    setIsExportModalOpen(false);
  };

  const handleExportPDF = () => {
    if(filteredFasilitas.length === 0) return Swal.fire('Kosong', 'Tidak ada data untuk diekspor', 'info');
    const headers = ["No", "Nama Barang", "Kategori", "Kondisi", "Jumlah"];
    const data = filteredFasilitas.map((f, i) => [i + 1, f.nama_fasilitas, f.kategori, f.kondisi, `${f.jumlah} Unit`]);
    exportToPDF(headers, data, `Data_Fasilitas_${getFormattedTime()}`, "LAPORAN INVENTARIS FASILITAS MI MUHAMMADIYAH TROKETON", 'p', exportTahun, exportSemester);
    setIsExportModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Sarana & Prasarana</h1>
          <p className="text-slate-500 mt-1">Manajemen inventaris, aset, dan fasilitas sekolah.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => setIsExportModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-all border border-emerald-200 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Ekspor Data
          </button>
          <div className="w-px h-10 bg-slate-300 hidden sm:block mx-1"></div>
          <Link to="/admin/fasilitas/restore" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-600 font-bold rounded-xl shadow-sm transition-all flex-1 sm:flex-none group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Recycle Bin
          </Link>
          <Link to="/admin/fasilitas/add" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-0.5">+ Tambah</Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-5">
        <input type="text" placeholder="Cari Nama Barang..." onChange={e => setSearchTerm(e.target.value)} className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl focus:border-cyan-500 outline-none text-slate-700" />
        <select onChange={e => setFilterKategori(e.target.value)} className="w-full md:w-48 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-slate-700">
          <option value="">Semua Kategori</option><option value="Sarana">Sarana</option><option value="Prasarana">Prasarana</option><option value="Elektronik">Elektronik</option><option value="Furniture">Furniture</option>
        </select>
        <select onChange={e => setFilterKondisi(e.target.value)} className="w-full md:w-48 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-slate-700">
          <option value="">Semua Kondisi</option><option value="Baik">Kondisi Baik</option><option value="Rusak Ringan">Rusak Ringan</option><option value="Rusak Berat">Rusak Berat</option>
        </select>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-8 py-5 font-bold">Nama Barang</th><th className="px-8 py-5 font-bold">Kategori</th><th className="px-8 py-5 font-bold">Kondisi</th><th className="px-8 py-5 font-bold">Jumlah</th><th className="px-8 py-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? ( <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-400">Memuat...</td></tr>
              ) : filteredFasilitas.length === 0 ? ( <tr><td colSpan="5" className="px-8 py-10 text-center text-slate-400">Kosong.</td></tr>
              ) : (
                filteredFasilitas.map(f => (
                  <tr key={f.id} className="hover:bg-cyan-50/30 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-800">{f.nama_fasilitas}</td>
                    <td className="px-8 py-5"><span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">{f.kategori}</span></td>
                    <td className="px-8 py-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${f.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-700' : f.kondisi === 'Rusak Ringan' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{f.kondisi}</span></td>
                    <td className="px-8 py-5 font-black text-slate-700">{f.jumlah} <span className="text-xs text-slate-400 font-semibold">Unit</span></td>
                    <td className="px-8 py-5 text-center"><Link to={`/admin/fasilitas/detail/${f.id}`} className="px-5 py-2 bg-white border border-slate-200 hover:border-cyan-400 text-sm font-bold rounded-xl transition-all">Detail</Link></td>
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
              <h3 className="text-lg font-black text-slate-800">Cetak Data Fasilitas</h3>
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