import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export default function Input({ label, error, hint, className = '', id, ...props }: InputProps) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`
          block w-full px-3 py-2 border rounded-md shadow-sm text-gray-900 text-sm
          placeholder:text-gray-400 bg-white
          focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${error ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-gray-300'}
          ${className}
        `}
                {...props}
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
    );
}