import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { ShieldAlert, CheckCircle, FileText, Loader2, Star, Send, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProposalsForChallenge, evaluateProposal } from '../../services/proposalService';

interface BlindEvalPanelProps {
  challengeId: string;
}

interface ProposalForEval {
  _id: string;
  submissionRefNumber: string;
  envelope_a_technical: {
    piiRedactedText?: string;
    startup_pitch?: string;
    claimed_trl?: number;
    piiReviewPending?: boolean;
  };
  verified_trl_score?: number;
  status: string;
  juryScoreCard?: {
    totalScore: number;
    evaluatedAt: string;
  };
}

export default function BlindEvalPanel({ challengeId }: BlindEvalPanelProps) {
  const [proposals, setProposals] = useState<ProposalForEval[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  
  // Scoring state
  const [innovation, setInnovation] = useState(0);
  const [feasibility, setFeasibility] = useState(0);
  const [scalability, setScalability] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!challengeId) return;
    loadProposals();
  }, [challengeId]);

  const loadProposals = async () => {
    setLoading(true);
    try {
      const data = await getProposalsForChallenge(challengeId);
      const list = Array.isArray(data) ? data : (data as any)?.proposals || data;
      setProposals(list as ProposalForEval[]);
      setSelectedIdx(null);
    } catch (error) {
      toast.error('Failed to load proposals for this challenge.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitScore = async () => {
    if (selectedIdx === null) return;
    const proposal = proposals[selectedIdx];
    
    if (innovation + feasibility + scalability === 0) {
      toast.error('Please provide scores before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      await evaluateProposal(proposal._id, {
        innovation,
        feasibility,
        scalability,
        m1Days: 30,
        m2Days: 60,
        m3Days: 90,
      });
      toast.success(`Proposal ${proposal.submissionRefNumber} scored successfully!`);
      setInnovation(0);
      setFeasibility(0);
      setScalability(0);
      loadProposals(); // Refresh
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit evaluation.');
    } finally {
      setSubmitting(false);
    }
  };

  const selected = selectedIdx !== null ? proposals[selectedIdx] : null;
  const redactedText = selected?.envelope_a_technical?.piiRedactedText || selected?.envelope_a_technical?.startup_pitch || 'No proposal text available.';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3 mb-2">
          <ShieldAlert className="text-[var(--color-primary)]" size={24} />
          <h3 className="text-lg font-bold text-gray-900">QCBS Double-Blind Evaluation</h3>
        </div>
        <p className="text-sm text-gray-600">
          Proposals are PII-redacted by AI. Startup identities are masked to ensure fair compliance with GFR Rule 194.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 size={24} className="animate-spin mr-3" /> Loading proposals...
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-400">
          <FileText size={40} className="mx-auto mb-3" />
          <p className="font-semibold">No proposals submitted yet</p>
          <p className="text-sm">Proposals will appear here once startups submit them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Proposal List */}
          <div className="lg:col-span-1 space-y-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              {proposals.length} Proposals
            </p>
            {proposals.map((p, idx) => (
              <button
                key={p._id}
                onClick={() => { setSelectedIdx(idx); setInnovation(0); setFeasibility(0); setScalability(0); }}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  selectedIdx === idx
                    ? 'bg-blue-50 border-blue-400 shadow-sm'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{p.submissionRefNumber || `Proposal #${idx + 1}`}</p>
                    <p className="text-xs text-gray-400 mt-1">TRL-{p.verified_trl_score || p.envelope_a_technical?.claimed_trl || '?'} • {p.status}</p>
                  </div>
                  {p.juryScoreCard ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <CheckCircle size={12} /> Scored
                    </span>
                  ) : (
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Right: Selected Proposal Detail + Scoring */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                {/* Redacted Proposal Text */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <EyeOff size={16} className="text-red-500" />
                    <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      PII-Redacted Technical Proposal
                    </h4>
                    {selected.envelope_a_technical?.piiReviewPending && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Fallback Redaction</span>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                      {redactedText}
                    </pre>
                  </div>
                </div>

                {/* Scoring Inputs */}
                {selected.juryScoreCard ? (
                  <div className="p-6 bg-green-50">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle size={20} />
                      <span className="font-bold">Already Evaluated — Score: {selected.juryScoreCard.totalScore}/70</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" /> Technical Scoring (out of 70)
                    </h4>
                    
                    {[
                      { label: 'Innovation (0-25)', value: innovation, setter: setInnovation, max: 25, color: 'blue' },
                      { label: 'Feasibility (0-25)', value: feasibility, setter: setFeasibility, max: 25, color: 'green' },
                      { label: 'Scalability (0-20)', value: scalability, setter: setScalability, max: 20, color: 'purple' },
                    ].map(({ label, value, setter, max, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{label}</span>
                          <span className={`font-bold text-${color}-600`}>{value}</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={max}
                          value={value}
                          onChange={(e) => setter(Number(e.target.value))}
                          className={`w-full accent-${color}-500 cursor-pointer`}
                        />
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <p className="text-lg font-black text-gray-900">
                        Total: <span className="text-[var(--color-primary)]">{innovation + feasibility + scalability}</span>/70
                      </p>
                      <Button
                        onClick={handleSubmitScore}
                        disabled={submitting}
                        variant="primary"
                        className="flex items-center gap-2"
                      >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        {submitting ? 'Submitting...' : 'Submit Evaluation'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center text-gray-400">
                <Eye size={40} className="mx-auto mb-3" />
                <p className="font-semibold">Select a proposal to review</p>
                <p className="text-sm">Click on a proposal from the left panel to view its redacted content.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
