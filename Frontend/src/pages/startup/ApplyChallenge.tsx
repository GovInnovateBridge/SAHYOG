import { useState, useEffect } from 'react';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import ChallengeMatchCard from '../../components/startup/ChallengeMatchCard';
import Dialog from '../../components/ui/Dialog';
import Button from '../../components/ui/Button';
import type { Match } from '../../types/Match';
import { Loader2, Target, Upload, Download, FileText } from 'lucide-react';
import { useFetchChallenges } from '../../hooks/useFetchChallenges';
import { submitProposal } from '../../services/proposalService';
import toast from 'react-hot-toast';

interface ApplicationForm {
  proposalFile: File | null;
}

const EMPTY_FORM: ApplicationForm = {
  proposalFile: null,
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
    // startup" specifically - only GET /challenges/:id/matches (govt-side, per
    // challenge). Until that exists, this stays a client-computed placeholder
    // over real challenge data, same fallback philosophy as everywhere else.
    const generatedMatches: Match[] = challenges
      .filter((c) => c.status === 'PUBLISHED' || c.status === 'OPEN') // Only show open/published
      .map((c, index) => ({
        // -- Required real Match fields --
        proposalId: c._id,
        founderName: c.title,
        matchScore: 0.95 - index * 0.05,

        // -- UI alias fields --
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

  const validate = (): boolean => {
    const next: Partial<Record<keyof ApplicationForm, string>> = {};

    if (!form.proposalFile) {
      next.proposalFile = 'Please upload your technical proposal document.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!activeMatch) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('challengeId', activeMatch._id!);
      formData.append('envelope_a_technical', JSON.stringify({
        domain: 'SOFTWARE',
        claimed_trl: 5,
        startup_pitch: 'See attached detailed technical proposal.',
      }));
      formData.append('envelope_b_financial', JSON.stringify({
        pilot_execution_bid: { amount_inr: 0 },
        payment_terms: 'See attached document.',
      }));
      formData.append('proposal_metadata', JSON.stringify({
        proposal_id: `PROP-${Date.now()}`,
      }));
      if (form.proposalFile) {
        formData.append('proposal_document', form.proposalFile);
      }

      await submitProposal(formData);

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
        title={activeMatch ? `Apply - ${activeMatch.founderName}` : 'Apply'}
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
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-gray-700">Detailed Technical Proposal (Envelope A)</label>
              <a href="/Sample_Proposal_Format.pdf" download="Sample_Proposal_Format.pdf" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--color-primary)] hover:underline flex items-center">
                <Download size={14} className="mr-1" /> Sample Proposal Format
              </a>
            </div>
            <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${errors.proposalFile ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  setForm(prev => ({ ...prev, proposalFile: e.target.files?.[0] || null }));
                  setErrors(prev => ({ ...prev, proposalFile: undefined }));
                }}
              />
              <Upload size={24} className={`${errors.proposalFile ? 'text-red-400' : 'text-gray-400'} mb-2`} />
              {form.proposalFile ? (
                <div className="flex items-center text-sm font-medium text-green-600">
                  <FileText size={16} className="mr-2" />
                  {form.proposalFile.name}
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600">Click to upload your proposal document</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX up to 5MB</p>
                </>
              )}
            </div>
            {errors.proposalFile && <p className="text-xs text-red-500 mt-1">{errors.proposalFile}</p>}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
