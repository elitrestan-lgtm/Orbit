"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("orbit_profile")) setHasProfile(true);
  }, []);

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem("orbit_profile", JSON.stringify({ name: name.trim(), email: email.trim() }));
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen" style={{ background: "#0b1020" }}>
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-base">
              🪐
            </div>
            <span className="font-semibold text-white">Orbit</span>
          </div>
          <div className="flex items-center gap-3">
            {hasProfile && (
              <button
                className="btn"
                onClick={() => router.push("/dashboard")}
              >
                Go to dashboard →
              </button>
            )}
            <a
              href="#signup"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500"
            >
              Get started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pb-20 pt-24 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Relationship intelligence, not a spreadsheet
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            Keep your network{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              warm
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-slate-400">
            Orbit tracks your professional relationships, reminds you when to
            reach out, and logs every touchpoint — so no one slips through the
            cracks.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 sm:w-auto"
            >
              Create your profile →
            </a>
            {hasProfile && (
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/10 px-6 py-2.5 text-sm text-slate-300 transition hover:border-white/20 hover:text-white sm:w-auto"
                onClick={() => router.push("/dashboard")}
              >
                Go to dashboard
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-white/5 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-semibold text-white">
            Everything you need to stay connected
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: "🎯",
                title: "Smart nudges",
                desc: "Set relationship-specific check-in windows. Orbit tells you exactly who's due for a touch point before the relationship cools.",
              },
              {
                icon: "📋",
                title: "Interaction log",
                desc: "Record every coffee chat, email, or chance run-in with a single tap. Build a living history of every relationship.",
              },
              {
                icon: "🌡️",
                title: "Warmth scores",
                desc: "Rate each relationship 1–5 to surface who needs attention. See your whole network's health at a glance.",
              },
              {
                icon: "🔍",
                title: "Instant search",
                desc: "Find anyone by name, company, role, or notes. Filter by relationship type to focus on the right tier.",
              },
              {
                icon: "📝",
                title: "Rich notes",
                desc: "Capture context, gift ideas, follow-ups, and anything else worth remembering — right on the contact card.",
              },
              {
                icon: "⚡",
                title: "Zero friction",
                desc: "No funnels, no CRM bloat. Open it, log it, close it. Orbit stays out of your way until you need it.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-lg border border-white/5 bg-white/[0.03] p-5"
              >
                <div className="mb-3 text-2xl">{f.icon}</div>
                <div className="mb-1 font-medium text-white">{f.title}</div>
                <div className="text-sm text-slate-400">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signup */}
      <section id="signup" className="px-6 py-24">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <div className="mb-3 text-3xl">🪐</div>
            <h2 className="mb-2 text-2xl font-semibold text-white">
              Create your profile
            </h2>
            <p className="text-sm text-slate-400">
              Set up in seconds. No credit card, no email verification.
            </p>
          </div>

          <form
            onSubmit={handleSignup}
            className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Your name
              </label>
              <input
                className="input"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400">
                Email{" "}
                <span className="normal-case text-slate-500">(optional)</span>
              </label>
              <input
                className="input"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
              disabled={!name.trim()}
            >
              Enter my orbit →
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Your data stays in your database. No tracking, no ads.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-slate-500">
        <div className="flex items-center justify-center gap-2">
          <span>🪐</span>
          <span>Orbit — keep your network warm</span>
        </div>
      </footer>
    </div>
  );
}
