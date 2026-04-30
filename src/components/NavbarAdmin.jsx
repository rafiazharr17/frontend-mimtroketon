export default function NavbarAdmin({ setIsSidebarOpen }) {
  return (
    <header className="sticky top-0 flex items-center justify-between h-20 px-6 z-30 bg-white/70 backdrop-blur-lg border-b border-slate-200/50 shadow-sm transition-all">
      <div className="flex items-center gap-4">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 bg-slate-100 text-slate-600 rounded-xl lg:hidden hover:bg-slate-200 transition focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <div className="hidden md:block text-xl font-bold text-slate-800 tracking-wide">
          Sistem Manajemen Sekolah
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-right">
          <p className="text-sm font-bold text-slate-800">Administrator</p>
          <p className="text-xs text-slate-500">Super Access</p>
        </div>
      </div>
    </header>
  );
}