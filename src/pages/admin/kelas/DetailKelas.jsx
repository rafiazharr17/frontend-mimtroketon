import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api } from '../../../service/api';
import AdminLayout from '../../../layouts/AdminLayout';

export default function DetailKelas() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [listSiswa, setListSiswa] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetailData = async () => {
      try {
        const resKelas = await api.get('/admin/kelas');
        const kls = resKelas.data.find(k => k.id.toString() === id);
        setDetail(kls);

        const resSiswa = await api.get(`/admin/kelas/${id}/siswa`);
        setListSiswa(resSiswa.data);
      } catch (error) {
        console.error("Gagal memuat data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetailData();
  }, [id]);

  const handleSoftDelete = () => {
    Swal.fire({
      title: 'Hapus Kelas?',
      text: "Data kelas ini akan dipindahkan ke Recycle Bin.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      customClass: { popup: 'rounded-3xl shadow-xl' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/admin/kelas/soft/${id}`);
          Swal.fire('Terhapus!', 'Kelas berhasil dipindahkan ke tempat sampah.', 'success');
          navigate('/admin/kelas');
        } catch (error) {
          Swal.fire('Gagal', 'Terjadi kesalahan.', 'error');
        }
      }
    });
  };

  if (!detail && !isLoading) return <AdminLayout><div className="p-8 text-center text-slate-500 font-medium">Data kelas tidak ditemukan.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/kelas')} className="p-2.5 bg-white rounded-xl shadow-sm hover:bg-slate-50 border border-slate-100 text-slate-500 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Detail Rombongan Belajar</h1>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
           <button onClick={handleSoftDelete} className="flex-1 sm:flex-none px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 hover:bg-red-100 transition-all">
              Hapus Kelas
           </button>
           <Link to={`/admin/kelas/update/${id}`} className="flex-1 sm:flex-none px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-center">
              Edit Kelas
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
        
        {/* Kolom Kiri: Informasi Kelas */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-3xl p-8">
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg text-white text-4xl font-black mb-6 mx-auto">
              {detail?.nama_kelas?.charAt(0) || '?'}
            </div>
            <h2 className="text-2xl font-black text-slate-800 text-center mb-6">{detail?.nama_kelas}</h2>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Wali Kelas</p>
                <p className="text-lg font-bold text-slate-700">{detail?.wali_kelas || 'Belum Ditentukan'}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Siswa</p>
                <p className="text-lg font-bold text-indigo-600">{listSiswa.length} Siswa Terdaftar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Daftar Siswa di Kelas Tersebut */}
        <div className="lg:col-span-2">
          <div className="bg-white/80 backdrop-blur-xl border border-white shadow-xl rounded-3xl overflow-hidden h-full">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">Daftar Siswa di Kelas Ini</h3>
              <span className="px-3 py-1 bg-white text-slate-500 text-xs font-bold rounded-lg border border-slate-200">
                {listSiswa.length} Orang
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-widest border-b border-slate-50">
                    <th className="px-8 py-4 font-bold">NIS</th>
                    <th className="px-8 py-4 font-bold">Nama Lengkap</th>
                    <th className="px-8 py-4 font-bold">L/P</th>
                    <th className="px-8 py-4 font-bold text-center">Profil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-300 animate-pulse">Memuat daftar siswa...</td></tr>
                  ) : listSiswa.length === 0 ? (
                    <tr><td colSpan="4" className="px-8 py-12 text-center text-slate-400">Belum ada siswa yang dimasukkan ke kelas ini.</td></tr>
                  ) : (
                    listSiswa.map((s) => (
                      <tr key={s.id} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-8 py-4 text-sm font-medium text-slate-500">{s.nis}</td>
                        <td className="px-8 py-4 text-sm font-bold text-slate-700">{s.nama}</td>
                        <td className="px-8 py-4 text-sm text-slate-500">{s.jenis_kelamin}</td>
                        <td className="px-8 py-4 text-center">
                          <Link to={`/admin/siswa/detail/${s.id}`} className="text-indigo-600 hover:text-indigo-800 font-bold text-xs uppercase tracking-wider">
                            Detail
                          </Link>
                        </td>
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