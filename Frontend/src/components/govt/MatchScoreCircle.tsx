
interface MatchScoreCircleProps {
  score: number; // 0–1 (e.g. 0.92 = 92%)
  size?: number;
}

export default function MatchScoreCircle({ score, size = 72 }: MatchScoreCircleProps) {
  const percent = Math.round(score * 100);
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Color logic from the Frontend PPT
  let strokeColor = '#DC2626'; // red
  let textColor = 'text-red-600';
  if (percent >= 85) {
    strokeColor = '#138808'; // India Green
    textColor = 'text-green-700';
  } else if (percent >= 70) {
    strokeColor = '#FF9933'; // Saffron
    textColor = 'text-orange-600';
  }

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox="0 0 64 64">
        {/* Background ring */}
        <circle cx="32" cy="32" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="6" />
        {/* Score ring */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 32 32)"
          className="transition-all duration-700 ease-out"
        />
        {/* Percentage text */}
        <text
          x="32"
          y="36"
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill={strokeColor}
          fontFamily="Inter, sans-serif"
        >
          {percent}%
        </text>
      </svg>
      <span className={`text-xs font-semibold mt-1 ${textColor}`}>Match</span>
    </div>
  );
}
