import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; interactionId: string } },
) {
  const interaction = await prisma.interaction.findUnique({
    where: { id: params.interactionId },
  });
  if (!interaction || interaction.contactId !== params.id) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  await prisma.interaction.delete({ where: { id: params.interactionId } });

  // Recalculate lastContactedAt from remaining interactions
  const latest = await prisma.interaction.findFirst({
    where: { contactId: params.id },
    orderBy: { occurredAt: "desc" },
  });

  const contact = await prisma.contact.update({
    where: { id: params.id },
    data: { lastContactedAt: latest?.occurredAt ?? null },
    include: { interactions: { orderBy: { occurredAt: "desc" }, take: 20 } },
  });

  return NextResponse.json(contact);
}
