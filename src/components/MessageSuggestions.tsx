"use client";

import { useState } from "react";
import type { MessageTemplate } from "@/app/api/contacts/[id]/suggest/route";

const TYPE_ICONS: Record<string, string> = {
  text: "💬",
  linkedin: "🔗",
  email: "✉️",
};

interface Props {
  contactId: string;
  contactName: string;
}

export default function MessageSuggestions({ contactId, contactName }: Props) {
  const [templates, setTemplates] = useState<MessageTemplate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setTemplates(null);
    try {
      const res = await fetch(`/api/contacts/${contactId}/suggest`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({ error: "Server error" })) as
        | { templates: MessageTemplate[] }
        | { error: string };
      if (!res.ok || "error" in data) {
        throw new Error(
          "error" in data ? data.error : "Failed to generate messages",
        );
      }
      setTemplates(data.templates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copy(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="card bg-orbit-bg/50 p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="label">Message ideas</div>
        <button
          className="btn-primary text-xs"
          onClick={generate}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Generating...
            </span>
          ) : (
            "✨ Generate with Claude"
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          {error}
        </div>
      )}

      {!templates && !loading && !error && (
        <p className="text-xs text-slate-500">
          Generate personalized outreach templates for {contactName} based on
          their notes and interaction history.
        </p>
      )}

      {templates && (
        <div className="space-y-3">
          {templates.map((t) => {
            const bodyId = `${t.type}-body`;
            const subjectId = `${t.type}-subject`;
            return (
              <div
                key={t.type}
                className="rounded-md border border-white/5 bg-white/[0.03] p-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                    <span>{TYPE_ICONS[t.type] ?? "📝"}</span>
                    {t.label}
                  </span>
                  <button
                    className="btn text-xs"
                    onClick={() => copy(bodyId, t.type === "email" ? `Subject: ${t.subject}\n\n${t.content}` : t.content)}
                  >
                    {copied === bodyId ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                {t.subject && (
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500">Subject:</span>
                    <div className="flex flex-1 items-center justify-between gap-2 rounded bg-white/5 px-2 py-1">
                      <span className="text-xs text-slate-300">{t.subject}</span>
                      <button
                        className="shrink-0 text-[10px] text-slate-500 hover:text-white"
                        onClick={() => copy(subjectId, t.subject!)}
                      >
                        {copied === subjectId ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>
                )}

                <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-300">
                  {t.content}
                </p>
              </div>
            );
          })}

          <button
            className="btn-ghost w-full text-xs"
            onClick={generate}
            disabled={loading}
          >
            ↻ Regenerate
          </button>
        </div>
      )}
    </div>
  );
}
