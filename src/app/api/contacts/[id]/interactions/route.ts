import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { INTERACTION_KINDS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const kind = String(body.kind ?? "");
  if (!(INTERACTION_KINDS as readonly string[]).includes(kind)) {
    return NextResponse.json({ error: "invalid interaction kind" }, { status: 400 });
  }
  const note = body.note ? String(body.note).slice(0, 1000) : null;
  const occurredAt = body.occurredAt ? new Date(body.occurredAt) : new Date();

  await prisma.interaction.create({
    data: {
      contactId: params.id,
      kind,
      note,
      occurredAt,
    },
  });

  const contact = await prisma.contact.update({
    where: { id: params.id },
    data: { lastContactedAt: occurredAt },
    include: { interactions: { orderBy: { occurredAt: "desc" }, take: 20 } },
  });

  return NextResponse.json(contact);
}
