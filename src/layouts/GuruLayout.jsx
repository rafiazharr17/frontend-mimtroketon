import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarGuru from '../components/SidebarGuru';
import NavbarGuru from '../components/NavbarGuru';

export default function GuruLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans overflow-hidden">
      <SidebarGuru isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <NavbarGuru setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* PERBAIKAN: Mengganti max-w-7xl menjadi w-full agar layout full width */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8 z-10">
          <div className="w-full animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}