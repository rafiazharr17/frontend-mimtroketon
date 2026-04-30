import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';

export default function DetailFasilitas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    api.get('/admin/fasilitas').then(res => {
      setDetail(res.data.find(f => f.id.toString() === id));
    });
  }, [id]);

  const handleSoftDelete = () => {
    Swal.fire({
      title: 'Hapus Fasilitas?',
      text: "Data akan dipindahkan ke Recycle Bin.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      customClass: { popup: 'rounded-3xl' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/fasilitas/soft/${id}`);
          Swal.fire({ title: 'Berhasil!', text: 'Data dihapus.', icon: 'success', customClass: { popup: 'rounded-3xl' } });
          navigate('/admin/fasilitas');
        } catch (error) { Swal.fire('Gagal', 'Terjadi kesalahan.', 'error'); }
      }
    });
  };

  if (!detail) return <AdminLayout><div className="p-8 text-center animate-pulse text-slate-500 font-medium">Memuat data inventaris...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center gap-4 w-full">
        <button onClick={() => navigate('/admin/fasilitas')} className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 border border-slate-100 text-slate-500 transition-all">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail Fasilitas</h1>
      </div>

      <div className="w-full bg-white/80 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/40 rounded-3xl p-10 lg:p-14">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Ikon diubah temanya ke Cyan */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tr from-cyan-400 to-sky-500 rounded-[2rem] flex items-center justify-center shadow-lg shadow-cyan-500/30 text-white shrink-0">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
          </div>
          <div className="flex-1 w-full">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">{detail.nama_fasilitas}</h2>
            <p className="text-slate-500 font-medium mb-6">{detail.keterangan || 'Tidak ada catatan tambahan.'}</p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Kategori</p>
                <p className="text-lg font-bold text-slate-700">{detail.kategori}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Jumlah</p>
                <p className="text-lg font-bold text-slate-700">{detail.jumlah} Unit</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 lg:col-span-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status Kondisi</p>
                <span className={`inline-block mt-1 px-4 py-1.5 rounded-lg text-sm font-black uppercase tracking-wider ${detail.kondisi === 'Baik' ? 'bg-emerald-100 text-emerald-700' : detail.kondisi === 'Rusak Ringan' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                  {detail.kondisi}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-end w-full">
          <button onClick={handleSoftDelete} className="px-8 py-3.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors border border-red-100">Hapus Data</button>
          {/* Tombol edit diubah temanya ke Cyan */}
          <Link to={`/admin/fasilitas/update/${detail.id}`} className="px-10 py-3.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600 text-white font-bold rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5">Edit Fasilitas</Link>
        </div>
      </div>
    </AdminLayout>
  );
}