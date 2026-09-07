# 3-Stage Automated Filtration Funnel Implementation Plan

This document outlines the technical implementation for the dynamic "N to Top 3" filtration funnel for the Sahyog platform. This ensures we can process any number of incoming proposals, filter them using AI/ML, and seamlessly pass the results between the Python ML Microservice, the Node.js Backend, and the React Frontend.

## Goal Description

To implement a robust, rate-limit-safe, 3-stage filtration engine:
1. **S1 (Semantic Triage):** Filter `N` proposals based on $\ge$ 80% cosine similarity.
2. **S2 (Automated Sandbox):** Benchmark startup APIs using synthetic data.
3. **S3 (Double-Blind QCBS):** Redact PII for jury evaluation and query the DB for the final Top 3.

## Open Questions

> [!WARNING]
> **API Rate Limits:**
> Handling hundreds of proposals at once requires batching. Is the Gemini API tier you are using sufficient for processing 50-100 embeddings per minute? We will implement batch-sleeping to prevent 429 Too Many Requests errors.

> [!IMPORTANT]
> **Sandbox Security:**
> When the Node.js backend pings Startup APIs in Stage S2, we need a timeout limit (e.g., 5 seconds) to prevent our server from hanging if a startup's API is unresponsive.

---

## Proposed Changes

### 1. ML Microservice (FastAPI - Python)

This component handles the heavy mathematical and AI tasks.

#### [MODIFY] `ml_service/api/matchmaking.py`
- Create `POST /semantic-triage`.
- Implement vector embedding generation for the Problem Statement and all Proposals.
- **Batching Logic:** Process embeddings in chunks of 50 to avoid Gemini API timeouts.
- Calculate Cosine Similarity. Return a list of Startup IDs that scored $\ge$ 0.80.

#### [NEW] `ml_service/api/sandbox_tester.py`
- Create `POST /generate-synthetic-data`.
- Takes a Problem Statement as input. Uses Gemini to output a JSON array of 10 fake, realistic data payloads (e.g., fake traffic data) for API stress testing.

#### [NEW] `ml_service/api/redaction.py`
- Create `POST /redact-proposal`.
- Uses Gemini 1.5 Flash (or `spacy`) to scan proposal text and replace `Company Name`, `Founder Names`, and `Emails` with `[REDACTED_ENTITY]`.

---

### 2. Main Backend (Node.js / Express)

This component handles database orchestration and workflow state.

#### [NEW] `src/services/triageService.js`
- Fetches all `SUBMITTED` proposals for a Challenge.
- Calls ML `/semantic-triage`.
- Updates MongoDB: Proposals `< 80%` get status `REJECTED_S1`. The rest become `PASSED_S1`.

#### [NEW] `src/services/sandboxRunner.js`
- For startups in `PASSED_S1`, fetch synthetic data from ML.
- Use `axios.all` or `Promise.allSettled` to fire requests to the startup's API endpoint.
- Measure latency (`Date.now()`) and count HTTP 200 responses for Uptime. Save scores to DB.

#### [MODIFY] `src/controllers/evaluationController.js`
- Before sending proposals to the Govt Frontend for Jury scoring, call ML `/redact-proposal` so the Jury gets blinded data.
- **The Top 3 Query:** Once the Jury submits tech scores (70%) and financial bids (30%) are calculated, run the final query:
  `Proposal.find({ challengeId }).sort({ finalQcbsScore: -1 }).limit(3)`
- Update these 3 to `SELECTED_FOR_PILOT`.

---

### 3. Frontend (React / Tailwind)

This component visualizes the funnel for the Government Officer.

#### [NEW] `src/pages/govt/S1TriageDashboard.tsx`
- A dashboard showing the incoming funnel. 
- Button: "Run Semantic Triage". Shows a loading state while Node.js and ML process the batch.
- Displays a table of surviving startups with "Match %" badges.

#### [NEW] `src/pages/govt/S2SandboxDashboard.tsx`
- Button: "Initiate API Stress Test".
- Displays live progress bars for Uptime and Latency metrics.

#### [NEW] `src/pages/govt/S3BlindEvaluation.tsx`
- Displays the redacted proposal text. 
- Form inputs for the Jury to enter out of 100 for Technical Quality.
- A final "Podium UI" revealing the Top 3 Winners who are moving to the Smart Escrow Sandbox.

---

## Verification Plan

### Automated Tests
- Write a Python script to send 200 dummy proposals to `/semantic-triage` to ensure the batching logic prevents API rate-limit crashes.
- Test the Cosine Similarity math with a known exact string (should return 1.0) and a completely unrelated string (should return < 0.3).

### Manual Verification
- Log in to Govt Frontend -> Create Challenge -> Submit 5 mock proposals -> Run the entire funnel via UI buttons and verify that exactly 3 end up in the "Smart Escrow" tab.
