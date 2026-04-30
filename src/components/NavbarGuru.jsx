import { useState, useEffect } from 'react';
import { api } from '../service/api';

export default function NavbarGuru({ setIsSidebarOpen }) {
  const [namaGuru, setNamaGuru] = useState('Memuat Data...');
  const [inisial, setInisial] = useState('G');

  useEffect(() => {
    const fetchProfilGuru = async () => {
      try {
        const response = await api.get('/guru/profil'); 
        
        const namaLengkap = response.data.nama;
        
        if (namaLengkap) {
          setNamaGuru(namaLengkap);
          setInisial(namaLengkap.charAt(0).toUpperCase());
        } else {
          setNamaGuru('Bapak/Ibu Guru');
          setInisial('G');
        }
      } catch (error) {
        console.error("Gagal memuat profil guru:", error);
        setNamaGuru('Bapak/Ibu Guru'); 
        setInisial('G');
      }
    };

    fetchProfilGuru();
  }, []);

  return (
    <header className="sticky top-0 flex items-center justify-between h-20 px-6 z-30 bg-white/70 backdrop-blur-lg border-b border-slate-200/50 shadow-sm transition-all">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 bg-emerald-50 text-emerald-600 rounded-xl lg:hidden hover:bg-emerald-100 transition focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <div className="hidden md:block text-xl font-bold text-slate-800 tracking-wide">
          Dashboard Akademik Guru
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-bold text-slate-800">{namaGuru}</p>
          <p className="text-xs text-emerald-600 font-black uppercase tracking-widest mt-0.5">Status: Aktif</p>
        </div>
      </div>
    </header>
  );
}