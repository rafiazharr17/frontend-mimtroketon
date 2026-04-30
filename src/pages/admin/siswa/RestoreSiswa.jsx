import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';

export default function RestoreSiswa() {
  const [trashed, setTrashed] = useState([]);
  const navigate = useNavigate();

  const Toast = Swal.mixin({
    toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, timerProgressBar: true,
  });

  const fetchTrash = () => {
    api.get('/admin/siswa/trash').then(res => setTrashed(res.data)).catch(() => setTrashed([]));
  };

  useEffect(() => { fetchTrash(); }, []);

  const handleRestore = (id) => {
    Swal.fire({
      title: 'Pulihkan Data?',
      text: "Data siswa akan kembali aktif di sistem.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Pulihkan!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-3xl' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/admin/siswa/restore/${id}`);
          Toast.fire({ icon: 'success', title: 'Data berhasil dikembalikan!' });
          fetchTrash();
        } catch(err) { Swal.fire('Error', 'Gagal memulihkan data', 'error'); }
      }
    });
  };

  const handlePermanentDelete = (id) => {
    Swal.fire({
      title: 'Hapus Permanen?',
      text: "Tindakan ini tidak dapat dibatalkan! Data akan hilang selamanya.",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus Permanen!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-3xl border-2 border-red-500' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/siswa/${id}`);
          Swal.fire({ title: 'Dihapus!', text: 'Data telah musnah.', icon: 'success', customClass: { popup: 'rounded-3xl' } });
          fetchTrash();
        } catch(err) { Swal.fire('Error', 'Gagal menghapus permanen', 'error'); }
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center gap-4 w-full">
        <button onClick={() => navigate('/admin/siswa')} className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 border border-slate-100 text-slate-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
            Recycle Bin 
            <span className="px-3 py-1 bg-red-100 text-red-600 text-sm rounded-lg font-bold">Data Terhapus</span>
          </h1>
        </div>
      </div>

      <div className="w-full bg-red-50/40 backdrop-blur-xl border border-red-100 shadow-xl shadow-red-200/20 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-red-100/50 border-b border-red-200 text-red-800 text-sm uppercase tracking-wider">
                <th className="px-8 py-5 font-extrabold">NIS</th>
                <th className="px-8 py-5 font-extrabold">Nama Siswa</th>
                <th className="px-8 py-5 font-extrabold text-center">Aksi (Pemulihan)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-100">
              {trashed.length === 0 ? (
                <tr><td colSpan="3" className="px-8 py-12 text-center text-red-400 font-bold text-lg">Recycle Bin kosong.</td></tr>
              ) : (
                trashed.map((s) => (
                  <tr key={s.id} className="hover:bg-white/60 transition-colors">
                    <td className="px-8 py-5 font-semibold text-slate-700">{s.nis}</td>
                    <td className="px-8 py-5 font-black text-slate-800">{s.nama}</td>
                    <td className="px-8 py-5 flex justify-center gap-3">
                      <button onClick={() => handleRestore(s.id)} className="px-5 py-2.5 bg-white text-emerald-600 hover:bg-emerald-500 hover:text-white border border-emerald-200 hover:border-emerald-500 font-bold rounded-xl transition-all shadow-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                        Restore
                      </button>
                      <button onClick={() => handlePermanentDelete(s.id)} className="px-5 py-2.5 bg-white text-red-600 hover:bg-red-500 hover:text-white border border-red-200 hover:border-red-500 font-bold rounded-xl transition-all shadow-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        Hapus Permanen
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}