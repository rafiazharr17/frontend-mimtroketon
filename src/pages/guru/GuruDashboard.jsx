import { useState, useEffect } from 'react';
import { api } from '../../service/api';
import GuruLayout from '../../layouts/GuruLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts';

export default function GuruDashboard() {
  const [jadwal, setJadwal] = useState([]);
  const [jadwalHariIni, setJadwalHariIni] = useState([]);
  const [stats, setStats] = useState({ totalSesi: 0, totalKelas: 0, totalMapel: 0 });
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const today = days[new Date().getDay()];

  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    const fetchGuruData = async () => {
      try {
        const response = await api.get('/guru/jadwal'); 
        
        const dataJadwal = response.data.jadwal || response.data || []; 
        setJadwal(dataJadwal);

        const hariIni = dataJadwal
            .filter(j => j.hari === today)
            .sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));
        setJadwalHariIni(hariIni);

        const uniqueKelas = new Set(dataJadwal.map(j => j.nama_kelas)).size;
        const uniqueMapel = new Set(dataJadwal.map(j => j.nama_pelajaran)).size;
        
        setStats({
            totalSesi: dataJadwal.length,
            totalKelas: uniqueKelas,
            totalMapel: uniqueMapel
        });

        const workdays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const weeklyLoad = workdays.map(day => ({
            name: day.substring(0, 3), 
            sesi: dataJadwal.filter(j => j.hari === day).length
        }));
        setChartData(weeklyLoad);

      } catch (error) {
        console.error("Gagal mengambil data jadwal:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuruData();
  }, [today]);

  return (
    <GuruLayout>
      <div className="space-y-8">
        
        {/* BANNER SELAMAT DATANG */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 p-10 sm:p-12 rounded-[3rem] shadow-2xl shadow-emerald-600/20 text-white border border-emerald-500/30">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <h2 className="text-4xl font-black mb-2 tracking-tight">Selamat Datang, Pahlawan Pendidikan!</h2>
                <p className="text-emerald-50 text-base font-medium opacity-90 max-w-2xl leading-relaxed">
                Portal akademik Anda siap digunakan. Kelola nilai siswa dan pantau jadwal mengajar Anda dengan sistem yang terintegrasi secara real-time.
                </p>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 text-center shrink-0 shadow-inner">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-1">Hari Ini</p>
                <p className="text-2xl font-bold tracking-wide">{today}</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-40 w-40 h-40 bg-teal-300 opacity-20 rounded-full blur-2xl"></div>
        </div>

        {/* KARTU STATISTIK CEPAT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white flex items-center space-x-5 hover:-translate-y-1 transition-all duration-300">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Sesi Mengajar</p>
              {isLoading ? <div className="h-8 bg-slate-100 animate-pulse rounded w-16"></div> : <p className="text-4xl font-black text-slate-800">{stats.totalSesi}</p>}
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white flex items-center space-x-5 hover:-translate-y-1 transition-all duration-300">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Kelas Diampu</p>
              {isLoading ? <div className="h-8 bg-slate-100 animate-pulse rounded w-16"></div> : <p className="text-4xl font-black text-slate-800">{stats.totalKelas}</p>}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-white flex items-center space-x-5 hover:-translate-y-1 transition-all duration-300">
            <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shadow-inner">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Mata Pelajaran</p>
              {isLoading ? <div className="h-8 bg-slate-100 animate-pulse rounded w-16"></div> : <p className="text-4xl font-black text-slate-800">{stats.totalMapel}</p>}
            </div>
          </div>
        </div>

        {/* BAGIAN KONTEN UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* TIMELINE JADWAL HARI INI */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-white flex flex-col">
                <div className="flex justify-between items-end mb-8 border-b border-slate-50 pb-4">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                        <span className="w-3 h-8 bg-emerald-500 rounded-full"></span>
                        Jadwal Hari Ini
                    </h3>
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full uppercase tracking-widest">
                        {jadwalHariIni.length} Sesi
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse"></div>)}
                        </div>
                    ) : jadwalHariIni.length > 0 ? (
                        <div className="space-y-4">
                            {jadwalHariIni.map((j, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="flex flex-col items-end pt-1 shrink-0 w-16">
                                        <span className="text-sm font-black text-slate-700">{j.jam_mulai.substring(0,5)}</span>
                                        <span className="text-[10px] font-bold text-slate-400">{j.jam_selesai.substring(0,5)}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-3.5 h-3.5 bg-emerald-200 group-hover:bg-emerald-500 rounded-full transition-colors border-2 border-white shadow-sm mt-1.5"></div>
                                        {idx !== jadwalHariIni.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-1"></div>}
                                    </div>
                                    <div className="bg-slate-50 group-hover:bg-emerald-50 border border-slate-100 group-hover:border-emerald-100 p-5 rounded-[1.5rem] flex-1 transition-all mb-2 shadow-sm">
                                        <h4 className="text-lg font-bold text-slate-800 group-hover:text-emerald-800">{j.nama_pelajaran}</h4>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
                                            <span className="text-sm font-bold text-emerald-600 tracking-wide">Kelas {j.nama_kelas}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60 py-10">
                            <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <p className="text-base font-bold text-center">Yeay! Tidak ada jadwal mengajar<br/>untuk Anda hari ini.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* GRAFIK BEBAN MENGAJAR MINGGUAN */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 border border-white flex flex-col">
                <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                    <span className="w-2.5 h-7 bg-blue-500 rounded-full"></span>
                    Distribusi Mengajar Mingguan
                </h3>
                <div style={{ width: '100%', height: 350 }}>
                    {isLoading ? (
                        <div className="w-full h-full bg-slate-50 rounded-[2rem] animate-pulse"></div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 30, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 13, fontWeight: 'bold', fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#94a3b8' }} allowDecimals={false} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.05)', fontWeight: 'bold' }} />
                                <Bar dataKey="sesi" radius={[10, 10, 10, 10]} barSize={45}>
                                    {/* Warnai setiap batang dengan palet warna yang berbeda */}
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                    ))}
                                    <LabelList dataKey="sesi" position="top" style={{ fill: '#334155', fontSize: '16px', fontWeight: '900' }} offset={12} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
                <p className="text-sm text-center text-slate-400 font-bold italic mt-6 tracking-wide">Total sesi mengajar dari Senin hingga Sabtu.</p>
            </div>

        </div>
      </div>
    </GuruLayout>
  );
}