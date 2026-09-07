import { create } from 'zustand';

export type TRLStatus =
  | 'idle'
  | 'pitch-input'
  | 'generating'
  | 'answering'
  | 'verifying'
  | 'complete'
  | 'error';

export type Domain = 'SOFTWARE' | 'HARDWARE';

interface TRLState {
  // Flow state
  status: TRLStatus;
  domain: Domain;
  errorMessage: string | null;

  // Step 1: Pitch input
  pitch: string;
  claimedTrl: number;
  githubUrl: string;
  liveUrl: string;

  // Step 2: AI Questions
  questions: string[];
  trlTier: string;
  answers: string[];

  // Step 3: Verification Result
  verifiedTrl: number | null;
  isFraudDetected: boolean;
  technicalConfidence: number;
  downgradeReason: string | null;
  evaluationReport: string;

  // Actions
  setPitch: (pitch: string) => void;
  setClaimedTrl: (trl: number) => void;
  setDomain: (domain: Domain) => void;
  setGithubUrl: (url: string) => void;
  setLiveUrl: (url: string) => void;
  setStatus: (status: TRLStatus) => void;
  setError: (message: string) => void;

  setQuestions: (questions: string[], trlTier: string) => void;
  setAnswer: (index: number, answer: string) => void;

  setVerificationResult: (result: {
    verifiedTrl: number;
    isFraudDetected: boolean;
    technicalConfidence: number;
    downgradeReason: string | null;
    evaluationReport: string;
  }) => void;

  reset: () => void;
}

const initialState = {
  status: 'pitch-input' as TRLStatus,
  domain: 'SOFTWARE' as Domain,
  errorMessage: null,
  pitch: '',
  claimedTrl: 5,
  githubUrl: '',
  liveUrl: '',
  questions: [],
  trlTier: '',
  answers: [],
  verifiedTrl: null,
  isFraudDetected: false,
  technicalConfidence: 0,
  downgradeReason: null,
  evaluationReport: '',
};

export const useTRLStore = create<TRLState>((set) => ({
  ...initialState,

  setPitch: (pitch) => set({ pitch }),
  setClaimedTrl: (claimedTrl) => set({ claimedTrl }),
  setDomain: (domain) => set({ domain }),
  setGithubUrl: (githubUrl) => set({ githubUrl }),
  setLiveUrl: (liveUrl) => set({ liveUrl }),
  setStatus: (status) => set({ status, errorMessage: null }),
  setError: (errorMessage) => set({ status: 'error', errorMessage }),

  setQuestions: (questions, trlTier) =>
    set({
      questions,
      trlTier,
      answers: questions.map(() => ''),
      status: 'answering',
    }),

  setAnswer: (index, answer) =>
    set((state) => {
      const answers = [...state.answers];
      answers[index] = answer;
      return { answers };
    }),

  setVerificationResult: (result) =>
    set({
      verifiedTrl: result.verifiedTrl,
      isFraudDetected: result.isFraudDetected,
      technicalConfidence: result.technicalConfidence,
      downgradeReason: result.downgradeReason,
      evaluationReport: result.evaluationReport,
      status: 'complete',
    }),

  reset: () => set(initialState),
}));
