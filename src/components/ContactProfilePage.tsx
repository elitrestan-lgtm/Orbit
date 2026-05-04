"use client";

import { useState } from "react";
import Link from "next/link";
import {
  INTERACTION_ICONS,
  INTERACTION_LABELS,
  RELATIONSHIP_LABELS,
  type InteractionKind,
} from "@/lib/constants";
import { nudgeFor } from "@/lib/nudge";
import type { Contact, Interaction, NudgeWindows } from "@/lib/types";
import WarmthBadge from "./WarmthBadge";

interface Props {
  contact: Contact;
  nudgeWindows: NudgeWindows;
}

export default function ContactProfilePage({ contact: initial, nudgeWindows }: Props) {
  const [interactions, setInteractions] = useState<Interaction[]>(initial.interactions);
  const [contact] = useState<Contact>(initial);

  const nudge = nudgeFor(contact.lastContactedAt, contact.relationship, nudgeWindows);

  async function handleDelete(interactionId: string) {
    const res = await fetch(`/api/contacts/${contact.id}/interactions/${interactionId}`, {
      method: "DELETE",
    });
    if (!res.ok) return;
    const updated = await res.json() as Contact;
    setInteractions(updated.interactions.slice().reverse()); // keep asc order
  }

  const grouped = groupByMonth(interactions);
  const years = Object.keys(grouped).sort((a, b) => Number(a) - Number(b));

  const firstContact = interactions[0]?.occurredAt;
  const lastContact = interactions[interactions.length - 1]?.occurredAt;

  return (
    <div className="min-h-screen" style={{ background: "#0b1020" }}>
      {/* Top nav */}
      <div className="border-b border-white/5 px-6 py-3">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            ← Dashboard
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-sm text-slate-400 truncate">{contact.name}</span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Profile header */}
        <div className="mb-8 flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/70 to-violet-600/70 text-xl font-semibold text-white">
            {initials(contact.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{contact.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs capitalize text-slate-300">
                {RELATIONSHIP_LABELS[contact.relationship as keyof typeof RELATIONSHIP_LABELS] ?? contact.relationship}
              </span>
              <WarmthBadge warmth={contact.warmth} />
            </div>
            <div className="mt-1 text-slate-400">
              {[contact.role, contact.company].filter(Boolean).join(" · ") || "No title"}
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-400">
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="hover:text-white">
                  ✉️ {contact.email}
                </a>
              )}
              {contact.phone && (
                <a href={`tel:${contact.phone}`} className="hover:text-white">
                  📞 {contact.phone}
                </a>
              )}
              {contact.linkedinUrl && (
                <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  🔗 LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total interactions" value={String(interactions.length)} />
          <StatCard
            label="First contact"
            value={firstContact ? formatDate(firstContact) : "—"}
          />
          <StatCard
            label="Last contact"
            value={lastContact ? formatDate(lastContact) : "—"}
          />
          <NudgeStatCard nudge={nudge} />
        </div>

        {/* Notes */}
        {contact.notes && (
          <div className="mb-8 rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">Notes</div>
            <p className="whitespace-pre-wrap text-sm text-slate-300">{contact.notes}</p>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h2 className="mb-6 text-lg font-semibold text-white">
            Relationship timeline
            <span className="ml-2 text-sm font-normal text-slate-500">
              {interactions.length} {interactions.length === 1 ? "entry" : "entries"}
            </span>
          </h2>

          {interactions.length === 0 ? (
            <div className="rounded-lg border border-white/5 bg-white/[0.02] py-16 text-center">
              <div className="mb-2 text-3xl">🛰️</div>
              <div className="text-sm text-slate-400">No interactions logged yet.</div>
            </div>
          ) : (
            <div className="space-y-8">
              {years.map((year) => (
                <div key={year}>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      {year}
                    </span>
                    <div className="h-px flex-1 bg-white/5" />
                  </div>

                  <div className="space-y-6">
                    {Object.entries(grouped[year]).map(([month, entries]) => (
                      <div key={month} className="flex gap-4">
                        {/* Month label */}
                        <div className="w-10 shrink-0 pt-1 text-right text-xs font-medium text-slate-500">
                          {month}
                        </div>

                        {/* Timeline spine + entries */}
                        <div className="flex flex-1 gap-4">
                          <div className="relative flex shrink-0 flex-col items-center">
                            <div className="h-2 w-px bg-transparent" />
                            <div className="h-full w-px bg-white/10" />
                          </div>

                          <div className="flex-1 space-y-2 pb-2">
                            {entries.map((it) => (
                              <TimelineEntry
                                key={it.id}
                                interaction={it}
                                onDelete={() => handleDelete(it.id)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TimelineEntry({
  interaction,
  onDelete,
}: {
  interaction: Interaction;
  onDelete: () => void;
}) {
  const kind = interaction.kind as InteractionKind;
  return (
    <div className="group relative flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3 transition hover:border-white/10 hover:bg-white/[0.04]">
      {/* Dot on the spine */}
      <div className="absolute -left-[1.35rem] top-4 h-2 w-2 rounded-full border-2 border-indigo-500/60 bg-orbit-bg" />

      <span className="mt-0.5 text-xl leading-none">
        {INTERACTION_ICONS[kind] ?? "•"}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-slate-200">
            {INTERACTION_LABELS[kind] ?? interaction.kind}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-500">
              {formatLong(interaction.occurredAt)}
            </span>
            <button
              className="hidden rounded p-0.5 text-slate-600 transition hover:bg-red-500/10 hover:text-red-400 group-hover:block"
              title="Delete this entry"
              onClick={onDelete}
            >
              ✕
            </button>
          </div>
        </div>
        {interaction.note && (
          <p className="mt-1 text-sm text-slate-400">{interaction.note}</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.03] p-4">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function NudgeStatCard({ nudge }: { nudge: ReturnType<typeof nudgeFor> }) {
  const tone =
    nudge.status === "overdue"
      ? "border-orange-500/30 bg-orange-500/10 text-orange-300"
      : nudge.status === "due"
        ? "border-amber-400/30 bg-amber-400/10 text-amber-300"
        : nudge.status === "never"
          ? "border-white/5 bg-white/[0.03] text-slate-400"
          : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

  const label =
    nudge.status === "never"
      ? "No check-ins yet"
      : nudge.status === "overdue"
        ? `${Math.abs(nudge.daysRemaining ?? 0)}d overdue`
        : nudge.status === "due"
          ? `${nudge.daysRemaining}d left`
          : `${nudge.daysRemaining}d until nudge`;

  return (
    <div className={`rounded-lg border p-4 ${tone}`}>
      <div className="text-xs opacity-70">Nudge status</div>
      <div className="mt-1 text-lg font-semibold capitalize">{nudge.status}</div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}

// Group interactions by year → month abbreviation
function groupByMonth(
  interactions: Interaction[],
): Record<string, Record<string, Interaction[]>> {
  const result: Record<string, Record<string, Interaction[]>> = {};
  for (const it of interactions) {
    const d = new Date(it.occurredAt);
    const year = String(d.getFullYear());
    const month = d.toLocaleDateString(undefined, { month: "short" });
    if (!result[year]) result[year] = {};
    if (!result[year][month]) result[year][month] = [];
    result[year][month].push(it);
  }
  return result;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatLong(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
