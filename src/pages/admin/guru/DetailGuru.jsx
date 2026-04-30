import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';

export default function DetailGuru() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [tugas, setTugas] = useState({ wali_kelas: null, jadwal: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailGuru = async () => {
      try {
        // 1. Ambil Profil Guru
        const resGuru = await api.get('/admin/guru');
        const guru = resGuru.data.find(g => g.id.toString() === id);
        setDetail(guru);

        // 2. Ambil Data Tugas Guru (Wali Kelas & Jadwal)
        const resTugas = await api.get(`/admin/guru/${id}/tugas`);
        setTugas(resTugas.data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailGuru();
  }, [id]);

  const handleSoftDelete = () => {
    Swal.fire({
      title: 'Pindahkan ke Recycle Bin?',
      text: "Data profil guru ini akan dinonaktifkan sementara.",
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
          await api.delete(`/admin/guru/soft/${id}`);
          Swal.fire({ title: 'Terhapus!', text: 'Data dipindahkan ke Recycle Bin.', icon: 'success', customClass: { popup: 'rounded-3xl' } });
          navigate('/admin/guru');
        } catch (error) {
          Swal.fire('Gagal', 'Terjadi kesalahan saat menghapus data.', 'error');
        }
      }
    });
  };

  if (!detail && !isLoading) return <AdminLayout><div className="p-8 text-center animate-pulse text-slate-500 font-medium">Data guru tidak ditemukan.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/guru')} className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 border border-slate-100 text-slate-500 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail Tenaga Pendidik</h1>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
           <button onClick={handleSoftDelete} className="flex-1 sm:flex-none px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition-all">
              Hapus Data
           </button>
           <Link to={`/admin/guru/update/${id}`} className="flex-1 sm:flex-none px-8 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-center">
              Edit Profil
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        
        {/* Kolom Kiri: Profil Guru */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-3xl p-8">
            <div className="w-32 h-32 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-[2rem] flex items-center justify-center shadow-lg text-white text-5xl font-black mb-6 mx-auto">
              {detail?.nama?.charAt(0)}
            </div>
            <h2 className="text-2xl font-black text-slate-800 text-center mb-6">{detail?.nama}</h2>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">NIP Pegawai</p>
                <p className="text-lg font-bold text-slate-700">{detail?.nip}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Jenis Kelamin</p>
                <p className="text-lg font-bold text-slate-700">{detail?.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</p>
              </div>

              {/* INDIKATOR STATUS TUGAS (BARU) */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col items-start">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status Tugas</p>
                <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm ${
                    detail?.jenis_guru === 'Guru Kelas' 
                    ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                    : 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                }`}>
                    {detail?.jenis_guru || 'Guru Mapel'}
                </span>
              </div>
              
              {/* Indikator Wali Kelas Aktual */}
              <div className={`p-4 rounded-2xl border ${tugas.wali_kelas ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${tugas.wali_kelas ? 'text-emerald-500' : 'text-slate-400'}`}>Jabatan Wali Kelas</p>
                <p className={`text-lg font-bold ${tugas.wali_kelas ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {tugas.wali_kelas ? `Kelas ${tugas.wali_kelas}` : 'Tidak Menjabat'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Jadwal Mengajar */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-3xl overflow-hidden h-full">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Jadwal Mengajar</h3>
              <span className="px-3 py-1 bg-white text-emerald-600 text-xs font-bold rounded-lg border border-emerald-100 shadow-sm">
                {tugas.jadwal.length} Sesi Terjadwal
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-50">
                    <th className="px-8 py-4 font-bold">Hari & Waktu</th>
                    <th className="px-8 py-4 font-bold">Kelas</th>
                    <th className="px-8 py-4 font-bold">Mata Pelajaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr><td colSpan="3" className="px-8 py-10 text-center text-slate-300 animate-pulse">Memuat jadwal guru...</td></tr>
                  ) : tugas.jadwal.length === 0 ? (
                    <tr><td colSpan="3" className="px-8 py-12 text-center text-slate-400">Guru ini belum memiliki jadwal mengajar.</td></tr>
                  ) : (
                    tugas.jadwal.map((j) => (
                      <tr key={j.id} className="hover:bg-emerald-50/30 transition-colors group">
                        <td className="px-8 py-4">
                          <p className="text-sm font-bold text-slate-700">{j.hari}</p>
                          <p className="text-xs text-slate-500">{j.jam_mulai} - {j.jam_selesai}</p>
                        </td>
                        <td className="px-8 py-4 text-sm font-bold text-emerald-600">
                           <span className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100">{j.nama_kelas}</span>
                        </td>
                        <td className="px-8 py-4 text-sm font-medium text-slate-600">{j.nama_pelajaran}</td>
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