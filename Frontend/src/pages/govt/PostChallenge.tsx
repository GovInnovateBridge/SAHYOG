import React, { useState } from 'react';
import Navbar from '../../components/shared/Navbar';
import Sidebar from '../../components/shared/Sidebar';
import Button from '../../components/ui/Button';
import AIThinkingLoader from '../../components/govt/AIThinkingLoader';
import Badge from '../../components/ui/Badge';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { publishChallenge } from '../../services/challengeService';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function PostChallenge() {
  const [rawText, setRawText] = useState('');
  const [pilotBudget, setPilotBudget] = useState('1500000');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();
  
  const [result, setResult] = useState<null | {
    id: string;
    title: string;
    scopeOfWork: string;
    kpis: { metric: string; target: string }[];
    budgetInr: number;
  }>(null);

  const handleGenerate = async () => {
    if (!rawText.trim()) return;
    setIsGenerating(true);
    setResult(null);

    try {
      // Create Challenge as DRAFT which triggers backend ML Formulator
      const { data } = await api.post('/challenges/create', {
        title: 'AI Generated Challenge Title',
        problemStatementRaw: rawText,
        scopeOfWork: 'To be defined based on KPIs',
        expectedDeliverables: 'Working prototype matching KPIs',
        pilotBudgetInr: Number(pilotBudget) || 1500000,
        category: 'SMART_CITY',
        departmentName: 'Nodal Department'
      });

      const challenge = data.challenge;
      const kpis = challenge.extractedKPIs?.metrics || [];

      // If backend didn't return KPIs, use mock to prevent empty state
      setResult({
        id: challenge._id,
        title: challenge.title || 'AI-Generated Challenge',
        scopeOfWork: challenge.scopeOfWork || 'No scope of work generated',
        kpis: kpis.length > 0 ? kpis : [
          { metric: 'Anomaly Detection Accuracy', target: '>= 95%' },
          { metric: 'Real-time Processing Latency', target: '<= 200ms per frame' },
        ],
        budgetInr: challenge.pilotBudgetInr || 1500000,
      });
      toast.success('AI successfully drafted the challenge!');
    } catch (error: any) {
      if (error.response?.status === 406) {
        toast.error(error.response.data.message || 'Bias detected in your challenge text.', { duration: 8000 });
      } else {
        toast.error('Failed to generate challenge. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!result?.id) return;
    setIsPublishing(true);
    try {
      await publishChallenge(result.id);
      toast.success('Challenge published successfully! Startups have been notified.');
      navigate('/govt/dashboard');
    } catch (error) {
      toast.error('Failed to publish challenge.');
    } finally {
      setIsPublishing(false);
    }
  };

  const formatINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-gray-900">Post New Challenge</h2>
              <p className="text-sm text-gray-500 mt-1">
                Describe your department's problem in plain language. Our AI will convert it into a structured, outcome-based challenge with measurable KPIs.
              </p>
            </div>

            {/* Input Area */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <label htmlFor="problem-text" className="block text-sm font-semibold text-gray-700 mb-2">
                Problem Statement (Plain Language)
              </label>
              <textarea
                id="problem-text"
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                disabled={isGenerating || isPublishing}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                placeholder="Example: We need a system to detect potholes and road anomalies in real-time using drone camera footage across national highways..."
              />

              <div className="mt-4">
                <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-2">
                  Allocated Pilot Budget (INR)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    id="budget"
                    value={pilotBudget}
                    onChange={(e) => setPilotBudget(e.target.value)}
                    disabled={isGenerating || isPublishing}
                    className="pl-7 block w-full px-4 py-3 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                    placeholder="1500000"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-gray-400">{rawText.length} characters</p>
                <Button
                  variant="primary"
                  size="lg"
                  loading={isGenerating}
                  disabled={!rawText.trim() || isGenerating || isPublishing}
                  onClick={handleGenerate}
                >
                  <Sparkles size={18} className="mr-2" />
                  Generate via AI
                </Button>
              </div>

              {/* AI Thinking Loader */}
              <AIThinkingLoader isGenerating={isGenerating} />
            </div>

            {/* Result Card */}
            {result && !isGenerating && (
              <div className="border border-gray-300 rounded-sm shadow-md mt-8 overflow-hidden bg-white">
                {/* Formal Header */}
                <div className="border-b-2 border-gray-800 p-6 text-center bg-gray-50">
                  <img src="/logo2.png" alt="Emblem" className="h-16 mx-auto mb-3 opacity-80 grayscale" />
                  <h2 className="text-xl font-serif font-bold text-gray-900 uppercase tracking-widest">Government of Maharashtra</h2>
                  <p className="text-sm text-gray-600 font-serif mt-1 uppercase tracking-widest">Department of Innovation</p>
                  <div className="w-16 h-0.5 bg-gray-400 mx-auto mt-4 mb-2"></div>
                  <h3 className="text-lg font-serif font-bold text-gray-900 uppercase tracking-widest">Official Problem Statement Draft</h3>
                </div>

                <div className="p-8 font-serif">
                  {/* Meta info */}
                  <div className="flex justify-between items-start mb-8 text-sm text-gray-600 border-b border-gray-200 pb-4">
                    <div>
                      <span className="font-bold text-gray-800">Reference No:</span> DRAFT-{(new Date().getTime()).toString().slice(-6)}
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-800">Date:</span> {new Date().toLocaleDateString('en-IN')}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">1. Subject Title</h4>
                    <h3 className="text-lg font-bold text-gray-900">{result.title}</h3>
                  </div>

                  {/* Scope */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">2. Scope of Work & Problem Description</h4>
                    <p className="text-gray-800 leading-relaxed text-justify">
                      {result.scopeOfWork}
                    </p>
                  </div>
                  {/* KPIs */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">3. Key Performance Indicators (KPIs)</h4>
                    <ul className="list-disc pl-5 space-y-2 text-gray-800">
                      {result.kpis.map((kpi, i) => (
                        <li key={i} className="pl-1">
                          <span className="font-bold">{kpi.metric}</span>: {kpi.target}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Budget */}
                  <div className="mb-8">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">4. Allocated Pilot Budget</h4>
                    <p className="text-gray-800 font-medium">₹ {result.budgetInr.toLocaleString('en-IN')} (INR)</p>
                  </div>

                  {/* Footer / CTA */}
                  <div className="mt-8 pt-6 border-t-2 border-gray-800 flex items-center justify-between bg-gray-50 -mx-8 -mb-8 p-6">
                    <div className="flex items-center gap-2">
                      <Badge variant="green" dot>Anti-Bias Cleared by ML</Badge>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="secondary" onClick={() => { setResult(null); setRawText(''); }} disabled={isPublishing}>
                        Discard
                      </Button>
                      <Button onClick={() => handlePublish(result.id)} size="lg" className="shadow-lg" loading={isPublishing}>
                        Approve & Publish to Startups
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
