import { Lock, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import type { Escrow } from '../../types/Escrow';
import type { Milestone, MilestoneStatus, MilestoneCode } from '../../types/Milestone';
import Progress from '../ui/Progress';

interface EscrowTrackerProps {
  escrow: Escrow;
}

// Human-readable labels for each milestone code (backend only stores M1/M2/M3).
const MILESTONE_LABELS: Record<MilestoneCode, string> = {
  M1: 'Month 1: Initial Deployment & Setup',
  M2: 'Month 2: Field Trial & Uptime Verification',
  M3: 'Month 3: Final UAT & Performance Sign-off',
};

const statusConfig: Record<MilestoneStatus, { icon: React.ReactNode; label: string; color: string }> = {
  PENDING: {
    icon: <Lock size={20} className="text-gray-400" />,
    label: 'Locked',
    color: 'border-gray-200 bg-gray-50',
  },
  CLAIMED: {
    icon: <Clock size={20} className="text-orange-500" />,
    label: '3-Day Review',
    color: 'border-orange-300 bg-orange-50',
  },
  APPROVED: {
    icon: <CheckCircle2 size={20} className="text-blue-500" />,
    label: 'Approved',
    color: 'border-blue-300 bg-blue-50',
  },
  DEEMED_APPROVED: {
    icon: <CheckCircle2 size={20} className="text-blue-500" />,
    label: 'Deemed Approved',
    color: 'border-blue-300 bg-blue-50',
  },
  RELEASED: {
    icon: <CheckCircle2 size={20} className="text-[var(--color-india-green)]" />,
    label: 'Released',
    color: 'border-green-300 bg-green-50',
  },
  DISPUTED: {
    icon: <AlertTriangle size={20} className="text-red-500" />,
    label: 'Disputed',
    color: 'border-red-300 bg-red-50',
  },
};

function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export default function EscrowTracker({ escrow }: EscrowTrackerProps) {
  // Escrow has no totalAmountInr/releasedAmountInr — derive them from milestones.
  const totalAmount = escrow.milestones.reduce((sum, m) => sum + m.amount, 0);
  const releasedAmount = escrow.milestones
    .filter((m) => m.status === 'RELEASED')
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Smart Escrow Vault</h3>
          <p className="text-xs text-gray-500 mt-0.5">Milestone-based release via PFMS</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">{formatINR(totalAmount)}</p>
          <p className="text-xs text-gray-500">Total Pilot Budget</p>
        </div>
      </div>

      {/* Overall Progress */}
      <Progress
        value={releasedAmount}
        max={totalAmount}
        label={`Released: ${formatINR(releasedAmount)}`}
        color="green"
        size="md"
      />

      {/* Milestones Timeline */}
      <div className="mt-5 space-y-3">
        {escrow.milestones.map((milestone: Milestone) => {
          const config = statusConfig[milestone.status];
          const percentage = totalAmount > 0 ? Math.round((milestone.amount / totalAmount) * 100) : 0;

          return (
            <div
              key={milestone.code}
              className={`flex items-center space-x-4 p-3 rounded border ${config.color}`}
            >
              <div className="flex-shrink-0">{config.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{MILESTONE_LABELS[milestone.code]}</p>
                <p className="text-xs text-gray-500">
                  {milestone.code} · {percentage}% ·{' '}
                  <span className="font-medium">{formatINR(milestone.amount)}</span>
                </p>
              </div>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${milestone.status === 'RELEASED'
                    ? 'bg-green-100 text-green-700'
                    : milestone.status === 'CLAIMED'
                      ? 'bg-orange-100 text-orange-700'
                      : milestone.status === 'DISPUTED'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-500'
                  }`}
              >
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}