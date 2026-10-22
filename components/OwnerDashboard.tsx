"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Palette,
  Compass,
  Play,
  Flame,
  Cpu,
  Layers,
  LayoutGrid,
  User,
  Award,
  MessageSquare,
  AlignLeft,
  Save,
  Eye,
  ExternalLink,
  LogOut,
  Check,
  Sparkles,
  Copy,
  ArrowLeft,
  ArrowRight,
  Search,
  Trash2,
  Plus,
  Monitor,
  Smartphone,
  X,
  AlertCircle,
} from "lucide-react";
import { ImageField, ImageGallery } from "./ImageUpload";
import { defaultContent, type ServiceIcon, type SiteContent } from "../lib/siteContent";
import type { Project } from "../types/portfolio";

const fieldClass =
  "w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-red-500/70 focus:bg-black/60 focus:ring-1 focus:ring-red-500/40";

const sections = [
  { id: "brand", label: "Identity", icon: Palette, hint: "Logo, colors & typography" },
  { id: "nav", label: "Navigation", icon: Compass, hint: "Header & menu links" },
  { id: "intro", label: "Intro", icon: Play, hint: "Opening preloader & capsule" },
  { id: "hero", label: "Hero", icon: Flame, hint: "Headline, portrait & bio" },
  { id: "programs", label: "Programs", icon: Cpu, hint: "Design tools in motion" },
  { id: "practice", label: "Practice", icon: Layers, hint: "Manifesto & studio services" },
  { id: "works", label: "Works", icon: LayoutGrid, hint: "Featured projects & campaigns" },
  { id: "about", label: "About", icon: User, hint: "Capabilities & client list" },
  { id: "awards", label: "Selection", icon: Award, hint: "Curated work & milestones" },
  { id: "talk", label: "Inquiry", icon: MessageSquare, hint: "Let's talk desk & bot copy" },
  { id: "footer", label: "Footer", icon: AlignLeft, hint: "Colophon & closing links" },
] as const;

type SectionId = (typeof sections)[number]["id"];

export function OwnerDashboard() {
  const [phase, setPhase] = useState<"checking" | "login" | "editor">("checking");
  const [email, setEmail] = useState("merall22@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<SiteContent>(defaultContent);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [section, setSection] = useState<SectionId>("works");
  const [projectIndex, setProjectIndex] = useState(0);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const isDirty = useMemo(() => {
    if (!lastSaved) return false;
    return JSON.stringify(draft) !== lastSaved;
  }, [draft, lastSaved]);

  useEffect(() => {
    const load = async () => {
      try {
        const session = await fetch("/api/auth/session", { cache: "no-store" });
        if (!session.ok) {
          setPhase("login");
          return;
        }
        const content = await fetch("/api/content", { cache: "no-store" });
        if (content.ok) {
          const data = await content.json();
          setDraft(data);
          setLastSaved(JSON.stringify(data));
        }
        setPhase("editor");
      } catch {
        setPhase("login");
      }
    };
    void load();
  }, []);

  const login = async () => {
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        setError("That email or password is not correct.");
        return;
      }
      const content = await fetch("/api/content", { cache: "no-store" });
      if (content.ok) {
        const data = await content.json();
        setDraft(data);
        setLastSaved(JSON.stringify(data));
      }
      setPhase("editor");
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const save = useCallback(async () => {
    setSaving(true);
    setStatus("");
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      setSaving(false);
      if (!response.ok) {
        setStatus("Could not save. Please sign in again.");
        return;
      }
      const saved = await response.json();
      setDraft(saved);
      setLastSaved(JSON.stringify(saved));

      // 1. Update localStorage for zero-latency client sync
      try {
        localStorage.setItem("meral_content_v1", JSON.stringify(saved));
      } catch {}

      // 2. Broadcast to all open tabs
      try {
        const channel = new BroadcastChannel("meral_content_sync");
        channel.postMessage({ type: "UPDATE", content: saved });
        channel.close();
      } catch {}

      // 3. Dispatch same-page event
      window.dispatchEvent(new CustomEvent("meral_content_update", { detail: saved }));

      setStatus("تم حفظ التعديلات بنجاح وتم التحديث في البورتفوليو مباشرة!");
      setTimeout(() => setStatus(""), 4500);
    } catch {
      setSaving(false);
      setStatus("Error saving changes. Please check your connection.");
    }
  }, [draft]);

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [save]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setPhase("login");
    setPassword("");
  };

  if (phase === "checking") {
    return (
      <main className="grid min-h-screen place-items-center bg-[#070709] text-white">
        <div className="flex items-center gap-3 font-mono text-sm text-neutral-400">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span>Verifying studio credentials…</span>
        </div>
      </main>
    );
  }

  if (phase === "login") {
    return (
      <main dir="ltr" className="grid min-h-screen place-items-center bg-[#070709] px-4 text-white">
        <form
          className="w-full max-w-md space-y-5 rounded-3xl border border-white/10 bg-[#0d0d10] p-8 shadow-2xl backdrop-blur-xl"
          onSubmit={(event) => {
            event.preventDefault();
            void login();
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-500">
              Studio Owner Desk
            </span>
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Meral Dashboard</h1>
            <p className="mt-1 text-xs text-neutral-400">
              Direct live management of works, copy, and visual identity.
            </p>
          </div>
          <label className="block space-y-1.5 text-sm">
            <span className="text-xs font-mono text-neutral-400">Owner Email</span>
            <input
              dir="ltr"
              className={fieldClass}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label className="block space-y-1.5 text-sm">
            <span className="text-xs font-mono text-neutral-400">Password</span>
            <input
              dir="ltr"
              className={fieldClass}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
              {error}
            </p>
          )}
          <button
            className="w-full rounded-full bg-white hover:bg-neutral-200 py-3 text-sm font-bold text-black transition-colors cursor-pointer"
            type="submit"
          >
            Sign in to Dashboard
          </button>
        </form>
      </main>
    );
  }

  return (
    <main dir="ltr" className="min-h-screen bg-[#070709] text-white">
      {/* 1. TOP HEADER BAR */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-[#070709]/92 px-4 py-3.5 backdrop-blur-xl sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="font-display text-xl font-extrabold tracking-tight text-white">
              Meral Studio
            </h1>
          </div>
          <span className="hidden sm:inline-block h-4 w-[1px] bg-white/15" />
          <span className="hidden sm:inline-block font-mono text-[11px] uppercase tracking-wider text-neutral-400">
            Portfolio Live Manager
          </span>
          {isDirty && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 font-mono text-[10px] text-amber-300">
              <AlertCircle className="w-3 h-3" /> Unsaved changes
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Live Preview Button */}
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs text-neutral-200 hover:text-white transition-all cursor-pointer"
            title="Preview changes live"
          >
            <Eye className="w-3.5 h-3.5 text-[#c4a574]" />
            <span className="hidden md:inline">Live Preview</span>
            <span className="md:hidden">Preview</span>
          </button>

          {/* View live site in new tab */}
          <a
            className="flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-neutral-300 hover:text-white hover:border-white/30 transition-all"
            href="/"
            target="_blank"
            rel="noreferrer"
            title="Open live website in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Open Site</span>
          </a>

          {/* Save button */}
          <button
            className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer shadow-lg ${
              isDirty
                ? "bg-red-600 hover:bg-red-500 text-white shadow-red-900/40 animate-pulse"
                : "bg-white hover:bg-neutral-200 text-black"
            }`}
            onClick={() => void save()}
            type="button"
            disabled={saving}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving…" : "Save Changes"}</span>
            <span className="hidden lg:inline text-[10px] opacity-60 font-mono">
              (Ctrl+S)
            </span>
          </button>

          {/* Sign out */}
          <button
            className="p-2 rounded-full border border-white/15 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => void logout()}
            type="button"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Status banner */}
      {status && (
        <div className="mx-4 mt-3 max-w-6xl sm:mx-auto">
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 px-4 py-3 text-xs sm:text-sm text-emerald-300 backdrop-blur-md">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{status}</span>
          </div>
        </div>
      )}

      {/* 2. MAIN WORKSPACE */}
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] sm:px-8">
        {/* Navigation Sidebar */}
        <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {sections.map(({ id, label, icon: Icon, hint }) => {
            const active = section === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSection(id)}
                className={`group flex items-center gap-3 shrink-0 rounded-2xl px-4 py-3 text-start text-xs sm:text-sm transition-all cursor-pointer ${
                  active
                    ? "bg-white text-black font-bold shadow-lg"
                    : "border border-white/10 bg-[#0e0e11] text-neutral-300 hover:text-white hover:border-white/20 hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    active ? "text-red-600" : "text-neutral-400 group-hover:text-white"
                  }`}
                />
                <div className="min-w-0">
                  <span className="block leading-none">{label}</span>
                  <span
                    className={`hidden lg:block text-[10px] font-normal font-mono truncate mt-1 ${
                      active ? "text-neutral-600" : "text-neutral-500"
                    }`}
                  >
                    {hint}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Section Editor Card */}
        <section className="space-y-6 rounded-3xl border border-white/10 bg-[#0d0d10]/95 p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
          {section === "brand" && <BrandEditor draft={draft} setDraft={setDraft} />}
          {section === "nav" && <NavEditor draft={draft} setDraft={setDraft} />}
          {section === "intro" && <IntroEditor draft={draft} setDraft={setDraft} />}
          {section === "hero" && <HeroEditor draft={draft} setDraft={setDraft} />}
          {section === "programs" && <ProgramsEditor draft={draft} setDraft={setDraft} />}
          {section === "practice" && <PracticeEditor draft={draft} setDraft={setDraft} />}
          {section === "works" && (
            <WorksEditor
              draft={draft}
              setDraft={setDraft}
              projectIndex={projectIndex}
              setProjectIndex={setProjectIndex}
            />
          )}
          {section === "about" && <AboutEditor draft={draft} setDraft={setDraft} />}
          {section === "awards" && <AwardsEditor draft={draft} setDraft={setDraft} />}
          {section === "talk" && <TalkEditor draft={draft} setDraft={setDraft} />}
          {section === "footer" && <FooterEditor draft={draft} setDraft={setDraft} />}

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              type="button"
              className="text-xs font-mono text-neutral-500 hover:text-neutral-300 underline cursor-pointer"
              onClick={() => {
                if (
                  window.confirm(
                    "Restore original draft? Any unsaved edits will be replaced with defaults."
                  )
                ) {
                  setDraft(structuredClone(defaultContent));
                }
              }}
            >
              Restore original draft
            </button>

            <button
              type="button"
              onClick={() => void save()}
              className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              {saving ? "Saving…" : "Save all changes"}
            </button>
          </div>
        </section>
      </div>

      {/* 3. LIVE PREVIEW MODAL */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-2xl p-2 sm:p-6 animate-fadeIn">
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/15">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="font-display text-lg font-bold text-white">
                Live Portfolio Preview
              </h2>
              <span className="hidden sm:inline font-mono text-xs text-neutral-400">
                (Real-time reflection of saved changes)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Device switchers */}
              <div className="flex items-center rounded-full bg-white/10 p-1 border border-white/10">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    previewDevice === "desktop"
                      ? "bg-white text-black"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    previewDevice === "mobile"
                      ? "bg-white text-black"
                      : "text-neutral-400 hover:text-white"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="p-2 rounded-full border border-white/20 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Frame Body */}
          <div className="flex-1 mt-4 overflow-hidden flex items-center justify-center">
            <div
              className={`h-full bg-black rounded-2xl border border-white/20 overflow-hidden shadow-2xl transition-all duration-300 ${
                previewDevice === "desktop" ? "w-full" : "w-[390px] h-[820px] max-h-[92%]"
              }`}
            >
              <iframe
                src="/?autostart=1"
                className="w-full h-full border-0"
                title="Portfolio Live Preview"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  area = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-mono text-neutral-400">{label}</span>
      {area ? (
        <textarea
          dir="ltr"
          className={`${fieldClass} min-h-24 text-left font-sans`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          dir="ltr"
          className={`${fieldClass} text-left font-sans`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}

function Lines({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <Field
      label={label}
      area
      value={values.join("\n")}
      onChange={(value) => onChange(value.split("\n"))}
    />
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-mono text-neutral-400">{label}</span>
      <span className="flex items-center gap-3">
        <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/20">
          <input
            aria-label={label}
            type="color"
            value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#c4a574"}
            onChange={(event) => onChange(event.target.value)}
            className="absolute -inset-2 h-16 w-16 cursor-pointer border-0 bg-transparent p-0"
          />
        </span>
        <input
          dir="ltr"
          className={`${fieldClass} text-left font-mono text-xs`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  );
}

function BrandEditor({ draft, setDraft }: EditorProps) {
  const brand = draft.brand;
  const set = (patch: Partial<SiteContent["brand"]>) =>
    setDraft({ ...draft, brand: { ...brand, ...patch } });
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="font-display text-2xl font-bold">Studio Identity & Theme</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Colors, logos, and typography update globally across all sections.
        </p>
      </div>
      <Field label="Studio Name" value={brand.name} onChange={(name) => set({ name })} />
      <Field label="Logo Word" value={brand.logoWord} onChange={(logoWord) => set({ logoWord })} />
      <div className="sm:col-span-2">
        <ImageField
          label="Studio Mark Logo"
          hint="Shown in navigation and footer. A transparent PNG works best."
          frame="logo"
          value={brand.logoImage}
          onChange={(logoImage) => set({ logoImage })}
        />
      </div>
      <ColorField label="Accent Gold Color" value={brand.accent} onChange={(accent) => set({ accent })} />
      <ColorField
        label="Primary Crimson Color"
        value={brand.accentHot}
        onChange={(accentHot) => set({ accentHot })}
      />
      <ColorField
        label="Page Background Color"
        value={brand.background}
        onChange={(background) => set({ background })}
      />
      <ColorField label="Text Color" value={brand.text} onChange={(text) => set({ text })} />
      <label className="block space-y-1.5">
        <span className="text-xs font-mono text-neutral-400">Headline Font</span>
        <select
          className={fieldClass}
          value={brand.headlineFont}
          onChange={(event) =>
            set({ headlineFont: event.target.value as SiteContent["brand"]["headlineFont"] })
          }
        >
          <option value="display">Syne (High Fashion & Editorial)</option>
          <option value="sans">Jakarta (Clean Modern Sans)</option>
          <option value="mono">JetBrains Mono (Technical)</option>
        </select>
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-mono text-neutral-400">Body Font</span>
        <select
          className={fieldClass}
          value={brand.bodyFont}
          onChange={(event) =>
            set({ bodyFont: event.target.value as SiteContent["brand"]["bodyFont"] })
          }
        >
          <option value="sans">Jakarta (Clean Modern Sans)</option>
          <option value="display">Syne (Editorial)</option>
          <option value="mono">JetBrains Mono (Technical)</option>
        </select>
      </label>
    </div>
  );
}

function NavEditor({ draft, setDraft }: EditorProps) {
  const nav = draft.nav;
  const set = (patch: Partial<SiteContent["nav"]>) =>
    setDraft({ ...draft, nav: { ...nav, ...patch } });
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="font-display text-2xl font-bold">Navigation Labels</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Menu labels for desktop navigation and mobile drawer.
        </p>
      </div>
      <Field label="Work Link" value={nav.works} onChange={(works) => set({ works })} />
      <Field label="About Link" value={nav.about} onChange={(about) => set({ about })} />
      <Field label="Selection Link" value={nav.awards} onChange={(awards) => set({ awards })} />
      <Field label="Start Project Link" value={nav.talk} onChange={(talk) => set({ talk })} />
      <Field label="CTA Button" value={nav.cta} onChange={(cta) => set({ cta })} />
      <Field
        label="Mobile Work Label"
        value={nav.mobileWorks}
        onChange={(mobileWorks) => set({ mobileWorks })}
      />
      <Field
        label="Mobile About Label"
        value={nav.mobileAbout}
        onChange={(mobileAbout) => set({ mobileAbout })}
      />
      <Field
        label="Mobile Selection Label"
        value={nav.mobileAwards}
        onChange={(mobileAwards) => set({ mobileAwards })}
      />
      <Field
        label="Mobile Project Label"
        value={nav.mobileTalk}
        onChange={(mobileTalk) => set({ mobileTalk })}
      />
    </div>
  );
}

function IntroEditor({ draft, setDraft }: EditorProps) {
  const intro = draft.intro;
  const set = (patch: Partial<SiteContent["intro"]>) =>
    setDraft({ ...draft, intro: { ...intro, ...patch } });
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="font-display text-2xl font-bold">Intro Preloader</h2>
        <p className="text-xs text-neutral-400 mt-1">
          First-visit opening animation and capsule showcase.
        </p>
      </div>
      <Field label="Name" value={intro.brand} onChange={(brand) => set({ brand })} />
      <Field
        label="Discipline"
        value={intro.discipline}
        onChange={(discipline) => set({ discipline })}
      />
      <Field label="Enter Button" value={intro.enter} onChange={(enter) => set({ enter })} />
      <Field label="Badge Tag" value={intro.badge} onChange={(badge) => set({ badge })} />
      <Field label="Left Line 1" value={intro.leftA} onChange={(leftA) => set({ leftA })} />
      <Field label="Left Line 2" value={intro.leftB} onChange={(leftB) => set({ leftB })} />
      <Field label="Right Line 1" value={intro.rightA} onChange={(rightA) => set({ rightA })} />
      <Field label="Right Line 2" value={intro.rightB} onChange={(rightB) => set({ rightB })} />
      <div className="sm:col-span-2">
        <Field label="Footer Note" value={intro.note} onChange={(note) => set({ note })} />
      </div>
      <div className="sm:col-span-2">
        <ImageGallery
          label="Intro Images Carousel"
          hint="Images cycling inside the intro pill. Upload high quality assets."
          values={intro.images}
          onChange={(images) => set({ images })}
        />
      </div>
    </div>
  );
}

function HeroEditor({ draft, setDraft }: EditorProps) {
  const hero = draft.hero;
  const set = (patch: Partial<SiteContent["hero"]>) =>
    setDraft({ ...draft, hero: { ...hero, ...patch } });
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <h2 className="font-display text-2xl font-bold">Hero Opening Section</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Top banner, headline, bio, portrait and key credentials.
        </p>
      </div>
      <Field label="Left Label" value={hero.leftLabel} onChange={(leftLabel) => set({ leftLabel })} />
      <Field
        label="Right Label"
        value={hero.rightLabel}
        onChange={(rightLabel) => set({ rightLabel })}
      />
      <Field label="Eyebrow Subtitle" value={hero.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
      <Field label="Name under Portrait" value={hero.name} onChange={(name) => set({ name })} />
      <Field label="Headline" value={hero.headline} onChange={(headline) => set({ headline })} />
      <Field
        label="Headline Accent"
        value={hero.headlineAccent}
        onChange={(headlineAccent) => set({ headlineAccent })}
      />
      <div className="sm:col-span-2">
        <Field label="Bio Body" area value={hero.body} onChange={(body) => set({ body })} />
      </div>
      <Lines label="Facts (one per line)" values={hero.facts} onChange={(facts) => set({ facts })} />
      <Field
        label="Portrait Alt Text"
        value={hero.portraitAlt}
        onChange={(portraitAlt) => set({ portraitAlt })}
      />
      <Field
        label="Role Line 1"
        value={hero.roleLine1}
        onChange={(roleLine1) => set({ roleLine1 })}
      />
      <Field
        label="Role Line 2"
        value={hero.roleLine2}
        onChange={(roleLine2) => set({ roleLine2 })}
      />
      <Field label="CTA Button" value={hero.cta} onChange={(cta) => set({ cta })} />
      <Field
        label="Tools Line"
        value={hero.toolsLine}
        onChange={(toolsLine) => set({ toolsLine })}
      />
      <div className="sm:col-span-2">
        <ImageField
          label="Hero Portrait"
          hint="Shown inside the glowing circular frame. A square portrait looks best."
          frame="portrait"
          value={hero.portrait}
          onChange={(portrait) => set({ portrait })}
        />
      </div>
    </div>
  );
}

function ProgramsEditor({ draft, setDraft }: EditorProps) {
  const programs = draft.programs;
  const setItems = (items: SiteContent["programs"]["items"]) =>
    setDraft({ ...draft, programs: { ...programs, items } });
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Programs & Design Tools</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Interactive 3D fan cards highlighting design software skills.
        </p>
      </div>
      <Field
        label="Caption under the Fan Cards"
        value={programs.caption}
        onChange={(caption) => setDraft({ ...draft, programs: { ...programs, caption } })}
      />
      <div className="space-y-3">
        {programs.items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-2"
          >
            <Field
              label="Tool Name"
              value={item.title}
              onChange={(title) =>
                setItems(
                  programs.items.map((entry, i) => (i === index ? { ...entry, title } : entry))
                )
              }
            />
            <ColorField
              label="Glow Color"
              value={item.to}
              onChange={(to) =>
                setItems(programs.items.map((entry, i) => (i === index ? { ...entry, to } : entry)))
              }
            />
            <div className="sm:col-span-2">
              <ImageField
                label="Tool Icon"
                hint="Sits on top edge of card."
                frame="icon"
                value={item.icon}
                onChange={(icon) =>
                  setItems(
                    programs.items.map((entry, i) => (i === index ? { ...entry, icon } : entry))
                  )
                }
              />
            </div>
            <button
              type="button"
              className="text-left text-xs text-red-400 hover:text-red-300 font-mono"
              onClick={() => setItems(programs.items.filter((_, i) => i !== index))}
            >
              Remove tool
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-mono text-white transition-colors"
        onClick={() =>
          setItems([
            ...programs.items,
            { id: `tool-${Date.now()}`, title: "New Tool", icon: "/icons/ai.png", to: "#c4a574" },
          ])
        }
      >
        <Plus className="w-3.5 h-3.5" /> Add Tool
      </button>
    </div>
  );
}

function PracticeEditor({ draft, setDraft }: EditorProps) {
  const practice = draft.practice;
  const set = (patch: Partial<SiteContent["practice"]>) =>
    setDraft({ ...draft, practice: { ...practice, ...patch } });
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Studio Practice & Services</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Manifesto statement and studio service offerings.
        </p>
      </div>
      <Field label="Eyebrow" value={practice.kicker} onChange={(kicker) => set({ kicker })} />
      <Field label="First Line" area value={practice.line1} onChange={(line1) => set({ line1 })} />
      <Field
        label="Highlighted Line"
        value={practice.highlight}
        onChange={(highlight) => set({ highlight })}
      />
      <Field
        label="Closing Line"
        area
        value={practice.line2}
        onChange={(line2) => set({ line2 })}
      />
      <Field label="Body Statement" area value={practice.body} onChange={(body) => set({ body })} />
      <div className="space-y-3">
        {practice.services.map((service, index) => (
          <div
            key={`${service.title}-${index}`}
            className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
          >
            <label className="block space-y-1.5">
              <span className="text-xs font-mono text-neutral-400">Service Icon</span>
              <select
                className={fieldClass}
                value={service.icon}
                onChange={(event) =>
                  set({
                    services: practice.services.map((entry, i) =>
                      i === index ? { ...entry, icon: event.target.value as ServiceIcon } : entry
                    ),
                  })
                }
              >
                <option value="direction">Art direction</option>
                <option value="campaigns">Campaigns</option>
                <option value="voice">Brand voice</option>
                <option value="print">Print</option>
              </select>
            </label>
            <Field
              label="Service Title"
              value={service.title}
              onChange={(title) =>
                set({
                  services: practice.services.map((entry, i) =>
                    i === index ? { ...entry, title } : entry
                  ),
                })
              }
            />
            <Field
              label="Detail"
              value={service.detail}
              onChange={(detail) =>
                set({
                  services: practice.services.map((entry, i) =>
                    i === index ? { ...entry, detail } : entry
                  ),
                })
              }
            />
            <button
              type="button"
              className="text-left text-xs text-red-400 hover:text-red-300 font-mono"
              onClick={() =>
                set({ services: practice.services.filter((_, i) => i !== index) })
              }
            >
              Remove service
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-mono text-white transition-colors"
        onClick={() =>
          set({
            services: [...practice.services, { icon: "direction", title: "New Service", detail: "" }],
          })
        }
      >
        <Plus className="w-3.5 h-3.5" /> Add Service
      </button>
    </div>
  );
}

function WorksEditor({
  draft,
  setDraft,
  projectIndex,
  setProjectIndex,
}: EditorProps & { projectIndex: number; setProjectIndex: (index: number) => void }) {
  const works = draft.works;
  const projects = works.projects;
  const index = Math.min(projectIndex, Math.max(projects.length - 1, 0));
  const project = projects[index];
  const [projectSearch, setProjectSearch] = useState("");

  const setWorks = (patch: Partial<SiteContent["works"]>) =>
    setDraft({ ...draft, works: { ...works, ...patch } });

  const update = (patch: Partial<Project>) => {
    setWorks({
      projects: projects.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)),
    });
  };

  const duplicateCurrent = () => {
    if (!project) return;
    const newId = `work-${Date.now()}`;
    const clone: Project = {
      ...project,
      id: newId,
      slug: `${project.slug}-copy`,
      title: `${project.title} (Copy)`,
    };
    const nextList = [...projects];
    nextList.splice(index + 1, 0, clone);
    setWorks({ projects: nextList });
    setProjectIndex(index + 1);
  };

  const moveProject = (direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;
    const nextList = [...projects];
    const [moved] = nextList.splice(index, 1);
    nextList.splice(targetIdx, 0, moved);
    setWorks({ projects: nextList });
    setProjectIndex(targetIdx);
  };

  const filteredProjects = projects.filter((p) => {
    if (!projectSearch) return true;
    const q = projectSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Featured Works & Campaigns</h2>
          <p className="text-xs text-neutral-400 mt-1">
            Displayed as social media feed cards in the portfolio.
          </p>
        </div>
        <span className="font-mono text-xs text-neutral-400">
          Total Projects: <strong className="text-white">{projects.length}</strong>
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Section Eyebrow" value={works.kicker} onChange={(kicker) => setWorks({ kicker })} />
        <Field label="Introduction Text" area value={works.intro} onChange={(intro) => setWorks({ intro })} />
        <Field label="Title Line 1" value={works.titleA} onChange={(titleA) => setWorks({ titleA })} />
        <Field label="Title Line 2" value={works.titleB} onChange={(titleB) => setWorks({ titleB })} />
      </div>

      {/* Project Selector Bar */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search projects…"
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-neutral-500 outline-none w-36 sm:w-48"
            />
          </div>

          <button
            type="button"
            className="flex items-center gap-1 rounded-full bg-white text-black px-3 py-1.5 text-xs font-bold hover:bg-neutral-200 transition-colors cursor-pointer"
            onClick={() => {
              const id = `work-${Date.now()}`;
              const next: Project = {
                id,
                slug: id,
                title: "New Project",
                client: "Client Name",
                year: "2026",
                category: "Campaign Design",
                tags: ["CAMPAIGN", "ART DIRECTION"],
                headline: "Campaign tagline or key message.",
                summary: "Full summary of the project and visual identity approach.",
                challenge: "",
                solution: "",
                results: ["Major Campaign KV", "National Rollout"],
                coverImage: "/work/rise-1.jpg",
                galleryImages: [],
                featured: true,
                accentColor: "#c4a574",
                role: ["Art Direction", "Campaign Design"],
                clientLogo: "",
              };
              setWorks({ projects: [...projects, next] });
              setProjectIndex(projects.length);
            }}
          >
            <Plus className="w-3.5 h-3.5" /> Add New Project
          </button>
        </div>

        {/* Project Buttons List */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
          {filteredProjects.map((item) => {
            const realIdx = projects.findIndex((p) => p.id === item.id);
            const isSelected = realIdx === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setProjectIndex(realIdx)}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-black font-bold shadow-md"
                    : "border border-white/10 bg-white/[0.03] text-neutral-300 hover:text-white hover:border-white/20"
                }`}
              >
                <span>{item.title || "Untitled"}</span>
                {item.featured && (
                  <Sparkles
                    className={`w-3 h-3 ${isSelected ? "text-red-600" : "text-red-400"}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Project Editor */}
      {project && (
        <div className="space-y-5 rounded-2xl border border-white/15 bg-white/[0.02] p-5 sm:p-6">
          {/* Project Management Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-neutral-400">Project #{index + 1}</span>
              <span className="h-3 w-[1px] bg-white/20" />
              <span className="font-display font-bold text-white text-base">
                {project.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Reorder Buttons */}
              <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-0.5">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveProject("up")}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                  title="Move project up (earlier in feed)"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === projects.length - 1}
                  onClick={() => moveProject("down")}
                  className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-400 transition-colors"
                  title="Move project down (later in feed)"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Duplicate Button */}
              <button
                type="button"
                onClick={duplicateCurrent}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/15 bg-white/5 text-neutral-300 hover:text-white text-xs font-mono transition-colors"
                title="Duplicate this project"
              >
                <Copy className="w-3 h-3" /> Duplicate
              </button>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${project.title}" from your portfolio?`)) {
                    setWorks({ projects: projects.filter((_, i) => i !== index) });
                    setProjectIndex(Math.max(0, index - 1));
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-mono transition-colors"
                title="Delete project"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Project Title"
              value={project.title}
              onChange={(title) =>
                update({
                  title,
                  slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || project.slug,
                })
              }
            />
            <Field label="Client Name" value={project.client} onChange={(client) => update({ client })} />
            <Field label="Year" value={project.year} onChange={(year) => update({ year })} />
            <Field
              label="Category"
              value={project.category}
              onChange={(category) => update({ category: category as Project["category"] })}
            />
            <Field
              label="Card Headline / Catchphrase"
              value={project.headline}
              onChange={(headline) => update({ headline })}
            />
            <ColorField
              label="Theme Glow Color"
              value={project.accentColor}
              onChange={(accentColor) => update({ accentColor })}
            />
            <div className="sm:col-span-2">
              <Field
                label="Project Summary / Social Caption"
                area
                value={project.summary}
                onChange={(summary) => update({ summary })}
              />
            </div>
            <Field
              label="Challenge Statement"
              area
              value={project.challenge}
              onChange={(challenge) => update({ challenge })}
            />
            <Field
              label="Solution Statement"
              area
              value={project.solution}
              onChange={(solution) => update({ solution })}
            />
            <Lines
              label="Results / Highlights (one per line)"
              values={project.results}
              onChange={(results) => update({ results })}
            />
            <Lines
              label="Hashtags (one per line, without #)"
              values={project.tags}
              onChange={(tags) => update({ tags })}
            />
            <Lines
              label="Your Roles (one per line)"
              values={project.role}
              onChange={(role) => update({ role })}
            />

            {/* Images */}
            <div className="sm:col-span-2">
              <ImageField
                label="Cover Image (Social Media Post Image)"
                hint="Main visual shown in the feed and at the top of the case study."
                frame="cover"
                value={project.coverImage}
                onChange={(coverImage) => update({ coverImage })}
              />
            </div>
            <div className="sm:col-span-2">
              <ImageField
                label="Client Avatar Mark"
                hint="Sits in the profile circle on the post header. A square transparent PNG is best."
                frame="logo"
                value={project.clientLogo || ""}
                onChange={(clientLogo) => update({ clientLogo })}
              />
            </div>
            <div className="sm:col-span-2">
              <ImageGallery
                label="Project Gallery / Multi-Image Carousel"
                hint="Allows users to swipe/click through multiple slides directly on the social media card!"
                values={project.galleryImages}
                onChange={(galleryImages) => update({ galleryImages })}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AboutEditor({ draft, setDraft }: EditorProps) {
  const about = draft.about;
  const set = (patch: Partial<SiteContent["about"]>) =>
    setDraft({ ...draft, about: { ...about, ...patch } });
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold">About Studio & Capabilities</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Biography, capability lists, and client logos.
        </p>
      </div>
      <Field label="Eyebrow" value={about.kicker} onChange={(kicker) => set({ kicker })} />
      <Field label="Headline" area value={about.headline} onChange={(headline) => set({ headline })} />
      <Field
        label="First Paragraph"
        area
        value={about.paragraphA}
        onChange={(paragraphA) => set({ paragraphA })}
      />
      <Field
        label="Second Paragraph"
        area
        value={about.paragraphB}
        onChange={(paragraphB) => set({ paragraphB })}
      />
      <Field
        label="Capabilities Label"
        value={about.practiceLabel}
        onChange={(practiceLabel) => set({ practiceLabel })}
      />
      <Field
        label="Capabilities Note"
        value={about.practiceNote}
        onChange={(practiceNote) => set({ practiceNote })}
      />
      <div className="space-y-3">
        {about.capabilities.map((item, index) => (
          <div
            key={`${item.number}-${index}`}
            className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
          >
            <Field
              label="Number"
              value={item.number}
              onChange={(number) =>
                set({
                  capabilities: about.capabilities.map((entry, i) =>
                    i === index ? { ...entry, number } : entry
                  ),
                })
              }
            />
            <Field
              label="Title"
              value={item.title}
              onChange={(title) =>
                set({
                  capabilities: about.capabilities.map((entry, i) =>
                    i === index ? { ...entry, title } : entry
                  ),
                })
              }
            />
            <Field
              label="Description"
              area
              value={item.description}
              onChange={(description) =>
                set({
                  capabilities: about.capabilities.map((entry, i) =>
                    i === index ? { ...entry, description } : entry
                  ),
                })
              }
            />
            <Lines
              label="Tags"
              values={item.tags}
              onChange={(tags) =>
                set({
                  capabilities: about.capabilities.map((entry, i) =>
                    i === index ? { ...entry, tags } : entry
                  ),
                })
              }
            />
            <button
              type="button"
              className="text-left text-xs text-red-400 hover:text-red-300 font-mono"
              onClick={() =>
                set({ capabilities: about.capabilities.filter((_, i) => i !== index) })
              }
            >
              Remove capability
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-mono text-white transition-colors"
        onClick={() =>
          set({
            capabilities: [
              ...about.capabilities,
              { number: `0${about.capabilities.length + 1}`, title: "New Capability", description: "", tags: [] },
            ],
          })
        }
      >
        <Plus className="w-3.5 h-3.5" /> Add Capability
      </button>
      <Field
        label="Clients Label"
        value={about.clientsLabel}
        onChange={(clientsLabel) => set({ clientsLabel })}
      />
      <Field
        label="Clients Note"
        value={about.clientsNote}
        onChange={(clientsNote) => set({ clientsNote })}
      />
      <Lines
        label="Client Names (one per line)"
        values={about.clients}
        onChange={(clients) => set({ clients })}
      />
    </div>
  );
}

function AwardsEditor({ draft, setDraft }: EditorProps) {
  const awards = draft.awards;
  const set = (patch: Partial<SiteContent["awards"]>) =>
    setDraft({ ...draft, awards: { ...awards, ...patch } });
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Curated Selection & Milestones</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Selection gallery highlight cards.
        </p>
      </div>
      <Field label="Eyebrow" value={awards.kicker} onChange={(kicker) => set({ kicker })} />
      <Field label="Title" area value={awards.headline} onChange={(headline) => set({ headline })} />
      <Field label="Introduction" area value={awards.intro} onChange={(intro) => set({ intro })} />
      <div className="space-y-3">
        {awards.items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-2"
          >
            <Field
              label="Title"
              value={item.title}
              onChange={(title) =>
                set({
                  items: awards.items.map((entry, i) =>
                    i === index ? { ...entry, title } : entry
                  ),
                })
              }
            />
            <Field
              label="Year"
              value={item.year}
              onChange={(year) =>
                set({
                  items: awards.items.map((entry, i) =>
                    i === index ? { ...entry, year } : entry
                  ),
                })
              }
            />
            <Field
              label="Type / Medium"
              value={item.type}
              onChange={(type) =>
                set({
                  items: awards.items.map((entry, i) =>
                    i === index ? { ...entry, type } : entry
                  ),
                })
              }
            />
            <Field
              label="Platform / Client"
              value={item.platform}
              onChange={(platform) =>
                set({
                  items: awards.items.map((entry, i) =>
                    i === index ? { ...entry, platform } : entry
                  ),
                })
              }
            />
            <button
              type="button"
              className="text-left text-xs text-red-400 hover:text-red-300 font-mono"
              onClick={() => set({ items: awards.items.filter((_, i) => i !== index) })}
            >
              Remove milestone
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-mono text-white transition-colors"
        onClick={() =>
          set({
            items: [
              ...awards.items,
              { id: `item-${Date.now()}`, title: "New Selection", platform: "", type: "", year: "2026" },
            ],
          })
        }
      >
        <Plus className="w-3.5 h-3.5" /> Add Milestone Card
      </button>
    </div>
  );
}

function TalkEditor({ draft, setDraft }: EditorProps) {
  const talk = draft.talk;
  const set = (patch: Partial<SiteContent["talk"]>) =>
    setDraft({ ...draft, talk: { ...talk, ...patch } });
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Inquiry Desk & Project Bot</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Interactive studio dispatch desk and auto-scope generator.
        </p>
      </div>
      <Field label="Eyebrow" value={talk.kicker} onChange={(kicker) => set({ kicker })} />
      <Field label="Title Line 1" value={talk.titleA} onChange={(titleA) => set({ titleA })} />
      <Field label="Title Line 2" value={talk.titleB} onChange={(titleB) => set({ titleB })} />
      <Field label="Introduction" area value={talk.intro} onChange={(intro) => set({ intro })} />
      <Field
        label="Opening Greeting Message"
        area
        value={talk.greeting}
        onChange={(greeting) => set({ greeting })}
      />
      <Field
        label="Terminal Window Name"
        value={talk.windowLabel}
        onChange={(windowLabel) => set({ windowLabel })}
      />
      <Field label="Status Badge Text" value={talk.status} onChange={(status) => set({ status })} />
    </div>
  );
}

function FooterEditor({ draft, setDraft }: EditorProps) {
  const footer = draft.footer;
  const set = (patch: Partial<SiteContent["footer"]>) =>
    setDraft({ ...draft, footer: { ...footer, ...patch } });
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold">Footer & Colophon</h2>
        <p className="text-xs text-neutral-400 mt-1">
          Bottom branding, statement and social/navigation links.
        </p>
      </div>
      <Field label="Eyebrow" value={footer.kicker} onChange={(kicker) => set({ kicker })} />
      <Field label="Line 1" value={footer.lineA} onChange={(lineA) => set({ lineA })} />
      <Field label="Line 2" value={footer.lineB} onChange={(lineB) => set({ lineB })} />
      <Field label="CTA Button" value={footer.cta} onChange={(cta) => set({ cta })} />
      <Field
        label="Practice Label"
        value={footer.practiceLabel}
        onChange={(practiceLabel) => set({ practiceLabel })}
      />
      <Field
        label="Practice Text"
        area
        value={footer.practiceBody}
        onChange={(practiceBody) => set({ practiceBody })}
      />
      <Field
        label="Links Label"
        value={footer.linksLabel}
        onChange={(linksLabel) => set({ linksLabel })}
      />
      <div className="space-y-3">
        {footer.links.map((link, index) => (
          <div key={`${link.url}-${index}`} className="grid gap-3 sm:grid-cols-2">
            <Field
              label="Link Name"
              value={link.name}
              onChange={(name) =>
                set({
                  links: footer.links.map((entry, i) => (i === index ? { ...entry, name } : entry)),
                })
              }
            />
            <Field
              label="Destination URL"
              value={link.url}
              onChange={(url) =>
                set({
                  links: footer.links.map((entry, i) => (i === index ? { ...entry, url } : entry)),
                })
              }
            />
          </div>
        ))}
      </div>
      <Field
        label="Status Label"
        value={footer.ethosLabel}
        onChange={(ethosLabel) => set({ ethosLabel })}
      />
      <Field
        label="Status Text"
        area
        value={footer.ethosBody}
        onChange={(ethosBody) => set({ ethosBody })}
      />
      <Field
        label="Booking Note"
        value={footer.status}
        onChange={(status) => set({ status })}
      />
      <Field
        label="Credit Line"
        value={footer.credit}
        onChange={(credit) => set({ credit })}
      />
    </div>
  );
}

interface EditorProps {
  draft: SiteContent;
  setDraft: (content: SiteContent) => void;
}
