import axios from 'axios';

/**
 * ML Service Client — calls the FastAPI TRL Engine directly.
 * Used for the interactive TRL Assessment flow (quiz → questions → verify).
 */
const mlApi = axios.create({
  baseURL: import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30s — LLM calls can take time
});

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface TRLQuestionsResponse {
  claimed_trl: number;
  trl_tier: string;
  questions: string[];
}

export interface TRLVerificationResult {
  is_fraud_detected: boolean;
  claimed_trl: number;
  final_verified_trl: number;
  technical_confidence: number;
  downgrade_reason: string | null;
  evaluation_report: string;
}

export interface BackendProofs {
  github_verified: boolean;
  live_url_verified: boolean;
  dns_verified: boolean;
  security_cert_verified: boolean;
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

/* ─── API Calls ─────────────────────────────────────────────────────────── */

/**
 * Step 1: Generate 3 AI-powered TRL verification questions.
 */
export async function generateQuestions(
  startupPitch: string,
  claimedTrl: number
): Promise<TRLQuestionsResponse> {
  const res = await mlApi.post('/generate-questions', {
    startup_pitch: startupPitch,
    claimed_trl: claimedTrl,
  });
  return res.data;
}

/**
 * Step 2: Zero-Trust TRL verification with answers + backend proofs.
 */
export async function verifyTRL(
  questions: string[],
  userAnswers: string[],
  claimedTrl: number,
  backendProofs: BackendProofs
): Promise<TRLVerificationResult> {
  const res = await mlApi.post('/verify-trl', {
    questions,
    user_answers: userAnswers,
    claimed_trl: claimedTrl,
    backend_proofs: backendProofs,
  });
  return res.data;
}

/**
 * Hardware TRL 1-3: Verify a CAD/PCB schematic document.
 */
export async function verifyHardwareDoc(file: File): Promise<HardwareDocResult> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await mlApi.post('/hardware/verify-doc', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return res.data;
}

/**
 * Hardware TRL 4-6: Verify a "hostage video" with OTP.
 */
export async function verifyHardwareVideo(
  file: File,
  expectedOtp: string
): Promise<HardwareVideoResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('expected_otp', expectedOtp);

  const res = await mlApi.post('/hardware/verify-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000, // Videos take longer
  });
  return res.data;
}

/**
 * Health check — confirm ML server is alive.
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const res = await mlApi.get('/', { timeout: 5000 });
    return res.data?.status === 'ok';
  } catch {
    return false;
  }
}
