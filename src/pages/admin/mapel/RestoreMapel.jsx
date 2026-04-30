import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';

export default function RestoreMapel() {
  const [trashed, setTrashed] = useState([]);
  const navigate = useNavigate();

  const fetchTrash = () => {
    api.get('/admin/mapel/trash').then(res => setTrashed(res.data)).catch(() => setTrashed([]));
  };

  useEffect(() => { fetchTrash(); }, []);

  const handleRestore = (id) => {
    Swal.fire({
      title: 'Pulihkan Data?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      confirmButtonText: 'Ya, Pulihkan!',
      customClass: { popup: 'rounded-3xl' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.put(`/admin/mapel/restore/${id}`);
          Swal.fire('Berhasil!', 'Data dikembalikan.', 'success');
          fetchTrash();
        } catch(err) { Swal.fire('Error', 'Gagal memulihkan.', 'error'); }
      }
    });
  };

  const handlePermanentDelete = (id) => {
    Swal.fire({
      title: 'Hapus Permanen?',
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      customClass: { popup: 'rounded-3xl border-2 border-red-500' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/mapel/${id}`);
          Swal.fire('Dihapus!', 'Data terhapus permanen.', 'success');
          fetchTrash();
        } catch(err) { Swal.fire('Error', 'Gagal menghapus.', 'error'); }
      }
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8 flex items-center gap-4 w-full">
        <button onClick={() => navigate('/admin/mapel')} className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 border border-slate-100 text-slate-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Recycle Bin Mapel</h1>
      </div>

      <div className="w-full bg-red-50/40 backdrop-blur-xl border border-red-100 shadow-xl rounded-3xl overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-max">
            <thead className="bg-red-100/50 text-red-800 text-sm uppercase">
              <tr>
                <th className="px-8 py-5 font-extrabold">Nama Pelajaran</th>
                <th className="px-8 py-5 font-extrabold text-center w-64">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-100">
              {trashed.length === 0 ? (
                <tr><td colSpan="2" className="px-8 py-12 text-center text-red-400 font-bold">Recycle Bin kosong.</td></tr>
              ) : (
                trashed.map((m) => (
                  <tr key={m.id} className="hover:bg-white/60">
                    <td className="px-8 py-5 font-black text-slate-800">{m.nama_pelajaran}</td>
                    <td className="px-8 py-5 flex justify-center gap-3">
                      <button onClick={() => handleRestore(m.id)} className="px-5 py-2.5 bg-white text-emerald-600 border border-emerald-200 font-bold rounded-xl shadow-sm">Restore</button>
                      <button onClick={() => handlePermanentDelete(m.id)} className="px-5 py-2.5 bg-white text-red-600 border border-red-200 font-bold rounded-xl shadow-sm">Hapus</button>
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