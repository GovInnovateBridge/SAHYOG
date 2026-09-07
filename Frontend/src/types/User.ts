export type UserRole = 'NODAL_OFFICER' | 'STARTUP_FOUNDER' | 'VIEWER' | 'JURY_MEMBER';

// Returned inside GET /auth/me's "profile" field when role === STARTUP_FOUNDER
export interface StartupProfileData {
  companyName: string;
  dpiitNumber: string;
  dpiitDetails?: Record<string, unknown> | null;
}

// Returned inside GET /auth/me's "profile" field when role === NODAL_OFFICER or JURY_MEMBER
export interface GovernmentProfileData {
  departmentName: string;
  designation?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  // organization/dpiitNumber no longer live flat on User — backend moved them
  // into separate StartupProfile/GovernmentProfile documents (see below).
  profile: StartupProfileData | GovernmentProfileData | null;
  hasCompletedTrl?: boolean;
  verifiedTrlScore?: number;
}
