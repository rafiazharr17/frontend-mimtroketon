import { Link, useLocation } from 'react-router-dom';

export default function SidebarGuru({ isSidebarOpen, setIsSidebarOpen, handleLogout }) {
  const location = useLocation();
  
  const menus = [
    { name: 'Dashboard Guru', path: '/guru', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Kelola Nilai', path: '/guru/nilai', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { name: 'Jadwal Mengajar', path: '/guru/jadwal', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  return (
    <>
      {/* Overlay Mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-all" onClick={() => setIsSidebarOpen(false)}></div>}

      <aside className={`fixed inset-y-0 left-0 bg-[#0f172a] text-slate-300 w-72 flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* HEADER BRANDING: MI MUHAMMADIYAH TROKETON (Sama dengan Admin) */}
        <div className="flex items-center justify-center h-28 border-b border-slate-800 bg-slate-900/50 px-6">
          <div className="flex items-center gap-4 w-full">
            {/* Logo diperbesar (w-16) tanpa background container sesuai request terakhir */}
            <div className="w-16 h-16 shrink-0 flex items-center justify-center">
              <img 
                src="/logo-sekolah.png" 
                alt="Logo MI Muhammadiyah Troketon" 
                className="w-full h-full object-contain drop-shadow-md"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            
            <div className="flex flex-col">
              <h1 className="text-lg font-extrabold tracking-wide text-white leading-tight">MIM TROKETON</h1>
              <span className="text-xs text-emerald-400 font-bold tracking-widest uppercase mt-0.5">Portal Guru</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Main Menu</p>
          {menus.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <Link key={menu.name} to={menu.path} onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center w-full px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25' : 'hover:bg-slate-800 hover:text-white'
                }`}>
                <svg className={`w-5 h-5 mr-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menu.icon}></path></svg>
                <span className="font-medium tracking-wide">{menu.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT SECTION */}
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