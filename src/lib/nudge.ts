import {
  DEFAULT_NUDGE_WINDOWS,
  type Relationship,
  RELATIONSHIPS,
} from "./constants";

export type NudgeStatus = "fresh" | "due" | "overdue" | "never";

export interface NudgeInfo {
  status: NudgeStatus;
  daysSince: number | null;
  window: number;
  daysRemaining: number | null;
}

export function nudgeFor(
  lastContactedAt: Date | string | null | undefined,
  relationship: string,
  windows: Record<string, number> = DEFAULT_NUDGE_WINDOWS,
): NudgeInfo {
  const window = windows[relationship] ?? DEFAULT_NUDGE_WINDOWS.peer;

  if (!lastContactedAt) {
    return { status: "never", daysSince: null, window, daysRemaining: null };
  }

  const last = new Date(lastContactedAt).getTime();
  const now = Date.now();
  const daysSince = Math.floor((now - last) / 86_400_000);
  const daysRemaining = window - daysSince;

  let status: NudgeStatus = "fresh";
  if (daysSince >= window) status = "overdue";
  else if (daysSince >= window * 0.8) status = "due";

  return { status, daysSince, window, daysRemaining };
}

export function isRelationship(value: string): value is Relationship {
  return (RELATIONSHIPS as readonly string[]).includes(value);
}
