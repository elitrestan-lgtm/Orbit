import OrbitApp from "@/components/OrbitApp";
import { prisma } from "@/lib/prisma";
import { DEFAULT_NUDGE_WINDOWS, RELATIONSHIPS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [contacts, nudgeSettings, integrations] = await Promise.all([
    prisma.contact.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        interactions: { orderBy: { occurredAt: "desc" }, take: 20 },
      },
    }),
    prisma.nudgeSetting.findMany(),
    prisma.integration.findMany(),
  ]);

  const nudgeMap: Record<string, number> = { ...DEFAULT_NUDGE_WINDOWS };
  for (const s of nudgeSettings) nudgeMap[s.relationship] = s.daysWindow;
  for (const r of RELATIONSHIPS) if (nudgeMap[r] == null) nudgeMap[r] = DEFAULT_NUDGE_WINDOWS[r];

  const integrationMap: Record<string, string> = { gmail: "disconnected", linkedin: "disconnected" };
  for (const i of integrations) integrationMap[i.provider] = i.status;

  return (
    <OrbitApp
      initialContacts={JSON.parse(JSON.stringify(contacts))}
      initialNudgeWindows={nudgeMap}
      initialIntegrations={integrationMap}
    />
  );
}
