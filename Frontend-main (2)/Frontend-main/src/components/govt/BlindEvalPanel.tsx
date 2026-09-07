import { useState } from 'react';
import Button from '../ui/Button';
import { ShieldAlert, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { startEvaluation as startEvaluationAPI } from '../../services/challengeService';

interface BlindEvalPanelProps {
  challengeId: string;
}

export default function BlindEvalPanel({ challengeId }: BlindEvalPanelProps) {
  const [evaluationState, setEvaluationState] = useState<'pending' | 'evaluating' | 'completed'>('pending');

  const startEvaluation = async () => {
    setEvaluationState('evaluating');
    try {
      await startEvaluationAPI(challengeId);
      toast.success('Blind evaluation started successfully.');
      setTimeout(() => {
        setEvaluationState('completed');
      }, 2000); // Simulate ML processing time visually
    } catch (error) {
      toast.error('Failed to start evaluation. Ensure the challenge is published.');
      setEvaluationState('pending');
    }
  };

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <ShieldAlert className="text-[var(--color-primary)]" size={24} />
        <h3 className="text-lg font-bold text-gray-900">QCBS Blind Evaluation</h3>
      </div>
      <p className="text-sm text-gray-600 mb-6">
        Initiate an unbiased, AI-assisted evaluation of the submitted technical proposals. Startup identities are masked to ensure fair compliance with GFR Rule 194.
      </p>

      {evaluationState === 'pending' && (
        <Button onClick={startEvaluation} variant="primary" className="w-full justify-center">
          <FileText size={16} className="mr-2" /> Start Blind Evaluation
        </Button>
      )}

      {evaluationState === 'evaluating' && (
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
          <p className="text-sm text-gray-500">Masking identities & evaluating technical merits...</p>
        </div>
      )}

      {evaluationState === 'completed' && (
        <div className="bg-green-50 text-green-700 p-4 rounded flex items-start space-x-3 border border-green-200">
          <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Evaluation Complete</h4>
            <p className="text-xs mt-1">Startups have been scored based on technical parameters. You may now review the results.</p>
          </div>
        </div>
      )}
    </div>
  );
}
