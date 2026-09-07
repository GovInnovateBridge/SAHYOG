import { useState } from 'react';
import { useTRLStore } from '../../store/useTRLStore';
import {
  generateQuestions,
  verifyTRL,
  verifyHardwareDoc,
  verifyHardwareVideo,
} from '../../services/trlService';
import type { BackendProofs } from '../../services/trlService';
import {
  Rocket,
  BrainCircuit,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  GitBranch,
  Globe,
  Cpu,
  Upload,
  FileText,
  Video,
  ChevronDown,
  ChevronUp,
  XCircle,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

/* ─── Step 1: Pitch Input ───────────────────────────────────────────────── */
function StepPitchInput() {
  const {
    pitch, setPitch,
    claimedTrl, setClaimedTrl,
    domain, setDomain,
    githubUrl, setGithubUrl,
    liveUrl, setLiveUrl,
    setStatus, setQuestions, setError,
  } = useTRLStore();

  const [loading, setLoading] = useState(false);

  const trlTierLabel = (trl: number) => {
    if (trl >= 8) return 'Commercial Scale (TRL 8-9)';
    if (trl >= 6) return 'Live Environment (TRL 6-7)';
    if (trl >= 4) return 'Cloud Prototype (TRL 4-5)';
    return 'Local Code (TRL 1-3)';
  };

  const trlColor = (trl: number) => {
    if (trl >= 8) return 'text-emerald-600';
    if (trl >= 6) return 'text-sky-600';
    if (trl >= 4) return 'text-amber-600';
    return 'text-orange-600';
  };

  const handleSubmit = async () => {
    if (!pitch.trim()) return;
    setLoading(true);
    setStatus('generating');

    try {
      const result = await generateQuestions(pitch, claimedTrl);
      setQuestions(result.questions, result.trl_tier);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Failed to connect to ML Engine';
      setError(`AI Engine Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Domain Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Startup Domain
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['SOFTWARE', 'HARDWARE'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 text-sm font-bold transition-all ${
                domain === d
                  ? 'border-[var(--color-primary)] bg-blue-50 text-[var(--color-primary)]'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {d === 'SOFTWARE' ? <Cpu size={18} /> : <Cpu size={18} />}
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Pitch */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Describe Your Solution <span className="text-red-500">*</span>
        </label>
        <textarea
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          rows={4}
          placeholder="E.g., We built a drone-based pothole detection system using computer vision. Our API is live on AWS EC2 and processes 10,000 images/day..."
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          Be specific about your technology, architecture, and deployment status.
        </p>
      </div>

      {/* Claimed TRL Slider */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Claimed TRL Level
        </label>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-3xl font-black text-[var(--color-primary)]">TRL {claimedTrl}</span>
            <span className={`text-sm font-bold ${trlColor(claimedTrl)}`}>
              {trlTierLabel(claimedTrl)}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={9}
            step={1}
            value={claimedTrl}
            onChange={(e) => setClaimedTrl(Number(e.target.value))}
            className="w-full accent-[var(--color-primary)]"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>1 — Research</span>
            <span>5 — Prototype</span>
            <span>9 — Commercial</span>
          </div>
        </div>
      </div>

      {/* Backend Proof URLs */}
      {domain === 'SOFTWARE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <GitBranch size={16} /> GitHub / GitLab URL
            </label>
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/your/repo"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
              <Globe size={14} /> Live URL / API Endpoint
            </label>
            <input
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://api.yourproduct.com"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!pitch.trim() || loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Generating AI Questions...
          </>
        ) : (
          <>
            <BrainCircuit size={18} />
            Generate Verification Questions
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* Info Banner */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>How it works:</strong> Our AI will generate 3 deeply technical questions
          targeting your claimed TRL tier. Your answers are then evaluated by the
          Zero-Trust TRL Engine using Gemini AI + deterministic rule enforcement.
        </p>
      </div>
    </div>
  );
}

/* ─── Step 2: Answer Questions (Software) ───────────────────────────────── */
function StepAnswerQuestions() {
  const {
    questions, trlTier, answers, claimedTrl,
    setAnswer, setStatus, setError,
    githubUrl, liveUrl,
    domain,
  } = useTRLStore();
  const { setVerificationResult } = useTRLStore();

  const [loading, setLoading] = useState(false);

  const allAnswered = answers.every((a) => a.trim().length > 20);

  const handleVerify = async () => {
    setLoading(true);
    setStatus('verifying');

    try {
      const backendProofs: BackendProofs = {
        github_verified: !!githubUrl.trim(),
        live_url_verified: !!liveUrl.trim(),
        dns_verified: false,
        security_cert_verified: false,
      };

      const result = await verifyTRL(questions, answers, claimedTrl, backendProofs);

      setVerificationResult({
        verifiedTrl: result.final_verified_trl,
        isFraudDetected: result.is_fraud_detected,
        technicalConfidence: result.technical_confidence,
        downgradeReason: result.downgrade_reason,
        evaluationReport: result.evaluation_report,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Verification failed';
      setError(`Verification Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tier badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit size={18} className="text-[var(--color-primary)]" />
          <span className="text-sm font-bold text-gray-700">AI-Generated Questions</span>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-[var(--color-primary)] rounded-full border border-blue-200">
          {trlTier} — TRL {claimedTrl}
        </span>
      </div>

      {/* Questions */}
      {questions.map((q, i) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3 mb-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            <p className="text-sm font-medium text-gray-800 leading-relaxed">{q}</p>
          </div>
          <textarea
            value={answers[i]}
            onChange={(e) => setAnswer(i, e.target.value)}
            rows={3}
            placeholder="Provide a detailed, technically specific answer..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[var(--color-primary)] outline-none transition-all resize-none"
          />
          <div className="flex justify-end mt-1">
            <span className={`text-[10px] font-medium ${answers[i].trim().length > 20 ? 'text-green-500' : 'text-gray-400'}`}>
              {answers[i].trim().length} chars {answers[i].trim().length > 20 ? '✓' : '(min 20)'}
            </span>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setStatus('pitch-input')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={handleVerify}
          disabled={!allAnswered || loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Running Zero-Trust Verification...
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              Submit for Verification
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Step 2 Alt: Hardware Verification ──────────────────────────────────── */
function StepHardwareVerify() {
  const { claimedTrl, setStatus, setError, setVerificationResult } = useTRLStore();
  const [file, setFile] = useState<File | null>(null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const isVideo = claimedTrl >= 4; // TRL 4-6: video, TRL 1-3: doc

  const handleVerify = async () => {
    if (!file) return;
    setLoading(true);
    setStatus('verifying');

    try {
      if (isVideo) {
        const result = await verifyHardwareVideo(file, otp);
        setVerificationResult({
          verifiedTrl: result.verified ? claimedTrl : 0,
          isFraudDetected: !result.verified,
          technicalConfidence: result.verified ? 0.95 : 0,
          downgradeReason: result.verified ? null : 'Hardware/OTP verification failed',
          evaluationReport: `Hardware Detected: ${result.hardware_detected}\nOTP Matched: ${result.otp_matched}`,
        });
      } else {
        const result = await verifyHardwareDoc(file);
        setVerificationResult({
          verifiedTrl: result.verified ? claimedTrl : 0,
          isFraudDetected: !result.verified,
          technicalConfidence: result.confidence,
          downgradeReason: result.verified ? null : 'CAD/Schematic verification failed',
          evaluationReport: `Document verification ${result.verified ? 'passed' : 'failed'} with ${(result.confidence * 100).toFixed(0)}% confidence.`,
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Hardware verification failed';
      setError(`Hardware Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800 font-medium">
          {isVideo ? (
            <>
              <strong>TRL 4-6 Verification:</strong> Upload a "hostage video" of your physical
              hardware prototype. You must show a handwritten paper with the OTP code visible
              next to the hardware.
            </>
          ) : (
            <>
              <strong>TRL 1-3 Verification:</strong> Upload a CAD drawing, PCB schematic, or
              engineering design document (PNG/JPG/PDF) to prove genuine technical work.
            </>
          )}
        </p>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition-colors">
        {file ? (
          <div className="flex items-center justify-center gap-3">
            {isVideo ? <Video size={24} className="text-[var(--color-primary)]" /> : <FileText size={24} className="text-[var(--color-primary)]" />}
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button onClick={() => setFile(null)} className="text-red-400 hover:text-red-600">
              <XCircle size={18} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              {isVideo ? 'Upload MP4 video (max 50MB)' : 'Upload image/PDF (max 10MB)'}
            </p>
            <input
              type="file"
              id="hw-file"
              className="hidden"
              accept={isVideo ? 'video/*' : 'image/*,.pdf'}
              onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            />
            <label
              htmlFor="hw-file"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Select File
            </label>
          </>
        )}
      </div>

      {/* OTP Input (Video only) */}
      {isVideo && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Security OTP Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.toUpperCase())}
            placeholder="e.g. SAHYOG-99X"
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono tracking-wider focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            This must match the code visible on the handwritten paper in the video.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setStatus('pitch-input')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <button
          onClick={handleVerify}
          disabled={!file || (isVideo && !otp) || loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Verifying Hardware...
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              Verify Hardware
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── Step 3: Verification Result ───────────────────────────────────────── */
function StepResult() {
  const {
    verifiedTrl, isFraudDetected, technicalConfidence,
    claimedTrl, downgradeReason, evaluationReport,
    reset,
  } = useTRLStore();

  const [reportExpanded, setReportExpanded] = useState(false);

  const confidencePct = Math.round((technicalConfidence ?? 0) * 100);
  const wasDowngraded = verifiedTrl !== null && verifiedTrl < claimedTrl;

  const statusColor = isFraudDetected
    ? 'border-red-300 bg-red-50'
    : wasDowngraded
    ? 'border-amber-300 bg-amber-50'
    : 'border-green-300 bg-green-50';

  const statusIcon = isFraudDetected
    ? <AlertTriangle size={28} className="text-red-500" />
    : wasDowngraded
    ? <AlertTriangle size={28} className="text-amber-500" />
    : <CheckCircle2 size={28} className="text-green-500" />;

  const statusText = isFraudDetected
    ? 'FRAUD DETECTED'
    : wasDowngraded
    ? 'TRL DOWNGRADED'
    : 'VERIFICATION PASSED';

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      <div className={`flex items-center gap-4 p-5 rounded-xl border-2 ${statusColor}`}>
        {statusIcon}
        <div>
          <h4 className="font-bold text-gray-900">{statusText}</h4>
          <p className="text-sm text-gray-600">
            {isFraudDetected
              ? `Claimed TRL ${claimedTrl} could not be verified. Evidence is insufficient.`
              : wasDowngraded
              ? `Claimed TRL ${claimedTrl} → Verified TRL ${verifiedTrl}. Backend proofs incomplete.`
              : `TRL ${verifiedTrl} verified successfully with ${confidencePct}% confidence.`}
          </p>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Claimed</p>
          <p className="text-3xl font-black text-gray-400">TRL {claimedTrl}</p>
        </div>
        <div className={`rounded-xl p-4 text-center shadow-sm border-2 ${
          isFraudDetected ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
        }`}>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Verified</p>
          <p className={`text-3xl font-black ${
            isFraudDetected ? 'text-red-600' : 'text-green-600'
          }`}>
            TRL {verifiedTrl ?? 0}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Confidence</p>
          <p className="text-3xl font-black text-[var(--color-primary)]">{confidencePct}%</p>
        </div>
      </div>

      {/* Downgrade Reason */}
      {downgradeReason && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Downgrade Reason:</strong> {downgradeReason}
          </p>
        </div>
      )}

      {/* Evaluation Report */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => setReportExpanded(!reportExpanded)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--color-primary)]" />
            <span className="text-sm font-bold text-gray-700">AI Evaluation Report</span>
          </div>
          {reportExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
        </button>
        {reportExpanded && (
          <div className="px-4 pb-4 border-t border-gray-100">
            <pre className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap mt-3 font-sans">
              {evaluationReport || 'No detailed report available.'}
            </pre>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-colors"
        >
          <RefreshCw size={16} />
          Take Again
        </button>
      </div>
    </div>
  );
}

/* ─── Error State ───────────────────────────────────────────────────────── */
function StepError() {
  const { errorMessage, reset, setStatus } = useTRLStore();

  return (
    <div className="text-center py-8">
      <XCircle size={48} className="mx-auto text-red-400 mb-4" />
      <h4 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h4>
      <p className="text-sm text-red-600 mb-6 max-w-sm mx-auto">{errorMessage}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => setStatus('pitch-input')}
          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-medium hover:bg-gray-50"
        >
          <ArrowLeft size={14} className="inline mr-1" />
          Go Back
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)]"
        >
          <RefreshCw size={14} className="inline mr-1" />
          Start Over
        </button>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
export default function TRLQuiz() {
  const { status, domain } = useTRLStore();

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
          <Rocket size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Zero-Trust TRL Verification</h3>
          <p className="text-xs text-gray-500">Powered by Sahyog AI Engine (Gemini)</p>
        </div>
      </div>

      {/* Step Content */}
      {status === 'pitch-input' && <StepPitchInput />}
      {(status === 'answering' || status === 'generating') && (
        domain === 'HARDWARE' ? <StepHardwareVerify /> : <StepAnswerQuestions />
      )}
      {status === 'verifying' && (
        <div className="text-center py-12">
          <Loader2 size={40} className="mx-auto text-[var(--color-primary)] animate-spin mb-4" />
          <h4 className="text-lg font-bold text-gray-900 mb-2">Running Zero-Trust Verification</h4>
          <p className="text-sm text-gray-500">AI is evaluating your answers and checking backend proofs...</p>
        </div>
      )}
      {status === 'complete' && <StepResult />}
      {status === 'error' && <StepError />}
    </div>
  );
}
