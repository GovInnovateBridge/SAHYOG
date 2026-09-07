import { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import GovtEmblem from '../../components/shared/GovtEmblem';
import Button from '../../components/ui/Button';
import { verifyOTPAPI, getMeAPI } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';

export default function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const setAuth = useAuthStore((s) => s.setAuth);

    // Email is passed via navigate state from Register page
    const email: string = (location.state as { email?: string })?.email ?? '';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) return; // only single digits
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);
        setError('');

        // Auto-advance focus
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            inputRefs.current[5]?.focus();
        }
        e.preventDefault();
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits of your OTP.');
            return;
        }
        if (!email) {
            setError('Session expired. Please register again.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { token } = await verifyOTPAPI({ email, otp: otpString });

            // Token received — fetch the full user profile, then set auth state
            localStorage.setItem('sahyog_token', token);
            const user = await getMeAPI();
            setAuth(user, token);

            // Redirect based on role
            if (user.role === 'NODAL_OFFICER') {
                navigate('/govt/dashboard', { replace: true });
            } else if (user.role === 'STARTUP_FOUNDER') {
                navigate('/startup/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        } catch (err: any) {
            console.error('Verification error:', err);
            const message =
                err?.response?.data?.message ??
                err?.response?.data?.error ??
                err?.message ??
                'Invalid or expired OTP. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-center py-12 px-4 relative">

            <div className="absolute top-0 left-0 w-full bg-[var(--color-primary)] text-white text-sm py-2 px-6 flex justify-between items-center">
                <span className="font-semibold tracking-wide">SAHYOG PORTAL</span>
                <Link to="/register" className="flex items-center text-white/80 hover:text-white transition-colors text-xs">
                    <ArrowLeft size={14} className="mr-1" /> Back to Register
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md mt-10">
                <div className="flex flex-col items-center mb-6">
                    <GovtEmblem width={52} height={64} />
                    <ShieldCheck size={32} className="text-[var(--color-india-green)] mt-3" />
                    <h2 className="mt-2 text-2xl font-bold text-gray-900">Verify Your Email</h2>
                    <p className="text-sm text-gray-500 mt-1 text-center">
                        We sent a 6-digit OTP to <strong className="text-gray-700">{email || 'your email'}</strong>.
                        <br />It expires in <strong>10 minutes</strong>.
                    </p>
                </div>

                <div className="bg-white shadow-md rounded-lg border-t-4 border-[var(--color-india-green)] p-6">

                    {/* 6-box OTP input */}
                    <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => { inputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className={`
                  w-11 h-14 text-center text-xl font-bold border-2 rounded-md
                  focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]
                  text-gray-900 bg-white transition-colors
                  ${error ? 'border-red-400' : 'border-gray-300'}
                  ${digit ? 'border-[var(--color-primary)] bg-blue-50' : ''}
                `}
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-700 text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-md px-3 py-2 text-xs text-green-700 text-center">
                            {success}
                        </div>
                    )}

                    <Button
                        onClick={handleVerify}
                        variant="primary"
                        size="lg"
                        loading={loading}
                        className="w-full"
                    >
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                    </Button>

                    <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-500">
                        <RefreshCw size={12} />
                        <span>Didn&apos;t receive it? Check spam, or</span>
                        <Link to="/register" className="text-[var(--color-primary)] font-semibold hover:underline">
                            register again
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}