import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export default function Textarea({ label, error, hint, className = '', id, rows = 4, ...props }: TextareaProps) {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={textareaId} className="block text-sm font-semibold text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                rows={rows}
                className={`
          block w-full px-3 py-2 border rounded-md shadow-sm text-gray-900 text-sm
          placeholder:text-gray-400 bg-white resize-none
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