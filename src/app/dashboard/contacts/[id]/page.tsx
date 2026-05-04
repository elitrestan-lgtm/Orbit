import { prisma } from "@/lib/prisma";
import { DEFAULT_NUDGE_WINDOWS, RELATIONSHIPS } from "@/lib/constants";
import { notFound } from "next/navigation";
import ContactProfilePage from "@/components/ContactProfilePage";

export const dynamic = "force-dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const [contact, nudgeSettings] = await Promise.all([
    prisma.contact.findUnique({
      where: { id: params.id },
      include: { interactions: { orderBy: { occurredAt: "asc" } } },
    }),
    prisma.nudgeSetting.findMany(),
  ]);

  if (!contact) notFound();

  const nudgeMap: Record<string, number> = { ...DEFAULT_NUDGE_WINDOWS };
  for (const s of nudgeSettings) nudgeMap[s.relationship] = s.daysWindow;
  for (const r of RELATIONSHIPS) if (nudgeMap[r] == null) nudgeMap[r] = DEFAULT_NUDGE_WINDOWS[r];

  return (
    <ContactProfilePage
      contact={JSON.parse(JSON.stringify(contact))}
      nudgeWindows={nudgeMap}
    />
  );
}
