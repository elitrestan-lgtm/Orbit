"use client";

import { RELATIONSHIPS, RELATIONSHIP_LABELS } from "@/lib/constants";
import { nudgeFor } from "@/lib/nudge";
import { computeWarmth } from "@/lib/warmth";
import type { Contact, NudgeWindows } from "@/lib/types";
import WarmthBadge from "./WarmthBadge";

interface Props {
  contacts: Contact[];
  allContacts: Contact[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  query: string;
  onQuery: (q: string) => void;
  filter: string;
  onFilter: (f: string) => void;
  nudgeWindows: NudgeWindows;
  labels: Record<string, string>;
}

export default function ContactList({
  contacts,
  allContacts,
  selectedId,
  onSelect,
  query,
  onQuery,
  filter,
  onFilter,
  nudgeWindows,
  labels,
}: Props) {
  return (
    <div className="card flex h-full flex-col overflow-hidden">
      <div className="border-b border-white/[0.06] p-3 space-y-2">
        <input
          type="search"
          className="input"
          placeholder="Search contacts…"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
        <div className="flex flex-wrap gap-1">
          <FilterChip
            active={filter === "all"}
            onClick={() => onFilter("all")}
            count={allContacts.length}
            label="All"
          />
          {RELATIONSHIPS.map((r) => (
            <FilterChip
              key={r}
              active={filter === r}
              onClick={() => onFilter(r)}
              count={allContacts.filter((c) => c.relationship === r).length}
              label={labels[r] ?? RELATIONSHIP_LABELS[r]}
            />
          ))}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {contacts.length === 0 && (
          <li className="px-4 py-10 text-center text-sm text-slate-500">
            No contacts match your filters.
          </li>
        )}
        {contacts.map((c) => {
          const nudge = nudgeFor(c.lastContactedAt, c.relationship, nudgeWindows);
          const active = c.id === selectedId;
          return (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={[
                  "flex w-full items-center gap-3 border-b border-white/[0.04] px-3 py-2.5 text-left transition-all duration-150",
                  active
                    ? "bg-indigo-500/10"
                    : "hover:bg-white/[0.03]",
                ].join(" ")}
              >
                {active && (
                  <span className="absolute left-0 h-8 w-0.5 rounded-r-full bg-indigo-400" />
                )}
                <Avatar name={c.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`truncate text-sm font-medium ${active ? "text-white" : "text-slate-200"}`}>
                      {c.name}
                    </div>
                    <WarmthBadge
                      warmth={computeWarmth(c.warmth, c.lastContactedAt, c.createdAt)}
                      baseWarmth={c.warmth}
                      compact
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <div className="truncate text-[11px] text-slate-500">
                      {[c.role, c.company].filter(Boolean).join(" · ") || "—"}
                    </div>
                    <NudgeBadge status={nudge.status} />
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  count,
  label,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all duration-150",
        active
          ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-300"
          : "border-white/[0.07] bg-white/[0.03] text-slate-500 hover:border-white/20 hover:text-slate-300",
      ].join(" ")}
    >
      {label}
      <span className={`ml-1 ${active ? "text-indigo-400/70" : "text-slate-600"}`}>{count}</span>
    </button>
  );
}

const AVATAR_COLORS = [
  "from-violet-500 to-indigo-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-amber-500 to-orange-500",
  "from-fuchsia-500 to-purple-600",
  "from-sky-500 to-blue-600",
  "from-green-500 to-emerald-600",
];

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const colorIdx =
    name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
    AVATAR_COLORS.length;
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-semibold text-white shadow-sm ${AVATAR_COLORS[colorIdx]}`}
    >
      {initials || "?"}
    </div>
  );
}

function NudgeBadge({ status }: { status: string }) {
  if (status === "overdue") {
    return (
      <span className="shrink-0 rounded-full bg-orange-500/15 px-1.5 py-0.5 text-[10px] font-medium text-orange-400">
        Overdue
      </span>
    );
  }
  if (status === "due") {
    return (
      <span className="shrink-0 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
        Due soon
      </span>
    );
  }
  return (
    <span className="flex items-center">
      <span className={`h-1.5 w-1.5 rounded-full ${status === "never" ? "bg-slate-600" : "bg-emerald-500"}`} />
    </span>
  );
}
