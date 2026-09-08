import { useState } from 'react';
import { KeyRound, ShieldCheck, Loader2 } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      // Stub for actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage("We've sent you the updated instructions shortly.");
      toast.success("Password reset instructions sent.");
      setEmail('');
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4 z-10 relative mt-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full border-2 border-[#1a365d] flex items-center justify-center mb-4 text-[#1a365d]">
            <KeyRound size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-sm text-gray-500 text-center">
            we'll send you the updated instruction shortly
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a365d] focus:border-[#1a365d] outline-none transition-colors"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1a365d] hover:bg-[#122643] text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <ShieldCheck size={20} />
                Send reset password link
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-xs text-gray-400">
            Protected by Aadhaar & NIC Security Protocols
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
