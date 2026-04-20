export interface Interaction {
  id: string;
  contactId: string;
  kind: string;
  note: string | null;
  occurredAt: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  linkedinUrl: string | null;
  relationship: string;
  warmth: number;
  notes: string | null;
  lastContactedAt: string | null;
  createdAt: string;
  updatedAt: string;
  interactions: Interaction[];
}

export type NudgeWindows = Record<string, number>;
export type IntegrationStatus = Record<string, string>;
