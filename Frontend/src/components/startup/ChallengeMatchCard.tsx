import type { Match } from '../../types/Match';
import MatchScoreCircle from '../govt/MatchScoreCircle';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { ExternalLink } from 'lucide-react';

interface ChallengeMatchCardProps {
  match: Match;
  onApply?: (matchId: string) => void;
}

const statusVariants: Record<string, 'blue' | 'green' | 'orange' | 'gray'> = {
  INVITED: 'blue',
  APPLIED: 'green',
  PENDING: 'orange',
  REJECTED: 'gray',
};

export default function ChallengeMatchCard({ match, onApply }: ChallengeMatchCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
      {/* Match Score Circle */}
      <div className="flex-shrink-0">
        <MatchScoreCircle score={match.score || 0} size={68} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-sm truncate">{match.startupName}</h3>
          <Badge variant={statusVariants[match.status || ''] || 'gray'} dot>
            {match.status}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="font-semibold text-[var(--color-primary)]">TRL {match.trlLevel}</span>
          <span>Â·</span>
          <span>Cosine Score: {((match.score || 0) * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* Action */}
      {match.status === 'INVITED' && onApply && (
        <Button
          variant="primary"
          size="sm"
          onClick={() => onApply(match._id || '')}
          className="flex-shrink-0"
        >
          Apply <ExternalLink size={14} className="ml-1" />
        </Button>
      )}
      {match.status === 'APPLIED' && (
        <span className="text-xs font-bold text-green-600 flex-shrink-0">Proposal Submitted âœ“</span>
      )}
    </div>
  );
}


