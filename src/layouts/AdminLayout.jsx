import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../components/SidebarAdmin';
import NavbarAdmin from '../components/NavbarAdmin';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-slate-50/50 font-sans overflow-hidden">
      <SidebarAdmin isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Decorative Blobs untuk kesan Futuristik */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <NavbarAdmin setIsSidebarOpen={setIsSidebarOpen} />
        
        {/* Area Render Konten */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 z-10">
          <div className="w-full animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}