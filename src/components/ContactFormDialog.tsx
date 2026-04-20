"use client";

import { useEffect, useState } from "react";
import { RELATIONSHIPS, RELATIONSHIP_LABELS } from "@/lib/constants";
import type { Contact } from "@/lib/types";

interface Props {
  contact: Contact | null;
  onSave: (c: Partial<Contact> & { id?: string }) => void;
  onClose: () => void;
}

export default function ContactFormDialog({ contact, onSave, onClose }: Props) {
  const [form, setForm] = useState<Partial<Contact>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    role: "",
    linkedinUrl: "",
    relationship: "peer",
    warmth: 3,
    notes: "",
  });

  useEffect(() => {
    if (contact) {
      setForm({
        ...contact,
        email: contact.email ?? "",
        phone: contact.phone ?? "",
        company: contact.company ?? "",
        role: contact.role ?? "",
        linkedinUrl: contact.linkedinUrl ?? "",
        notes: contact.notes ?? "",
      });
    }
  }, [contact]);

  function update<K extends keyof Contact>(key: K, value: Contact[K] | string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name?.trim()) return;
    onSave({
      id: contact?.id,
      ...form,
      warmth: Number(form.warmth) || 3,
      // normalize empty strings to null
      email: form.email || null,
      phone: form.phone || null,
      company: form.company || null,
      role: form.role || null,
      linkedinUrl: form.linkedinUrl || null,
      notes: form.notes || null,
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <form
        className="card w-full max-w-lg p-5"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">
            {contact ? "Edit contact" : "New contact"}
          </h3>
          <button type="button" className="btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" required>
            <input
              className="input"
              value={form.name ?? ""}
              onChange={(e) => update("name", e.target.value)}
              required
              autoFocus
            />
          </Field>
          <Field label="Relationship">
            <select
              className="input"
              value={form.relationship ?? "peer"}
              onChange={(e) => update("relationship", e.target.value)}
            >
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>
                  {RELATIONSHIP_LABELS[r]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Email">
            <input
              type="email"
              className="input"
              value={form.email ?? ""}
              onChange={(e) => update("email", e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <input
              className="input"
              value={form.phone ?? ""}
              onChange={(e) => update("phone", e.target.value)}
            />
          </Field>
          <Field label="Company">
            <input
              className="input"
              value={form.company ?? ""}
              onChange={(e) => update("company", e.target.value)}
            />
          </Field>
          <Field label="Role">
            <input
              className="input"
              value={form.role ?? ""}
              onChange={(e) => update("role", e.target.value)}
            />
          </Field>
          <Field label="LinkedIn URL" span={2}>
            <input
              className="input"
              value={form.linkedinUrl ?? ""}
              onChange={(e) => update("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </Field>
          <Field label={`Warmth (${form.warmth ?? 3}/5)`} span={2}>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={form.warmth ?? 3}
              onChange={(e) => update("warmth", Number(e.target.value))}
              className="w-full accent-orbit-warm"
            />
          </Field>
          <Field label="Notes" span={2}>
            <textarea
              className="input min-h-[80px]"
              value={form.notes ?? ""}
              onChange={(e) => update("notes", e.target.value)}
            />
          </Field>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {contact ? "Save changes" : "Add contact"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
  span = 1,
  required,
}: {
  label: string;
  children: React.ReactNode;
  span?: 1 | 2;
  required?: boolean;
}) {
  return (
    <label className={span === 2 ? "col-span-2" : "col-span-1"}>
      <div className="label mb-1">
        {label} {required && <span className="text-orbit-warm">*</span>}
      </div>
      {children}
    </label>
  );
}
