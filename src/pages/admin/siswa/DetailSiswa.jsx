import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';

export default function DetailSiswa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    api.get('/admin/siswa').then(res => {
      const siswa = res.data.find(s => s.id.toString() === id);
      setDetail(siswa);
    });
  }, [id]);

  const handleSoftDelete = () => {
    Swal.fire({
      title: 'Pindahkan ke Recycle Bin?',
      text: "Data profil siswa ini akan dihapus sementara.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-3xl shadow-xl border border-slate-100' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/siswa/soft/${id}`);
          Swal.fire({ title: 'Terhapus!', text: 'Data dipindahkan ke Recycle Bin.', icon: 'success', customClass: { popup: 'rounded-3xl' } });
          navigate('/admin/siswa');
        } catch (error) {
          Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data.', 'error');
        }
      }
    });
  };

  if (!detail) return <AdminLayout><div className="p-8 text-center animate-pulse text-slate-500 font-medium">Memuat profil siswa...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center gap-4 w-full">
        <button onClick={() => navigate('/admin/siswa')} className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 border border-slate-100 text-slate-500 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Profil Siswa</h1>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-10 lg:p-14">
        <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
          <div className="w-40 h-40 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-blue-500/30 text-white text-6xl font-black shrink-0">
            {detail.nama.charAt(0)}
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6">{detail.nama}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-8 mt-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nomor Induk</p>
                <p className="text-xl font-bold text-slate-700">{detail.nis}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Jenis Kelamin</p>
                <p className="text-xl font-bold text-slate-700">{detail.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kelas Aktif</p>
                <p className="text-xl font-bold text-slate-700">{detail.nama_kelas || '-'}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Wali Murid</p>
                <p className="text-xl font-bold text-slate-700">{detail.nama_wali || '-'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-end w-full">
          <button onClick={handleSoftDelete} className="px-8 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors border border-red-100 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            Hapus Data (Recycle Bin)
          </button>
          <Link to={`/admin/siswa/update/${detail.id}`} className="px-10 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-transform transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            Edit Profil Siswa
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}