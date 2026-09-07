import React, { useState } from 'react';
import Sidebar from '../../components/shared/Sidebar';
import GovtEmblem from '../../components/shared/GovtEmblem';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Rocket, BrainCircuit, ShieldCheck, Loader2, 
  AlertTriangle, GitBranch, Globe, CheckCircle2,
  LogOut, BadgeCheck, Upload, Video, FileText, Key
} from 'lucide-react';
import { generateQuestions, verifyTRL, verifyHardwareDoc, verifyHardwareVideo } from '../../services/trlService';
import api from '../../services/api';

interface AssessmentResult {
  claimed_trl: number;
  verified_trl: number;
  is_fraud: boolean;
  downgrade_reason: string | null;
  confidence?: number;
  report?: string;
}

export default function TRLQuizPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- STATE ---
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [domain, setDomain] = useState<'SOFTWARE' | 'HARDWARE'>('SOFTWARE');
  
  // Step 1 State
  const [pitch, setPitch] = useState('');
  const [claimedTrl, setClaimedTrl] = useState(1);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  
  // Step 2 State (Software)
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  
  // Step 2 State (Hardware)
  const [hardwareFile, setHardwareFile] = useState<File | null>(null);
  const [otp, setOtp] = useState('');
  
  // Step 3 State
  const [result, setResult] = useState<AssessmentResult | null>(null);
  
  const [loading, setLoading] = useState(false);

  // --- REAL API: Generate Questions ---
  const handleGenerateQuestions = async () => {
    if (!pitch.trim()) return;
    setLoading(true);
    
    try {
      const res = await generateQuestions(pitch, claimedTrl);
      setQuestions(res.questions || []);
      setAnswers(new Array(res.questions?.length || 3).fill(''));
      setStep(2);
      toast.success(`AI generated ${res.questions?.length || 0} verification questions`);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to generate questions. Is the backend running?';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- REAL API: Submit Answers for Verification ---
  const handleSubmitAuditor = async () => {
    setLoading(true);
    
    try {
      const res = await verifyTRL(
        questions,
        answers,
        claimedTrl,
        {
          github_verified: !!githubUrl,
          live_url_verified: !!liveUrl,
        }
      );
      
      setResult({
        claimed_trl: claimedTrl,
        verified_trl: res.final_verified_trl ?? claimedTrl,
        is_fraud: res.is_fraud_detected || false,
        downgrade_reason: res.downgrade_reason || null,
        confidence: res.technical_confidence,
        report: res.evaluation_report,
      });
      setStep(3);
      
      if (res.is_fraud_detected) {
        toast.error(`TRL Downgraded to ${res.final_verified_trl}`);
      } else {
        toast.success(`TRL-${res.final_verified_trl} Verified Successfully!`);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- REAL API: Hardware Document Upload ---
  const handleHardwareDocUpload = async () => {
    if (!hardwareFile) return;
    setLoading(true);
    
    try {
      const res = await verifyHardwareDoc(hardwareFile);
      setResult({
        claimed_trl: claimedTrl,
        verified_trl: res.verified ? claimedTrl : 1,
        is_fraud: !res.verified,
        downgrade_reason: res.verified ? null : 'Document verification failed. CAD/PCB schematic could not be validated.',
        confidence: res.confidence,
      });
      setStep(3);
      
      if (res.verified) {
        toast.success(`Hardware document verified with ${Math.round(res.confidence * 100)}% confidence`);
      } else {
        toast.error('Hardware document verification failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Document upload failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- REAL API: Hardware Video Upload ---
  const handleHardwareVideoUpload = async () => {
    if (!hardwareFile || !otp) return;
    setLoading(true);
    
    try {
      const res = await verifyHardwareVideo(hardwareFile, otp);
      setResult({
        claimed_trl: claimedTrl,
        verified_trl: res.verified ? claimedTrl : 1,
        is_fraud: !res.verified,
        downgrade_reason: res.verified ? null : `OTP match: ${res.otp_matched}, Hardware: ${res.hardware_detected}`,
        confidence: res.otp_matched ? 1 : 0,
      });
      setStep(3);
      
      if (res.verified) {
        toast.success('Hardware video verified — OTP matched!');
      } else {
        toast.error('Hardware video verification failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Video upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <header className="bg-[var(--color-primary)] text-white shadow-md z-10">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <GovtEmblem width={32} height={40} className="opacity-90" />
             <div>
               <h1 className="text-lg font-bold tracking-wide">SAHYOG</h1>
               <p className="text-[10px] text-[var(--color-saffron)] font-semibold uppercase tracking-wider">Zero-Trust TRL Engine</p>
             </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
             <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded">
               <BadgeCheck size={16} className="text-[var(--color-saffron)]"/>
               <span className="font-medium text-white/90">{user?.email}</span>
             </div>
             <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-red-300 transition-colors">
               <LogOut size={16} />
               <span>Logout</span>
             </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Progress Steps */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[
                { num: 1, label: 'Submit Pitch', icon: Rocket },
                { num: 2, label: domain === 'SOFTWARE' ? 'Interrogation' : 'Hardware Proof', icon: BrainCircuit },
                { num: 3, label: 'Verdict', icon: ShieldCheck },
              ].map(({ num, label, icon: Icon }) => (
                <div key={num} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    step >= num ? 'bg-[var(--color-primary)] text-white shadow-md' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon size={18} />
                  </div>
                  <span className={`ml-2 text-xs font-semibold ${step >= num ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                  {num < 3 && <div className={`w-16 h-0.5 ml-3 ${step > num ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>

            {/* STEP 1: Submit Pitch */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in slide-in-from-left-8 duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Rocket className="text-[var(--color-primary)]" /> Step 1: Startup Pitch & Claim
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Describe your technology. The AI Zero-Trust Engine will generate custom interrogation questions.
                </p>
                
                <div className="space-y-5">
                  {/* Domain Selector */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Domain</label>
                    <div className="flex gap-3">
                      <button onClick={() => setDomain('SOFTWARE')} className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${domain === 'SOFTWARE' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}>
                        ?? Software
                      </button>
                      <button onClick={() => setDomain('HARDWARE')} className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${domain === 'HARDWARE' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'border-gray-300 text-gray-500 hover:border-gray-400'}`}>
                        ?? Hardware
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Rocket size={16} /> Startup Pitch
                    </label>
                    <textarea 
                      rows={4}
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      placeholder="Describe your core technology, architecture, and what it does..."
                      className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-sm resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      Claimed TRL Level: <span className="text-[var(--color-primary)] text-lg">{claimedTrl}</span>
                    </label>
                    <input 
                      type="range" min={1} max={9} step={1}
                      value={claimedTrl}
                      onChange={(e) => setClaimedTrl(Number(e.target.value))}
                      className="w-full accent-[var(--color-primary)] cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                      <span>1</span>
                      <span>5</span>
                      <span>9</span>
                    </div>
                  </div>

                  {domain === 'SOFTWARE' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                          <GitBranch size={16} /> GitHub Repository URL
                        </label>
                        <input 
                          type="url"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          placeholder="https://github.com/..."
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                          <Globe size={16} /> Live API/Demo URL
                        </label>
                        <input 
                          type="url"
                          value={liveUrl}
                          onChange={(e) => setLiveUrl(e.target.value)}
                          placeholder="https://api.startup.com"
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-[var(--color-primary)] outline-none text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={domain === 'SOFTWARE' ? handleGenerateQuestions : () => setStep(2)}
                    disabled={loading || !pitch.trim()}
                    className="w-full mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3.5 rounded-lg shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
                    {loading ? 'Analyzing Pitch & Generating Interrogation...' : domain === 'SOFTWARE' ? 'Generate AI Interrogation' : 'Proceed to Hardware Upload'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Software Interrogation */}
            {step === 2 && domain === 'SOFTWARE' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <BrainCircuit className="text-[var(--color-primary)]" /> Step 2: The Interrogation
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Based on your claim of TRL {claimedTrl}, the Zero-Trust Engine requires detailed technical answers to the following questions.
                </p>
                
                <div className="space-y-6">
                  {questions.map((q, idx) => (
                    <div key={idx} className="bg-blue-50/50 rounded-lg p-5 border border-blue-100">
                      <p className="text-sm font-bold text-gray-800 mb-3 flex items-start gap-2">
                        <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{idx + 1}</span>
                        {q}
                      </p>
                      <textarea 
                        rows={3}
                        value={answers[idx]}
                        onChange={(e) => {
                          const newAnswers = [...answers];
                          newAnswers[idx] = e.target.value;
                          setAnswers(newAnswers);
                        }}
                        placeholder="Provide deep technical specifics..."
                        className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none bg-white"
                      />
                    </div>
                  ))}

                  <button 
                    onClick={handleSubmitAuditor}
                    disabled={loading || answers.some(a => !a.trim())}
                    className="w-full mt-4 bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-lg shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
                    {loading ? 'Zero-Trust Auditor Evaluating...' : 'Submit to Zero-Trust Auditor'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Hardware Upload */}
            {step === 2 && domain === 'HARDWARE' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in slide-in-from-right-8 duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <Upload className="text-orange-500" /> Step 2: Hardware Proof Upload
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {claimedTrl <= 3
                    ? 'Upload a CAD/PCB schematic document (PDF) for TRL 1-3 verification.'
                    : 'Upload a live demonstration video with the OTP displayed for TRL 4-6+ verification.'}
                </p>
                
                <div className="space-y-5">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-orange-400 transition-colors">
                    <input
                      type="file"
                      id="hardware-file"
                      accept={claimedTrl <= 3 ? '.pdf,.png,.jpg' : 'video/*'}
                      onChange={(e) => setHardwareFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <label htmlFor="hardware-file" className="cursor-pointer">
                      {claimedTrl <= 3 ? <FileText size={40} className="mx-auto text-gray-400 mb-3" /> : <Video size={40} className="mx-auto text-gray-400 mb-3" />}
                      <p className="text-sm font-semibold text-gray-700">
                        {hardwareFile ? hardwareFile.name : (claimedTrl <= 3 ? 'Click to upload CAD/PCB document' : 'Click to upload demonstration video')}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {hardwareFile ? `${(hardwareFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Max 50MB'}
                      </p>
                    </label>
                  </div>

                  {/* OTP Input for Video (TRL 4+) */}
                  {claimedTrl > 3 && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                        <Key size={16} /> Expected OTP Code
                      </label>
                      <input 
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter the OTP displayed in your video"
                        className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      />
                    </div>
                  )}

                  <button 
                    onClick={claimedTrl <= 3 ? handleHardwareDocUpload : handleHardwareVideoUpload}
                    disabled={loading || !hardwareFile || (claimedTrl > 3 && !otp)}
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-lg shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    {loading ? 'ML Vision Engine Analyzing...' : 'Upload & Verify Hardware'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: The Verdict */}
            {step === 3 && result && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                {result.is_fraud ? (
                  /* Scenario A: Fraud / Downgrade */
                  <div className="bg-white rounded-xl shadow-lg border-t-4 border-red-500 p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle size={40} className="text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Verification Failed</h3>
                    <div className="inline-block bg-red-50 border border-red-200 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
                      Downgraded to TRL-{result.verified_trl}
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 text-left max-w-xl mx-auto">
                      <p className="text-sm text-gray-600 font-semibold mb-1 uppercase tracking-wider text-xs">ML Auditor Reason:</p>
                      <p className="text-gray-800 text-sm leading-relaxed">{result.downgrade_reason}</p>
                    </div>
                    
                    {result.confidence !== undefined && (
                      <p className="text-xs text-gray-400 mt-4">Technical Confidence: {Math.round(result.confidence * 100)}%</p>
                    )}
                    
                    <button onClick={() => { setStep(1); setResult(null); }} className="mt-8 text-[var(--color-primary)] font-bold hover:underline text-sm">
                      Start Over
                    </button>
                  </div>
                ) : (
                  /* Scenario B: Success */
                  <div className="bg-white rounded-xl shadow-lg border-t-4 border-green-500 p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={40} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">Verification Successful!</h3>
                    <div className="inline-block bg-green-50 border border-green-200 text-green-700 px-5 py-2 rounded-full text-lg font-bold mb-6 shadow-sm">
                      TRL-{result.verified_trl} Verified & Locked
                    </div>
                    
                    <p className="text-gray-500 text-sm max-w-md mx-auto">
                      Your technical capabilities have satisfied the Zero-Trust Auditor. Your startup is now eligible for Govt Challenges requiring up to TRL-{result.verified_trl}.
                    </p>

                    {result.confidence !== undefined && (
                      <p className="text-xs text-gray-400 mt-4">Technical Confidence: {Math.round(result.confidence * 100)}%</p>
                    )}
                    
                    <button 
                      onClick={async () => {
                        try {
                          const meRes = await api.get('/auth/me');
                          useAuthStore.getState().setAuth(meRes.data, useAuthStore.getState().token || '');
                          toast.success('Dashboard Unlocked!');
                          navigate('/startup/dashboard');
                        } catch (err) {
                          toast.error('Failed to sync auth state. Please login again.');
                        }
                      }} 
                      className="mt-8 bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-700 transition-colors shadow-sm"
                    >
                      Unlock Dashboard & Continue
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}



