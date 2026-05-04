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
}: Props) {
  return (
    <div className="card flex h-full flex-col overflow-hidden">
      <div className="border-b border-orbit-border p-3">
        <input
          type="search"
          className="input"
          placeholder="Search contacts..."
          value={query}
          onChange={(e) => onQuery(e.target.value)}
        />
        <div className="mt-2 flex flex-wrap gap-1.5">
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
              label={RELATIONSHIP_LABELS[r]}
            />
          ))}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {contacts.length === 0 && (
          <li className="p-6 text-center text-sm text-slate-400">
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
                className={
                  "flex w-full items-center gap-3 border-b border-orbit-border/60 px-3 py-2.5 text-left transition hover:bg-orbit-bg/40 " +
                  (active ? "bg-orbit-bg/60" : "")
                }
              >
                <Avatar name={c.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-sm font-medium text-white">
                      {c.name}
                    </div>
                    <WarmthBadge
                    warmth={computeWarmth(c.warmth, c.lastContactedAt, c.createdAt)}
                    baseWarmth={c.warmth}
                    compact
                  />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-xs text-slate-400">
                      {[c.role, c.company].filter(Boolean).join(" · ") || "—"}
                    </div>
                    <NudgeDot status={nudge.status} />
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
      className={
        "rounded-full border px-2.5 py-0.5 text-xs transition " +
        (active
          ? "border-orbit-accent bg-orbit-accent/20 text-white"
          : "border-orbit-border bg-orbit-bg/50 text-slate-400 hover:text-white")
      }
    >
      {label}
      <span className="ml-1 text-slate-500">{count}</span>
    </button>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orbit-accent/60 to-orbit-accent2/60 text-xs font-semibold text-white">
      {initials || "?"}
    </div>
  );
}

function NudgeDot({ status }: { status: string }) {
  const color =
    status === "overdue"
      ? "bg-orbit-warm"
      : status === "due"
        ? "bg-amber-400"
        : status === "never"
          ? "bg-slate-500"
          : "bg-emerald-400";
  const label =
    status === "overdue"
      ? "Overdue"
      : status === "due"
        ? "Due soon"
        : status === "never"
          ? "No contact yet"
          : "Fresh";
  return (
    <span className="flex items-center gap-1 text-[10px] text-slate-400" title={label}>
      <span className={"h-1.5 w-1.5 rounded-full " + color} />
      {label}
    </span>
  );
}
