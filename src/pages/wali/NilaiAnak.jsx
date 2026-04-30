import { useState, useEffect, useMemo } from 'react';
import { api } from '../../service/api'; 
import WaliLayout from '../../layouts/WaliLayout'; 

export default function NilaiAnak() {
  const [dataNilai, setDataNilai] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSiswaId, setSelectedSiswaId] = useState('');
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('Ganjil');

  useEffect(() => {
    const fetchNilai = async () => {
      try {
        const response = await api.get('/wali/nilai');
        const data = response.data || [];
        setDataNilai(data);

        if (data.length > 0) {
          const uniqueSiswa = [...new Set(data.map(item => item.id_siswa))];
          const firstSiswa = uniqueSiswa[0].toString();
          setSelectedSiswaId(firstSiswa);
          
          const kelasAnak = data.filter(d => d.id_siswa.toString() === firstSiswa).map(d => d.nama_kelas);
          if (kelasAnak.length > 0) setSelectedKelas(kelasAnak[0]);
        }
      } catch (error) {
        console.error("Gagal mengambil data nilai:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNilai();
  }, []);

  const daftarAnak = useMemo(() => {
    const unique = [];
    const map = new Map();
    for (const item of dataNilai) {
      if (!map.has(item.id_siswa)) {
        map.set(item.id_siswa, true);
        unique.push({ id: item.id_siswa.toString(), nama: item.nama_siswa, nis: item.nis });
      }
    }
    return unique;
  }, [dataNilai]);

  const daftarKelas = useMemo(() => {
    if (!selectedSiswaId) return [];
    const riwayat = dataNilai.filter(item => item.id_siswa.toString() === selectedSiswaId);
    return [...new Set(riwayat.map(item => item.nama_kelas))].sort();
  }, [dataNilai, selectedSiswaId]);

  const handleSiswaChange = (e) => {
    const newSiswaId = e.target.value;
    setSelectedSiswaId(newSiswaId);
    
    const kelasBaru = dataNilai.filter(item => item.id_siswa.toString() === newSiswaId);
    const uniqueKelasBaru = [...new Set(kelasBaru.map(item => item.nama_kelas))];
    if (uniqueKelasBaru.length > 0) {
        setSelectedKelas(uniqueKelasBaru[0]);
    } else {
        setSelectedKelas('');
    }
  };

  const nilaiDitampilkan = useMemo(() => {
    return dataNilai.filter(
      item => 
        item.id_siswa.toString() === selectedSiswaId && 
        item.nama_kelas === selectedKelas && 
        item.semester === selectedSemester
    );
  }, [dataNilai, selectedSiswaId, selectedKelas, selectedSemester]);

  const rataRata = useMemo(() => {
    if (nilaiDitampilkan.length === 0) return 0;
    const total = nilaiDitampilkan.reduce((sum, item) => sum + parseFloat(item.nilai_akhir || 0), 0);
    return (total / nilaiDitampilkan.length).toFixed(1); 
  }, [nilaiDitampilkan]);

  const anakAktif = daftarAnak.find(a => a.id === selectedSiswaId);

  return (
    <WaliLayout>
      <div className="w-full">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">Rapor Akademik</h1>
          <p className="text-slate-500 mt-2 font-medium">Pantau hasil evaluasi dan riwayat belajar anak Anda.</p>
        </div>

        {/* PANEL FILTER CERDAS (Tema Biru & Emas) */}
        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 opacity-70"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Pilih Anak */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-800 uppercase tracking-widest ml-2">Pilih Data Anak</label>
              {isLoading ? (
                <div className="h-14 bg-slate-100 animate-pulse rounded-2xl w-full"></div>
              ) : (
                <div className="relative">
                  <select 
                    value={selectedSiswaId}
                    onChange={handleSiswaChange}
                    className="w-full h-14 pl-5 pr-10 bg-blue-50/50 border border-blue-100 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl appearance-none outline-none font-bold text-blue-900 cursor-pointer transition-all"
                  >
                    {daftarAnak.length === 0 && <option value="">Tidak ada data anak</option>}
                    {daftarAnak.map((anak) => (
                      <option key={anak.id} value={anak.id}>{anak.nama}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-blue-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Pilih Kelas (Riwayat) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-blue-800 uppercase tracking-widest ml-2">Riwayat Kelas</label>
              <div className="relative">
                <select 
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  disabled={daftarKelas.length === 0}
                  className="w-full h-14 pl-5 pr-10 bg-white border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 rounded-2xl appearance-none outline-none font-bold text-slate-700 cursor-pointer transition-all disabled:bg-slate-50 disabled:text-slate-400"
                >
                  {daftarKelas.length === 0 && <option value="">Belum ada nilai</option>}
                  {daftarKelas.map((kelas, idx) => (
                    <option key={idx} value={kelas}>Kelas {kelas}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* 3. Pilih Semester */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-amber-700 uppercase tracking-widest ml-2">Semester</label>
              <div className="relative">
                <select 
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="w-full h-14 pl-5 pr-10 bg-amber-50/50 border border-amber-100 focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 rounded-2xl appearance-none outline-none font-bold text-amber-900 cursor-pointer transition-all"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-amber-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KONTEN RAPOR */}
        {isLoading ? (
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
             <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
             <p className="text-slate-400 font-bold animate-pulse">Menarik data dari server...</p>
          </div>
        ) : !anakAktif ? (
          <div className="bg-white rounded-[2.5rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-5">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Data Akademik</h2>
            <p className="text-slate-500 text-sm max-w-md">Sistem belum menemukan data nilai untuk akun Anda. Pastikan wali kelas sudah mempublikasikan nilai.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            
            {/* IDENTITAS SISWA (BANNER NAVY) */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-8 sm:p-10 text-white relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
               
               <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                     <div className="w-16 h-16 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center font-black text-2xl shadow-inner text-amber-300">
                       {anakAktif.nama.charAt(0)}
                     </div>
                     <div>
                       <h2 className="text-2xl font-black mb-1">{anakAktif.nama}</h2>
                       <div className="flex items-center gap-3 text-sm font-semibold text-blue-200">
                          <span>NIS: {anakAktif.nis}</span>
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                          <span className="text-white">Kelas {selectedKelas || '-'}</span>
                       </div>
                     </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-2xl text-center min-w-[140px]">
                     <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Nilai Rata-Rata</p>
                     <p className="text-3xl font-black text-amber-400">{rataRata}</p>
                  </div>
               </div>
            </div>

            {/* TABEL NILAI */}
            <div className="p-6 sm:p-10">
              {nilaiDitampilkan.length === 0 ? (
                 <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h3 className="font-bold text-slate-700">Rapor Masih Kosong</h3>
                    <p className="text-sm text-slate-500 mt-1">Belum ada nilai yang dipublikasikan pada {selectedSemester} di kelas ini.</p>
                 </div>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr>
                        <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 w-16 text-center">No</th>
                        <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100">Mata Pelajaran</th>
                        <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-blue-600 border-b-2 border-slate-100 w-36 text-center bg-blue-50/50 rounded-tl-xl">Nilai Akhir</th>
                        <th className="py-4 px-6 text-xs font-black uppercase tracking-widest text-slate-400 border-b-2 border-slate-100 w-40 text-center">Predikat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nilaiDitampilkan.map((item, index) => {
                        const nilaiNum = parseFloat(item.nilai_akhir);
                        const isTuntas = nilaiNum >= 75;

                        return (
                          <tr key={index} className="group hover:bg-slate-50/70 transition-colors border-b border-slate-50 last:border-none">
                            <td className="py-5 px-6 text-sm font-bold text-slate-400 text-center">{index + 1}</td>
                            <td className="py-5 px-6 text-base font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{item.nama_pelajaran}</td>
                            
                            {/* Angka Nilai */}
                            <td className="py-5 px-6 text-center bg-blue-50/20 group-hover:bg-blue-50/50 transition-colors">
                              <span className="text-xl font-black text-slate-800">{nilaiNum}</span>
                            </td>
                            
                            {/* Status Kelulusan */}
                            <td className="py-5 px-6 text-center">
                               <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block w-full border shadow-sm ${
                                 isTuntas 
                                 ? 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-100' 
                                 : 'bg-rose-50 text-rose-600 border-rose-200 shadow-rose-100'
                               }`}>
                                 {isTuntas ? 'Tuntas' : 'Remedial'}
                               </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </WaliLayout>
  );
}