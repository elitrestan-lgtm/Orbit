export const RELATIONSHIPS = [
  "mentor",
  "peer",
  "collaborator",
  "advisor",
  "friend",
] as const;

export type Relationship = (typeof RELATIONSHIPS)[number];

export const RELATIONSHIP_LABELS: Record<Relationship, string> = {
  mentor: "Mentor",
  peer: "Peer",
  collaborator: "Collaborator",
  advisor: "Advisor",
  friend: "Friend",
};

export const DEFAULT_NUDGE_WINDOWS: Record<Relationship, number> = {
  mentor: 30,
  advisor: 30,
  collaborator: 30,
  peer: 30,
  friend: 30,
};

export const INTERACTION_KINDS = [
  "ran_into",
  "texted",
  "emailed",
  "phone_call",
  "met_up",
  "other",
] as const;

export type InteractionKind = (typeof INTERACTION_KINDS)[number];

export const INTERACTION_LABELS: Record<InteractionKind, string> = {
  ran_into: "Ran into",
  texted: "Texted",
  emailed: "Emailed",
  phone_call: "Phone call",
  met_up: "Met up",
  other: "Other",
};

export const INTERACTION_ICONS: Record<InteractionKind, string> = {
  ran_into: "👋",
  texted: "💬",
  emailed: "✉️",
  phone_call: "📞",
  met_up: "🤝",
  other: "📝",
};
