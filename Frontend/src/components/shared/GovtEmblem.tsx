interface GovtEmblemProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Stylised SVG representation of the Emblem of India (Lion Capital of Ashoka).
 * Used on official government portals (NIC standard).
 */
export default function GovtEmblem({ width = 48, height = 56, className = '' }: GovtEmblemProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 120"
      width={width}
      height={height}
      className={className}
      aria-label="Emblem of India"
      role="img"
    >
      {/* ── THREE LIONS (Front two + suggestion of third) ── */}
      {/* Left Lion body */}
      <ellipse cx="32" cy="28" rx="11" ry="9" fill="#8B6914" />
      <circle cx="32" cy="20" r="7" fill="#A07820" />
      {/* Left Lion mane */}
      <circle cx="32" cy="20" r="9" fill="none" stroke="#6B4F0F" strokeWidth="3" opacity="0.6" />
      {/* Left Lion face */}
      <ellipse cx="32" cy="18" rx="4" ry="5" fill="#C49A28" />
      <circle cx="30" cy="17" r="1" fill="#3D2B00" />
      <circle cx="34" cy="17" r="1" fill="#3D2B00" />
      <path d="M30 21 Q32 23 34 21" stroke="#3D2B00" strokeWidth="0.8" fill="none" />

      {/* Right Lion body */}
      <ellipse cx="68" cy="28" rx="11" ry="9" fill="#8B6914" />
      <circle cx="68" cy="20" r="7" fill="#A07820" />
      {/* Right Lion mane */}
      <circle cx="68" cy="20" r="9" fill="none" stroke="#6B4F0F" strokeWidth="3" opacity="0.6" />
      {/* Right Lion face */}
      <ellipse cx="68" cy="18" rx="4" ry="5" fill="#C49A28" />
      <circle cx="66" cy="17" r="1" fill="#3D2B00" />
      <circle cx="70" cy="17" r="1" fill="#3D2B00" />
      <path d="M66 21 Q68 23 70 21" stroke="#3D2B00" strokeWidth="0.8" fill="none" />

      {/* Center Lion (front-facing, slightly larger) */}
      <ellipse cx="50" cy="26" rx="12" ry="10" fill="#9B7718" />
      <circle cx="50" cy="17" r="8" fill="#B8891C" />
      {/* Mane */}
      <circle cx="50" cy="17" r="11" fill="none" stroke="#6B4F0F" strokeWidth="3.5" opacity="0.5" />
      <ellipse cx="50" cy="15" rx="5" ry="6" fill="#D4A82A" />
      <circle cx="47" cy="14" r="1.2" fill="#2C1E00" />
      <circle cx="53" cy="14" r="1.2" fill="#2C1E00" />
      <ellipse cx="50" cy="18" rx="1.5" ry="1" fill="#A0522D" />
      <path d="M47 20 Q50 22.5 53 20" stroke="#2C1E00" strokeWidth="1" fill="none" />

      {/* ── ABACUS / DRUM ── */}
      <rect x="14" y="36" width="72" height="14" rx="3" fill="#C49A28" />
      <rect x="14" y="36" width="72" height="2" rx="1" fill="#A07820" />
      <rect x="14" y="48" width="72" height="2" rx="1" fill="#A07820" />

      {/* Ashoka Chakra (Wheel) – center of abacus */}
      <circle cx="50" cy="43" r="5.5" fill="none" stroke="#003366" strokeWidth="1.2" />
      <circle cx="50" cy="43" r="1.2" fill="#003366" />
      {/* 24 spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + 1.2 * Math.cos(rad);
        const y1 = 43 + 1.2 * Math.sin(rad);
        const x2 = 50 + 5.5 * Math.cos(rad);
        const y2 = 43 + 5.5 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#003366" strokeWidth="0.5" />;
      })}

      {/* Bull silhouette (left of chakra) */}
      <ellipse cx="28" cy="43" rx="7" ry="4" fill="#7A5C10" />
      <circle cx="23" cy="40" r="3.5" fill="#8B6914" />
      <line x1="23" y1="46" x2="21" y2="50" stroke="#7A5C10" strokeWidth="1.5" />
      <line x1="26" y1="47" x2="25" y2="51" stroke="#7A5C10" strokeWidth="1.5" />
      <line x1="30" y1="47" x2="31" y2="51" stroke="#7A5C10" strokeWidth="1.5" />

      {/* Horse silhouette (right of chakra) */}
      <ellipse cx="72" cy="43" rx="7" ry="4" fill="#7A5C10" />
      <circle cx="77" cy="40" r="3.5" fill="#8B6914" />
      {/* Horse mane */}
      <path d="M77 37 Q79 36 78 40" stroke="#5C3D08" strokeWidth="1" fill="none" />
      <line x1="70" y1="47" x2="69" y2="51" stroke="#7A5C10" strokeWidth="1.5" />
      <line x1="74" y1="47" x2="73" y2="51" stroke="#7A5C10" strokeWidth="1.5" />
      <line x1="77" y1="46" x2="78" y2="51" stroke="#7A5C10" strokeWidth="1.5" />

      {/* ── BASE PLATFORM ── */}
      <rect x="14" y="50" width="72" height="5" rx="2" fill="#A07820" />
      <rect x="10" y="55" width="80" height="4" rx="2" fill="#8B6914" />

      {/* ── SATYAMEVA JAYATE ── */}
      <text
        x="50"
        y="70"
        textAnchor="middle"
        fontFamily="serif"
        fontSize="6.5"
        fontWeight="bold"
        fill="#003366"
        letterSpacing="0.5"
      >
        SATYAMEVA JAYATE
      </text>

      {/* Devanagari-style decorative underline */}
      <line x1="18" y1="72" x2="82" y2="72" stroke="#C49A28" strokeWidth="0.8" />
    </svg>
  );
}
