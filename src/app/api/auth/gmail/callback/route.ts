import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Gmail OAuth callback — STUB.
 *
 * Exchange `code` for tokens with Google's token endpoint, then store tokens
 * in the Integration `config` field (encrypt in production).
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "missing code" }, { status: 400 });
  }
  // TODO: exchange code for tokens via https://oauth2.googleapis.com/token
  await prisma.integration.upsert({
    where: { provider: "gmail" },
    update: { status: "connected", config: JSON.stringify({ placeholder: true }) },
    create: {
      provider: "gmail",
      status: "connected",
      config: JSON.stringify({ placeholder: true }),
    },
  });
  return NextResponse.redirect(new URL("/", req.url));
}
