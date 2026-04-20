import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RELATIONSHIPS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const contacts = await prisma.contact.findMany({
    orderBy: { updatedAt: "desc" },
    include: { interactions: { orderBy: { occurredAt: "desc" }, take: 20 } },
  });
  return NextResponse.json(contacts);
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = String(body.name ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }
  const relationship = (RELATIONSHIPS as readonly string[]).includes(body.relationship)
    ? body.relationship
    : "peer";
  const warmth = clampWarmth(body.warmth);

  const contact = await prisma.contact.create({
    data: {
      name,
      email: body.email || null,
      phone: body.phone || null,
      company: body.company || null,
      role: body.role || null,
      linkedinUrl: body.linkedinUrl || null,
      relationship,
      warmth,
      notes: body.notes || null,
    },
    include: { interactions: true },
  });
  return NextResponse.json(contact, { status: 201 });
}

function clampWarmth(w: unknown): number {
  const n = typeof w === "number" ? w : parseInt(String(w ?? 3), 10);
  if (Number.isNaN(n)) return 3;
  return Math.max(1, Math.min(5, n));
}
