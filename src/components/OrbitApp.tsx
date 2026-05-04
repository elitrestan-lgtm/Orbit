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
      <header className="border-b border-orbit-border bg-orbit-panel/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orbit-accent to-orbit-accent2 text-lg">
              🪐
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Orbit</div>
              <div className="text-xs text-slate-400">
                Keep your professional network warm
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile && (
              <span className="hidden text-sm text-slate-400 sm:inline">
                Hi, {profile.name} 👋
              </span>
            )}
            <span className="chip">
              <span
                className={
                  integrations.gmail === "connected"
                    ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                    : "h-1.5 w-1.5 rounded-full bg-slate-500"
                }
              />
              Gmail
            </span>
            <span className="chip">
              <span
                className={
                  integrations.linkedin === "connected"
                    ? "h-1.5 w-1.5 rounded-full bg-emerald-400"
                    : "h-1.5 w-1.5 rounded-full bg-slate-500"
                }
              />
              LinkedIn
            </span>
            <button
              className="btn-ghost"
              onClick={() => setShowProfile((s) => !s)}
              title={showProfile ? "Hide profile panel" : "Show profile panel"}
            >
              {showProfile ? "Hide panel" : "Show panel"}
            </button>
            <button className="btn-primary" onClick={() => setCreating(true)}>
              + New contact
            </button>
          </div>
        </div>
      </header>

      {overdue.length > 0 && (
        <div className="border-b border-orbit-border bg-orbit-warm/10 px-4 py-2 text-sm text-orbit-warm">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              ⚠️ {overdue.length} {overdue.length === 1 ? "contact is" : "contacts are"} overdue for a check-in.
            </div>
            <button
              className="btn-ghost text-orbit-warm hover:text-white"
              onClick={() => setSelectedId(overdue[0].id)}
            >
              Jump to first →
            </button>
          </div>
        </div>
      )}

      <main className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-4">
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
    <div className="card flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
      <div className="text-4xl">🛰️</div>
      <div className="text-lg font-medium text-white">No contact selected</div>
      <p className="max-w-sm text-sm text-slate-400">
        Pick someone from the list, or add a new person to your orbit.
      </p>
      <button className="btn-primary" onClick={onCreate}>
        + New contact
      </button>
    </div>
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
