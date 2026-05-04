import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";
import { INTERACTION_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export interface MessageTemplate {
  type: "text" | "linkedin" | "email";
  label: string;
  subject?: string;
  content: string;
}

const client = new Anthropic();

export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const contact = await prisma.contact.findUnique({
      where: { id: params.id },
      include: { interactions: { orderBy: { occurredAt: "desc" }, take: 5 } },
    });

    if (!contact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const interactionSummary =
      contact.interactions.length === 0
        ? "No previous interactions logged."
        : contact.interactions
            .map((it) => {
              const label =
                INTERACTION_LABELS[it.kind as keyof typeof INTERACTION_LABELS] ??
                it.kind;
              const date = new Date(it.occurredAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              return `- ${label} on ${date}${it.note ? `: "${it.note}"` : ""}`;
            })
            .join("\n");

    const prompt = `You are helping someone reconnect with a professional contact. Generate 3 warm, personal outreach message templates.

Contact details:
- Name: ${contact.name}
- Relationship: ${contact.relationship}
- Role/Company: ${[contact.role, contact.company].filter(Boolean).join(" at ") || "not specified"}
- Notes: ${contact.notes || "none"}
- Recent interactions:
${interactionSummary}

Generate exactly 3 templates:
1. A brief casual text message (2–3 sentences, relaxed tone)
2. A LinkedIn direct message (3–4 sentences, professional but warm)
3. An email with a subject line (4–5 sentence body, thoughtful)

Reference specific details from their notes and interactions to make each message feel personal, not generic.

Respond with valid JSON only, matching this exact structure:
{
  "templates": [
    { "type": "text", "label": "Text message", "content": "..." },
    { "type": "linkedin", "label": "LinkedIn DM", "content": "..." },
    { "type": "email", "label": "Email", "subject": "...", "content": "..." }
  ]
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw =
      message.content[0].type === "text" ? message.content[0].text.trim() : "";

    // Extract JSON even if Claude wraps it in a code block
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Claude did not return valid JSON" },
        { status: 500 },
      );
    }

    let templates: MessageTemplate[];
    try {
      const parsed = JSON.parse(jsonMatch[0]) as { templates: MessageTemplate[] };
      templates = parsed.templates;
    } catch {
      return NextResponse.json(
        { error: "Failed to parse Claude response" },
        { status: 500 },
      );
    }

    return NextResponse.json({ templates });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
