import type { Milestone } from './Milestone';

// Matches the backend's Escrow model exactly (models/Escrow.js).
// There is no top-level "status", "totalAmountInr", or "releasedAmountInr" —
// those are derived from summing the milestones array on the frontend if needed.
export interface Escrow {
  _id: string;
  proposal: string;   // Proposal _id
  challenge: string;  // Challenge _id
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}