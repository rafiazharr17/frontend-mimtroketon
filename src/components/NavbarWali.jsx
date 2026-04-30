import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavbarWali({ handleLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const menus = [
    { name: 'Dashboard', path: '/wali' },
    { name: 'PPDB', path: '/wali/ppdb' },
    { name: 'Nilai Anak', path: '/wali/nilai' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
      {/* FULL WIDTH CONTAINER */}
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Sekolah & Judul */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Memanggil logo dari folder public */}
            <img 
              src="/logo-sekolah.png" 
              alt="Logo MIM Troketon" 
              className="w-12 h-12 object-contain drop-shadow-sm"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://via.placeholder.com/150?text=Logo"; 
              }}
            />
            <h1 className="text-xl md:text-2xl font-black tracking-widest text-slate-800">
              PORTAL<span className="text-blue-700">WALI</span>
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {menus.map(menu => {
              const isActive = location.pathname === menu.path;
              return (
                <Link 
                  key={menu.name} 
                  to={menu.path} 
                  className={`px-5 py-2.5 rounded-full font-bold transition-all text-sm uppercase tracking-wider ${
                    isActive ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  {menu.name}
                </Link>
              );
            })}
            <div className="h-8 w-px bg-slate-200 mx-2"></div>
            <button 
              onClick={handleLogout} 
              className="px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-full shadow-md shadow-rose-500/20 transition-all text-sm uppercase tracking-wider"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-slate-600 focus:outline-none bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 pt-4 pb-6 space-y-2 shadow-2xl absolute w-full">
          {menus.map(menu => {
             const isActive = location.pathname === menu.path;
             return (
               <Link 
                 key={menu.name} 
                 to={menu.path} 
                 onClick={() => setIsMenuOpen(false)} 
                 className={`block px-5 py-3.5 rounded-2xl font-bold uppercase tracking-wider text-sm ${
                   isActive ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'text-slate-600 hover:bg-slate-50'
                 }`}
               >
                 {menu.name}
               </Link>
             )
          })}
          <div className="h-px w-full bg-slate-100 my-4"></div>
          <button onClick={handleLogout} className="block w-full text-center px-5 py-3.5 bg-rose-50 text-rose-600 font-bold uppercase tracking-wider text-sm hover:bg-rose-100 rounded-2xl transition-colors">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}