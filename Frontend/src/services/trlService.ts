import api from './api';

/**
 * TRL Service — calls the Node.js Backend API Gateway (port 5000).
 * The backend then forwards requests to the ML Python server internally.
 * 
 * ARCHITECTURE: Frontend → Backend (5000) → ML (8000)
 * Frontend must NEVER call ML (8000) directly.
 */

/* ═══ Types ═══════════════════════════════════════════════════════════ */

export interface TRLQuestionsResponse {
  questions: string[];
  tier_name: string;
  claimed_trl: number;
}

export interface TRLVerificationResult {
  is_fraud_detected: boolean;
  claimed_trl: number;
  final_verified_trl: number;
  technical_confidence: number;
  downgrade_reason: string | null;
  evaluation_report: string;
  answer_scores: number[];
}

export interface BackendProofs {
  github_verified: boolean;
  live_url_verified: boolean;
}

export interface HardwareDocResult {
  verified: boolean;
  confidence: number;
}

export interface HardwareVideoResult {
  verified: boolean;
  otp_matched: boolean;
  hardware_detected: string;
}

/* ═══ API Calls (all routed through Node.js Backend) ═══════════════ */

/**
 * Step 1: Generate 3 AI-powered TRL verification questions.
 * Backend route: POST /api/trl/generate-questions
 */
export async function generateQuestions(
  startupPitch: string,
  claimedTrl: number,
  domain: string
): Promise<TRLQuestionsResponse> {
  const res = await api.post('/trl/generate-questions', {
    startup_pitch: startupPitch,
    claimed_trl: claimedTrl,
    domain: domain,
  });
  return res.data;
}

/**
 * Step 2: Zero-Trust TRL verification with answers + backend proofs.
 * Backend route: POST /api/trl/evaluate-software
 */
export async function verifyTRL(
  questions: string[],
  userAnswers: string[],
  claimedTrl: number,
  backendProofs: BackendProofs
): Promise<TRLVerificationResult> {
  const res = await api.post('/trl/evaluate-software', {
    questions,
    user_answers: userAnswers,
    claimed_trl: claimedTrl,
    backend_proofs: backendProofs,
  });
  return res.data;
}

/**
 * Hardware TRL 1-3: Verify a CAD/PCB schematic document.
 * Backend route: POST /api/trl/hardware/verify-doc (multipart)
 */
export async function verifyHardwareDoc(file: File): Promise<HardwareDocResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/trl/hardware/verify-doc', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return res.data;
}

/**
 * Hardware TRL 4-6: Verify a "hostage video" with OTP.
 * Backend route: POST /api/trl/hardware/verify-video (multipart)
 */
export async function verifyHardwareVideo(
  file: File,
  expectedOtp: string
): Promise<HardwareVideoResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('expected_otp', expectedOtp);

  const res = await api.post('/trl/hardware/verify-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  });
  return res.data;
}

/**
 * Health check — confirm backend + ML pipeline is alive.
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const res = await api.get('/trl/health', { timeout: 5000 });
    return res.data?.status === 'ok';
  } catch {
    return false;
  }
}
