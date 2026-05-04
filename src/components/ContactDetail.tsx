"use client";

import { useEffect, useState } from "react";
import {
  INTERACTION_ICONS,
  INTERACTION_KINDS,
  INTERACTION_LABELS,
  RELATIONSHIP_LABELS,
  type InteractionKind,
} from "@/lib/constants";
import { nudgeFor } from "@/lib/nudge";
import type { Contact, NudgeWindows } from "@/lib/types";
import WarmthBadge from "./WarmthBadge";

interface Props {
  contact: Contact;
  nudgeWindows: NudgeWindows;
  onEdit: () => void;
  onDelete: () => void;
  onLogInteraction: (kind: InteractionKind, note?: string) => void;
  onUpdateNotes: (notes: string) => void;
}

export default function ContactDetail({
  contact,
  nudgeWindows,
  onEdit,
  onDelete,
  onLogInteraction,
  onUpdateNotes,
}: Props) {
  const nudge = nudgeFor(contact.lastContactedAt, contact.relationship, nudgeWindows);
  const [selectedKind, setSelectedKind] = useState<InteractionKind | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [notes, setNotes] = useState(contact.notes ?? "");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    setNotes(contact.notes ?? "");
    setSelectedKind(null);
    setNoteInput("");
  }, [contact.id, contact.notes]);

  function handleSelectKind(kind: InteractionKind) {
    setSelectedKind((prev) => (prev === kind ? null : kind));
    if (kind !== selectedKind) setNoteInput("");
  }

  function handleLog() {
    if (!selectedKind) return;
    onLogInteraction(selectedKind, noteInput.trim() || undefined);
    setSelectedKind(null);
    setNoteInput("");
  }

  async function saveNotes() {
    if (notes === (contact.notes ?? "")) return;
    setSavingNotes(true);
    await onUpdateNotes(notes);
    setSavingNotes(false);
  }

  return (
    <div className="card flex h-full flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-orbit-border p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-xl font-semibold text-white">
              {contact.name}
            </h2>
            <span className="chip capitalize">
              {RELATIONSHIP_LABELS[contact.relationship as keyof typeof RELATIONSHIP_LABELS] ??
                contact.relationship}
            </span>
            <WarmthBadge warmth={contact.warmth} />
          </div>
          <div className="mt-1 text-sm text-slate-400">
            {[contact.role, contact.company].filter(Boolean).join(" · ") || "No title"}
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
            {contact.email && (
              <a className="hover:text-white" href={`mailto:${contact.email}`}>
                ✉️ {contact.email}
              </a>
            )}
            {contact.phone && (
              <a className="hover:text-white" href={`tel:${contact.phone}`}>
                📞 {contact.phone}
              </a>
            )}
            {contact.linkedinUrl && (
              <a
                className="hover:text-white"
                href={contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                🔗 LinkedIn
              </a>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={onEdit}>
            Edit
          </button>
          <button
            className="btn text-red-400 hover:border-red-500 hover:text-red-300"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid gap-4 border-b border-orbit-border p-4 md:grid-cols-2">
        <NudgeCard nudge={nudge} relationship={contact.relationship} />
        <div className="card bg-orbit-bg/50 p-3">
          <div className="label mb-2">Log a connection</div>
          <div className="flex flex-wrap gap-1.5">
            {INTERACTION_KINDS.map((kind) => (
              <button
                key={kind}
                className={`btn transition-all ${
                  selectedKind === kind
                    ? "border-orbit-accent bg-orbit-accent/20 text-white"
                    : ""
                }`}
                onClick={() => handleSelectKind(kind)}
                title={`Log ${INTERACTION_LABELS[kind]}`}
              >
                <span>{INTERACTION_ICONS[kind]}</span>
                <span>{INTERACTION_LABELS[kind]}</span>
              </button>
            ))}
          </div>

          {selectedKind && (
            <div className="mt-3 space-y-2 rounded-md border border-orbit-accent/30 bg-orbit-accent/5 p-3">
              <div className="text-xs text-slate-400">
                {selectedKind === "other"
                  ? "Describe the interaction"
                  : `Note about this ${INTERACTION_LABELS[selectedKind].toLowerCase()}`}
                {selectedKind !== "other" && (
                  <span className="ml-1 text-slate-500">(optional)</span>
                )}
              </div>
              <textarea
                className="input resize-none"
                rows={2}
                placeholder={
                  selectedKind === "other"
                    ? "What happened? e.g. introduced me to someone, shared an article..."
                    : "Any context worth remembering..."
                }
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                autoFocus
              />
              <div className="flex items-center justify-between gap-2">
                <button
                  className="btn-ghost text-xs"
                  onClick={() => { setSelectedKind(null); setNoteInput(""); }}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary text-xs"
                  onClick={handleLog}
                  disabled={selectedKind === "other" && !noteInput.trim()}
                >
                  Log {INTERACTION_ICONS[selectedKind]} {INTERACTION_LABELS[selectedKind]}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-4 p-4 md:grid-cols-2">
        <div className="card flex min-h-0 flex-col bg-orbit-bg/50 p-3">
          <div className="label mb-2">Timeline</div>
          <div className="flex-1 overflow-y-auto">
            {contact.interactions.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No interactions yet. Log one above.
              </div>
            ) : (
              <ul className="space-y-2">
                {contact.interactions.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-start gap-2 rounded-md border border-orbit-border/60 bg-orbit-panel p-2"
                  >
                    <span className="text-lg">
                      {INTERACTION_ICONS[it.kind as InteractionKind] ?? "•"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="text-slate-200">
                          {INTERACTION_LABELS[it.kind as InteractionKind] ?? it.kind}
                        </span>
                        <span className="text-xs text-slate-500">
                          {formatDate(it.occurredAt)}
                        </span>
                      </div>
                      {it.note && (
                        <div className="mt-1 text-xs text-slate-400">{it.note}</div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="card flex min-h-0 flex-col bg-orbit-bg/50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="label">Notes</div>
            <button
              className="btn-ghost"
              onClick={saveNotes}
              disabled={savingNotes || notes === (contact.notes ?? "")}
            >
              {savingNotes ? "Saving..." : "Save"}
            </button>
          </div>
          <textarea
            className="input flex-1 resize-none"
            placeholder="Context, topics to follow up on, gift ideas, etc."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={saveNotes}
          />
        </div>
      </div>
    </div>
  );
}

function NudgeCard({
  nudge,
  relationship,
}: {
  nudge: ReturnType<typeof nudgeFor>;
  relationship: string;
}) {
  const tone =
    nudge.status === "overdue"
      ? "border-orbit-warm/40 bg-orbit-warm/10 text-orbit-warm"
      : nudge.status === "due"
        ? "border-amber-400/40 bg-amber-400/10 text-amber-300"
        : nudge.status === "never"
          ? "border-slate-600/40 bg-slate-600/10 text-slate-300"
          : "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";

  const message =
    nudge.status === "never"
      ? "No check-ins logged yet. Start the clock with a connection log."
      : nudge.status === "overdue"
        ? `It's been ${nudge.daysSince} days — you're ${Math.abs(nudge.daysRemaining ?? 0)} days past your ${nudge.window}-day window.`
        : nudge.status === "due"
          ? `It's been ${nudge.daysSince} days — only ${nudge.daysRemaining} days left in your window.`
          : `Last seen ${nudge.daysSince} days ago. Next nudge in ${nudge.daysRemaining} days.`;

  return (
    <div className={`card p-3 ${tone}`}>
      <div className="label text-current/80">Nudge</div>
      <div className="mt-1 text-sm">
        <span className="font-medium capitalize">{relationship}</span> window:
        <span className="ml-1 tabular-nums">{nudge.window} days</span>
      </div>
      <div className="mt-2 text-sm">{message}</div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}
