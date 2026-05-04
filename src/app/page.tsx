"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FEATURES = [
  {
    icon: "🎯",
    title: "Smart nudges",
    desc: "Set check-in windows per relationship type. Orbit surfaces who's due before the connection cools.",
    color: "from-indigo-500/20 to-violet-500/20",
  },
  {
    icon: "📋",
    title: "Interaction log",
    desc: "One tap to record a coffee chat, email, or chance run-in. Every touchpoint, always visible.",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: "🌡️",
    title: "Warmth scores",
    desc: "Relationships decay without contact. Warmth drops automatically so nothing slips quietly away.",
    color: "from-orange-500/20 to-amber-500/20",
  },
  {
    icon: "✨",
    title: "AI outreach",
    desc: "Claude drafts personalised text, LinkedIn DMs, and emails based on your notes — in seconds.",
    color: "from-violet-500/20 to-fuchsia-500/20",
  },
  {
    icon: "📝",
    title: "Rich notes",
    desc: "Capture context, gift ideas, follow-ups, anything worth remembering — right on the contact card.",
    color: "from-emerald-500/20 to-teal-500/20",
  },
  {
    icon: "⚡",
    title: "Zero friction",
    desc: "No funnels, no CRM bloat. Open it, log it, close it. Orbit stays out of your way.",
    color: "from-rose-500/20 to-pink-500/20",
  },
];

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
    localStorage.setItem(
      "orbit_profile",
      JSON.stringify({ name: name.trim(), email: email.trim() }),
    );
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0c1120] text-slate-300">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0c1120]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-sm shadow-lg shadow-indigo-950/60">
              🪐
            </div>
            <span className="font-semibold tracking-tight text-white">Orbit</span>
          </div>
          <div className="flex items-center gap-2">
            {hasProfile && (
              <button
                onClick={() => router.push("/dashboard")}
                className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-1.5 text-sm text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                Dashboard →
              </button>
            )}
            <a
              href="#signup"
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-sm font-medium text-white shadow-sm shadow-indigo-950/50 transition hover:bg-indigo-500"
            >
              Get started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 text-center">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="h-[600px] w-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />
        </div>
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />

        <div className="relative mx-auto max-w-3xl">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />
            </span>
            Your relationships deserve more than a spreadsheet
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-7xl">
            Keep your network{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              warm
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-slate-400">
            Orbit tracks your professional relationships, reminds you when to
            reach out, and uses AI to draft the perfect message — so no one slips
            through the cracks.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#signup"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/50 transition hover:bg-indigo-500 sm:w-auto"
            >
              Create your profile
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            {hasProfile && (
              <button
                onClick={() => router.push("/dashboard")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-7 py-3 text-sm font-medium text-slate-300 transition hover:border-white/20 hover:text-white sm:w-auto"
              >
                Go to dashboard
              </button>
            )}
          </div>

          {/* Trust line */}
          <p className="mt-6 text-xs text-slate-600">
            No credit card · No email verification · Your data, your database
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 text-center">
            <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-xs text-slate-500">
              Features
            </span>
          </div>
          <h2 className="mb-3 text-center text-3xl font-bold tracking-tight text-white">
            Everything you need
          </h2>
          <p className="mb-12 text-center text-slate-500">
            Built for people who care about relationships, not pipeline metrics.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-xl ${f.color} ring-1 ring-inset ring-white/10`}>
                  {f.icon}
                </div>
                <div className="mb-1.5 font-semibold text-white">{f.title}</div>
                <div className="text-sm leading-relaxed text-slate-500">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Signup */}
      <section id="signup" className="px-6 py-24">
        <div className="mx-auto max-w-sm">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl shadow-xl shadow-indigo-950/60">
              🪐
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-white">
              Start your orbit
            </h2>
            <p className="text-sm text-slate-500">
              Set up in seconds. No account required.
            </p>
          </div>

          <form
            onSubmit={handleSignup}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm"
          >
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-500">
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
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Email{" "}
                  <span className="normal-case font-normal text-slate-600">(optional)</span>
                </label>
                <input
                  className="input"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-950/40 transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Enter my orbit →
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-600">
            Your data stays in your own database. Zero tracking.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>🪐</span>
            <span>Orbit</span>
          </div>
          <p className="text-xs text-slate-700">
            Keep your network warm.
          </p>
        </div>
      </footer>
    </div>
  );
}
