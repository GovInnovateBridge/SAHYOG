
interface ProgressProps {
  value: number;       // 0–100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'orange' | 'red';
  size?: 'sm' | 'md';
}

const colorStyles = {
  blue:   'bg-blue-600',
  green:  'bg-[var(--color-india-green)]',
  orange: 'bg-[var(--color-saffron)]',
  red:    'bg-red-500',
};

export default function Progress({
  value,
  max = 100,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md',
}: ProgressProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs font-medium text-gray-600">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-bold text-gray-700">{Math.round(percent)}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}>
        <div
          className={`${colorStyles[color]} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
