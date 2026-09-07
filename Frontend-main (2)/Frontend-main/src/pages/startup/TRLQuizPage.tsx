import React, { useState } from 'react';
import Sidebar from '../../components/shared/Sidebar';
import GovtEmblem from '../../components/shared/GovtEmblem';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, BrainCircuit, ShieldCheck, Loader2, 
  AlertTriangle, GitBranch, Globe, CheckCircle2,
  LogOut, BadgeCheck 
} from 'lucide-react';

interface AssessmentResult {
  claimed_trl: number;
  verified_trl: number;
  is_fraud: boolean;
  downgrade_reason: string | null;
}

export default function TRLQuizPage() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- STATE TO MANAGE ---
  const [step, setStep] = useState<1 | 2 | 3>(1);
  
  // Step 1 State
  const [pitch, setPitch] = useState('');
  const [claimedTrl, setClaimedTrl] = useState(1);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  
  // Step 2 State
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  
  // Step 3 State
  const [result, setResult] = useState<AssessmentResult | null>(null);
  
  const [loading, setLoading] = useState(false);

  // --- API MOCKS ---
  const handleGenerateQuestions = async () => {
    if (!pitch.trim()) return;
    setLoading(true);
    
    // TODO: Real Axios call
    // await axios.post('/api/trl/generate-questions', { startup_pitch: pitch, claimed_trl: claimedTrl });
    
    setTimeout(() => {
      setQuestions([
        "How does your architecture handle fault tolerance during a node failure?",
        "What specific load testing metrics have you recorded in your live environment?",
        "Explain the security protocols used for data at rest and in transit in your system."
      ]);
      setStep(2);
      setLoading(false);
    }, 2000);
  };

  const handleSubmitAuditor = async () => {
    setLoading(true);
    
    // TODO: Real Axios call
    // await axios.post('/api/trl/verify-trl', {
    //   questions,
    //   user_answers: answers,
    //   claimed_trl: claimedTrl,
    //   backend_proofs: { github_verified: !!githubUrl, live_url_verified: !!liveUrl }
    // });
    
    setTimeout(() => {
      // Mock logic: If answers are too short or proofs are missing, fail them.
      const isWeak = answers.some(a => a.length < 15) || !githubUrl || !liveUrl;
      
      if (isWeak || claimedTrl > 7) {
        setResult({
          claimed_trl: claimedTrl,
          verified_trl: 3,
          is_fraud: true,
          downgrade_reason: "Insufficient backend proofs and vague technical answers. System architecture cannot be verified at claimed scale."
        });
      } else {
        setResult({
          claimed_trl: claimedTrl,
          verified_trl: claimedTrl,
          is_fraud: false,
          downgrade_reason: null
        });
      }
      setStep(3);
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <header className="bg-[var(--color-primary)] text-white shadow-md z-10">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <GovtEmblem width={32} height={40} className="opacity-90" />
            <div>
              <h1 className="text-lg font-bold tracking-wide">SAHYOG</h1>
              <p className="text-[10px] text-[var(--color-saffron)] font-semibold uppercase tracking-wider">Startup Partner Portal</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded">
              <BadgeCheck size={16} className="text-[var(--color-india-green)]" />
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
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50">
          
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8 border-b border-gray-200 pb-5 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Zero-Trust TRL Assessment</h2>
                <p className="text-sm text-gray-500 mt-2">
                  Powered by FastAPI ML Engine. Strict validation of your startup's Technology Readiness Level.
                </p>
              </div>
              
              {/* Step Indicator */}
              <div className="hidden md:flex items-center gap-3">
                {[
                  { num: 1, label: 'Claim', icon: Rocket },
                  { num: 2, label: 'Interrogation', icon: BrainCircuit },
                  { num: 3, label: 'Verdict', icon: ShieldCheck },
                ].map((s, i) => (
                  <div key={s.num} className="flex items-center">
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      step === s.num
                        ? 'bg-[var(--color-primary)] text-white shadow-md'
                        : step > s.num
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-200 text-gray-400'
                    }`}>
                      <s.icon size={14} />
                      {s.label}
                    </div>
                    {i < 2 && (
                      <div className={`w-8 h-0.5 mx-2 ${step > s.num ? 'bg-green-300' : 'bg-gray-300'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STEP 1: The Claim */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Rocket className="text-[var(--color-primary)]" /> Step 1: The Claim
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Describe Your Solution</label>
                    <textarea 
                      rows={4}
                      value={pitch}
                      onChange={(e) => setPitch(e.target.value)}
                      placeholder="Explain your technology, architecture, and current deployment status..."
                      className="w-full rounded-lg border-gray-300 border p-3 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none text-sm resize-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Claimed TRL Level (1-9)</label>
                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-3xl font-black text-[var(--color-primary)]">TRL {claimedTrl}</span>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                          {claimedTrl <= 3 ? 'Research' : claimedTrl <= 6 ? 'Prototype' : 'Commercial'}
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="9" 
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
                  </div>

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

                  <button 
                    onClick={handleGenerateQuestions}
                    disabled={loading || !pitch.trim()}
                    className="w-full mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3.5 rounded-lg shadow-md transition-all flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
                    {loading ? 'Analyzing Pitch & Generating Interrogation...' : 'Generate AI Interrogation'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: The Interrogation */}
            {step === 2 && (
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
                    
                    <button onClick={() => setStep(1)} className="mt-8 text-[var(--color-primary)] font-bold hover:underline text-sm">
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
                      Your technical capabilities and backend proofs have satisfied the Zero-Trust Auditor. Your startup is now eligible for Govt Challenges requiring up to TRL-{result.verified_trl}.
                    </p>
                    
                    <button onClick={() => setStep(1)} className="mt-8 text-gray-500 font-semibold hover:text-gray-800 text-sm transition-colors">
                      Restart Assessment
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
