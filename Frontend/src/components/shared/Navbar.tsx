import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import GovtEmblem from './GovtEmblem';
import { LogOut, Building2, BadgeCheck } from 'lucide-react';

export default function Navbar() {
  const { user, role, logout, isGovt } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-[var(--color-primary)] text-white shadow-md z-10 flex-shrink-0">
      <div className="px-6 py-3 flex justify-between items-center">
        <Link to={isGovt ? '/govt/dashboard' : '/startup/dashboard'} className="flex items-center space-x-3">
          <GovtEmblem width={32} height={40} className="opacity-90" />
          <div>
            <h1 className="text-lg font-bold tracking-wide">SAHYOG</h1>
            <p className="text-[10px] text-[var(--color-saffron)] font-semibold uppercase tracking-wider">
              {isGovt ? 'Govt Officer Portal' : 'Startup Partner Portal'}
            </p>
          </div>
        </Link>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded">
            {isGovt
              ? <Building2 size={16} className="text-[var(--color-saffron)]" />
              : <BadgeCheck size={16} className="text-[var(--color-india-green)]" />
            }
            <span className="font-medium text-white/90 max-w-[180px] truncate">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 hover:text-red-300 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
