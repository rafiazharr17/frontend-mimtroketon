import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function SidebarAdmin({ isSidebarOpen, setIsSidebarOpen, handleLogout }) {
  const location = useLocation();
  
  const menuCategories = [
    {
      title: 'Menu Utama',
      items: [
        { name: 'Dashboard', path: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
      ]
    },
    {
      title: 'Data Master',
      items: [
        { name: 'Kelola Siswa', path: '/admin/siswa', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Kelola Guru', path: '/admin/guru', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { name: 'Kelola Kelas', path: '/admin/kelas', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { name: 'Sarana Prasarana', path: '/admin/fasilitas', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },

      ]
    },
    {
      title: 'Akademik & Kesiswaan',
      items: [
        { name: 'Mata Pelajaran', path: '/admin/mapel', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { name: 'Jadwal Pelajaran', path: '/admin/jadwal', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Kelola PPDB', path: '/admin/ppdb', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      ]
    },
    {
      title: 'Manajemen Sistem',
      items: [
        { name: 'Kelola Users', path: '/admin/users', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
      ]
    }
  ];

  // LOGIKA BARU: Cari Path yang Paling Cocok (Longest Match)
  const allPaths = menuCategories.flatMap(c => c.items.map(i => i.path));
  const activePath = allPaths.filter(p => location.pathname.startsWith(p)).sort((a, b) => b.length - a.length)[0];

  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    const activeStates = {};
    menuCategories.forEach((category, index) => {
      const hasActiveItem = category.items.some(item => 
        item.path === activePath && (item.path !== '/admin' || location.pathname === '/admin')
      );
      activeStates[index] = hasActiveItem;
    });
    setOpenDropdowns(activeStates);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, activePath]);

  const toggleDropdown = (index) => {
    setOpenDropdowns(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <>
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all" onClick={() => setIsSidebarOpen(false)}></div>}

      <aside className={`fixed inset-y-0 left-0 bg-[#0f172a] text-slate-300 w-72 flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* HEADER BRANDING */}
        <div className="flex items-center justify-center h-28 border-b border-slate-800 bg-slate-900/50 px-6">
          <div className="flex items-center gap-4 w-full">
            <div className="w-16 h-16 shrink-0 bg-white/5 rounded-2xl p-2 flex items-center justify-center shadow-lg border border-slate-700/50">
              <img 
                src="/logo-sekolah.png" 
                alt="Logo MI Muhammadiyah Troketon" 
                className="w-full h-full object-contain drop-shadow-md"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-lg font-extrabold tracking-wide text-white leading-tight">MIM TROKETON</h1>
              <span className="text-xs text-emerald-400 font-bold tracking-widest uppercase mt-0.5">Sistem Manajemen</span>
            </div>
          </div>
        </div>

        {/* AREA NAVIGASI DENGAN DROPDOWN KATEGORI */}
        <nav className="flex-1 px-4 py-6 space-y-4 overflow-y-auto custom-scrollbar">
          {menuCategories.map((category, catIndex) => {
            const isOpen = openDropdowns[catIndex];

            return (
              <div key={catIndex} className="space-y-1 text-slate-300">
                <button 
                  onClick={() => toggleDropdown(catIndex)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors rounded-lg hover:bg-slate-800/50 outline-none"
                >
                  <span>{category.title}</span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-emerald-400' : 'text-slate-500'}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pt-1' : 'max-h-0 opacity-0'}`}>
                  {category.items.map((menu) => {
                    const isActive = menu.path === activePath && (menu.path !== '/admin' || location.pathname === '/admin');
                    
                    return (
                      <Link 
                        key={menu.name} 
                        to={menu.path} 
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center w-full px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                          isActive 
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25' 
                            : 'hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <svg 
                          className={`w-5 h-5 mr-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menu.icon}></path>
                        </svg>
                        <span className="font-medium tracking-wide">{menu.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* LOGOUT FOOTER */}
        <div className="p-5 border-t border-slate-800 bg-[#0b1121]">
          <button onClick={handleLogout} className="flex items-center justify-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 border border-red-500/20 rounded-xl transition-all duration-300 group">
            <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span className="font-semibold tracking-wide">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}