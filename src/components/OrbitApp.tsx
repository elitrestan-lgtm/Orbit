"use client";

import { useMemo, useState, useEffect } from "react";
import {
  INTERACTION_ICONS,
  INTERACTION_KINDS,
  INTERACTION_LABELS,
  RELATIONSHIPS,
  RELATIONSHIP_LABELS,
} from "@/lib/constants";
import { nudgeFor } from "@/lib/nudge";
import type { Contact, IntegrationStatus, NudgeWindows } from "@/lib/types";
import ContactList from "./ContactList";
import ContactDetail from "./ContactDetail";
import SettingsPanel from "./SettingsPanel";
import ContactFormDialog from "./ContactFormDialog";

interface Props {
  initialContacts: Contact[];
  initialNudgeWindows: NudgeWindows;
  initialIntegrations: IntegrationStatus;
}

export default function OrbitApp({
  initialContacts,
  initialNudgeWindows,
  initialIntegrations,
}: Props) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [nudgeWindows, setNudgeWindows] = useState<NudgeWindows>(initialNudgeWindows);
  const [integrations, setIntegrations] = useState<IntegrationStatus>(initialIntegrations);
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("orbit_profile");
    if (stored) setProfile(JSON.parse(stored));
  }, []);

  const [selectedId, setSelectedId] = useState<string | null>(
    initialContacts[0]?.id ?? null,
  );
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [showProfile, setShowProfile] = useState(true);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return contacts.filter((c) => {
      if (filter !== "all" && c.relationship !== filter) return false;
      if (!q) return true;
      return [c.name, c.email, c.company, c.role, c.notes]
        .filter(Boolean)
        .some((v) => (v as string).toLowerCase().includes(q));
    });
  }, [contacts, query, filter]);

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  const overdue = useMemo(
    () =>
      contacts.filter(
        (c) => nudgeFor(c.lastContactedAt, c.relationship, nudgeWindows).status === "overdue",
      ),
    [contacts, nudgeWindows],
  );

  async function refreshContacts() {
    const res = await fetch("/api/contacts", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as Contact[];
      setContacts(data);
    }
  }

  async function saveContact(input: Partial<Contact> & { id?: string }) {
    const isEdit = Boolean(input.id);
    const url = isEdit ? `/api/contacts/${input.id}` : "/api/contacts";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) return;
    const saved = (await res.json()) as Contact;
    setContacts((prev) => {
      if (isEdit) return prev.map((c) => (c.id === saved.id ? saved : c));
      return [saved, ...prev];
    });
    setSelectedId(saved.id);
    setEditing(null);
    setCreating(false);
  }

  async function deleteContact(id: string) {
    if (!confirm("Delete this contact and their interaction history?")) return;
    const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  async function logInteraction(contactId: string, kind: string, note?: string) {
    const res = await fetch(`/api/contacts/${contactId}/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, note }),
    });
    if (!res.ok) return;
    const saved = (await res.json()) as Contact;
    setContacts((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
  }

  async function deleteInteraction(contactId: string, interactionId: string) {
    const res = await fetch(`/api/contacts/${contactId}/interactions/${interactionId}`, {
      method: "DELETE",
    });
    if (!res.ok) return;
    const saved = (await res.json()) as Contact;
    setContacts((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
  }

  async function updateNotes(contactId: string, notes: string) {
    await saveContact({ id: contactId, notes });
  }

  async function updateNudgeWindow(relationship: string, daysWindow: number) {
    setNudgeWindows((prev) => ({ ...prev, [relationship]: daysWindow }));
    await fetch("/api/settings/nudges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relationship, daysWindow }),
    });
  }

  async function connectIntegration(provider: "gmail" | "linkedin") {
    const res = await fetch(`/api/auth/${provider}`, { method: "POST" });
    if (!res.ok) return;
    const data = (await res.json()) as { status: string };
    setIntegrations((prev) => ({ ...prev, [provider]: data.status }));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-orbit-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-base shadow-lg shadow-indigo-950/50">
              🪐
            </div>
            <div>
              <div className="text-sm font-semibold tracking-tight text-white">Orbit</div>
              <div className="text-[11px] text-slate-500">
                Keep your network warm
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile && (
              <span className="hidden rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-slate-400 sm:inline">
                {profile.name}
              </span>
            )}
            <div className="hidden items-center gap-1.5 sm:flex">
              <StatusPill label="Gmail" connected={integrations.gmail === "connected"} />
              <StatusPill label="LinkedIn" connected={integrations.linkedin === "connected"} />
            </div>
            <div className="h-4 w-px bg-white/[0.08]" />
            <button
              className="btn-ghost text-xs"
              onClick={() => setShowProfile((s) => !s)}
            >
              {showProfile ? "Hide panel" : "Settings"}
            </button>
            <button className="btn-primary text-xs" onClick={() => setCreating(true)}>
              + New contact
            </button>
          </div>
        </div>
      </header>

      {overdue.length > 0 && (
        <div className="border-b border-orange-500/20 bg-orange-500/[0.07] px-5 py-2">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-orange-300">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              {overdue.length} {overdue.length === 1 ? "contact" : "contacts"} overdue for a check-in
            </div>
            <button
              className="text-xs text-orange-400 transition hover:text-orange-200"
              onClick={() => setSelectedId(overdue[0].id)}
            >
              View first →
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-5 py-4">
        <aside className="w-80 shrink-0">
          <ContactList
            contacts={filtered}
            allContacts={contacts}
            selectedId={selectedId}
            onSelect={setSelectedId}
            query={query}
            onQuery={setQuery}
            filter={filter}
            onFilter={setFilter}
            nudgeWindows={nudgeWindows}
          />
        </aside>

        <section className="min-w-0 flex-1">
          {selected ? (
            <ContactDetail
              contact={selected}
              nudgeWindows={nudgeWindows}
              onEdit={() => setEditing(selected)}
              onDelete={() => deleteContact(selected.id)}
              onLogInteraction={(kind, note) =>
                logInteraction(selected.id, kind, note)
              }
              onDeleteInteraction={(interactionId) =>
                deleteInteraction(selected.id, interactionId)
              }
              onUpdateNotes={(notes) => updateNotes(selected.id, notes)}
            />
          ) : (
            <EmptyState onCreate={() => setCreating(true)} />
          )}
        </section>

        {showProfile && (
          <aside className="w-80 shrink-0">
            <SettingsPanel
              nudgeWindows={nudgeWindows}
              onNudgeChange={updateNudgeWindow}
              integrations={integrations}
              onConnect={connectIntegration}
              totalContacts={contacts.length}
              overdueCount={overdue.length}
            />
          </aside>
        )}
      </main>

      {(creating || editing) && (
        <ContactFormDialog
          contact={editing}
          onSave={saveContact}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="card flex h-full flex-col items-center justify-center gap-4 p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 text-3xl ring-1 ring-inset ring-white/10">
        🛰️
      </div>
      <div>
        <div className="text-base font-semibold text-white">No contact selected</div>
        <p className="mt-1 max-w-xs text-sm text-slate-500">
          Pick someone from the list, or add a new person to your orbit.
        </p>
      </div>
      <button className="btn-primary" onClick={onCreate}>
        + New contact
      </button>
    </div>
  );
}

function StatusPill({ label, connected }: { label: string; connected: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-slate-400">
      <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-400" : "bg-slate-600"}`} />
      {label}
    </span>
  );
}

// re-export utilities for child components to avoid circular imports
export {
  RELATIONSHIPS,
  RELATIONSHIP_LABELS,
  INTERACTION_KINDS,
  INTERACTION_LABELS,
  INTERACTION_ICONS,
};
