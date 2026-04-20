import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RELATIONSHIPS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await prisma.nudgeSetting.findMany();
  const map: Record<string, number> = {};
  for (const r of rows) map[r.relationship] = r.daysWindow;
  return NextResponse.json(map);
}

export async function POST(req: Request) {
  const body = await req.json();
  const relationship = String(body.relationship ?? "");
  if (!(RELATIONSHIPS as readonly string[]).includes(relationship)) {
    return NextResponse.json({ error: "invalid relationship" }, { status: 400 });
  }
  const daysWindow = Number(body.daysWindow);
  if (!Number.isFinite(daysWindow) || daysWindow < 1 || daysWindow > 365) {
    return NextResponse.json({ error: "daysWindow must be 1-365" }, { status: 400 });
  }

  const row = await prisma.nudgeSetting.upsert({
    where: { relationship },
    update: { daysWindow },
    create: { relationship, daysWindow },
  });
  return NextResponse.json(row);
}
