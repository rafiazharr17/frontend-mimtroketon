import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';

export default function DetailMapel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [listJadwal, setListJadwal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMapelData = async () => {
      try {
        const resMapel = await api.get('/admin/mapel');
        const mapel = resMapel.data.find(m => m.id.toString() === id);
        setDetail(mapel);

        const resJadwal = await api.get(`/admin/mapel/${id}/jadwal`);
        setListJadwal(resJadwal.data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMapelData();
  }, [id]);

  const handleSoftDelete = () => {
    Swal.fire({
      title: 'Hapus Mata Pelajaran?',
      text: "Data ini akan dipindahkan ke Recycle Bin.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      customClass: { popup: 'rounded-3xl shadow-xl' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/mapel/soft/${id}`);
          Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
          navigate('/admin/mapel');
        } catch (error) {
          Swal.fire('Gagal', 'Terjadi kesalahan.', 'error');
        }
      }
    });
  };

  if (!detail && !isLoading) return <AdminLayout><div className="p-8 text-center text-slate-500 font-medium">Data tidak ditemukan.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/mapel')} className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 border border-slate-100 text-slate-500 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail Mata Pelajaran</h1>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
           <button onClick={handleSoftDelete} className="flex-1 sm:flex-none px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition-all">
              Hapus Data
           </button>
           <Link to={`/admin/mapel/update/${id}`} className="flex-1 sm:flex-none px-8 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-center">
              Edit Mapel
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        
        {/* Kolom Kiri: Informasi Mapel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-3xl p-8">
            <div className="w-32 h-32 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-[2rem] flex items-center justify-center shadow-lg text-white text-6xl font-black mb-6 mx-auto">
              {detail?.nama_pelajaran?.charAt(0).toUpperCase() || '?'}
            </div>
            <h2 className="text-2xl font-black text-slate-800 text-center mb-6">{detail?.nama_pelajaran}</h2>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Sesi Mengajar</p>
                <p className="text-xl font-bold text-rose-600">{listJadwal.length} Sesi Terjadwal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Guru & Jadwal */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-3xl overflow-hidden h-full">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Distribusi Jadwal & Guru</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-50">
                    <th className="px-8 py-4 font-bold">Hari & Waktu</th>
                    <th className="px-8 py-4 font-bold">Kelas</th>
                    <th className="px-8 py-4 font-bold">Guru Pengampu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr><td colSpan="3" className="px-8 py-10 text-center text-slate-300 animate-pulse">Memuat jadwal...</td></tr>
                  ) : listJadwal.length === 0 ? (
                    <tr><td colSpan="3" className="px-8 py-12 text-center text-slate-400">Pelajaran ini belum memiliki jadwal / guru pengampu.</td></tr>
                  ) : (
                    listJadwal.map((j) => (
                      <tr key={j.id} className="hover:bg-rose-50/30 transition-colors group">
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-slate-700">{j.hari}</p>
                          <p className="text-xs text-slate-500">{j.jam_mulai} - {j.jam_selesai}</p>
                        </td>
                        <td className="px-8 py-4 text-sm font-bold text-rose-600">
                           <span className="px-3 py-1 bg-rose-50 rounded-lg">{j.nama_kelas}</span>
                        </td>
                        <td className="px-8 py-4 text-sm font-medium text-slate-600">{j.nama_guru}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}