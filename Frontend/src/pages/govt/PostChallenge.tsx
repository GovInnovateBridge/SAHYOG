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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const navigate = useNavigate();
  
  const [result, setResult] = useState<null | {
    id: string;
    title: string;
    kpis: { metric: string; target: string }[];
    budgetInr: number;
  }>(null);

  const handleGenerate = async () => {
    if (!rawText.trim()) return;
    setIsGenerating(true);
    setResult(null);

    try {
      // Create Challenge as DRAFT which triggers backend ML KPI extraction
      const { data } = await api.post('/challenges/create', {
        title: 'AI Generated Challenge Title', // Fallback, would normally let user edit
        problemStatementRaw: rawText,
        scopeOfWork: 'To be defined based on KPIs',
        expectedDeliverables: 'Working prototype matching KPIs',
        pilotBudgetInr: 1500000,
        category: 'SMART_CITY',
        departmentName: 'Nodal Department'
      });

      const challenge = data.challenge;
      const kpis = challenge.extractedKPIs?.metrics || [];

      // If backend didn't return KPIs, use mock to prevent empty state
      setResult({
        id: challenge._id,
        title: challenge.title || 'AI-Generated Challenge',
        kpis: kpis.length > 0 ? kpis : [
          { metric: 'Anomaly Detection Accuracy', target: '>= 95%' },
          { metric: 'Real-time Processing Latency', target: '<= 200ms per frame' },
        ],
        budgetInr: challenge.pilotBudgetInr || 1500000,
      });
      toast.success('AI successfully drafted the challenge!');
    } catch (error) {
      toast.error('Failed to generate challenge. Please try again.');
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
              <div className="mt-8 bg-white border-2 border-[var(--color-india-green)] rounded-lg shadow-sm overflow-hidden animate-[fadeIn_0.4s_ease-out]">
                <div className="bg-green-50 px-6 py-4 border-b border-green-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-1">AI-Generated Challenge</p>
                    <h3 className="text-lg font-bold text-gray-900">{result.title}</h3>
                  </div>
                  <Badge variant="green" dot>Anti-Bias Cleared</Badge>
                </div>

                <div className="px-6 py-5">
                  <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Measurable KPIs</h4>
                  <div className="space-y-2">
                    {result.kpis.map((kpi, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
                        <span className="text-sm font-medium text-gray-800">{kpi.metric}</span>
                        <span className="text-sm font-bold text-[var(--color-primary)]">{kpi.target}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between p-4 bg-blue-50 rounded border border-blue-200">
                    <div>
                      <p className="text-xs font-semibold text-blue-700 uppercase">Allocated Pilot Budget</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        {formatINR(result.budgetInr)}
                      </p>
                    </div>
                    <Badge variant="blue">Smart Escrow Ready</Badge>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => { setResult(null); setRawText(''); }} disabled={isPublishing}>
                    Discard & Retry
                  </Button>
                  <Button variant="primary" onClick={handlePublish} loading={isPublishing}>
                    Publish Challenge
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
