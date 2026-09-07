import { AlertTriangle } from 'lucide-react';

interface TRLBadgeProps {
  level: number; // 1–9
  verified?: boolean;
  confidence?: number; // 0.0 to 1.0
  fraudDetected?: boolean;
}

function getTRLColor(level: number, fraudDetected?: boolean): string {
  if (fraudDetected) return 'bg-red-50 text-red-700 border-red-300';
  if (level >= 8) return 'bg-green-50 text-green-700 border-green-300';
  if (level >= 6) return 'bg-yellow-50 text-yellow-700 border-yellow-300';
  if (level >= 4) return 'bg-orange-50 text-orange-700 border-orange-300';
  return 'bg-red-50 text-red-700 border-red-300';
}

function getTRLLabel(level: number): string {
  if (level >= 9) return 'Commercially Deployed';
  if (level >= 8) return 'Field Tested';
  if (level >= 7) return 'Pilot Ready';
  if (level >= 5) return 'Lab Prototype';
  if (level >= 3) return 'Proof of Concept';
  return 'Research Stage';
}

export default function TRLBadge({ level, verified = false, confidence, fraudDetected = false }: TRLBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${getTRLColor(level, fraudDetected)}`}>
      {fraudDetected && <AlertTriangle size={12} className="text-red-500" />}
      <span>TRL {level}</span>
      <span className="text-current opacity-70">·</span>
      <span className="font-medium">{getTRLLabel(level)}</span>
      {verified && !fraudDetected && (
        <span className="ml-1 bg-green-100 text-green-700 rounded-full px-1.5 py-0.5 text-[10px]">
          ✓ Verified
        </span>
      )}
      {fraudDetected && (
        <span className="ml-1 bg-red-100 text-red-700 rounded-full px-1.5 py-0.5 text-[10px]">
          ⚠ Fraud
        </span>
      )}
      {confidence !== undefined && confidence > 0 && !fraudDetected && (
        <span className="ml-1 text-[10px] opacity-70">
          ({Math.round(confidence * 100)}%)
        </span>
      )}
    </div>
  );
}
