"use client";

import { RELATIONSHIPS, RELATIONSHIP_LABELS } from "@/lib/constants";
import type { IntegrationStatus, NudgeWindows } from "@/lib/types";

interface Props {
  nudgeWindows: NudgeWindows;
  onNudgeChange: (relationship: string, days: number) => void;
  integrations: IntegrationStatus;
  onConnect: (provider: "gmail" | "linkedin") => void;
  totalContacts: number;
  overdueCount: number;
}

export default function SettingsPanel({
  nudgeWindows,
  onNudgeChange,
  integrations,
  onConnect,
  totalContacts,
  overdueCount,
}: Props) {
  return (
    <div className="flex h-full flex-col gap-4">
      <section className="card p-3">
        <div className="label mb-2">At a glance</div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Stat label="Contacts" value={totalContacts} />
          <Stat label="Overdue" value={overdueCount} tone={overdueCount > 0 ? "warm" : "ok"} />
        </div>
      </section>

      <section className="card p-3">
        <div className="label mb-2">Nudge windows</div>
        <p className="mb-3 text-xs text-slate-400">
          How many days between check-ins for each relationship type.
        </p>
        <div className="space-y-2">
          {RELATIONSHIPS.map((r) => (
            <div key={r} className="flex items-center gap-2">
              <label className="w-24 text-sm capitalize text-slate-300">
                {RELATIONSHIP_LABELS[r]}
              </label>
              <input
                type="number"
                min={1}
                max={365}
                className="input flex-1"
                value={nudgeWindows[r] ?? 30}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (!Number.isNaN(n) && n > 0) onNudgeChange(r, n);
                }}
              />
              <span className="text-xs text-slate-500">days</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-3">
        <div className="label mb-2">Integrations</div>
        <div className="space-y-2">
          <IntegrationRow
            name="Gmail"
            description="Auto-log emails as connections."
            status={integrations.gmail ?? "disconnected"}
            onConnect={() => onConnect("gmail")}
          />
          <IntegrationRow
            name="LinkedIn"
            description="Sync profile data & track connection changes."
            status={integrations.linkedin ?? "disconnected"}
            onConnect={() => onConnect("linkedin")}
          />
        </div>
        <p className="mt-3 text-[11px] text-slate-500">
          OAuth endpoints are stubbed — wire up real credentials in <code>.env</code>.
        </p>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "ok",
}: {
  label: string;
  value: number;
  tone?: "ok" | "warm";
}) {
  return (
    <div className="rounded-md border border-orbit-border bg-orbit-bg/50 p-2">
      <div className="text-xs text-slate-400">{label}</div>
      <div
        className={
          "text-lg font-semibold " +
          (tone === "warm" ? "text-orbit-warm" : "text-white")
        }
      >
        {value}
      </div>
    </div>
  );
}

function IntegrationRow({
  name,
  description,
  status,
  onConnect,
}: {
  name: string;
  description: string;
  status: string;
  onConnect: () => void;
}) {
  const connected = status === "connected";
  return (
    <div className="flex items-start gap-3 rounded-md border border-orbit-border bg-orbit-bg/50 p-2">
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm text-white">
          {name}
          <span
            className={
              "rounded-full px-1.5 py-0.5 text-[10px] " +
              (connected
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-slate-500/20 text-slate-400")
            }
          >
            {connected ? "Connected" : "Not connected"}
          </span>
        </div>
        <div className="text-xs text-slate-400">{description}</div>
      </div>
      <button className="btn self-center" onClick={onConnect}>
        {connected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}
