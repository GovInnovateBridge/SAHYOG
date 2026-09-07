import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import GovtEmblem from '../../components/shared/GovtEmblem';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { loginAPI, getMeAPI } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../types/User';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!role) {
        setError('Please select your role.');
        toast.error('Please select your role.');
        setLoading(false);
        return;
      }

      // Step 1: Get JWT token
      const { token } = await loginAPI({ email, password });

      // Step 2: Set token in localStorage (api.ts interceptor picks it up)
      localStorage.setItem('sahyog_token', token);

      // Step 3: Fetch the full user profile using the token
      const user = await getMeAPI();

      // Step 4: Validate role matches
      if (user.role !== role) {
        localStorage.removeItem('sahyog_token');
        const roleError = `Access Denied: You are not registered as a ${role.replace('_', ' ')}.`;
        setError(roleError);
        toast.error(roleError);
        setLoading(false);
        return;
      }

      // Step 5: Store in Zustand
      setAuth(user, token);
      toast.success('Successfully logged in!');

      // Step 6: Redirect based on actual role from backend
      if (user.role === 'NODAL_OFFICER') {
        navigate('/govt/dashboard', { replace: true });
      } else if (user.role === 'STARTUP_FOUNDER') {
        navigate('/startup/dashboard', { replace: true });
      } else {
        // VIEWER
        navigate('/', { replace: true });
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login failed. Please check your credentials.';

      // Specific guidance for unverified email
      if (message.toLowerCase().includes('not verified')) {
        setError('Your email is not verified. Please check your inbox for the OTP, or register again.');
        toast.error('Your email is not verified. Please check your inbox.');
      } else {
        setError(message);
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative">

      <div className="absolute top-0 left-0 w-full bg-[var(--color-primary)] text-white text-sm py-2 px-6 flex justify-between items-center shadow">
        <span className="font-semibold">SAHYOG PORTAL</span>
        <Link to="/" className="flex items-center text-white/80 hover:text-white transition-colors text-xs">
          <ArrowLeft size={14} className="mr-1" /> Return to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md mt-10">
        <div className="flex flex-col items-center mb-6">
          <GovtEmblem width={56} height={68} />
          <h2 className="mt-3 text-2xl font-bold text-gray-900 tracking-tight">Portal Authentication</h2>
          <p className="text-sm text-gray-500 mt-1">
            Authorized personnel and registered startups only
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-md border-t-4 border-[var(--color-primary)] rounded-b-lg sm:px-10">
          
          {/* Developer Bypass Buttons */}
          <div className="mb-6 pb-6 border-b border-red-100 flex flex-col gap-2">
            <p className="text-[10px] text-red-500 font-bold uppercase text-center mb-1">Developer Testing Bypass</p>
            <div className="flex gap-2">
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                className="w-full text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                onClick={() => {
                  setAuth({ _id: 'gov_mock', email: 'officer@gov.in', role: 'NODAL_OFFICER', name: 'Mock Officer', profile: null }, 'mock_token');
                  navigate('/govt/dashboard', { replace: true });
                }}
              >
                Bypass (Govt)
              </Button>
              <Button 
                type="button"
                variant="outline" 
                size="sm" 
                className="w-full text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                onClick={() => {
                  setAuth({ _id: 'startup_mock', email: 'founder@startup.com', role: 'STARTUP_FOUNDER', name: 'Mock Founder', profile: null }, 'mock_token');
                  navigate('/startup/dashboard', { replace: true });
                }}
              >
                Bypass (Startup)
              </Button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            <Input
              label="Registered Email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="name@gov.in or founder@startup.com"
              autoComplete="email"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                autoComplete="current-password"
                required
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select Your Role
              </label>
              <select
                value={role}
                onChange={(e) => { setRole(e.target.value as UserRole); setError(''); }}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] sm:text-sm bg-white text-gray-900"
              >
                <option value="" disabled>Select Role</option>
                <option value="NODAL_OFFICER">Nodal Officer (Govt)</option>
                <option value="STARTUP_FOUNDER">Startup Founder</option>
                <option value="VIEWER">Public Viewer</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-700">
                {error}
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                <Shield size={16} className="mr-2 opacity-80" />
                {loading ? 'Signing in...' : 'Secure Login'}
              </Button>
            </div>

            <p className="text-center text-sm text-gray-500">
              No account yet?{' '}
              <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
                Register here
              </Link>
            </p>

            <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-200">
              Protected by Aadhaar &amp; NIC Security Protocols
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}




