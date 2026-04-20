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
  advisor: 45,
  collaborator: 21,
  peer: 60,
  friend: 90,
};

export const INTERACTION_KINDS = [
  "ran_into",
  "texted",
  "emailed",
  "phone_call",
  "met_up",
] as const;

export type InteractionKind = (typeof INTERACTION_KINDS)[number];

export const INTERACTION_LABELS: Record<InteractionKind, string> = {
  ran_into: "Ran into",
  texted: "Texted",
  emailed: "Emailed",
  phone_call: "Phone call",
  met_up: "Met up",
};

export const INTERACTION_ICONS: Record<InteractionKind, string> = {
  ran_into: "👋",
  texted: "💬",
  emailed: "✉️",
  phone_call: "📞",
  met_up: "🤝",
};
