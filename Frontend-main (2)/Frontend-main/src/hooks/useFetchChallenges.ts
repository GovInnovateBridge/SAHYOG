import { useState, useEffect } from 'react';
import type { Challenge } from '../types/Challenge';
import { fetchChallenges } from '../services/challengeService';

// ── Demo Fallback: shown when backend is down or DB is empty ─────────────────
// Uses REAL backend status values: PUBLISHED, EVALUATING, SANDBOX_ACTIVE.
// Also maps backend fields (problemStatementRaw → description, pilotBudgetInr, etc.)
const DEMO_CHALLENGES: Challenge[] = [
  {
    _id: 'ch_001',
    title: 'AI-Driven Traffic Anomaly Detection via Drone Surveillance',
    description: 'Detect traffic anomalies and road incidents in real-time using drone camera footage across national highways.',
    problemStatementRaw: 'Detect traffic anomalies and road incidents in real-time using drone camera footage across national highways.',
    pilotBudgetInr: 2000000,
    budgetMin: 500000,
    budgetMax: 2000000,
    kpis: [
      { metric: 'Anomaly Detection Accuracy', target: '>= 95%' },
      { metric: 'Real-time Latency', target: '<= 200ms' },
      { metric: 'System Uptime', target: '>= 99.5%' },
    ],
    status: 'PUBLISHED',
    departmentName: 'Ministry of Road Transport',
    psNumber: 'PS-2026-MH-001',
    authorId: 'govt_officer_001',
    createdBy: 'govt_officer_001',
    publishedAt: '2026-08-01T10:00:00Z',
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    _id: 'ch_002',
    title: 'Rural Water Quality Monitoring IoT Network',
    description: 'Deploy low-cost IoT sensors across 500 villages to monitor drinking water quality and alert authorities in real-time.',
    problemStatementRaw: 'Deploy low-cost IoT sensors across 500 villages to monitor drinking water quality.',
    pilotBudgetInr: 5000000,
    budgetMin: 1000000,
    budgetMax: 5000000,
    kpis: [
      { metric: 'Sensor Coverage', target: '500 villages' },
      { metric: 'Data Freshness', target: '<= 15 min' },
      { metric: 'Uptime SLA', target: '>= 99%' },
    ],
    status: 'EVALUATING',
    departmentName: 'Jal Jeevan Mission',
    psNumber: 'PS-2026-UP-002',
    authorId: 'govt_officer_001',
    createdBy: 'govt_officer_001',
    publishedAt: '2026-07-15T10:00:00Z',
    createdAt: '2026-07-15T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    _id: 'ch_003',
    title: 'Smart Crop Disease Detection via Mobile Vision AI',
    description: 'Enable field-level crop disease detection using mobile cameras with offline-capable AI models for rural farmers.',
    problemStatementRaw: 'Enable field-level crop disease detection using mobile cameras with offline-capable AI models.',
    pilotBudgetInr: 3000000,
    budgetMin: 800000,
    budgetMax: 3000000,
    kpis: [
      { metric: 'Disease Classification Accuracy', target: '>= 92%' },
      { metric: 'Works Offline', target: 'Yes, with local model' },
    ],
    status: 'SANDBOX_ACTIVE',
    departmentName: 'Ministry of Agriculture',
    psNumber: 'PS-2026-KA-003',
    authorId: 'govt_officer_002',
    createdBy: 'govt_officer_002',
    publishedAt: '2026-06-10T10:00:00Z',
    createdAt: '2026-06-10T10:00:00Z',
    updatedAt: '2026-08-10T10:00:00Z',
  },
];

/**
 * Maps a raw backend Challenge document to the frontend Challenge interface.
 * Backend returns problemStatementRaw, pilotBudgetInr, createdBy, extractedKPIs, etc.
 */
function mapBackendChallenge(c: any): Challenge {
  return {
    _id: c._id,
    title: c.title,
    description: c.problemStatementRaw || c.description || '',
    problemStatementRaw: c.problemStatementRaw,
    pilotBudgetInr: c.pilotBudgetInr,
    budgetMin: c.pilotBudgetInr ? Math.floor(c.pilotBudgetInr * 0.5) : undefined,
    budgetMax: c.pilotBudgetInr,
    kpis: c.extractedKPIs?.metrics || c.kpis || [],
    extractedKPIs: c.extractedKPIs,
    status: c.status,
    authorId: c.createdBy,
    createdBy: c.createdBy,
    departmentName: c.departmentName,
    category: c.category,
    psNumber: c.psNumber,
    publishedAt: c.publishedAt,
    evaluationDeadline: c.evaluationDeadline,
    applicationDeadline: c.applicationDeadline,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

/**
 * Custom hook to fetch all government challenges.
 * Falls back to DEMO_CHALLENGES if backend is unreachable or returns empty.
 */
export const useFetchChallenges = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchChallenges();
        // Map backend response to frontend type, fall back to demo if empty
        const mapped = data.map(mapBackendChallenge);
        setChallenges(mapped.length > 0 ? mapped : DEMO_CHALLENGES);
      } catch (err) {
        console.warn('[useFetchChallenges] Backend unavailable — using demo data.');
        setChallenges(DEMO_CHALLENGES);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { challenges, loading, error };
};
