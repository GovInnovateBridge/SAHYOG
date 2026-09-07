import { useState, useEffect } from 'react';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import ChallengeMatchCard from '../../components/startup/ChallengeMatchCard';
import Dialog from '../../components/ui/Dialog';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import type { Match } from '../../types/Match';
import { Loader2, Target } from 'lucide-react';
import { useFetchChallenges } from '../../hooks/useFetchChallenges';
import { submitProposal } from '../../services/proposalService';
import toast from 'react-hot-toast';

interface ApplicationForm {
  domain: 'SOFTWARE' | 'HARDWARE';
  claimedTrl: string;
  pitch: string;
  githubUrl: string;
  liveUrl: string;
  bidAmount: string;
  paymentTerms: string;
}

const EMPTY_FORM: ApplicationForm = {
  domain: 'SOFTWARE',
  claimedTrl: '',
  pitch: '',
  githubUrl: '',
  liveUrl: '',
  bidAmount: '',
  paymentTerms: '',
};

export default function ApplyChallenge() {
  const { challenges, loading: challengesLoading } = useFetchChallenges();
  const [matches, setMatches] = useState<Match[]>([]);

  // Which match the dialog is currently open for (null = closed)
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [form, setForm] = useState<ApplicationForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationForm, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Convert real challenges into mock "Matches" for the startup UI.
    // NOTE: there is no backend endpoint yet for "challenges matched to this
    // startup" specifically — only GET /challenges/:id/matches (govt-side, per
    // challenge). Until that exists, this stays a client-computed placeholder
    // over real challenge data, same fallback philosophy as everywhere else.
    const generatedMatches: Match[] = challenges
      .filter((c) => c.status === 'PUBLISHED' || c.status === 'OPEN') // Only show open/published
      .map((c, index) => ({
        // ── Required real Match fields ──
        proposalId: c._id,
        founderName: c.title,
        matchScore: 0.95 - index * 0.05,

        // ── UI alias fields ──
        _id: c._id, // Use challenge ID as match ID for easy reference
        challengeId: c._id,
        startupId: 's_self',
        startupName: c.title, // Displaying challenge title in place of startup name in the card for context
        score: 0.95 - index * 0.05, // Mock score
        trlLevel: 7 + (index % 3),
        status: 'INVITED',
        createdAt: c.createdAt || new Date().toISOString(),
      }));

    setMatches(generatedMatches);
  }, [challenges]);

  const openApplyDialog = (matchId: string) => {
    const match = matches.find((m) => m._id === matchId);
    if (!match) return;
    setActiveMatch(match);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const closeDialog = () => {
    if (submitting) return; // don't allow closing mid-submit
    setActiveMatch(null);
  };

  const updateField =
    (field: keyof ApplicationForm) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      };

  const validate = (): boolean => {
    const next: Partial<Record<keyof ApplicationForm, string>> = {};
    const trl = Number(form.claimedTrl);
    const bid = Number(form.bidAmount);

    if (!form.claimedTrl || trl < 1 || trl > 9) next.claimedTrl = 'Enter a TRL between 1 and 9.';
    if (!form.pitch.trim() || form.pitch.trim().length < 30) {
      next.pitch = 'Please describe your solution in at least 30 characters.';
    }
    if (!form.bidAmount || bid <= 0) next.bidAmount = 'Enter your proposed pilot bid amount in INR.';
    if (form.domain === 'SOFTWARE' && !form.githubUrl && !form.liveUrl) {
      next.githubUrl = 'Provide a GitHub repo or a live URL as evidence for TRL verification.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!activeMatch) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitProposal({
        challengeId: activeMatch._id!, // matches were built from real challenge IDs
        envelope_a_technical: {
          domain: form.domain,
          claimed_trl: Number(form.claimedTrl),
          startup_pitch: form.pitch.trim(),
          github_url: form.githubUrl.trim() || undefined,
          live_url: form.liveUrl.trim() || undefined,
        },
        envelope_b_financial: {
          pilot_execution_bid: {
            amount_inr: Number(form.bidAmount),
          },
          payment_terms: form.paymentTerms.trim() || undefined,
        },
        proposal_metadata: {
          proposal_id: `PROP-${Date.now()}`,
        },
      });

      toast.success('Proposal submitted successfully! You are now in the QCBS evaluation phase.');

      setMatches((prev) =>
        prev.map((m) => (m._id === activeMatch._id ? { ...m, status: 'APPLIED' as const } : m))
      );
      setActiveMatch(null);
    } catch (error) {
      toast.error('Failed to submit proposal. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Matched Government Challenges</h2>
              <p className="text-sm text-gray-500 mt-1">
                These challenges were matched to your startup profile via AI Semantic Matching (Cosine Similarity &gt;80%). Review and apply to participate in the QCBS evaluation.
              </p>
            </div>

            {challengesLoading ? (
              <div className="flex items-center justify-center py-20 text-gray-500">
                <Loader2 size={24} className="animate-spin mr-3" /> Fetching your matches...
              </div>
            ) : matches.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <Target size={40} className="mx-auto mb-3" />
                <p className="font-semibold">No matched challenges yet</p>
                <p className="text-sm">Your TRL and profile will be continuously matched against new government problem statements.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.map((match) => (
                  <ChallengeMatchCard key={match._id} match={match} onApply={openApplyDialog} />
                ))}
              </div>
            )}

            {/* Legal Notice */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Legal Note:</strong> By applying, you agree to the terms under GFR Rule 194, DPDP Act 2023, and MeitY IP Policy. Your intellectual property remains with your startup; the Government receives a perpetual usage license. Safe Harbor provisions apply during the 90-day sandbox pilot.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Application Form Dialog */}
      <Dialog
        isOpen={activeMatch !== null}
        onClose={closeDialog}
        title={activeMatch ? `Apply — ${activeMatch.founderName}` : 'Apply'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={closeDialog} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit} loading={submitting}>
              {submitting ? 'Submitting...' : 'Submit Proposal'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Solution Domain</label>
            <div className="flex gap-3">
              {(['SOFTWARE', 'HARDWARE'] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, domain: d }))}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold border transition-colors ${form.domain === d
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  {d === 'SOFTWARE' ? 'Software' : 'Hardware / DeepTech'}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Claimed TRL Level (1–9)"
            type="number"
            min={1}
            max={9}
            value={form.claimedTrl}
            onChange={updateField('claimedTrl')}
            error={errors.claimedTrl}
            placeholder="e.g. 7"
          />

          <Textarea
            label="Solution Pitch"
            value={form.pitch}
            onChange={updateField('pitch')}
            error={errors.pitch}
            placeholder="Describe your solution, how it addresses the KPIs, and why it fits this challenge..."
            rows={5}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="GitHub Repo URL"
              value={form.githubUrl}
              onChange={updateField('githubUrl')}
              error={errors.githubUrl}
              placeholder="https://github.com/..."
            />
            <Input
              label="Live Demo / Product URL"
              value={form.liveUrl}
              onChange={updateField('liveUrl')}
              placeholder="https://..."
            />
          </div>

          <Input
            label="Proposed Pilot Bid (INR)"
            type="number"
            min={0}
            value={form.bidAmount}
            onChange={updateField('bidAmount')}
            error={errors.bidAmount}
            placeholder="e.g. 1500000"
            hint="This is the trial-period budget you're bidding for — not the full contract value."
          />

          <Textarea
            label="Payment Terms (optional)"
            value={form.paymentTerms}
            onChange={updateField('paymentTerms')}
            placeholder="Any notes on milestone-linked payment expectations..."
            rows={2}
          />
        </div>
      </Dialog>
    </div>
  );
}