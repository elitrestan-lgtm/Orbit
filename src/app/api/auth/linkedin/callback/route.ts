import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * LinkedIn OAuth callback — STUB.
 *
 * Exchange `code` for tokens at https://www.linkedin.com/oauth/v2/accessToken
 * and persist them in the Integration `config` field.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "missing code" }, { status: 400 });
  }
  await prisma.integration.upsert({
    where: { provider: "linkedin" },
    update: { status: "connected", config: JSON.stringify({ placeholder: true }) },
    create: {
      provider: "linkedin",
      status: "connected",
      config: JSON.stringify({ placeholder: true }),
    },
  });
  return NextResponse.redirect(new URL("/", req.url));
}
