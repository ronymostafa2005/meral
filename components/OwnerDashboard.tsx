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
  ArrowUp,
  ArrowDown,
  Search,
  Trash2,
  Plus,
  Monitor,
  Smartphone,
  X,
  AlertCircle,
  Menu,
  RotateCcw,
  Loader2,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
  Images,
  ChevronLeft,
  ChevronRight,
  Type,
} from "lucide-react";
import { ImageField, ImageGallery } from "./ImageUpload";
import { defaultContent, safeColor, type ServiceIcon, type SiteContent } from "../lib/siteContent";
import type { ArchiveItem, Project } from "../types/portfolio";

/* ────────────────────────────────────────────────────────────────────────────
   Meral Studio — owner console

   The console is a tool, not a page of the site, so it keeps its own tokens
   on purpose. Colours are written as explicit hex values rather than Tailwind
   palette classes because SiteProvider rewrites `.text-red-*`, `.bg-red-*` and
   friends with !important to follow the owner's brand: inheriting that would
   recolour the console's own buttons every time the site's accent changes.

   Colour grammar, applied strictly:
     gold    #c4a574 — active navigation, primary action, focus
     crimson #e0566a — destructive only (delete, remove, failure)
     emerald #34d399 — confirmation
   ──────────────────────────────────────────────────────────────────────────── */

const consoleStyles = `
.admin-shell {
  font-family: var(--console-sans), ui-sans-serif, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.admin-display {
  font-family: var(--console-serif), ui-serif, Georgia, serif;
  font-weight: 500;
  letter-spacing: -0.005em;
}
.admin-mono {
  font-family: var(--console-mono), ui-monospace, monospace;
}
.admin-grain::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
}
.admin-scroll::-webkit-scrollbar { width: 5px; }
.admin-scroll::-webkit-scrollbar-track { background: transparent; }
.admin-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
.admin-scroll::-webkit-scrollbar-thumb:hover { background: rgba(196,165,116,0.4); }
.admin-shell input[type="color"] { appearance: none; -webkit-appearance: none; }
@keyframes adminRise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes adminFade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes adminSlideUp {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}
.admin-rise { animation: adminRise 0.34s cubic-bezier(0.22, 1, 0.36, 1) both; }
.admin-fade { animation: adminFade 0.25s ease both; }
.admin-slide-up { animation: adminSlideUp 0.28s cubic-bezier(0.22, 1, 0.36, 1) both; }
@media (prefers-reduced-motion: reduce) {
  .admin-rise, .admin-fade, .admin-slide-up { animation: none; }
}
`;

const inputBase =
  "w-full rounded-lg border border-white/[0.09] bg-[#0b0b0f] px-3.5 py-2.5 text-[13px] text-[#f2f2f4] outline-none transition-colors duration-150 placeholder:text-[#70707c] hover:border-white/[0.16] focus:border-[#c4a574]/60 focus:bg-[#0d0d12] focus:ring-2 focus:ring-[#c4a574]/15";

const labelBase =
  "admin-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#a9a9b4]";

const ghostButton =
  "inline-flex items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.02] px-3 py-2 text-[12px] text-[#dcdce2] transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-40";

const dangerButton =
  "inline-flex items-center gap-1.5 rounded-lg border border-[#e0566a]/25 bg-[#e0566a]/[0.08] px-2.5 py-1.5 admin-mono text-[10px] uppercase tracking-[0.12em] text-[#e0566a] transition-colors hover:bg-[#e0566a]/20 hover:text-[#ff8795]";

/* ── Navigation model ──────────────────────────────────────────────────────
   Every section declares the panels it renders. The sidebar reads this to
   build its sub-section tree, and the panel ids double as scroll anchors, so
   a new panel only has to be listed here to appear in the navigation.        */

type SectionId =
  | "brand"
  | "nav"
  | "intro"
  | "hero"
  | "programs"
  | "practice"
  | "works"
  | "archive"
  | "about"
  | "awards"
  | "talk"
  | "footer";

interface SectionMeta {
  id: SectionId;
  label: string;
  icon: typeof Palette;
  hint: string;
  description: string;
  subs: { id: string; label: string }[];
}

interface NavGroup {
  label: string;
  caption: string;
  sections: SectionMeta[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Foundation",
    caption: "Applies site-wide",
    sections: [
      {
        id: "brand",
        label: "Brand Identity",
        icon: Palette,
        hint: "Logo, colour & type",
        description:
          "The studio mark, palette and typefaces. These values cascade into every section of the site.",
        subs: [
          { id: "brand-studio", label: "Studio & mark" },
          { id: "brand-canvas", label: "Page canvas" },
          { id: "brand-accents", label: "Accents" },
          { id: "brand-type", label: "Typography" },
        ],
      },
      {
        id: "nav",
        label: "Header & Menu",
        icon: Compass,
        hint: "Navigation labels",
        description:
          "Labels for the fixed header and the mobile drawer. Keep them short — the header sets them in wide tracking.",
        subs: [
          { id: "nav-desktop", label: "Desktop header" },
          { id: "nav-mobile", label: "Mobile drawer" },
        ],
      },
    ],
  },
  {
    label: "Opening",
    caption: "First impression",
    sections: [
      {
        id: "intro",
        label: "Opening Animation",
        icon: Play,
        hint: "First-visit preloader",
        description:
          "The opening animation a first-time visitor sees before the site resolves.",
        subs: [
          { id: "intro-wordmark", label: "Wordmark" },
          { id: "intro-corners", label: "Corner lines" },
          { id: "intro-carousel", label: "Image carousel" },
        ],
      },
      {
        id: "hero",
        label: "Hero Banner",
        icon: Flame,
        hint: "Headline & portrait",
        description:
          "The top of the page: headline, biography, portrait and the credentials beside them.",
        subs: [
          { id: "hero-headline", label: "Headline" },
          { id: "hero-statement", label: "Statement" },
          { id: "hero-disciplines", label: "Disciplines" },
          { id: "hero-portrait", label: "Portrait" },
          { id: "hero-about", label: "Biography" },
          { id: "hero-edges", label: "Edge labels" },
          { id: "hero-cta", label: "Call to action" },
        ],
      },
      {
        id: "programs",
        label: "Design Tools",
        icon: Cpu,
        hint: "Software fan cards",
        description:
          "The fanned cards under the hero that show which software the studio works in.",
        subs: [
          { id: "programs-caption", label: "Caption" },
          { id: "programs-tools", label: "Tool cards" },
        ],
      },
    ],
  },
  {
    label: "Content",
    caption: "The body of the site",
    sections: [
      {
        id: "practice",
        label: "Manifesto & Services",
        icon: Layers,
        hint: "Studio statement",
        description:
          "The manifesto statement under the hero, and the services listed beneath it.",
        subs: [
          { id: "practice-manifesto", label: "Manifesto" },
          { id: "practice-services", label: "Services" },
        ],
      },
      {
        id: "works",
        label: "Featured Projects",
        icon: LayoutGrid,
        hint: "Case studies",
        description:
          "Selected projects, their case-study copy and every image that appears with them.",
        subs: [
          { id: "works-section", label: "Section copy" },
          { id: "works-projects", label: "Projects" },
        ],
      },
      {
        id: "archive",
        label: "All Projects",
        icon: Images,
        hint: "Full archive grid",
        description:
          "The paged grid under the featured work. Lighter entries — a cover set, both titles and one line each.",
        subs: [
          { id: "archive-section", label: "Section copy" },
          { id: "archive-projects", label: "Projects" },
        ],
      },
      {
        id: "about",
        label: "About & Clients",
        icon: User,
        hint: "Biography & logos",
        description:
          "The biography, the numbered capability list and the client marquee.",
        subs: [
          { id: "about-biography", label: "Biography" },
          { id: "about-capabilities", label: "Capabilities" },
          { id: "about-clients", label: "Clients" },
        ],
      },
      {
        id: "awards",
        label: "Awards & Selection",
        icon: Award,
        hint: "What is on view",
        description: "The curated gallery of what is currently on view.",
        subs: [
          { id: "awards-section", label: "Section copy" },
          { id: "awards-items", label: "Milestones" },
        ],
      },
    ],
  },
  {
    label: "Contact",
    caption: "Closing the page",
    sections: [
      {
        id: "talk",
        label: "Contact Desk",
        icon: MessageSquare,
        hint: "Inquiry & scope bot",
        description:
          "The inquiry section and the copy the scope assistant opens with.",
        subs: [
          { id: "talk-section", label: "Section copy" },
          { id: "talk-desk", label: "Dispatch desk" },
        ],
      },
      {
        id: "footer",
        label: "Site Footer",
        icon: AlignLeft,
        hint: "Colophon & links",
        description: "The closing statement, page links and colophon.",
        subs: [
          { id: "footer-statement", label: "Closing statement" },
          { id: "footer-practice", label: "Practice note" },
          { id: "footer-links", label: "Page links" },
          { id: "footer-colophon", label: "Colophon" },
        ],
      },
    ],
  },
];

const ALL_SECTIONS = NAV_GROUPS.flatMap((group) =>
  group.sections.map((section) => ({ ...section, group: group.label })),
);

const SECTION_INDEX = new Map(ALL_SECTIONS.map((section, i) => [section.id, i + 1]));

function sectionMeta(id: SectionId) {
  return ALL_SECTIONS.find((section) => section.id === id) ?? ALL_SECTIONS[0];
}

interface EditorProps {
  draft: SiteContent;
  setDraft: (content: SiteContent) => void;
}

/* ── Console ───────────────────────────────────────────────────────────────── */

export function OwnerDashboard() {
  const [phase, setPhase] = useState<"checking" | "login" | "editor" | "error">("checking");
  const [email, setEmail] = useState("merall22@gmail.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [draft, setDraft] = useState<SiteContent>(defaultContent);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [savedAt, setSavedAt] = useState<string>("");
  const [section, setSection] = useState<SectionId>("works");
  const [observedSub, setObservedSub] = useState("");
  const [projectIndex, setProjectIndex] = useState(0);
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"ok" | "error">("ok");
  const [saving, setSaving] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  // Per-viewer layout preference, so the rail stays how it was left. Read in a
  // lazy initializer rather than an effect: the sidebar only renders once the
  // editor opens client-side, so this never reaches the server's HTML.
  const [navCollapsed, setNavCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return localStorage.getItem("meral_console_rail") === "1";
    } catch {
      return false;
    }
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");

  const meta = sectionMeta(section);
  const subs = meta.subs;
  // Derived rather than reset in an effect, so switching section cannot leave
  // a stale highlight for one render.
  const activeSub = subs.some((sub) => sub.id === observedSub) ? observedSub : subs[0]?.id ?? "";

  const isDirty = useMemo(() => {
    if (!lastSaved) return false;
    return JSON.stringify(draft) !== lastSaved;
  }, [draft, lastSaved]);

  useEffect(() => {
    const load = async () => {
      let session: Response;
      try {
        session = await fetch("/api/auth/session", { cache: "no-store" });
      } catch {
        setPhase("login");
        return;
      }
      if (!session.ok) {
        setPhase("login");
        return;
      }
      // Entering the editor without the live content would leave `draft` on
      // defaultContent, and one Save would publish those defaults over the
      // real site. Refuse to open the editor unless the load succeeded.
      try {
        const content = await fetch("/api/content", { cache: "no-store" });
        if (!content.ok) {
          setPhase("error");
          return;
        }
        const data = await content.json();
        setDraft(data);
        setLastSaved(JSON.stringify(data));
        setPhase("editor");
      } catch {
        setPhase("error");
      }
    };
    void load();
  }, []);

  // Highlight the panel the owner is actually looking at.
  useEffect(() => {
    if (phase !== "editor") return;
    const nodes = subs
      .map((sub) => document.getElementById(sub.id))
      .filter((node): node is HTMLElement => !!node);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const top = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (top) setObservedSub(top.target.id);
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [phase, section, subs]);

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
      if (!content.ok) {
        setPhase("error");
        return;
      }
      const data = await content.json();
      setDraft(data);
      setLastSaved(JSON.stringify(data));
      setPhase("editor");
    } catch {
      setError("Network error. Please try again.");
    }
  };

  const announce = (tone: "ok" | "error", message: string) => {
    setStatusTone(tone);
    setStatus(message);
  };

  const save = useCallback(async () => {
    // No baseline means the editor never received the live content, so the
    // draft is still defaultContent. Saving it would wipe the real site.
    if (!lastSaved) {
      setStatusTone("error");
      setStatus("Content has not loaded yet. Reload before saving.");
      return;
    }
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
        if (response.status === 401) {
          setStatusTone("error");
          setStatus("Your session expired. Please sign in again.");
          return;
        }
        const failure = await response.json().catch(() => null);
        setStatusTone("error");
        setStatus(
          typeof failure?.error === "string" ? failure.error : "Could not save. Please try again.",
        );
        return;
      }
      const saved = await response.json();
      setDraft(saved);
      setLastSaved(JSON.stringify(saved));
      setSavedAt(
        // Pinned to en-US: the browser locale would render Arabic-Indic
        // numerals on an Arabic system, which this project does not use.
        new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      );

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

      setStatusTone("ok");
      setStatus("Published. The live site is updated.");
      setTimeout(() => setStatus(""), 4500);
    } catch {
      setSaving(false);
      setStatusTone("error");
      setStatus("Error saving changes. Please check your connection.");
    }
  }, [draft, lastSaved]);

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

  const discard = () => {
    if (!lastSaved) return;
    if (!window.confirm("Discard every change made since your last save?")) return;
    setDraft(JSON.parse(lastSaved));
    announce("ok", "Unsaved changes discarded.");
    setTimeout(() => setStatus(""), 3000);
  };

  const toggleRail = () => {
    setNavCollapsed((previous) => {
      const next = !previous;
      try {
        localStorage.setItem("meral_console_rail", next ? "1" : "0");
      } catch {}
      return next;
    });
  };

  const goToSection = (id: SectionId) => {
    setSection(id);
    setObservedSub("");
    setNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToSub = (id: string) => {
    setObservedSub(id);
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── Gate screens ──────────────────────────────────────────────────────── */

  if (phase === "checking") {
    return (
      <Gate>
        <div className="flex items-center gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-[#c4a574]" />
          <span className="admin-mono text-[11px] uppercase tracking-[0.2em] text-[#a9a9b4]">
            Verifying studio credentials
          </span>
        </div>
      </Gate>
    );
  }

  if (phase === "error") {
    return (
      <Gate>
        <div className="admin-rise w-full max-w-sm space-y-5 rounded-2xl border border-[#c4a574]/20 bg-[#0c0c10] p-8 text-center">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#c4a574]/30 bg-[#c4a574]/10">
            <AlertCircle className="h-5 w-5 text-[#c4a574]" />
          </span>
          <div className="space-y-2">
            <h1 className="admin-display text-[19px] font-semibold tracking-tight text-white">
              Could not load your content
            </h1>
            <p className="text-[13px] leading-6 text-[#a9a9b4]">
              The editor stays closed so a save cannot overwrite your live site with
              default content. Check your connection and try again.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full rounded-lg bg-[#c4a574] px-5 py-2.5 text-[12px] font-bold text-[#12100c] transition-colors hover:bg-[#d4b888]"
          >
            Retry
          </button>
        </div>
      </Gate>
    );
  }

  if (phase === "login") {
    return (
      <Gate>
        <form
          className="admin-rise w-full max-w-sm space-y-7 rounded-2xl border border-white/[0.08] bg-[#0c0c10] p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
          onSubmit={(event) => {
            event.preventDefault();
            void login();
          }}
        >
          <div className="space-y-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c4a574]/25 bg-[#c4a574]/[0.08]">
              <Lock className="h-4 w-4 text-[#c4a574]" />
            </span>
            <div className="space-y-1.5">
              <p className="admin-mono text-[10px] uppercase tracking-[0.26em] text-[#c4a574]">
                Owner access
              </p>
              <h1 className="admin-display text-[26px] font-semibold tracking-tight text-white">
                Meral Studio Console
              </h1>
              <p className="text-[13px] leading-6 text-[#a9a9b4]">
                Sign in to edit the live portfolio.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block space-y-2">
              <span className={labelBase}>Owner email</span>
              <input
                dir="ltr"
                className={inputBase}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="block space-y-2">
              <span className={labelBase}>Password</span>
              <input
                dir="ltr"
                className={inputBase}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </div>

          {error && (
            <p className="flex items-start gap-2 rounded-lg border border-[#e0566a]/25 bg-[#e0566a]/[0.08] p-3 text-[12px] leading-5 text-[#f08a97]">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {error}
            </p>
          )}

          <button
            className="w-full rounded-lg bg-[#c4a574] py-3 text-[12px] font-bold uppercase tracking-[0.14em] text-[#12100c] transition-colors hover:bg-[#d4b888]"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </Gate>
    );
  }

  /* ── Console shell ─────────────────────────────────────────────────────── */

  /**
   * One sidebar, two widths. Collapsed it keeps only the icons, so the rail
   * reads as a column of marks; the labels, hints, indices and sub-sections
   * all drop away rather than being squeezed. The mobile drawer always renders
   * expanded, which is why this takes the state as an argument instead of
   * reading it directly.
   */
  const renderSidebar = (collapsed: boolean) => (
    <>
      {/* The rail toggle lives on the top edge, beside the wordmark, where a
          sidebar control is looked for — not at the far bottom of the nav. */}
      <div
        className={`flex items-center border-b border-white/[0.07] ${
          collapsed ? "justify-center px-2 py-[18px]" : "gap-3 px-5 py-[18px]"
        }`}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={toggleRail}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            aria-expanded={false}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#c4a574]/45 bg-[#c4a574]/[0.14] text-[#c4a574] shadow-[0_0_0_3px_rgba(196,165,116,0.07)] transition-colors hover:border-[#c4a574] hover:bg-[#c4a574] hover:text-[#12100c]"
          >
            <PanelLeftOpen className="h-[18px] w-[18px]" />
          </button>
        ) : (
          <>
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#34d399]/60" />
              <span className="relative h-2 w-2 rounded-full bg-[#34d399]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="admin-display truncate text-[16px] font-semibold tracking-tight text-white">
                Meral Studio
              </p>
              <p className="admin-mono text-[9.5px] uppercase tracking-[0.2em] text-[#9a9aa6]">
                Portfolio console
              </p>
            </div>
            <button
              type="button"
              onClick={toggleRail}
              title="Collapse sidebar to icons"
              aria-label="Collapse sidebar to icons"
              aria-expanded
              className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#c4a574]/45 bg-[#c4a574]/[0.14] text-[#c4a574] shadow-[0_0_0_3px_rgba(196,165,116,0.07)] transition-colors hover:border-[#c4a574] hover:bg-[#c4a574] hover:text-[#12100c] lg:grid"
            >
              <PanelLeftClose className="h-[18px] w-[18px]" />
            </button>
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              className="rounded-lg p-1.5 text-[#a9a9b4] transition-colors hover:bg-white/5 hover:text-white lg:hidden"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      <nav className={`admin-scroll flex-1 overflow-y-auto py-5 ${collapsed ? "px-2" : "px-3"}`}>
        {NAV_GROUPS.map((group, groupIndex) => (
          <div key={group.label} className="mb-6 last:mb-0">
            {/* Group heading only. The right-hand column of this list is
                already the section index (01–11); a second number there read
                as another index rather than a count. Collapsed, the heading
                becomes a hairline so the grouping survives without text. */}
            {collapsed ? (
              groupIndex > 0 && <div className="mx-auto mb-5 h-px w-6 bg-white/[0.12]" />
            ) : (
              <div className="mb-2 px-3">
                <span className="admin-mono text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[#8c8c99]">
                  {group.label}
                </span>
              </div>
            )}

            <ul className="space-y-1">
              {group.sections.map((item) => {
                const Icon = item.icon;
                const active = section === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => goToSection(item.id)}
                      aria-current={active ? "page" : undefined}
                      aria-label={collapsed ? item.label : undefined}
                      title={collapsed ? `${item.label} — ${item.hint}` : undefined}
                      className={`group relative flex w-full items-center rounded-lg transition-colors ${
                        collapsed ? "justify-center py-3" : "gap-3 px-3 py-3 text-left"
                      } ${
                        active
                          ? "bg-[#c4a574]/[0.1] text-white"
                          : "text-[#c0c0c9] hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <span
                        className={`absolute left-0 top-1/2 w-[2px] -translate-y-1/2 rounded-full transition-all ${
                          collapsed ? "h-7" : "h-5"
                        } ${active ? "bg-[#c4a574]" : "bg-transparent group-hover:bg-white/20"}`}
                      />
                      <Icon
                        className={`h-[22px] w-[22px] shrink-0 transition-colors ${
                          active ? "text-[#c4a574]" : "text-[#9a9aa6] group-hover:text-[#dcdce2]"
                        }`}
                      />
                      {/* A section is a destination, so it carries the same
                          serif as the page heading it opens. Sub-sections are
                          sans, smaller and lighter — the two levels differ by
                          typeface, size, weight and colour, not weight alone. */}
                      {!collapsed && (
                        <>
                          <span className="min-w-0 flex-1">
                            <span className="admin-display block truncate text-[15.5px] font-semibold leading-tight">
                              {item.label}
                            </span>
                            <span className="admin-mono mt-1 block truncate text-[9px] uppercase tracking-[0.14em] text-[#8c8c99]">
                              {item.hint}
                            </span>
                          </span>
                          <span className="admin-mono text-[9.5px] tabular-nums text-[#7e7e8a]">
                            {String(SECTION_INDEX.get(item.id)).padStart(2, "0")}
                          </span>
                        </>
                      )}
                    </button>

                    {!collapsed && active && item.subs.length > 0 && (
                      <ul className="admin-fade ml-[30px] mt-1 space-y-0.5 border-l border-white/[0.09] pl-3">
                        {item.subs.map((sub) => {
                          const current = activeSub === sub.id;
                          return (
                            <li key={sub.id}>
                              <button
                                type="button"
                                onClick={() => goToSub(sub.id)}
                                className={`group/sub relative flex w-full items-center gap-2 rounded-md py-[7px] pl-3 pr-2 text-left text-[11.5px] tracking-[0.01em] transition-colors ${
                                  current
                                    ? "font-semibold text-[#c4a574]"
                                    : "font-normal text-[#9a9aa6] hover:text-[#dcdce2]"
                                }`}
                              >
                                <span
                                  className={`absolute left-0 top-1/2 h-1 w-1 -translate-y-1/2 rounded-full transition-all ${
                                    current
                                      ? "bg-[#c4a574]"
                                      : "bg-[#5e5e6a] group-hover/sub:bg-[#9a9aa6]"
                                  }`}
                                />
                                <span className="truncate">{sub.label}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div
        className={`border-t border-white/[0.07] ${
          collapsed ? "space-y-2 px-2 py-4" : "space-y-3 px-5 py-4"
        }`}
      >
        {collapsed ? (
          <button
            type="button"
            onClick={() => void logout()}
            title="Sign out"
            aria-label="Sign out"
            className="flex w-full items-center justify-center rounded-lg py-2.5 text-[#a9a9b4] transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            <LogOut className="h-[18px] w-[18px]" />
          </button>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="admin-mono text-[9.5px] uppercase tracking-[0.16em] text-[#8c8c99]">
                {savedAt ? `Saved ${savedAt}` : "No save yet"}
              </span>
              <button
                type="button"
                onClick={() => void logout()}
                className="inline-flex items-center gap-1.5 admin-mono text-[9.5px] uppercase tracking-[0.16em] text-[#a9a9b4] transition-colors hover:text-white"
              >
                <LogOut className="h-3 w-3" /> Sign out
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Replace every field with the original factory content? Your unsaved edits will be lost.",
                  )
                ) {
                  setDraft(structuredClone(defaultContent));
                  announce("ok", "Factory content loaded into the editor. Nothing is saved yet.");
                }
              }}
              className="inline-flex items-center gap-1.5 admin-mono text-[9.5px] uppercase tracking-[0.16em] text-[#8c8c99] transition-colors hover:text-[#e0566a]"
            >
              <RotateCcw className="h-3 w-3" /> Load factory content
            </button>
          </>
        )}
      </div>
    </>
  );

  return (
    <div
      dir="ltr"
      className="admin-shell admin-grain relative min-h-screen bg-[#08080a] text-[#f2f2f4]"
    >
      <style>{consoleStyles}</style>

      {/* Atmosphere: one warm bloom behind the navigation rail. */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[480px] bg-[radial-gradient(ellipse_70%_100%_at_12%_0%,rgba(196,165,116,0.1),transparent_72%)]" />

      <div className="relative z-10 flex min-h-screen">
        {/* Rail */}
        <aside
          className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/[0.07] bg-[#0a0a0d]/70 backdrop-blur-xl transition-[width] duration-300 ease-out lg:flex ${
            navCollapsed ? "w-[76px]" : "w-[278px]"
          }`}
        >
          {renderSidebar(navCollapsed)}
        </aside>

        {/* Mobile drawer */}
        {navOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="admin-fade absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setNavOpen(false)}
            />
            <aside className="admin-fade absolute inset-y-0 left-0 flex w-[82%] max-w-[300px] flex-col border-r border-white/[0.08] bg-[#0a0a0d]">
              {renderSidebar(false)}
            </aside>
          </div>
        )}

        {/* Workspace */}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#08080a]/85 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-[1560px] items-center gap-3 px-4 py-3 sm:px-7">
              <button
                type="button"
                onClick={() => setNavOpen(true)}
                className="rounded-lg border border-white/[0.1] p-2 text-[#dcdce2] transition-colors hover:bg-white/5 hover:text-white lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="h-4 w-4" />
              </button>

              <nav
                aria-label="Breadcrumb"
                className="admin-mono hidden min-w-0 items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#8c8c99] sm:flex"
              >
                <span>{meta.group}</span>
                <span className="text-[#5e5e6a]">/</span>
                <span className="truncate text-[#dcdce2]">{meta.label}</span>
              </nav>

              <div className="ml-auto flex items-center gap-2">
                {isDirty && (
                  <span className="hidden items-center gap-1.5 rounded-full border border-[#c4a574]/25 bg-[#c4a574]/[0.08] px-2.5 py-1 admin-mono text-[9.5px] uppercase tracking-[0.14em] text-[#c4a574] sm:inline-flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#c4a574]" />
                    Unsaved
                  </span>
                )}
                {/* Emerald, matching the "live" dot in the sidebar: this button
                    shows the published site. Gold stays reserved for Publish so
                    the two never compete. */}
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#34d399]/40 bg-[#34d399]/[0.12] px-3 py-2 text-[12px] font-medium text-[#8fe7c0] transition-colors hover:border-[#34d399]/70 hover:bg-[#34d399]/20 hover:text-[#bdf5db]"
                  title="Preview the published site"
                >
                  <Eye className="h-3.5 w-3.5 text-[#34d399]" />
                  <span className="hidden md:inline">Preview</span>
                </button>
                <a
                  className={ghostButton}
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  title="Open the live site in a new tab"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Live site</span>
                </a>
                <button
                  type="button"
                  onClick={() => void save()}
                  disabled={saving || !lastSaved}
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    isDirty
                      ? "bg-[#c4a574] text-[#12100c] hover:bg-[#d4b888]"
                      : "border border-white/[0.12] bg-white/[0.04] text-[#dcdce2] hover:bg-white/[0.08]"
                  }`}
                >
                  {saving ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Save className="h-3.5 w-3.5" />
                  )}
                  <span>{saving ? "Saving" : "Publish"}</span>
                </button>
              </div>
            </div>

            {/* Section identity */}
            <div className="border-t border-white/[0.05] px-4 pb-5 pt-4 sm:px-7">
              <div className="mx-auto flex w-full max-w-[1560px] items-start gap-4">
                <span className="admin-mono mt-1 hidden text-[11px] tabular-nums text-[#c4a574]/70 sm:block">
                  {String(SECTION_INDEX.get(meta.id)).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h1 className="admin-display text-[25px] font-semibold leading-tight text-white sm:text-[29px]">
                    {meta.label}
                  </h1>
                  <p className="mt-1.5 max-w-2xl text-[13px] leading-6 text-[#a9a9b4]">
                    {meta.description}
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className={`flex-1 px-4 py-7 sm:px-7 ${isDirty ? "pb-28" : "pb-10"}`}>
            <div key={section} className="admin-rise mx-auto w-full max-w-[1560px] space-y-5">
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
              {section === "archive" && <ArchiveEditor draft={draft} setDraft={setDraft} />}
              {section === "about" && <AboutEditor draft={draft} setDraft={setDraft} />}
              {section === "awards" && <AwardsEditor draft={draft} setDraft={setDraft} />}
              {section === "talk" && <TalkEditor draft={draft} setDraft={setDraft} />}
              {section === "footer" && <FooterEditor draft={draft} setDraft={setDraft} />}
            </div>
          </main>
        </div>
      </div>

      {/* Commit bar — only while there is something to commit */}
      {isDirty && (
        <div
          className={`admin-slide-up fixed inset-x-0 bottom-0 z-40 border-t border-[#c4a574]/20 bg-[#0a0a0d]/95 backdrop-blur-xl transition-[left] duration-300 ease-out ${
            navCollapsed ? "lg:left-[76px]" : "lg:left-[278px]"
          }`}
        >
          <div className="mx-auto flex w-full max-w-[1560px] items-center gap-4 px-4 py-3.5 sm:px-7">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c4a574]/30 bg-[#c4a574]/10">
              <AlertCircle className="h-3.5 w-3.5 text-[#c4a574]" />
            </span>
            <p className="min-w-0 flex-1 text-[12px] leading-5 text-[#dcdce2]">
              <span className="font-semibold text-white">Unpublished changes.</span>{" "}
              <span className="hidden sm:inline">
                Visitors still see the previous version until you publish.
              </span>
            </p>
            <button type="button" onClick={discard} className={ghostButton}>
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Discard</span>
            </button>
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#c4a574] px-5 py-2 text-[12px] font-bold text-[#12100c] transition-colors hover:bg-[#d4b888] disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {saving ? "Publishing" : "Publish"}
              <span className="admin-mono hidden text-[9.5px] opacity-60 lg:inline">⌘S</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {status && (
        <div
          role="status"
          className={`admin-rise fixed right-4 z-50 flex max-w-sm items-start gap-2.5 rounded-xl border px-4 py-3 text-[12px] leading-5 backdrop-blur-xl ${
            isDirty ? "bottom-24" : "bottom-5"
          } ${
            statusTone === "ok"
              ? "border-[#34d399]/25 bg-[#07130f]/95 text-[#7ae0b8]"
              : "border-[#e0566a]/25 bg-[#17090b]/95 text-[#f08a97]"
          }`}
        >
          {statusTone === "ok" ? (
            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          )}
          <span>{status}</span>
          <button
            type="button"
            onClick={() => setStatus("")}
            className="ml-1 shrink-0 opacity-50 transition-opacity hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Preview */}
      {previewOpen && (
        <div className="admin-fade fixed inset-0 z-50 flex flex-col bg-[#05050700]/95 p-3 backdrop-blur-2xl sm:p-6">
          <div className="flex items-center justify-between gap-4 pb-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#34d399]" />
              <h2 className="admin-display truncate text-[16px] font-semibold text-white">
                Live preview
              </h2>
              <span className="admin-mono hidden text-[10px] uppercase tracking-[0.16em] text-[#9a9aa6] sm:inline">
                Shows the published site
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.1] bg-white/[0.03] p-0.5">
                {(
                  [
                    ["desktop", Monitor, "Desktop"],
                    ["mobile", Smartphone, "Mobile"],
                  ] as const
                ).map(([device, Icon, title]) => (
                  <button
                    key={device}
                    type="button"
                    onClick={() => setPreviewDevice(device)}
                    title={title}
                    className={`rounded-md p-1.5 transition-colors ${
                      previewDevice === device
                        ? "bg-[#c4a574] text-[#12100c]"
                        : "text-[#a9a9b4] hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg border border-white/[0.12] p-2 text-[#dcdce2] transition-colors hover:bg-white/[0.06] hover:text-white"
                aria-label="Close preview"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center">
            <div
              className={`h-full overflow-hidden rounded-xl border border-white/[0.12] bg-black shadow-[0_40px_120px_-40px_rgba(0,0,0,1)] transition-all duration-300 ${
                previewDevice === "desktop" ? "w-full" : "h-full max-h-[860px] w-[390px]"
              }`}
            >
              <iframe
                src="/?autostart=1"
                className="h-full w-full border-0"
                title="Portfolio live preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Layout primitives ─────────────────────────────────────────────────────── */

function Gate({ children }: { children: React.ReactNode }) {
  return (
    <main
      dir="ltr"
      className="admin-shell admin-grain relative grid min-h-screen place-items-center bg-[#08080a] px-4 text-[#f2f2f4]"
    >
      <style>{consoleStyles}</style>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(196,165,116,0.08),transparent_70%)]" />
      <div className="relative z-10 flex w-full justify-center">{children}</div>
    </main>
  );
}

function Panel({
  id,
  title,
  description,
  children,
  split = true,
  onReset,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Columns from the `sm` breakpoint up. Turn off for stacked prose. */
  split?: boolean;
  /** Shows a "Restore originals" control in the header. */
  onReset?: () => void;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-[164px] overflow-hidden rounded-xl border border-white/[0.07] bg-[#0b0b0f]/70"
    >
      <header className="flex items-start justify-between gap-4 border-b border-white/[0.06] bg-white/[0.012] px-5 py-3.5">
        <div className="min-w-0">
          <h2 className="admin-display text-[15.5px] font-semibold text-white">{title}</h2>
          {description && (
            <p className="mt-1 text-[12px] leading-5 text-[#b0b0bb]">{description}</p>
          )}
        </div>
        {onReset && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Restore the original values for “${title}”?`)) onReset();
            }}
            className="admin-mono inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/[0.1] px-2.5 py-1.5 text-[9.5px] uppercase tracking-[0.14em] text-[#a9a9b4] transition-colors hover:border-[#c4a574]/40 hover:text-[#c4a574]"
            title={`Restore the original ${title.toLowerCase()} values`}
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Restore</span>
          </button>
        )}
      </header>
      <div className={`grid gap-5 p-5 ${split ? "sm:grid-cols-2 xl:grid-cols-3" : ""}`}>
        {children}
      </div>
    </section>
  );
}

/** Spans every column of its grid, whatever the current count. */
function Wide({ children }: { children: React.ReactNode }) {
  return <div className="col-span-full">{children}</div>;
}

/**
 * Destructive confirmation, in the console's own language.
 *
 * window.confirm paints an OS dialog with the browser's wording and the site's
 * URL in the title bar — it looks like a warning the page is in trouble, not a
 * step the owner meant to take. This names the thing being deleted and keeps
 * the crimson reserved for the button that does it.
 */
function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="admin-fade fixed inset-0 z-[60] grid place-items-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="admin-rise w-full max-w-sm overflow-hidden rounded-xl border border-[#e0566a]/25 bg-[#0c0c10] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3.5 p-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#e0566a]/30 bg-[#e0566a]/[0.1]">
            <Trash2 className="h-4 w-4 text-[#e0566a]" />
          </span>
          <div className="min-w-0 space-y-1.5">
            <h2 className="admin-display text-[17px] font-semibold text-white">{title}</h2>
            <p className="text-[12.5px] leading-6 text-[#b0b0bb]">{body}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-white/[0.07] bg-white/[0.012] px-5 py-3.5">
          <button type="button" onClick={onCancel} className={ghostButton} autoFocus>
            Keep it
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-lg bg-[#e0566a] px-4 py-2 text-[12px] font-bold text-white transition-colors hover:bg-[#ef6c7c]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Appears beside a label once its value no longer matches the original. */
function RestoreField({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Restore the original value"
      className="admin-mono inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[0.12em] text-[#9a9aa6] transition-colors hover:text-[#c4a574]"
    >
      <RotateCcw className="h-2.5 w-2.5" />
      Original
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  area = false,
  hint,
  mono = false,
  placeholder,
  defaultValue,
  rtl = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  area?: boolean;
  hint?: string;
  mono?: boolean;
  placeholder?: string;
  /** Supply to offer a one-click restore once the value has been edited. */
  defaultValue?: string;
  /** Right-to-left input, for Arabic copy. */
  rtl?: boolean;
}) {
  const changed = defaultValue !== undefined && value !== defaultValue;
  return (
    <label className="block space-y-2">
      <span className="flex items-baseline justify-between gap-3">
        <span className={labelBase}>{label}</span>
        <span className="flex shrink-0 items-baseline gap-3">
          {area && (
            <span className="admin-mono text-[9.5px] tabular-nums text-[#7e7e8a]">
              {value.length}
            </span>
          )}
          {changed && <RestoreField onClick={() => onChange(defaultValue)} />}
        </span>
      </span>
      {area ? (
        <textarea
          dir={rtl ? "rtl" : "ltr"}
          placeholder={placeholder}
          className={`${inputBase} min-h-[104px] resize-y leading-6 ${rtl ? "text-right" : ""}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          dir={rtl ? "rtl" : "ltr"}
          placeholder={placeholder}
          className={`${inputBase} ${mono ? "admin-mono text-[12px]" : ""} ${
            rtl ? "text-right text-[15px]" : ""
          }`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint && <span className="block text-[11px] leading-5 text-[#8c8c99]">{hint}</span>}
    </label>
  );
}

function Lines({
  label,
  values,
  onChange,
  hint = "One per line.",
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  hint?: string;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-baseline justify-between gap-3">
        <span className={labelBase}>{label}</span>
        <span className="admin-mono text-[9.5px] tabular-nums text-[#7e7e8a]">
          {values.filter(Boolean).length} items
        </span>
      </span>
      <textarea
        dir="ltr"
        className={`${inputBase} min-h-[104px] resize-y leading-6`}
        value={values.join("\n")}
        onChange={(event) => onChange(event.target.value.split("\n"))}
      />
      <span className="block text-[11px] leading-5 text-[#8c8c99]">{hint}</span>
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
  defaultValue,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
  defaultValue?: string;
}) {
  const changed = defaultValue !== undefined && value !== defaultValue;
  return (
    <label className="block space-y-2">
      <span className="flex items-baseline justify-between gap-3">
        <span className={labelBase}>{label}</span>
        {changed && <RestoreField onClick={() => onChange(defaultValue)} />}
      </span>
      <select
        className={`${inputBase} cursor-pointer appearance-none bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-10`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238c8c97' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#0b0b0f]">
            {option.label}
          </option>
        ))}
      </select>
      {hint && <span className="block text-[11px] leading-5 text-[#8c8c99]">{hint}</span>}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
  hint,
  defaultValue,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  defaultValue?: string;
}) {
  const valid = /^#[0-9a-fA-F]{6}$/.test(value);
  const changed =
    defaultValue !== undefined && value.toLowerCase() !== defaultValue.toLowerCase();
  return (
    <label className="block space-y-2">
      <span className="flex items-baseline justify-between gap-3">
        <span className={labelBase}>{label}</span>
        {changed && <RestoreField onClick={() => onChange(defaultValue)} />}
      </span>
      <span className="flex items-center gap-2.5">
        <span
          className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/[0.14] shadow-inner"
          style={{ backgroundColor: valid ? value : "#c4a574" }}
        >
          <input
            aria-label={label}
            type="color"
            value={valid ? value : "#c4a574"}
            onChange={(event) => onChange(event.target.value)}
            className="absolute -inset-3 h-20 w-20 cursor-pointer border-0 bg-transparent p-0 opacity-0"
          />
        </span>
        <input
          dir="ltr"
          className={`${inputBase} admin-mono text-[12px] uppercase`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
      {hint && <span className="block text-[11px] leading-5 text-[#8c8c99]">{hint}</span>}
    </label>
  );
}

/** A card for one entry of a repeating list. */
function RepeaterCard({
  index,
  title,
  removeLabel,
  onRemove,
  children,
  split = false,
}: {
  index: number;
  title: string;
  removeLabel: string;
  onRemove: () => void;
  children: React.ReactNode;
  split?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d0d12]">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
        <span className="admin-mono text-[10px] tabular-nums text-[#c4a574]/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-[#e8e8ee]">
          {title || "Untitled"}
        </span>
        <button type="button" onClick={onRemove} className={dangerButton} title={removeLabel}>
          <Trash2 className="h-3 w-3" />
          <span className="hidden sm:inline">Remove</span>
        </button>
      </div>
      <div className={`grid gap-4 p-4 ${split ? "sm:grid-cols-2" : ""}`}>{children}</div>
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/[0.14] bg-white/[0.012] py-3 admin-mono text-[10px] uppercase tracking-[0.16em] text-[#a9a9b4] transition-colors hover:border-[#c4a574]/40 hover:bg-[#c4a574]/[0.05] hover:text-[#c4a574]"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/* ── Section editors ───────────────────────────────────────────────────────── */

/* Relative luminance per WCAG 2.1, used only to warn when the owner picks a
   background and body text that will be hard to read on the live site. */
function luminance(hex: string) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const int = parseInt(match[1], 16);
  const channels = [(int >> 16) & 255, (int >> 8) & 255, int & 255].map((value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrastRatio(a: string, b: string) {
  const first = luminance(a);
  const second = luminance(b);
  if (first === null || second === null) return null;
  const [light, dark] = first > second ? [first, second] : [second, first];
  return (light + 0.05) / (dark + 0.05);
}

function BrandEditor({ draft, setDraft }: EditorProps) {
  const brand = draft.brand;
  const base = defaultContent.brand;
  const set = (patch: Partial<SiteContent["brand"]>) =>
    setDraft({ ...draft, brand: { ...brand, ...patch } });

  const background = safeColor(brand.background, base.background);
  const text = safeColor(brand.text, base.text);
  const accent = safeColor(brand.accent, base.accent);
  const hot = safeColor(brand.accentHot, base.accentHot);
  const ratio = contrastRatio(background, text);

  return (
    <>
      <Panel
        id="brand-studio"
        title="Studio & mark"
        description="The name in the header and footer, and the logo that sits beside it."
        onReset={() =>
          set({ name: base.name, logoWord: base.logoWord, logoImage: base.logoImage })
        }
      >
        <Field
          label="Studio name"
          value={brand.name}
          onChange={(name) => set({ name })}
          defaultValue={base.name}
        />
        <Field
          label="Logo wordmark"
          value={brand.logoWord}
          onChange={(logoWord) => set({ logoWord })}
          hint="Used when no logo image is set."
          defaultValue={base.logoWord}
        />
        <Wide>
          <ImageField
            label="Studio mark"
            hint="Your logo. A PNG with a transparent background works best."
            where="Beside the studio name in the fixed header at the top of every page, and again in the footer. Leave it empty and the logo wordmark above is used instead."
            frame="logo"
            value={brand.logoImage}
            onChange={(logoImage) => set({ logoImage })}
          />
        </Wide>
      </Panel>

      {/* Background and body text are edited together: they are the pair that
          has to stay legible, so the preview shows them as a visitor sees. */}
      <Panel
        id="brand-canvas"
        title="Page canvas"
        description="The surface the whole site is printed on. Set these two together — they decide whether anything else can be read."
        onReset={() => set({ background: base.background, text: base.text })}
      >
        <ColorField
          label="Page background"
          value={brand.background}
          onChange={(value) => set({ background: value })}
          hint="Near-black by default."
          defaultValue={base.background}
        />
        <ColorField
          label="Body text"
          value={brand.text}
          onChange={(value) => set({ text: value })}
          hint="Every paragraph on the site."
          defaultValue={base.text}
        />

        <Wide>
          <div className="space-y-2.5">
            <span className={labelBase}>Preview</span>
            <div
              className="rounded-lg border border-white/[0.12] px-5 py-6"
              style={{ backgroundColor: background }}
            >
              <p className="admin-display text-[22px] font-semibold" style={{ color: text }}>
                The work speaks first
              </p>
              <p className="mt-2 text-[13px] leading-6" style={{ color: text, opacity: 0.8 }}>
                Body copy exactly as a visitor reads it, with{" "}
                <span style={{ color: accent, opacity: 1 }}>an accent word</span> set in place.
              </p>
            </div>
            {ratio !== null && (
              <p
                className={`flex items-start gap-1.5 text-[11.5px] leading-5 ${
                  ratio < 4.5 ? "text-[#f08a97]" : "text-[#9a9aa6]"
                }`}
              >
                {ratio < 4.5 && <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />}
                <span>
                  Contrast {ratio.toFixed(1)}:1 —{" "}
                  {ratio < 3
                    ? "too low. Most visitors will not be able to read the page."
                    : ratio < 4.5
                      ? "below the 4.5:1 minimum for body text. Headings will read, paragraphs will not."
                      : "comfortable for body text."}
                </span>
              </p>
            )}
          </div>
        </Wide>
      </Panel>

      <Panel
        id="brand-accents"
        title="Accents"
        description="Two colours used sparingly on top of the canvas: one carries the brand, the other raises emphasis."
        onReset={() => set({ accent: base.accent, accentHot: base.accentHot })}
      >
        <ColorField
          label="Accent"
          value={brand.accent}
          onChange={(value) => set({ accent: value })}
          hint="Headline accents, hairlines and labels. Gold by default."
          defaultValue={base.accent}
        />
        <ColorField
          label="Hot accent"
          value={brand.accentHot}
          onChange={(value) => set({ accentHot: value })}
          hint="High-emphasis highlights and badges only."
          defaultValue={base.accentHot}
        />
        <Wide>
          <div className="space-y-2.5">
            <span className={labelBase}>On canvas</span>
            <div
              className="flex flex-wrap items-center gap-2.5 rounded-lg border border-white/[0.12] px-5 py-4"
              style={{ backgroundColor: background }}
            >
              <span
                className="rounded-full px-3 py-1 text-[11.5px] font-semibold"
                style={{ backgroundColor: accent, color: background }}
              >
                Accent
              </span>
              <span
                className="rounded-full px-3 py-1 text-[11.5px] font-semibold"
                style={{ backgroundColor: hot, color: background }}
              >
                Hot accent
              </span>
              <span className="text-[13px]" style={{ color: text, opacity: 0.8 }}>
                beside body text
              </span>
            </div>
          </div>
        </Wide>
      </Panel>

      <Panel
        id="brand-type"
        title="Typography"
        description="Three typefaces ship with the site. Choose which carries headlines and which carries body copy."
        onReset={() => set({ headlineFont: base.headlineFont, bodyFont: base.bodyFont })}
      >
        <SelectField
          label="Headline typeface"
          value={brand.headlineFont}
          onChange={(value) =>
            set({ headlineFont: value as SiteContent["brand"]["headlineFont"] })
          }
          defaultValue={base.headlineFont}
          options={[
            { value: "display", label: "Syne — editorial, high fashion" },
            { value: "sans", label: "Plus Jakarta Sans — clean modern" },
            { value: "mono", label: "JetBrains Mono — technical" },
          ]}
        />
        <SelectField
          label="Body typeface"
          value={brand.bodyFont}
          onChange={(value) => set({ bodyFont: value as SiteContent["brand"]["bodyFont"] })}
          defaultValue={base.bodyFont}
          options={[
            { value: "sans", label: "Plus Jakarta Sans — clean modern" },
            { value: "display", label: "Syne — editorial" },
            { value: "mono", label: "JetBrains Mono — technical" },
          ]}
        />
      </Panel>
    </>
  );
}

function NavEditor({ draft, setDraft }: EditorProps) {
  const nav = draft.nav;
  const set = (patch: Partial<SiteContent["nav"]>) =>
    setDraft({ ...draft, nav: { ...nav, ...patch } });

  return (
    <>
      <Panel
        id="nav-desktop"
        title="Desktop header"
        description="Set in wide uppercase tracking, so one or two words read best."
      >
        <Field label="Works link" value={nav.works} onChange={(works) => set({ works })} />
        <Field label="About link" value={nav.about} onChange={(about) => set({ about })} />
        <Field label="Selection link" value={nav.awards} onChange={(awards) => set({ awards })} />
        <Field label="Start a project link" value={nav.talk} onChange={(talk) => set({ talk })} />
        <Wide>
          <Field
            label="Call-to-action button"
            value={nav.cta}
            onChange={(cta) => set({ cta })}
            hint="The filled button at the right of the header."
          />
        </Wide>
      </Panel>

      <Panel
        id="nav-mobile"
        title="Mobile drawer"
        description="The drawer has room for longer, friendlier labels than the header."
      >
        <Field
          label="Works label"
          value={nav.mobileWorks}
          onChange={(mobileWorks) => set({ mobileWorks })}
        />
        <Field
          label="About label"
          value={nav.mobileAbout}
          onChange={(mobileAbout) => set({ mobileAbout })}
        />
        <Field
          label="Selection label"
          value={nav.mobileAwards}
          onChange={(mobileAwards) => set({ mobileAwards })}
        />
        <Field
          label="Start a project label"
          value={nav.mobileTalk}
          onChange={(mobileTalk) => set({ mobileTalk })}
        />
      </Panel>
    </>
  );
}

function IntroEditor({ draft, setDraft }: EditorProps) {
  const intro = draft.intro;
  const set = (patch: Partial<SiteContent["intro"]>) =>
    setDraft({ ...draft, intro: { ...intro, ...patch } });

  return (
    <>
      <Panel
        id="intro-wordmark"
        title="Wordmark"
        description="The centre of the opening screen, and the button that dismisses it."
      >
        <Field label="Name" value={intro.brand} onChange={(brand) => set({ brand })} />
        <Field
          label="Discipline"
          value={intro.discipline}
          onChange={(discipline) => set({ discipline })}
        />
        <Field label="Enter button" value={intro.enter} onChange={(enter) => set({ enter })} />
        <Field
          label="Badge tag"
          value={intro.badge}
          onChange={(badge) => set({ badge })}
          mono
          hint="Small monospaced stamp, e.g. KV.2026."
        />
      </Panel>

      <Panel
        id="intro-corners"
        title="Corner lines"
        description="Two words in each upper corner, stacked. Single words hold the composition best."
      >
        <Field label="Left line 1" value={intro.leftA} onChange={(leftA) => set({ leftA })} />
        <Field label="Left line 2" value={intro.leftB} onChange={(leftB) => set({ leftB })} />
        <Field label="Right line 1" value={intro.rightA} onChange={(rightA) => set({ rightA })} />
        <Field label="Right line 2" value={intro.rightB} onChange={(rightB) => set({ rightB })} />
        <Wide>
          <Field label="Footer note" value={intro.note} onChange={(note) => set({ note })} />
        </Wide>
      </Panel>

      <Panel id="intro-carousel" title="Image carousel" split={false}>
        <ImageGallery
          label="Intro images"
          hint="A handful of your strongest visuals. They flick past quickly, so pick bold ones."
          where="Inside the opening animation a first-time visitor sees before the site appears. They cycle in this order."
          values={intro.images}
          onChange={(images) => set({ images })}
        />
      </Panel>
    </>
  );
}

function HeroEditor({ draft, setDraft }: EditorProps) {
  const hero = draft.hero;
  const set = (patch: Partial<SiteContent["hero"]>) =>
    setDraft({ ...draft, hero: { ...hero, ...patch } });

  return (
    <>
      <Panel
        id="hero-headline"
        title="Headline"
        description="The two big words on the left of the hero card, and the small line above them."
      >
        <Field
          label="Greeting"
          value={hero.greeting}
          onChange={(greeting) => set({ greeting })}
          hint="Sits above the headline, e.g. “Hey, I'm a”."
        />
        <Field label="Headline line 1" value={hero.headline} onChange={(headline) => set({ headline })} />
        <Field
          label="Headline line 2"
          value={hero.headlineAccent}
          onChange={(headlineAccent) => set({ headlineAccent })}
        />
      </Panel>

      <Panel
        id="hero-statement"
        title="Statement"
        description="The short claim set to the right of the portrait, with one sentence under it."
      >
        <Wide>
          <Field
            label="Statement headline"
            value={hero.statementHeadline}
            onChange={(statementHeadline) => set({ statementHeadline })}
            hint="Six or seven words reads best — it wraps to three lines."
          />
        </Wide>
        <Wide>
          <Field
            label="Statement body"
            area
            value={hero.statementBody}
            onChange={(statementBody) => set({ statementBody })}
          />
        </Wide>
      </Panel>

      <Panel
        id="hero-disciplines"
        title="Disciplines"
        description="The numbered row along the foot of the hero card. Four fit on one line."
        split={false}
      >
        <div className="space-y-3">
          {hero.services.map((service, index) => (
            <RepeaterCard
              key={`${service.number}-${index}`}
              index={index}
              title={service.title}
              removeLabel="Remove discipline"
              onRemove={() =>
                set({ services: hero.services.filter((_, i) => i !== index) })
              }
              split
            >
              <Field
                label="Number"
                value={service.number}
                onChange={(number) =>
                  set({
                    services: hero.services.map((entry, i) =>
                      i === index ? { ...entry, number } : entry,
                    ),
                  })
                }
                mono
                hint="Printed after a # symbol."
              />
              <Field
                label="Title"
                value={service.title}
                onChange={(title) =>
                  set({
                    services: hero.services.map((entry, i) =>
                      i === index ? { ...entry, title } : entry,
                    ),
                  })
                }
              />
            </RepeaterCard>
          ))}
          <AddButton
            label="Add discipline"
            onClick={() =>
              set({
                services: [
                  ...hero.services,
                  {
                    number: String(hero.services.length + 1).padStart(2, "0"),
                    title: "New Discipline",
                  },
                ],
              })
            }
          />
        </div>
      </Panel>

      <Panel
        id="hero-about"
        title="Biography & credentials"
        description="Longer copy about the studio. Used by the about section and search engines."
      >
        <Field label="Eyebrow" value={hero.eyebrow} onChange={(eyebrow) => set({ eyebrow })} />
        <Field
          label="Client strip line"
          value={hero.clientsLine}
          onChange={(clientsLine) => set({ clientsLine })}
          hint="The small line beside the client names under the hero card."
        />
        <Wide>
          <Field label="Biography" area value={hero.body} onChange={(body) => set({ body })} />
        </Wide>
        <Wide>
          <Lines
            label="Credential chips"
            values={hero.facts}
            onChange={(facts) => set({ facts })}
            hint="One per line."
          />
        </Wide>
      </Panel>

      <Panel
        id="hero-edges"
        title="Edge labels"
        description="The small monospaced labels pinned to the top corners of the hero."
      >
        <Field
          label="Left label"
          value={hero.leftLabel}
          onChange={(leftLabel) => set({ leftLabel })}
          mono
        />
        <Field
          label="Right label"
          value={hero.rightLabel}
          onChange={(rightLabel) => set({ rightLabel })}
          mono
        />
      </Panel>

      <Panel
        id="hero-portrait"
        title="Portrait & role"
        description="The circular portrait and the two role lines printed beneath it."
      >
        <Field label="Name under portrait" value={hero.name} onChange={(name) => set({ name })} />
        <Field
          label="Portrait alt text"
          value={hero.portraitAlt}
          onChange={(portraitAlt) => set({ portraitAlt })}
          hint="Described to screen readers and search engines."
        />
        <Field
          label="Role line 1"
          value={hero.roleLine1}
          onChange={(roleLine1) => set({ roleLine1 })}
        />
        <Field
          label="Role line 2"
          value={hero.roleLine2}
          onChange={(roleLine2) => set({ roleLine2 })}
        />
        <Wide>
          <ImageField
            label="Hero portrait"
            hint="A wide, landscape shot with the subject near the centre. It fills the whole hero card, so anything important near the edges may be cropped on a narrow screen."
            where="Filling the hero card at the top of the home page, behind the headline."
            frame="cover"
            value={hero.portrait}
            onChange={(portrait) => set({ portrait })}
          />
        </Wide>
      </Panel>

      <Panel
        id="hero-cta"
        title="Call to action"
        description="The link down to the work, and the tool list printed opposite it."
      >
        <Field label="Scroll button" value={hero.cta} onChange={(cta) => set({ cta })} />
        <Field
          label="Tools line"
          value={hero.toolsLine}
          onChange={(toolsLine) => set({ toolsLine })}
          hint="Separate entries with a middle dot ·"
        />
      </Panel>
    </>
  );
}

function ProgramsEditor({ draft, setDraft }: EditorProps) {
  const programs = draft.programs;
  const setItems = (items: SiteContent["programs"]["items"]) =>
    setDraft({ ...draft, programs: { ...programs, items } });
  const patch = (index: number, entry: Partial<SiteContent["programs"]["items"][number]>) =>
    setItems(programs.items.map((item, i) => (i === index ? { ...item, ...entry } : item)));

  return (
    <>
      <Panel id="programs-caption" title="Caption" split={false}>
        <Field
          label="Caption under the fan"
          value={programs.caption}
          onChange={(caption) => setDraft({ ...draft, programs: { ...programs, caption } })}
        />
      </Panel>

      <Panel
        id="programs-tools"
        title="Tool cards"
        description="Each card carries an icon and a glow colour. They fan out in the order listed here."
        split={false}
      >
        <div className="space-y-3">
          {programs.items.map((item, index) => (
            <RepeaterCard
              key={`${item.id}-${index}`}
              index={index}
              title={item.title}
              removeLabel="Remove tool"
              onRemove={() => setItems(programs.items.filter((_, i) => i !== index))}
              split
            >
              <Field
                label="Tool name"
                value={item.title}
                onChange={(title) => patch(index, { title })}
              />
              <ColorField
                label="Glow colour"
                value={item.to}
                onChange={(to) => patch(index, { to })}
              />
              <Wide>
                <ImageField
                  label="Tool icon"
                  hint="The software's icon. A square PNG with a transparent background."
                  where="On the top edge of this tool's card, in the fanned row under the hero."
                  frame="icon"
                  value={item.icon}
                  onChange={(icon) => patch(index, { icon })}
                />
              </Wide>
            </RepeaterCard>
          ))}
          <AddButton
            label="Add tool"
            onClick={() =>
              setItems([
                ...programs.items,
                {
                  id: `tool-${Date.now()}`,
                  title: "New Tool",
                  icon: "/icons/ai.png",
                  to: "#c4a574",
                },
              ])
            }
          />
        </div>
      </Panel>
    </>
  );
}

function PracticeEditor({ draft, setDraft }: EditorProps) {
  const practice = draft.practice;
  const set = (patch: Partial<SiteContent["practice"]>) =>
    setDraft({ ...draft, practice: { ...practice, ...patch } });
  const patchService = (index: number, entry: Partial<SiteContent["practice"]["services"][number]>) =>
    set({
      services: practice.services.map((service, i) =>
        i === index ? { ...service, ...entry } : service,
      ),
    });

  return (
    <>
      <Panel
        id="practice-manifesto"
        title="Manifesto"
        description="Three lines that build one statement, with the middle line highlighted."
        split={false}
      >
        <Field label="Eyebrow" value={practice.kicker} onChange={(kicker) => set({ kicker })} mono />
        <Field label="First line" area value={practice.line1} onChange={(line1) => set({ line1 })} />
        <Field
          label="Highlighted line"
          value={practice.highlight}
          onChange={(highlight) => set({ highlight })}
          hint="Printed in the accent colour, between the two lines."
        />
        <Field label="Closing line" area value={practice.line2} onChange={(line2) => set({ line2 })} />
        <Field
          label="Body statement"
          area
          value={practice.body}
          onChange={(body) => set({ body })}
        />
      </Panel>

      <Panel
        id="practice-services"
        title="Services"
        description="Each service picks one of four icons drawn by the site."
        split={false}
      >
        <div className="space-y-3">
          {practice.services.map((service, index) => (
            <RepeaterCard
              key={`${service.title}-${index}`}
              index={index}
              title={service.title}
              removeLabel="Remove service"
              onRemove={() => set({ services: practice.services.filter((_, i) => i !== index) })}
              split
            >
              <SelectField
                label="Icon"
                value={service.icon}
                onChange={(icon) => patchService(index, { icon: icon as ServiceIcon })}
                options={[
                  { value: "direction", label: "Art direction" },
                  { value: "campaigns", label: "Campaigns" },
                  { value: "voice", label: "Brand voice" },
                  { value: "print", label: "Print" },
                ]}
              />
              <Field
                label="Title"
                value={service.title}
                onChange={(title) => patchService(index, { title })}
              />
              <Wide>
                <Field
                  label="Detail"
                  value={service.detail}
                  onChange={(detail) => patchService(index, { detail })}
                />
              </Wide>
            </RepeaterCard>
          ))}
          <AddButton
            label="Add service"
            onClick={() =>
              set({
                services: [
                  ...practice.services,
                  { icon: "direction", title: "New Service", detail: "" },
                ],
              })
            }
          />
        </div>
      </Panel>
    </>
  );
}

/* ── Tabbed entity editing ──────────────────────────────────────────────────
   Two levels of tabs. The outer strip picks which project you are editing; the
   inner row picks which part of it. The point is that a long form stops being
   a scroll: whatever you are looking for is one or two clicks away, and the
   gallery is a named destination rather than something you find by accident.  */

/** Tabs across entities — one per project, each showing its cover. */
function EntityTabs({
  items,
  activeIndex,
  onSelect,
  onAdd,
  addLabel,
}: {
  items: { index: number; id: string; title: string; image?: string; featured?: boolean }[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div
      role="tablist"
      aria-label="Projects"
      className="admin-scroll -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-2"
    >
      {items.map((item) => {
        const active = item.index === activeIndex;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(item.index)}
            title={item.title}
            className={`group flex shrink-0 items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition-colors ${
              active
                ? "border-[#c4a574]/45 bg-[#c4a574]/[0.1]"
                : "border-white/[0.08] bg-white/[0.015] hover:border-white/20 hover:bg-white/[0.05]"
            }`}
          >
            <span
              className="h-9 w-9 shrink-0 rounded-md border border-white/10 bg-cover bg-center"
              style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
              aria-hidden
            />
            <span className="min-w-0">
              <span
                className={`admin-mono block text-[9px] uppercase tracking-[0.14em] ${
                  active ? "text-[#c4a574]" : "text-[#8c8c99]"
                }`}
              >
                {String(item.index + 1).padStart(2, "0")}
              </span>
              <span
                className={`block max-w-[150px] truncate text-[12.5px] font-medium ${
                  active ? "text-white" : "text-[#c0c0c9] group-hover:text-white"
                }`}
              >
                {item.title || "Untitled"}
              </span>
            </span>
            {item.featured && (
              <span title="Featured">
                <Sparkles
                  className={`h-3 w-3 shrink-0 ${active ? "text-[#c4a574]" : "text-[#8c8c99]"}`}
                />
              </span>
            )}
          </button>
        );
      })}

      <button
        type="button"
        onClick={onAdd}
        title={addLabel}
        className="flex shrink-0 items-center gap-2 rounded-lg border border-dashed border-white/[0.16] px-3.5 py-2 admin-mono text-[10px] uppercase tracking-[0.14em] text-[#a9a9b4] transition-colors hover:border-[#c4a574]/45 hover:bg-[#c4a574]/[0.06] hover:text-[#c4a574]"
      >
        <Plus className="h-3.5 w-3.5" />
        Add
      </button>
    </div>
  );
}

/** Tabs within one entity — which part of it you are editing. */
function SectionTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; icon: typeof Palette; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="tablist" aria-label="Project sections" className="flex gap-1 border-b border-white/[0.08]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const current = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={current}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-2 px-3.5 py-2.5 text-[12.5px] font-medium transition-colors ${
              current ? "text-[#c4a574]" : "text-[#a9a9b4] hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={`admin-mono rounded-full px-1.5 py-0.5 text-[9px] tabular-nums ${
                  current ? "bg-[#c4a574]/20 text-[#c4a574]" : "bg-white/[0.07] text-[#8c8c99]"
                }`}
              >
                {tab.count}
              </span>
            )}
            <span
              className={`absolute inset-x-0 -bottom-px h-[2px] rounded-full transition-colors ${
                current ? "bg-[#c4a574]" : "bg-transparent"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

/** Pages the tab strip when there are more entries than fit comfortably. */
const TAB_PAGE_SIZE = 10;

function StripPager({
  page,
  pageCount,
  onChange,
  showing,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  showing: string;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="admin-mono text-[10px] uppercase tracking-[0.14em] text-[#9a9aa6]">
        {showing}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page of projects"
          className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.1] text-[#a9a9b4] transition-colors hover:border-white/25 hover:text-white disabled:opacity-25"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => onChange(entry)}
            aria-current={entry === page ? "true" : undefined}
            className={`admin-mono h-8 min-w-8 rounded-lg px-2.5 text-[11px] transition-colors ${
              entry === page
                ? "bg-[#c4a574] font-bold text-[#12100c]"
                : "border border-white/[0.1] text-[#a9a9b4] hover:border-white/25 hover:text-white"
            }`}
          >
            {String(entry).padStart(2, "0")}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          aria-label="Next page of projects"
          className="grid h-8 w-8 place-items-center rounded-lg border border-white/[0.1] text-[#a9a9b4] transition-colors hover:border-white/25 hover:text-white disabled:opacity-25"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/** Search box shared by both tabbed editors. */
function EntitySearch({
  value,
  onChange,
  placeholder,
  total,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  total: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-white/[0.09] bg-[#0b0b0f] px-3 py-2">
        <Search className="h-3.5 w-3.5 shrink-0 text-[#9a9aa6]" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full min-w-0 bg-transparent text-[12.5px] text-white outline-none placeholder:text-[#70707c]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 text-[#9a9aa6] transition-colors hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <span className="admin-mono text-[10px] uppercase tracking-[0.14em] text-[#9a9aa6]">
        {total} total
      </span>
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
  const [query, setQuery] = useState("");
  const [stripPage, setStripPage] = useState(1);
  const [tab, setTab] = useState("basics");
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  const addProject = () => {
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
    setQuery("");
    setStripPage(Math.ceil((projects.length + 1) / TAB_PAGE_SIZE));
    setTab("basics");
  };

  const search = query.trim().toLowerCase();
  const matches = projects
    .map((entry, i) => ({ entry, i }))
    .filter(({ entry }) =>
      !search
        ? true
        : entry.title.toLowerCase().includes(search) ||
          entry.client.toLowerCase().includes(search),
    );

  const pageCount = Math.max(1, Math.ceil(matches.length / TAB_PAGE_SIZE));
  const currentStrip = Math.min(stripPage, pageCount);
  const stripStart = (currentStrip - 1) * TAB_PAGE_SIZE;
  const stripItems = matches.slice(stripStart, stripStart + TAB_PAGE_SIZE).map(({ entry, i }) => ({
    index: i,
    id: entry.id,
    title: entry.title,
    image: entry.coverImage,
    featured: entry.featured,
  }));

  return (
    <>
      <Panel
        id="works-section"
        title="Section copy"
        description="The heading block above the project feed."
      >
        <Field label="Eyebrow" value={works.kicker} onChange={(kicker) => setWorks({ kicker })} mono />
        <Field
          label="Title line 1"
          value={works.titleA}
          onChange={(titleA) => setWorks({ titleA })}
        />
        <Field
          label="Title line 2"
          value={works.titleB}
          onChange={(titleB) => setWorks({ titleB })}
        />
        <Wide>
          <Field
            label="Introduction"
            area
            value={works.intro}
            onChange={(intro) => setWorks({ intro })}
          />
        </Wide>
      </Panel>

      <Panel
        id="works-projects"
        title="Projects"
        description="Pick a project along the top, then choose what to edit. The strip order is the order visitors scroll through."
        split={false}
      >
        <EntitySearch
          value={query}
          onChange={(value) => {
            setQuery(value);
            setStripPage(1);
          }}
          placeholder="Search by title or client…"
          total={projects.length}
        />

        {stripItems.length > 0 ? (
          <EntityTabs
            items={stripItems}
            activeIndex={index}
            onSelect={setProjectIndex}
            onAdd={addProject}
            addLabel="Add a new project"
          />
        ) : (
          <p className="rounded-lg border border-dashed border-white/[0.1] py-6 text-center text-[12px] text-[#9a9aa6]">
            No project matches “{query}”.
          </p>
        )}

        <StripPager
          page={currentStrip}
          pageCount={pageCount}
          onChange={setStripPage}
          showing={`Showing ${stripStart + 1}–${Math.min(
            stripStart + TAB_PAGE_SIZE,
            matches.length,
          )} of ${matches.length}`}
        />

        {project && (
          <>
            {/* Project toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-white/[0.012] px-3 py-2.5">
              <span className="min-w-0">
                <span className="admin-display block truncate text-[15px] font-semibold text-white">
                  {project.title}
                </span>
                <span className="admin-mono text-[9.5px] uppercase tracking-[0.14em] text-[#9a9aa6]">
                  Position {index + 1} of {projects.length}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.1] bg-white/[0.03] p-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveProject("up")}
                    className="rounded-md p-1.5 text-[#a9a9b4] transition-colors hover:text-white disabled:opacity-25"
                    title="Move earlier"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === projects.length - 1}
                    onClick={() => moveProject("down")}
                    className="rounded-md p-1.5 text-[#a9a9b4] transition-colors hover:text-white disabled:opacity-25"
                    title="Move later"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button type="button" onClick={duplicateCurrent} className={ghostButton}>
                  <Copy className="h-3 w-3" />
                  <span className="hidden sm:inline">Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className={dangerButton}
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>

            <SectionTabs
              active={tab}
              onChange={setTab}
              tabs={[
                { id: "basics", label: "Title & basics", icon: Type },
                { id: "story", label: "Description", icon: AlignLeft },
                {
                  id: "gallery",
                  label: "Gallery",
                  icon: Images,
                  count: project.galleryImages.length,
                },
              ]}
            />

            {tab === "basics" && (
              <div className="admin-fade grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Project title"
                  value={project.title}
                  onChange={(title) =>
                    update({
                      title,
                      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-") || project.slug,
                    })
                  }
                />
                <Field
                  label="Client"
                  value={project.client}
                  onChange={(client) => update({ client })}
                />
                <Field label="Year" value={project.year} onChange={(year) => update({ year })} mono />
                <Field
                  label="Category"
                  value={project.category}
                  onChange={(category) => update({ category: category as Project["category"] })}
                  hint="Becomes a filter button above the project feed."
                />
                <Field
                  label="Card headline"
                  value={project.headline}
                  onChange={(headline) => update({ headline })}
                  hint="The catchphrase printed on the feed card."
                />
                <ColorField
                  label="Theme glow"
                  value={project.accentColor}
                  onChange={(accentColor) => update({ accentColor })}
                />
              </div>
            )}

            {tab === "story" && (
              <div className="admin-fade grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <Wide>
                  <Field
                    label="Summary"
                    area
                    value={project.summary}
                    onChange={(summary) => update({ summary })}
                    hint="The opening paragraph of the case study."
                  />
                </Wide>
                <Field
                  label="Challenge"
                  area
                  value={project.challenge}
                  onChange={(challenge) => update({ challenge })}
                />
                <Field
                  label="Solution"
                  area
                  value={project.solution}
                  onChange={(solution) => update({ solution })}
                />
                <Lines
                  label="Results"
                  values={project.results}
                  onChange={(results) => update({ results })}
                />
                <Lines
                  label="Tags"
                  values={project.tags}
                  onChange={(tags) => update({ tags })}
                  hint="One per line, without the # symbol."
                />
                <Lines
                  label="Your roles"
                  values={project.role}
                  onChange={(role) => update({ role })}
                />
              </div>
            )}

            {tab === "gallery" && (
              <div className="admin-fade space-y-5">
                <ImageField
                  label="Cover image"
                  hint="One landscape or portrait photo. This is the picture people judge the project by."
                  where="On the project card in the Featured Projects section, and across the top of the case study when someone opens it."
                  frame="cover"
                  value={project.coverImage}
                  onChange={(coverImage) => update({ coverImage })}
                />
                <ImageField
                  label="Client mark"
                  hint="The client's logo. A square PNG with a transparent background works best."
                  where="As the centre mark on the 3D brand view of the Featured Projects section."
                  frame="logo"
                  value={project.clientLogo || ""}
                  onChange={(clientLogo) => update({ clientLogo })}
                />
                <ImageGallery
                  label="Project gallery"
                  hint="Extra pictures for this project — layouts, print pieces, detail shots."
                  where="Inside the case study only. A visitor sees these after clicking this project's card, under the heading “Visual Artifacts & Design System”. They are not on the card itself."
                  values={project.galleryImages}
                  onChange={(galleryImages) => update({ galleryImages })}
                />
              </div>
            )}

            <ConfirmDialog
              open={confirmDelete}
              title="Delete this project?"
              body={
                <>
                  <strong className="text-white">{project.title}</strong> and its case study copy
                  will be removed from the Featured Projects section. Uploaded images stay on the
                  server. This takes effect when you publish.
                </>
              }
              confirmLabel="Delete project"
              onCancel={() => setConfirmDelete(false)}
              onConfirm={() => {
                setWorks({ projects: projects.filter((_, i) => i !== index) });
                setProjectIndex(Math.max(0, index - 1));
                setConfirmDelete(false);
              }}
            />
          </>
        )}
      </Panel>
    </>
  );
}

/**
 * Page sizes that fill whole rows of the three-column grid. A value saved
 * before this list existed is kept as an option of its own, so the select
 * never renders blank on older content.
 */
function perPageOptions(current: number) {
  const sizes = [3, 6, 9, 12, 15, 18];
  const options = sizes.map((size) => ({
    value: String(size),
    label: `${size} — ${size / 3} row${size === 3 ? "" : "s"}`,
  }));
  if (!sizes.includes(current)) {
    options.unshift({ value: String(current), label: `${current} — custom` });
  }
  return options;
}

function ArchiveEditor({ draft, setDraft }: EditorProps) {
  const archive = draft.archive;
  const base = defaultContent.archive;
  const items = archive.items;
  const [query, setQuery] = useState("");
  const [stripPage, setStripPage] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tab, setTab] = useState("basics");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const index = Math.min(activeIndex, Math.max(items.length - 1, 0));
  const item = items[index];

  const set = (patch: Partial<SiteContent["archive"]>) =>
    setDraft({ ...draft, archive: { ...archive, ...patch } });

  const update = (patch: Partial<ArchiveItem>) =>
    set({ items: items.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)) });

  const move = (direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    set({ items: next });
    setActiveIndex(target);
  };

  const addItem = () => {
    const entry: ArchiveItem = {
      id: `archive-${Date.now()}`,
      title: "New Project",
      titleAr: "",
      category: items[0]?.category || "Campaign Design",
      description: "",
      images: [],
    };
    set({ items: [...items, entry] });
    setActiveIndex(items.length);
    setQuery("");
    setStripPage(Math.ceil((items.length + 1) / TAB_PAGE_SIZE));
    setTab("basics");
  };

  const search = query.trim().toLowerCase();
  const matches = items
    .map((entry, i) => ({ entry, i }))
    .filter(({ entry }) =>
      !search
        ? true
        : entry.title.toLowerCase().includes(search) ||
          entry.titleAr.includes(query.trim()) ||
          entry.category.toLowerCase().includes(search),
    );

  const pageCount = Math.max(1, Math.ceil(matches.length / TAB_PAGE_SIZE));
  const currentStrip = Math.min(stripPage, pageCount);
  const stripStart = (currentStrip - 1) * TAB_PAGE_SIZE;
  const stripItems = matches.slice(stripStart, stripStart + TAB_PAGE_SIZE).map(({ entry, i }) => ({
    index: i,
    id: entry.id,
    title: entry.title,
    image: entry.images[0],
  }));

  return (
    <>
      <Panel
        id="archive-section"
        title="Section copy"
        description="The heading block above the archive grid, and how many cards each page shows."
        onReset={() =>
          set({
            kicker: base.kicker,
            titleA: base.titleA,
            titleB: base.titleB,
            intro: base.intro,
            perPage: base.perPage,
          })
        }
      >
        <Field
          label="Eyebrow"
          value={archive.kicker}
          onChange={(kicker) => set({ kicker })}
          mono
          defaultValue={base.kicker}
        />
        <Field
          label="Title line 1"
          value={archive.titleA}
          onChange={(titleA) => set({ titleA })}
          defaultValue={base.titleA}
        />
        <Field
          label="Title line 2"
          value={archive.titleB}
          onChange={(titleB) => set({ titleB })}
          hint="Printed in the accent colour."
          defaultValue={base.titleB}
        />
        <Wide>
          <Field
            label="Introduction"
            area
            value={archive.intro}
            onChange={(intro) => set({ intro })}
            defaultValue={base.intro}
          />
        </Wide>
        <SelectField
          label="Cards per page on the site"
          value={String(archive.perPage)}
          onChange={(value) => set({ perPage: Number(value) })}
          defaultValue={String(base.perPage)}
          hint="The grid runs three to a row on a wide screen, so multiples of three fill every row."
          options={perPageOptions(archive.perPage)}
        />
      </Panel>

      <Panel
        id="archive-projects"
        title="Projects"
        description="Pick an entry along the top, then choose what to edit. Each entry prints one card in the archive grid."
        split={false}
      >
        <EntitySearch
          value={query}
          onChange={(value) => {
            setQuery(value);
            setStripPage(1);
          }}
          placeholder="Search by title, Arabic title or category…"
          total={items.length}
        />

        {stripItems.length > 0 ? (
          <EntityTabs
            items={stripItems}
            activeIndex={index}
            onSelect={setActiveIndex}
            onAdd={addItem}
            addLabel="Add a project to the archive"
          />
        ) : (
          <p className="rounded-lg border border-dashed border-white/[0.1] py-6 text-center text-[12px] text-[#9a9aa6]">
            {search ? `No project matches “${query}”.` : "The archive is empty."}
          </p>
        )}

        <StripPager
          page={currentStrip}
          pageCount={pageCount}
          onChange={setStripPage}
          showing={`Showing ${stripStart + 1}–${Math.min(
            stripStart + TAB_PAGE_SIZE,
            matches.length,
          )} of ${matches.length}`}
        />

        {item && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.07] bg-white/[0.012] px-3 py-2.5">
              <span className="min-w-0">
                <span className="admin-display block truncate text-[15px] font-semibold text-white">
                  {item.title}
                </span>
                <span className="admin-mono text-[9.5px] uppercase tracking-[0.14em] text-[#9a9aa6]">
                  Position {index + 1} of {items.length}
                </span>
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.1] bg-white/[0.03] p-0.5">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(-1)}
                    className="rounded-md p-1.5 text-[#a9a9b4] transition-colors hover:text-white disabled:opacity-25"
                    title="Move earlier"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => move(1)}
                    className="rounded-md p-1.5 text-[#a9a9b4] transition-colors hover:text-white disabled:opacity-25"
                    title="Move later"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className={dangerButton}
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            </div>

            <SectionTabs
              active={tab}
              onChange={setTab}
              tabs={[
                { id: "basics", label: "Titles", icon: Type },
                { id: "story", label: "Description", icon: AlignLeft },
                { id: "gallery", label: "Gallery", icon: Images, count: item.images.length },
              ]}
            />

            {tab === "basics" && (
              <div className="admin-fade grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Title (English)"
                  value={item.title}
                  onChange={(title) => update({ title })}
                />
                <Field
                  rtl
                  label="Title (Arabic)"
                  value={item.titleAr}
                  onChange={(titleAr) => update({ titleAr })}
                  hint="Printed right-aligned beside the English title. Leave empty to hide it."
                />
                <Field
                  label="Category"
                  value={item.category}
                  onChange={(category) => update({ category })}
                  hint="Becomes the badge on the cover and a filter button above the grid."
                />
              </div>
            )}

            {tab === "story" && (
              <div className="admin-fade">
                <Field
                  label="One-line description"
                  area
                  value={item.description}
                  onChange={(description) => update({ description })}
                  hint="Printed under the two titles on the card. One sentence reads best."
                />
              </div>
            )}

            {tab === "gallery" && (
              <div className="admin-fade">
                <ImageGallery
                  label="Frames"
                  hint="Every picture for this entry. The first one leads."
                  where="On this entry's card in the All Projects grid. Image 01 is the cover; if you add more, visitors click the card to step through them."
                  firstIsCover
                  values={item.images}
                  onChange={(images) => update({ images })}
                />
              </div>
            )}

            <ConfirmDialog
              open={confirmDelete}
              title="Remove this project?"
              body={
                <>
                  <strong className="text-white">{item.title}</strong> will be removed from the All
                  Projects grid. Uploaded images stay on the server. This takes effect when you
                  publish.
                </>
              }
              confirmLabel="Remove project"
              onCancel={() => setConfirmDelete(false)}
              onConfirm={() => {
                set({ items: items.filter((_, i) => i !== index) });
                setActiveIndex(Math.max(0, index - 1));
                setConfirmDelete(false);
              }}
            />
          </>
        )}
      </Panel>
    </>
  );
}

function AboutEditor({ draft, setDraft }: EditorProps) {
  const about = draft.about;
  const set = (patch: Partial<SiteContent["about"]>) =>
    setDraft({ ...draft, about: { ...about, ...patch } });
  const patchCapability = (
    index: number,
    entry: Partial<SiteContent["about"]["capabilities"][number]>,
  ) =>
    set({
      capabilities: about.capabilities.map((item, i) =>
        i === index ? { ...item, ...entry } : item,
      ),
    });

  return (
    <>
      <Panel
        id="about-biography"
        title="Biography"
        description="The headline statement and two paragraphs of the about section."
        split={false}
      >
        <Field label="Eyebrow" value={about.kicker} onChange={(kicker) => set({ kicker })} mono />
        <Field
          label="Headline"
          area
          value={about.headline}
          onChange={(headline) => set({ headline })}
        />
        <Field
          label="First paragraph"
          area
          value={about.paragraphA}
          onChange={(paragraphA) => set({ paragraphA })}
        />
        <Field
          label="Second paragraph"
          area
          value={about.paragraphB}
          onChange={(paragraphB) => set({ paragraphB })}
        />
      </Panel>

      <Panel
        id="about-capabilities"
        title="Capabilities"
        description="A numbered list of what the studio does, each with its own tags."
        split={false}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="List label"
            value={about.practiceLabel}
            onChange={(practiceLabel) => set({ practiceLabel })}
            mono
          />
          <Field
            label="List note"
            value={about.practiceNote}
            onChange={(practiceNote) => set({ practiceNote })}
            mono
          />
        </div>

        <div className="space-y-3">
          {about.capabilities.map((item, index) => (
            <RepeaterCard
              key={`${item.number}-${index}`}
              index={index}
              title={item.title}
              removeLabel="Remove capability"
              onRemove={() =>
                set({ capabilities: about.capabilities.filter((_, i) => i !== index) })
              }
              split
            >
              <Field
                label="Number"
                value={item.number}
                onChange={(number) => patchCapability(index, { number })}
                mono
              />
              <Field
                label="Title"
                value={item.title}
                onChange={(title) => patchCapability(index, { title })}
              />
              <Wide>
                <Field
                  label="Description"
                  area
                  value={item.description}
                  onChange={(description) => patchCapability(index, { description })}
                />
              </Wide>
              <Wide>
                <Lines
                  label="Tags"
                  values={item.tags}
                  onChange={(tags) => patchCapability(index, { tags })}
                />
              </Wide>
            </RepeaterCard>
          ))}
          <AddButton
            label="Add capability"
            onClick={() =>
              set({
                capabilities: [
                  ...about.capabilities,
                  {
                    number: `0${about.capabilities.length + 1}`,
                    title: "New Capability",
                    description: "",
                    tags: [],
                  },
                ],
              })
            }
          />
        </div>
      </Panel>

      <Panel
        id="about-clients"
        title="Clients"
        description="The names that scroll in the client marquee."
      >
        <Field
          label="Marquee label"
          value={about.clientsLabel}
          onChange={(clientsLabel) => set({ clientsLabel })}
          mono
        />
        <Field
          label="Marquee note"
          value={about.clientsNote}
          onChange={(clientsNote) => set({ clientsNote })}
          mono
        />
        <Wide>
          <Lines
            label="Client names"
            values={about.clients}
            onChange={(clients) => set({ clients })}
          />
        </Wide>
      </Panel>
    </>
  );
}

function AwardsEditor({ draft, setDraft }: EditorProps) {
  const awards = draft.awards;
  const set = (patch: Partial<SiteContent["awards"]>) =>
    setDraft({ ...draft, awards: { ...awards, ...patch } });
  const patchItem = (index: number, entry: Partial<SiteContent["awards"]["items"][number]>) =>
    set({ items: awards.items.map((item, i) => (i === index ? { ...item, ...entry } : item)) });

  return (
    <>
      <Panel
        id="awards-section"
        title="Section copy"
        description="The heading block above the selection gallery."
        split={false}
      >
        <Field label="Eyebrow" value={awards.kicker} onChange={(kicker) => set({ kicker })} mono />
        <Field label="Headline" area value={awards.headline} onChange={(headline) => set({ headline })} />
        <Field label="Introduction" area value={awards.intro} onChange={(intro) => set({ intro })} />
      </Panel>

      <Panel
        id="awards-items"
        title="Milestones"
        description="Each card names one piece of work, where it ran and when."
        split={false}
      >
        <div className="space-y-3">
          {awards.items.map((item, index) => (
            <RepeaterCard
              key={`${item.id}-${index}`}
              index={index}
              title={item.title}
              removeLabel="Remove milestone"
              onRemove={() => set({ items: awards.items.filter((_, i) => i !== index) })}
              split
            >
              <Field
                label="Title"
                value={item.title}
                onChange={(title) => patchItem(index, { title })}
              />
              <Field
                label="Year"
                value={item.year}
                onChange={(year) => patchItem(index, { year })}
                mono
              />
              <Field
                label="Type / medium"
                value={item.type}
                onChange={(type) => patchItem(index, { type })}
              />
              <Field
                label="Platform / client"
                value={item.platform}
                onChange={(platform) => patchItem(index, { platform })}
              />
            </RepeaterCard>
          ))}
          <AddButton
            label="Add milestone"
            onClick={() =>
              set({
                items: [
                  ...awards.items,
                  {
                    id: `item-${Date.now()}`,
                    title: "New Selection",
                    platform: "",
                    type: "",
                    year: "2026",
                  },
                ],
              })
            }
          />
        </div>
      </Panel>
    </>
  );
}

function TalkEditor({ draft, setDraft }: EditorProps) {
  const talk = draft.talk;
  const set = (patch: Partial<SiteContent["talk"]>) =>
    setDraft({ ...draft, talk: { ...talk, ...patch } });

  return (
    <>
      <Panel
        id="talk-section"
        title="Section copy"
        description="The heading block of the inquiry section."
      >
        <Field label="Eyebrow" value={talk.kicker} onChange={(kicker) => set({ kicker })} mono />
        <Field label="Title line 1" value={talk.titleA} onChange={(titleA) => set({ titleA })} />
        <Field label="Title line 2" value={talk.titleB} onChange={(titleB) => set({ titleB })} />
        <Wide>
          <Field label="Introduction" area value={talk.intro} onChange={(intro) => set({ intro })} />
        </Wide>
      </Panel>

      <Panel
        id="talk-desk"
        title="Dispatch desk"
        description="The terminal-style panel visitors type their brief into."
      >
        <Wide>
          <Field
            label="Opening greeting"
            area
            value={talk.greeting}
            onChange={(greeting) => set({ greeting })}
            hint="The first message shown before a visitor writes anything."
          />
        </Wide>
        <Field
          label="Window name"
          value={talk.windowLabel}
          onChange={(windowLabel) => set({ windowLabel })}
          mono
        />
        <Field
          label="Status badge"
          value={talk.status}
          onChange={(status) => set({ status })}
          mono
        />
      </Panel>
    </>
  );
}

function FooterEditor({ draft, setDraft }: EditorProps) {
  const footer = draft.footer;
  const set = (patch: Partial<SiteContent["footer"]>) =>
    setDraft({ ...draft, footer: { ...footer, ...patch } });
  const patchLink = (index: number, entry: Partial<SiteContent["footer"]["links"][number]>) =>
    set({ links: footer.links.map((link, i) => (i === index ? { ...link, ...entry } : link)) });

  return (
    <>
      <Panel
        id="footer-statement"
        title="Closing statement"
        description="The large two-line sign-off at the bottom of the page."
      >
        <Field label="Eyebrow" value={footer.kicker} onChange={(kicker) => set({ kicker })} mono />
        <Field label="Call-to-action button" value={footer.cta} onChange={(cta) => set({ cta })} />
        <Field label="Line 1" value={footer.lineA} onChange={(lineA) => set({ lineA })} />
        <Field label="Line 2" value={footer.lineB} onChange={(lineB) => set({ lineB })} />
      </Panel>

      <Panel
        id="footer-practice"
        title="Practice note"
        description="A short description of the practice, printed in the footer columns."
      >
        <Field
          label="Label"
          value={footer.practiceLabel}
          onChange={(practiceLabel) => set({ practiceLabel })}
          mono
        />
        <Field
          label="Links column label"
          value={footer.linksLabel}
          onChange={(linksLabel) => set({ linksLabel })}
          mono
        />
        <Wide>
          <Field
            label="Practice text"
            area
            value={footer.practiceBody}
            onChange={(practiceBody) => set({ practiceBody })}
          />
        </Wide>
      </Panel>

      <Panel
        id="footer-links"
        title="Page links"
        description="Where the footer navigation points. Use #works, #about or #talk to jump within the page."
        split={false}
      >
        <div className="space-y-3">
          {footer.links.map((link, index) => (
            <RepeaterCard
              key={`${link.url}-${index}`}
              index={index}
              title={link.name}
              removeLabel="Remove link"
              onRemove={() => set({ links: footer.links.filter((_, i) => i !== index) })}
              split
            >
              <Field
                label="Link name"
                value={link.name}
                onChange={(name) => patchLink(index, { name })}
              />
              <Field
                label="Destination"
                value={link.url}
                onChange={(url) => patchLink(index, { url })}
                mono
              />
            </RepeaterCard>
          ))}
          <AddButton
            label="Add link"
            onClick={() => set({ links: [...footer.links, { name: "New link", url: "#works" }] })}
          />
        </div>
      </Panel>

      <Panel
        id="footer-colophon"
        title="Colophon"
        description="Availability and the credit line on the last row of the site."
      >
        <Field
          label="Ethos label"
          value={footer.ethosLabel}
          onChange={(ethosLabel) => set({ ethosLabel })}
          mono
        />
        <Field
          label="Booking note"
          value={footer.status}
          onChange={(status) => set({ status })}
        />
        <Wide>
          <Field
            label="Ethos text"
            area
            value={footer.ethosBody}
            onChange={(ethosBody) => set({ ethosBody })}
          />
        </Wide>
        <Wide>
          <Field
            label="Credit line"
            value={footer.credit}
            onChange={(credit) => set({ credit })}
            mono
          />
        </Wide>
      </Panel>
    </>
  );
}
