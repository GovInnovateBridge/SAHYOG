import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth = useAuthStore((s) => s.setAuth);
  const logout = useAuthStore((s) => s.logout);

  const role = user?.role; // <--- Extract role here
  const isGovt = user?.role === 'NODAL_OFFICER';
  const isStartup = user?.role === 'STARTUP_FOUNDER';
  const isViewer = user?.role === 'VIEWER';

  return { user, role, token, isAuthenticated, setAuth, logout, isGovt, isStartup, isViewer };
};