// Matches the backend's milestone subdocument exactly (models/Escrow.js).
// Note: milestones are identified by "code" (M1/M2/M3), not a Mongo _id.
export type MilestoneCode = 'M1' | 'M2' | 'M3';

export type MilestoneStatus =
  | 'PENDING'
  | 'CLAIMED'
  | 'APPROVED'
  | 'DEEMED_APPROVED'
  | 'RELEASED'
  | 'DISPUTED';

export interface Milestone {
  code: MilestoneCode;
  amount: number;
  status: MilestoneStatus;
  claimedAt?: string;
  deemedApprovalDeadline?: string;
  approvedAt?: string;
  releasedAt?: string;
  pfmsTransactionRef?: string;
}