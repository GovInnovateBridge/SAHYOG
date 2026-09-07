import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Rocket, Eye, EyeOff } from 'lucide-react';
import GovtEmblem from '../../components/shared/GovtEmblem';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { registerAPI } from '../../services/authService';
import type { UserRole } from '../../types/User';

type RoleTab = 'STARTUP_FOUNDER' | 'NODAL_OFFICER' | 'VIEWER';

interface FormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    organization: string;
    dpiitNumber: string;
}

const INITIAL_FORM: FormState = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    dpiitNumber: '',
};

export default function Register() {
    const navigate = useNavigate();
    const [role, setRole] = useState<RoleTab>('STARTUP_FOUNDER');
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<Partial<FormState>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
        setApiError('');
    };

    const validate = (): boolean => {
        const newErrors: Partial<FormState> = {};

        if (!form.name.trim()) newErrors.name = 'Full name is required.';
        if (!form.email.trim()) {
            newErrors.email = 'Email is required.';
        } else if (role === 'NODAL_OFFICER') {
            if (!form.email.endsWith('@gov.in') && !form.email.endsWith('@nic.in')) {
                newErrors.email = 'Government officers must use a @gov.in or @nic.in email.';
            }
        }
        if (!form.password) {
            newErrors.password = 'Password is required.';
        } else if (form.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters.';
        }
        if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }
        if (role === 'STARTUP_FOUNDER') {
            if (!form.organization.trim()) newErrors.organization = 'Company name is required.';
            if (!form.dpiitNumber.trim()) newErrors.dpiitNumber = 'DPIIT number is required.';
        }
        if (role === 'NODAL_OFFICER') {
            if (!form.organization.trim()) newErrors.organization = 'Department name is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        setApiError('');

        try {
            await registerAPI({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                role: role as UserRole,
                ...(role !== 'VIEWER' && { organization: form.organization.trim() }),
                ...(role === 'STARTUP_FOUNDER' && { dpiitNumber: form.dpiitNumber.trim() }),
            });

            // Registration succeeded — OTP sent. Navigate to verify page with email in state.
            navigate('/verify-email', { state: { email: form.email.trim() } });
        } catch (err: any) {
            console.error('Registration error:', err);
            const message =
                err?.response?.data?.message ??
                err?.response?.data?.error ??
                err?.message ??
                'Registration failed. Please try again.';
            setApiError(message);
        } finally {
            setLoading(false);
        }
    };

    const roleTabs: { value: RoleTab; label: string; icon: React.ReactNode }[] = [
        { value: 'STARTUP_FOUNDER', label: 'Startup Founder', icon: <Rocket size={15} /> },
        { value: 'NODAL_OFFICER', label: 'Nodal Officer', icon: <Building2 size={15} /> },
        { value: 'VIEWER', label: 'Viewer', icon: <Eye size={15} /> },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg)] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative">

            {/* Top portal banner */}
            <div className="absolute top-0 left-0 w-full bg-[var(--color-primary)] text-white text-sm py-2 px-6 flex justify-between items-center">
                <span className="font-semibold tracking-wide">SAHYOG PORTAL</span>
                <Link to="/" className="flex items-center text-white/80 hover:text-white transition-colors text-xs">
                    <ArrowLeft size={14} className="mr-1" /> Return to Home
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-lg mt-10">
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <GovtEmblem width={52} height={64} />
                    <h2 className="mt-3 text-2xl font-bold text-gray-900 tracking-tight">Create Your Account</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Already registered?{' '}
                        <Link to="/login" className="text-[var(--color-primary)] font-semibold hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>

                <div className="bg-white shadow-md rounded-lg border-t-4 border-[var(--color-primary)]">

                    {/* Role Tabs */}
                    <div className="flex border-b border-gray-200">
                        {roleTabs.map((tab) => (
                            <button
                                key={tab.value}
                                type="button"
                                onClick={() => { setRole(tab.value); setErrors({}); setApiError(''); }}
                                className={`
                  flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors
                  ${role === tab.value
                                        ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] bg-blue-50/50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }
                `}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">

                        {/* Role hint */}
                        {role === 'NODAL_OFFICER' && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2 text-xs text-blue-800">
                                Government officers must register with an official <strong>@gov.in</strong> or <strong>@nic.in</strong> email address.
                            </div>
                        )}
                        {role === 'VIEWER' && (
                            <div className="bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs text-gray-600">
                                Viewers can browse public challenges and track procurement decisions. No department or DPIIT number needed.
                            </div>
                        )}

                        {/* Full Name */}
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="e.g. Amit Sharma"
                            value={form.name}
                            onChange={update('name')}
                            error={errors.name}
                            autoComplete="name"
                        />

                        {/* Email */}
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder={role === 'NODAL_OFFICER' ? 'name@gov.in or name@nic.in' : 'name@example.com'}
                            value={form.email}
                            onChange={update('email')}
                            error={errors.email}
                            autoComplete="email"
                        />

                        {/* Dynamic fields based on role */}
                        {role === 'NODAL_OFFICER' && (
                            <Input
                                label="Department / Ministry Name"
                                type="text"
                                placeholder="e.g. Ministry of Defence"
                                value={form.organization}
                                onChange={update('organization')}
                                error={errors.organization}
                            />
                        )}

                        {role === 'STARTUP_FOUNDER' && (
                            <>
                                <Input
                                    label="Company Name"
                                    type="text"
                                    placeholder="e.g. AI Solutions Pvt Ltd"
                                    value={form.organization}
                                    onChange={update('organization')}
                                    error={errors.organization}
                                />
                                <Input
                                    label="DPIIT Recognition Number"
                                    type="text"
                                    placeholder="e.g. DPIIT123456"
                                    value={form.dpiitNumber}
                                    onChange={update('dpiitNumber')}
                                    error={errors.dpiitNumber}
                                    hint="Find this on your DPIIT Startup India registration certificate."
                                />
                            </>
                        )}

                        {/* Password */}
                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Minimum 8 characters"
                                value={form.password}
                                onChange={update('password')}
                                error={errors.password}
                                autoComplete="new-password"
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

                        {/* Confirm Password */}
                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Re-enter your password"
                            value={form.confirmPassword}
                            onChange={update('confirmPassword')}
                            error={errors.confirmPassword}
                            autoComplete="new-password"
                        />

                        {/* API error */}
                        {apiError && (
                            <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-700">
                                {apiError}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
                                {loading ? 'Creating Account...' : 'Register & Send OTP'}
                            </Button>
                        </div>

                        <p className="text-center text-xs text-gray-400 pt-2 border-t border-gray-100">
                            By registering, you agree to the Sahyog Platform Terms & the IT Act, 2000.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}