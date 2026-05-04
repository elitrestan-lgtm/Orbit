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
    <div className="flex h-full flex-col gap-3">
      <section className="card p-4">
        <div className="label mb-3">Overview</div>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Contacts" value={totalContacts} />
          <Stat label="Overdue" value={overdueCount} tone={overdueCount > 0 ? "warm" : "ok"} />
        </div>
      </section>

      <section className="card p-4">
        <div className="label mb-1">Nudge windows</div>
        <p className="mb-3 text-[11px] text-slate-500">
          Days between check-ins per relationship type.
        </p>
        <div className="space-y-2.5">
          {RELATIONSHIPS.map((r) => (
            <div key={r} className="flex items-center gap-2">
              <label className="w-24 text-xs text-slate-300">
                {RELATIONSHIP_LABELS[r]}
              </label>
              <input
                type="number"
                min={1}
                max={365}
                className="input h-8 flex-1 text-xs"
                value={nudgeWindows[r] ?? 30}
                onChange={(e) => {
                  const n = parseInt(e.target.value, 10);
                  if (!Number.isNaN(n) && n > 0) onNudgeChange(r, n);
                }}
              />
              <span className="text-[11px] text-slate-600">days</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-4">
        <div className="label mb-3">Integrations</div>
        <div className="space-y-2">
          <IntegrationRow
            name="Gmail"
            icon="✉️"
            description="Auto-log emails as interactions."
            status={integrations.gmail ?? "disconnected"}
            onConnect={() => onConnect("gmail")}
          />
          <IntegrationRow
            name="LinkedIn"
            icon="🔗"
            description="Sync profiles & connections."
            status={integrations.linkedin ?? "disconnected"}
            onConnect={() => onConnect("linkedin")}
          />
        </div>
        <p className="mt-3 text-[10px] text-slate-600">
          OAuth is stubbed — add credentials in <code className="font-mono">.env</code> to activate.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value, tone = "ok" }: { label: string; value: number; tone?: "ok" | "warm" }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5">
      <div className="text-[10px] text-slate-500">{label}</div>
      <div className={`mt-0.5 text-xl font-semibold tabular-nums ${tone === "warm" ? "text-orange-400" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function IntegrationRow({ name, icon, description, status, onConnect }: {
  name: string; icon: string; description: string; status: string; onConnect: () => void;
}) {
  const connected = status === "connected";
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2.5">
      <span className="text-lg">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-200">{name}</span>
          <span className={`rounded-full px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide ${
            connected ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.05] text-slate-500"
          }`}>
            {connected ? "On" : "Off"}
          </span>
        </div>
        <div className="text-[11px] text-slate-500">{description}</div>
      </div>
      <button className="btn text-xs" onClick={onConnect}>
        {connected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}
