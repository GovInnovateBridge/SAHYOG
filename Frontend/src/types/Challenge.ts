// ── Backend status values (from models/Challenge.js) ──────────────────────────
// "DRAFT" | "PUBLISHED" | "EVALUATING" | "SANDBOX_ACTIVE" | "AWARDED" | "CLOSED"
// "OPEN" and "PILOT" are kept as deprecated frontend-only aliases for mock data.
export type ChallengeStatus =
  | 'DRAFT'
  | 'PUBLISHED'
  | 'EVALUATING'
  | 'SANDBOX_ACTIVE'
  | 'AWARDED'
  | 'CLOSED'
  // Legacy/demo aliases — not returned by backend but used in mock data
  | 'OPEN'
  | 'PILOT';

export interface KPI {
  metric: string;
  target: string;
}

export interface Challenge {
  _id: string;
  title: string;
  // Backend field: "problemStatementRaw". Frontend uses "description" as a UI alias.
  description?: string;
  problemStatementRaw?: string;
  budgetMin?: number;
  budgetMax?: number;
  pilotBudgetInr?: number;
  kpis?: KPI[];
  // Backend field: extractedKPIs (object from ML)
  extractedKPIs?: { metrics?: KPI[]; kpiVector?: number[] };
  status: ChallengeStatus;
  // Backend field: "createdBy" (ObjectId ref). Frontend uses "authorId" as alias.
  authorId?: string;
  createdBy?: string;
  departmentName?: string;
  category?: string;
  psNumber?: string;
  publishedAt?: string;
  evaluationDeadline?: string;
  applicationDeadline?: string;
  createdAt?: string;
  updatedAt?: string;
}
