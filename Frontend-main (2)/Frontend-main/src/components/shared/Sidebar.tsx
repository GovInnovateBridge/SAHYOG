import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, FileText, FileSearch, Landmark,
  Rocket, Target, CheckCircle, FileUp,
} from 'lucide-react';

import { ShieldAlert, HelpCircle } from 'lucide-react';

const govtLinks = [
  { label: 'Dashboard', to: '/govt/dashboard', icon: LayoutDashboard },
  { label: 'Post Challenge', to: '/govt/post-challenge', icon: FileText },
  { label: 'Startup Matches', to: '/govt/matches', icon: FileSearch },
  { label: 'Blind Evaluation', to: '/govt/blind-eval', icon: ShieldAlert },
  { label: 'Smart Escrow', to: '/govt/escrow', icon: Landmark },
];

const startupLinks = [
  { label: 'Dashboard', to: '/startup/dashboard', icon: Rocket },
  { label: 'Matched Challenges', to: '/startup/challenges', icon: Target },
  { label: 'TRL Assessment', to: '/startup/trl-quiz', icon: HelpCircle },
  { label: 'Active Sandboxes', to: '/startup/pilots', icon: CheckCircle },
  { label: 'Upload Milestones', to: '/startup/milestones', icon: FileUp },
];

export default function Sidebar() {
  const { isGovt } = useAuth();
  const links = isGovt ? govtLinks : startupLinks;

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
      <nav className="p-4 space-y-1">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-3">
          {isGovt ? 'Management' : 'Opportunities'}
        </div>

        {links.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded border-l-4 transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-blue-50 text-[var(--color-primary)] border-[var(--color-primary)]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent'
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
