import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RELATIONSHIPS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const contact = await prisma.contact.findUnique({
    where: { id: params.id },
    include: { interactions: { orderBy: { occurredAt: "desc" } } },
  });
  if (!contact) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(contact);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const data: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) return NextResponse.json({ error: "name cannot be empty" }, { status: 400 });
    data.name = name;
  }
  if (body.email !== undefined) data.email = body.email || null;
  if (body.phone !== undefined) data.phone = body.phone || null;
  if (body.company !== undefined) data.company = body.company || null;
  if (body.role !== undefined) data.role = body.role || null;
  if (body.linkedinUrl !== undefined) data.linkedinUrl = body.linkedinUrl || null;
  if (body.notes !== undefined) data.notes = body.notes || null;
  if (body.relationship !== undefined) {
    if (!(RELATIONSHIPS as readonly string[]).includes(body.relationship)) {
      return NextResponse.json({ error: "invalid relationship" }, { status: 400 });
    }
    data.relationship = body.relationship;
  }
  if (body.warmth !== undefined) {
    const n = Number(body.warmth);
    if (Number.isNaN(n)) return NextResponse.json({ error: "invalid warmth" }, { status: 400 });
    data.warmth = Math.max(1, Math.min(5, n));
  }

  const contact = await prisma.contact.update({
    where: { id: params.id },
    data,
    include: { interactions: { orderBy: { occurredAt: "desc" }, take: 20 } },
  });
  return NextResponse.json(contact);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.contact.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
