import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * LinkedIn OAuth — STUB.
 *
 * To wire up: redirect to LinkedIn's OAuth consent screen with scopes like
 * `r_liteprofile r_emailaddress`, and implement `/api/auth/linkedin/callback`
 * to exchange the code for tokens and persist them.
 */
export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      {
        error: "LinkedIn not configured",
        hint: "Set LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET in .env to enable.",
      },
      { status: 501 },
    );
  }
  const redirect = process.env.LINKEDIN_REDIRECT_URI ?? "";
  const scope = encodeURIComponent("r_liteprofile r_emailaddress");
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirect)}&scope=${scope}`;
  return NextResponse.redirect(url);
}

export async function POST() {
  const existing = await prisma.integration.findUnique({
    where: { provider: "linkedin" },
  });
  const next = existing?.status === "connected" ? "disconnected" : "connected";
  const row = await prisma.integration.upsert({
    where: { provider: "linkedin" },
    update: { status: next },
    create: { provider: "linkedin", status: next },
  });
  return NextResponse.json({ provider: "linkedin", status: row.status });
}
