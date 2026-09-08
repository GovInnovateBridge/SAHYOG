import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
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

      const { token } = await loginAPI({ email, password });
      localStorage.setItem('sahyog_token', token);
      const user = await getMeAPI();

      if (user.role !== role) {
        localStorage.removeItem('sahyog_token');
        const roleError = `Access Denied: You are not registered as a ${role.replace('_', ' ')}.`;
        setError(roleError);
        toast.error(roleError);
        setLoading(false);
        return;
      }

      setAuth(user, token);
      toast.success('Successfully logged in!');

      if (user.role === 'NODAL_OFFICER') {
        navigate('/govt/dashboard', { replace: true });
      } else if (user.role === 'STARTUP_FOUNDER') {
        navigate('/startup/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      const message = err?.response?.data?.message ?? 'Login failed. Please check your credentials.';
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
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 z-10 relative mt-8">
        
        {/* Developer Bypass Buttons */}
        <div className="mb-6 pb-6 border-b border-red-100 flex flex-col gap-2">
          <p className="text-[10px] text-red-500 font-bold uppercase text-center mb-1">Developer Testing Bypass</p>
          <div className="flex gap-2">
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              className="w-full text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              onClick={async () => {
                try {
                  const { token } = await loginAPI({ email: 'rajesh.patil@gov.in', password: 'Password@123' });
                  localStorage.setItem('sahyog_token', token);
                  const user = await getMeAPI();
                  setAuth(user, token);
                  navigate('/govt/dashboard', { replace: true });
                } catch (e) {
                  toast.error('Govt Bypass failed. Did you run seed.js?');
                }
              }}
            >
              Bypass (Govt)
            </Button>
            <Button 
              type="button"
              variant="outline" 
              size="sm" 
              className="w-full text-xs bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              onClick={async () => {
                try {
                  const { token } = await loginAPI({ email: 'founder1@startup.com', password: 'Password@123' });
                  localStorage.setItem('sahyog_token', token);
                  const user = await getMeAPI();
                  setAuth(user, token);
                  navigate('/startup/dashboard', { replace: true });
                } catch (e) {
                  toast.error('Startup Bypass failed. Did you run seed.js?');
                }
              }}
            >
              Bypass (Startup)
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5">
              Registered Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="name@gov.in or founder@startup.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-[#1a365d] outline-none transition-colors"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-[#1a365d] outline-none transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Select Your Role
            </label>
            <select
              value={role}
              onChange={(e) => { setRole(e.target.value as UserRole); setError(''); }}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-[#1a365d] outline-none transition-colors bg-white text-gray-900"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a365d] hover:bg-[#122643] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <ShieldCheck size={20} />
            {loading ? 'Signing in...' : 'Secure Login'}
          </button>

          {/* Forgot Password Link */}
          <div className="flex justify-end mt-1">
            <Link to="/forgot-password" className="text-xs text-[#1a365d] hover:underline font-medium">
              Forgot Password?
            </Link>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              No account yet? <Link to="/register" className="text-[#1a365d] font-semibold hover:underline">Register here</Link>
            </p>
          </div>

          {/* Divider 1 */}
          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-400">
              Protected by Aadhaar & NIC Security Protocols
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>


        </form>
      </div>
    </AuthLayout>
  );
}
