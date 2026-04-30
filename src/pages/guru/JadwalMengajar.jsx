import { useState, useEffect } from 'react';
import { api } from '../../service/api';
import GuruLayout from '../../layouts/GuruLayout';

export default function JadwalMengajar() {
  const [jadwal, setJadwal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('Semua');
  const [currentTime, setCurrentTime] = useState(new Date());

  const daysMap = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const response = await api.get('/guru/jadwal');
        const data = response.data.jadwal || response.data || [];
        setJadwal(data);
      } catch (error) {
        console.error("Gagal mengambil jadwal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJadwal();
  }, []);

  const hitungDurasi = (start, end) => {
    if (!start || !end) return 0;
    const [h1, m1] = start.split(':').map(Number);
    const [h2, m2] = end.split(':').map(Number);
    return (h2 * 60 + m2) - (h1 * 60 + m1);
  };

  const cekStatusKelas = (hari, jamMulai, jamSelesai) => {
    const currentDayStr = daysMap[currentTime.getDay()];
    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    
    const [sH, sM] = jamMulai.split(':').map(Number);
    const [eH, eM] = jamSelesai.split(':').map(Number);
    const startMins = sH * 60 + sM;
    const endMins = eH * 60 + eM;

    if (hari === currentDayStr) {
      if (currentMins >= startMins && currentMins <= endMins) return 'Berlangsung';
      if (currentMins > endMins) return 'Selesai';
      return 'Segera';
    } 
    
    if (daysMap.indexOf(hari) < currentTime.getDay() && currentTime.getDay() !== 0) {
      return 'Selesai';
    }
    
    return 'Mendatang';
  };

  const groupJadwalByHari = () => {
    let filteredData = jadwal;
    if (activeDay !== 'Semua') {
      filteredData = jadwal.filter(j => j.hari === activeDay);
    }
    const grouped = {};
    days.forEach(day => {
      const jadwalHariIni = filteredData.filter(j => j.hari === day);
      if (jadwalHariIni.length > 0) {
        grouped[day] = jadwalHariIni.sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));
      }
    });
    return grouped;
  };

  const groupedJadwal = groupJadwalByHari();

  return (
    <GuruLayout>
      {/* HEADER MINIMALIS DENGAN SUMMARY */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Jadwal Mengajar</h1>
          <p className="text-base text-slate-500 mt-1">Agenda kelas Anda minggu ini.</p>
        </div>
        {!isLoading && (
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 w-fit">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Jadwal</span>
            <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">{jadwal.length} Sesi</span>
          </div>
        )}
      </div>

      {/* FILTER HARI */}
      <div className="mb-10 overflow-x-auto custom-scrollbar pb-2">
        <div className="flex gap-2 min-w-max bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit">
          <button 
            onClick={() => setActiveDay('Semua')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeDay === 'Semua' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Semua
          </button>
          {days.map(day => (
            <button 
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative ${activeDay === day ? 'bg-emerald-50 text-emerald-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {day}
              {/* Dot indikator jika hari ini */}
              {day === daysMap[currentTime.getDay()] && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* KONTEN JADWAL */}
      {isLoading ? (
        <div className="space-y-12">
          {[1, 2].map(section => (
            <div key={section}>
              <div className="h-6 bg-slate-200 rounded-lg w-32 mb-6 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {[1, 2, 3].map(item => (
                    <div key={item} className="h-32 bg-white rounded-[2rem] border border-slate-100 animate-pulse"></div>
                 ))}
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(groupedJadwal).length > 0 ? (
        <div className="space-y-10">
          {days.map(day => {
            if (!groupedJadwal[day]) return null;
            
            return (
              <div key={day}>
                <div className="flex items-center gap-3 mb-5">
                  <h2 className={`text-xl font-bold ${day === daysMap[currentTime.getDay()] ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {day}
                  </h2>
                  <div className="h-px flex-1 bg-slate-200/60"></div>
                  <span className="text-xs font-bold text-slate-400">{groupedJadwal[day].length} Sesi</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {groupedJadwal[day].map((item, index) => {
                    const status = cekStatusKelas(item.hari, item.jam_mulai, item.jam_selesai);
                    const durasi = hitungDurasi(item.jam_mulai, item.jam_selesai);
                    const isSelesai = status === 'Selesai';
                    
                    return (
                      <div 
                        key={index} 
                        className={`group bg-white p-6 rounded-[2rem] border border-slate-100 transition-all duration-300 flex flex-col 
                          ${isSelesai ? 'opacity-60 bg-slate-50/50' : 'hover:border-emerald-200 hover:shadow-md'}`}
                      >
                        <div className="flex gap-5 items-start">
                          {/* Kolom Waktu */}
                          <div className={`flex flex-col items-center justify-center p-3 rounded-2xl shrink-0 min-w-[75px] transition-colors
                            ${status === 'Berlangsung' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 
                              isSelesai ? 'bg-slate-200/50 text-slate-500' : 'bg-emerald-50/50 text-emerald-700'}`}>
                            <span className="text-lg font-bold">{item.jam_mulai.substring(0, 5)}</span>
                            <span className={`text-[11px] font-medium mt-0.5 ${status === 'Berlangsung' ? 'text-emerald-100' : 'opacity-70'}`}>
                              {item.jam_selesai.substring(0, 5)}
                            </span>
                          </div>

                          {/* Kolom Detail */}
                          <div className="flex-1 py-1 relative w-full">
                            <h3 className={`text-base font-bold mb-3 transition-colors pr-20 ${isSelesai ? 'text-slate-600' : 'text-slate-800 group-hover:text-emerald-700'}`}>
                              {item.nama_pelajaran}
                            </h3>
                            
                            {/* Indikator Status Absolut di Kanan Atas Konten */}
                            {status === 'Berlangsung' && (
                              <div className="absolute top-0 right-0 flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black px-2.5 py-1 rounded-lg border border-emerald-100">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                                ONGOING
                              </div>
                            )}
                            {isSelesai && (
                               <div className="absolute top-0 right-0 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-200">
                                 SELESAI
                               </div>
                            )}

                            <div className="flex flex-wrap items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <svg className={`w-4 h-4 ${isSelesai ? 'text-slate-400' : 'text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                <p className="text-sm font-semibold text-slate-600">{item.nama_kelas}</p>
                              </div>
                              
                              <div className="flex items-center gap-1.5">
                                 <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                 <p className="text-sm font-semibold text-slate-500">{durasi} Menit</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Jadwal Kosong</h2>
          <p className="text-slate-500 text-sm max-w-md">
            {activeDay === 'Semua' 
              ? "Belum ada jadwal yang ditugaskan untuk Anda." 
              : `Tidak ada jadwal mengajar di hari ${activeDay}.`}
          </p>
          {activeDay !== 'Semua' && (
             <button onClick={() => setActiveDay('Semua')} className="mt-6 px-6 py-2.5 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all text-xs">
                Tampilkan Semua Hari
             </button>
          )}
        </div>
      )}
    </GuruLayout>
  );
}