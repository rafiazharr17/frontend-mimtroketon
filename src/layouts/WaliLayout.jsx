import { useNavigate } from 'react-router-dom';
import NavbarWali from '../components/NavbarWali';

export default function WaliLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans flex flex-col overflow-x-hidden">
      
      {/* NAVBAR */}
      <NavbarWali handleLogout={handleLogout} />
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 z-10">
        <div className="w-full animate-fade-in-up">
          {children}
        </div>
      </main>

    </div>
  );
}