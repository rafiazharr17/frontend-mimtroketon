import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';
import { exportToExcel, exportToPDF } from '../../../utils/exportData';

export default function HomeUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');

  const dt = new Date();
  const currentYear = dt.getFullYear();
  const currentMonth = dt.getMonth() + 1;
  const optionTahun1 = `${currentYear - 1}/${currentYear}`;
  const optionTahun2 = `${currentYear}/${currentYear + 1}`;
  
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportTahun, setExportTahun] = useState(currentMonth <= 6 ? optionTahun1 : optionTahun2);
  const [exportSemester, setExportSemester] = useState(currentMonth <= 6 ? 'Genap' : 'Ganjil');

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data)).finally(() => setIsLoading(false));
  }, []);

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) && (filterRole === '' || u.role === filterRole)
  );

  const getFormattedTime = () => `${String(dt.getDate()).padStart(2, '0')}-${String(dt.getMonth() + 1).padStart(2, '0')}-${dt.getFullYear()}_${String(dt.getHours()).padStart(2, '0')}-${String(dt.getMinutes()).padStart(2, '0')}`;

  const handleExportExcel = () => {
    if(filteredUsers.length === 0) return Swal.fire('Kosong', 'Tidak ada data untuk diekspor', 'info');
    const data = filteredUsers.map((u, i) => ({ "No": i + 1, "Username Login": u.username, "Role": u.role.replace('_', ' ').toUpperCase(), "Profil Tertaut": u.nama_guru || 'Belum/Tidak Ditautkan' }));
    exportToExcel(data, `Data_Akun_${getFormattedTime()}`, "LAPORAN AKUN SISTEM MI MUHAMMADIYAH TROKETON", exportTahun, exportSemester);
    setIsExportModalOpen(false);
  };

  const handleExportPDF = () => {
    if(filteredUsers.length === 0) return Swal.fire('Kosong', 'Tidak ada data untuk diekspor', 'info');
    const headers = ["No", "Username Login", "Role", "Profil Tertaut"];
    const data = filteredUsers.map((u, i) => [ i + 1, u.username, u.role.replace('_', ' ').toUpperCase(), u.nama_guru || 'Belum/Tidak Ditautkan' ]);
    exportToPDF(headers, data, `Data_Akun_${getFormattedTime()}`, "LAPORAN AKUN SISTEM MI MUHAMMADIYAH TROKETON", 'p', exportTahun, exportSemester);
    setIsExportModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 w-full">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Manajemen Akun Login</h1>
          <p className="text-slate-500 mt-1">Kelola kredensial pengguna sistem (Admin, Guru, Wali).</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => setIsExportModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl transition-all border border-emerald-200 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> Ekspor Data
          </button>
          <div className="w-px h-10 bg-slate-300 hidden sm:block mx-1"></div>
          <Link to="/admin/users/restore" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-600 font-bold rounded-xl shadow-sm transition-all flex-1 sm:flex-none group">
            <svg className="w-5 h-5 text-slate-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Recycle Bin
          </Link>
          <Link to="/admin/users/add" className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-slate-700 to-slate-900 text-white font-bold rounded-xl shadow-lg transform hover:-translate-y-0.5">+ Tambah</Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-5">
        <input type="text" placeholder="Cari Username..." onChange={e => setSearchTerm(e.target.value)} className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl focus:border-slate-500 outline-none text-slate-700" />
        <select onChange={e => setFilterRole(e.target.value)} className="w-full md:w-56 px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-slate-700">
          <option value="">Semua Hak Akses</option><option value="admin">Administrator</option><option value="guru">Guru Pendidik</option><option value="wali_murid">Wali Murid</option>
        </select>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="px-8 py-5 font-bold">Username Login</th><th className="px-8 py-5 font-bold">Role</th><th className="px-8 py-5 font-bold">Profil Ditautkan</th><th className="px-8 py-5 font-bold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? ( <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-400">Memuat...</td></tr>
              ) : filteredUsers.length === 0 ? ( <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-400">Kosong.</td></tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-100 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-800">{u.username}</td>
                    <td className="px-8 py-5"><span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : u.role === 'guru' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{u.role.replace('_', ' ')}</span></td>
                    <td className="px-8 py-5">{u.role === 'guru' ? (u.nama_guru ? u.nama_guru : 'Belum Ditautkan') : '-'}</td>
                    <td className="px-8 py-5 text-center"><Link to={`/admin/users/detail/${u.id}`} className="px-5 py-2 bg-white border border-slate-200 hover:border-slate-400 text-sm font-bold rounded-xl transition-all">Detail</Link></td>
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
              <h3 className="text-lg font-black text-slate-800">Cetak Data Akun</h3>
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