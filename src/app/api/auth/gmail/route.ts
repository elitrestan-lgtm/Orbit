import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Gmail OAuth — STUB.
 *
 * To wire up: swap this handler to redirect to Google's OAuth consent screen
 * with scopes like `https://www.googleapis.com/auth/gmail.readonly`, and
 * implement the `/api/auth/gmail/callback` route to exchange the code for
 * tokens and persist them in the Integration row's `config` JSON field.
 */
export async function GET() {
  const clientId = process.env.GMAIL_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      {
        error: "Gmail not configured",
        hint: "Set GMAIL_CLIENT_ID and GMAIL_CLIENT_SECRET in .env to enable.",
      },
      { status: 501 },
    );
  }
  const redirect = process.env.GMAIL_REDIRECT_URI ?? "";
  const scope = encodeURIComponent(
    "openid email https://www.googleapis.com/auth/gmail.readonly",
  );
  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=${scope}&access_type=offline&prompt=consent`;
  return NextResponse.redirect(url);
}

export async function POST() {
  // Dev convenience: toggle the "connected" state so UI wiring is testable
  // without real OAuth round-trip. Remove once the real callback lands.
  const existing = await prisma.integration.findUnique({ where: { provider: "gmail" } });
  const next = existing?.status === "connected" ? "disconnected" : "connected";
  const row = await prisma.integration.upsert({
    where: { provider: "gmail" },
    update: { status: next },
    create: { provider: "gmail", status: next },
  });
  return NextResponse.json({ provider: "gmail", status: row.status });
}
