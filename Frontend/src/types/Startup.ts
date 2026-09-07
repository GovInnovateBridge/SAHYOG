export type StartupType = 'SOFTWARE' | 'HARDWARE';

export interface Startup {
  _id: string;
  name: string;
  email: string;
  dpiitNumber: string;
  type: StartupType;
  trlLevel: number;           // AI-verified TRL score (1–9)
  trlVerified: boolean;
  description: string;        // Solution description used for semantic matching
  githubUrl?: string;
  demoUrl?: string;
  createdAt: string;
}
