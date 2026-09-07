
type BadgeVariant = 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray' | 'cyan';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  blue:   'bg-blue-50 text-blue-700 border-blue-200',
  green:  'bg-green-50 text-green-700 border-green-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  red:    'bg-red-50 text-red-700 border-red-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  gray:   'bg-gray-50 text-gray-600 border-gray-200',
  cyan:   'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const dotStyles: Record<BadgeVariant, string> = {
  blue: 'bg-blue-500', green: 'bg-green-500', orange: 'bg-orange-500',
  red: 'bg-red-500', purple: 'bg-purple-500', gray: 'bg-gray-400', cyan: 'bg-cyan-500',
};

export default function Badge({ children, variant = 'gray', dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-0.5
        text-xs font-semibold border rounded-full
        ${variantStyles[variant]} ${className}
      `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[variant]}`} />}
      {children}
    </span>
  );
}
