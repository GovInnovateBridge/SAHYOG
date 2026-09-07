import React, { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface AIThinkingLoaderProps {
  isGenerating: boolean;
}

const STAGES = [
  { text: 'Analysing your problem statement...', duration: 1800 },
  { text: 'Running Anti-Bias Filter (NER + LLM)...', duration: 2000 },
  { text: 'Formulating technical KPIs via Gemini AI...', duration: 2200 },
  { text: 'Validating JSON schema with Pydantic...', duration: 1600 },
  { text: 'Challenge created successfully!', duration: 1000 },
];

export default function AIThinkingLoader({ isGenerating }: AIThinkingLoaderProps) {
  const [stageIndex, setStageIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isGenerating) {
      setStageIndex(0);
      return;
    }

    const cycle = (index: number) => {
      if (index >= STAGES.length - 1) return;
      timerRef.current = setTimeout(() => {
        setStageIndex(index + 1);
        cycle(index + 1);
      }, STAGES[index].duration);
    };

    cycle(0);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isGenerating]);

  if (!isGenerating) return null;

  const currentStage = STAGES[stageIndex];
  const progressPercent = ((stageIndex + 1) / STAGES.length) * 100;

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-3 mb-3">
        <Loader2 size={18} className="text-[var(--color-primary)] animate-spin flex-shrink-0" />
        <p className="text-sm font-semibold text-[var(--color-primary)] transition-all">
          {currentStage.text}
        </p>
      </div>
      {/* Progress bar */}
      <div className="w-full bg-blue-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-[var(--color-primary)] h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        {STAGES.map((s, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              i <= stageIndex ? 'bg-[var(--color-primary)]' : 'bg-blue-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
