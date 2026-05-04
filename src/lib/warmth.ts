export function computeWarmth(
  storedWarmth: number,
  lastContactedAt: string | null,
  createdAt: string,
): number {
  const ref = lastContactedAt ?? createdAt;
  const daysSince = Math.floor((Date.now() - new Date(ref).getTime()) / 86_400_000);
  const decay = Math.floor(daysSince / 30);
  return Math.max(1, storedWarmth - decay);
}
