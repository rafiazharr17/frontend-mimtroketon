import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../service/api'; 
import WaliLayout from '../../layouts/WaliLayout'; 

export default function DashboardWali() {
  const [dashboardData, setDashboardData] = useState({ ppdb: [], siswa: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/wali/dashboard-data')
      .then(res => setDashboardData(res.data))
      .catch(err => console.error("Gagal memuat data dashboard:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <WaliLayout>
      <div className="w-full space-y-6">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden border border-blue-800">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">Halo, Selamat Datang!</h1>
              <p className="text-blue-100 font-medium max-w-2xl text-sm sm:text-base leading-relaxed">
                Pantau perkembangan akademik anak Anda dan kelola pendaftaran PPDB dengan mudah melalui portal interaktif ini.
              </p>
            </div>
            {/* Info Tanggal Cepat */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl hidden md:block text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Hari Ini</p>
              <p className="text-xl font-bold">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>
        </div>

        {/* ALERT PENGUMUMAN */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">Pengumuman Akademik</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">Belum ada pengumuman nilai terbaru dari guru untuk anak Anda hari ini.</p>
          </div>
        </div>

        {/* GRID KARTU (FULL WIDTH RESPONSIF) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* KARTU 1: DATA ANAK */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 sm:p-8 border-b border-slate-50 flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
               </div>
               <h2 className="text-2xl font-black text-slate-800">Data Anak Anda</h2>
            </div>
            
            <div className="p-6 sm:p-8 flex-1 bg-slate-50/30">
              {isLoading ? (
                <div className="animate-pulse flex flex-col items-center justify-center h-full text-slate-400 space-y-4 py-8">
                  <div className="w-14 h-14 bg-slate-200 rounded-full"></div>
                  <div className="h-5 bg-slate-200 rounded w-40"></div>
                </div>
              ) : dashboardData.siswa.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.siswa.map((anak, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:border-blue-200 transition-colors group">
                      <div className="w-16 h-16 bg-gradient-to-tr from-blue-700 to-blue-400 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
                        {anak.nama.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">{anak.nama}</h4>
                        <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                           <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">NIS: {anak.nis}</span>
                           <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">{anak.nama_kelas || 'Belum Masuk Kelas'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 opacity-60">
                  <svg className="w-20 h-20 text-slate-300 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  <p className="text-slate-500 font-bold text-base">Belum ada data anak berstatus siswa aktif.</p>
                </div>
              )}
            </div>
          </div>

          {/* KARTU 2: STATUS PPDB (Aksen Kuning Emas/Yellow) */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-6 sm:p-8 border-b border-slate-50 flex justify-between items-center">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center shrink-0 border border-yellow-100">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                 </div>
                 <h2 className="text-2xl font-black text-slate-800">Status PPDB</h2>
               </div>
               <Link to="/wali/ppdb" className="text-[11px] font-black text-yellow-700 hover:text-white bg-yellow-100 hover:bg-yellow-500 px-4 py-2.5 rounded-xl transition-all uppercase tracking-widest">
                  + Daftar Baru
               </Link>
            </div>

            <div className="p-6 sm:p-8 flex-1 bg-slate-50/30">
              {isLoading ? (
                 <div className="animate-pulse flex flex-col items-center justify-center h-full text-slate-400 space-y-4 py-8">
                    <div className="w-14 h-14 bg-slate-200 rounded-full"></div>
                    <div className="h-5 bg-slate-200 rounded w-40"></div>
                 </div>
              ) : dashboardData.ppdb.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.ppdb.map((p, index) => (
                    <div key={index} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col xl:flex-row justify-between xl:items-center gap-5 hover:border-yellow-200 transition-colors">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{p.no_pendaftaran}</p>
                        <h4 className="font-bold text-slate-800 text-lg leading-tight">{p.nama_lengkap}</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-1.5 flex items-center gap-1.5">
                           <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                           Didaftar: {new Date(p.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <span className={`inline-block w-full text-center px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border ${
                          p.status === 'Diterima' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm shadow-emerald-100' :
                          p.status === 'Ditolak' ? 'bg-red-50 text-red-600 border-red-200' :
                          'bg-amber-50 text-amber-600 border-amber-200 shadow-sm shadow-amber-100'
                        }`}>
                          {p.status === 'Menunggu' ? 'Sedang Diproses' : p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center py-12 opacity-60">
                  <svg className="w-20 h-20 text-slate-300 mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p className="text-slate-500 font-bold text-base">Belum ada riwayat pendaftaran PPDB.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </WaliLayout>
  );
}