"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { defaultContent, mergeContent, safeColor, type FontChoice, type SiteContent } from "../lib/siteContent";

interface SiteState {
  content: SiteContent;
  owner: boolean;
  refresh: () => Promise<void>;
}

const SiteContext = createContext<SiteState>({
  content: defaultContent,
  owner: false,
  refresh: async () => {},
});

export function useSite() {
  return useContext(SiteContext);
}

const FONT_KEY: Record<FontChoice, "display" | "sans" | "mono"> = {
  display: "display",
  sans: "sans",
  mono: "mono",
};

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [owner, setOwner] = useState(false);
  const fonts = useRef<{ display: string; sans: string; mono: string } | null>(null);

  const applyContent = (newContent: SiteContent) => {
    setContent(newContent);
    try {
      localStorage.setItem("meral_content_v1", JSON.stringify(newContent));
    } catch {}
  };

  const refresh = async () => {
    try {
      const [contentRes, sessionRes] = await Promise.all([
        fetch("/api/content", { cache: "no-store" }),
        fetch("/api/auth/session", { cache: "no-store" }),
      ]);
      if (contentRes.ok) {
        const data = await contentRes.json();
        applyContent(mergeContent(data));
      }
      setOwner(sessionRes.ok);
    } catch (e) {
      console.error("Failed to refresh site content:", e);
    }
  };

  useEffect(() => {
    // 1. Initial check from localStorage for instant zero-lag load.
    // Every value coming from the browser goes through mergeContent: a cache
    // written by an older deploy can be missing whole sections, and rendering
    // that raw would crash components that map over them (ToolStage reading
    // programs.items, for example). Read in an effect, not a lazy useState
    // initializer, so the first client render still matches the server's.
    try {
      const saved = localStorage.getItem("meral_content_v1");
      if (saved) {
        setContent(mergeContent(JSON.parse(saved)));
      }
    } catch {}

    // 2. Fetch fresh data from server
    void refresh();

    // 3. Real-time BroadcastChannel sync across tabs
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("meral_content_sync");
      channel.onmessage = (event) => {
        if (event.data?.type === "UPDATE" && event.data?.content) {
          setContent(mergeContent(event.data.content));
        }
      };
    } catch {}

    // 4. Custom event for same-page updates
    const handleCustomUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<SiteContent>;
      if (customEvent.detail) {
        setContent(mergeContent(customEvent.detail));
      }
    };
    window.addEventListener("meral_content_update", handleCustomUpdate);

    // 5. Window focus listener to refresh when returning from another tab
    const handleFocus = () => {
      void refresh();
    };
    window.addEventListener("focus", handleFocus);

    // 6. Cross-tab storage event
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "meral_content_v1" && event.newValue) {
        try {
          setContent(mergeContent(JSON.parse(event.newValue)));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      channel?.close();
      window.removeEventListener("meral_content_update", handleCustomUpdate);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!fonts.current) {
      const computed = getComputedStyle(root);
      fonts.current = {
        display: computed.getPropertyValue("--font-display").trim(),
        sans: computed.getPropertyValue("--font-sans").trim(),
        mono: computed.getPropertyValue("--font-mono").trim(),
      };
    }
    const stored = fonts.current;
    root.style.setProperty("--font-display", stored[FONT_KEY[content.brand.headlineFont]] || stored.display);
    root.style.setProperty("--font-sans", stored[FONT_KEY[content.brand.bodyFont]] || stored.sans);
    root.style.setProperty("--brand", safeColor(content.brand.accent, "#c4a574"));
    root.style.setProperty("--brand-hot", safeColor(content.brand.accentHot, "#ef4444"));
    root.style.setProperty("--page-bg", safeColor(content.brand.background, "#050505"));
    root.style.setProperty("--page-text", safeColor(content.brand.text, "#ededed"));
    document.body.style.backgroundColor = safeColor(content.brand.background, "#050505");
    document.body.style.color = safeColor(content.brand.text, "#ededed");
  }, [content.brand]);

  const value = useMemo(() => ({ content, owner, refresh }), [content, owner]);

  const hot = safeColor(content.brand.accentHot, "#ef4444");
  const accent = safeColor(content.brand.accent, "#c4a574");

  return (
    <SiteContext.Provider value={value}>
      <style>{`
        .text-red-400, .text-red-500, .hover\\:text-red-400:hover, .hover\\:text-red-500:hover { color: ${hot} !important; }
        .bg-red-500, .bg-red-600, .bg-red-700 { background-color: ${hot} !important; }
        .border-red-400, .border-red-500, .hover\\:border-red-500:hover { border-color: ${hot} !important; }
        .text-brand { color: ${accent} !important; }
        .border-brand { border-color: ${accent} !important; }
        .from-red-500, .from-red-600 { --tw-gradient-from: ${hot} var(--tw-gradient-from-position) !important; }
        .to-red-400, .to-red-600, .to-red-700 { --tw-gradient-to: ${hot} var(--tw-gradient-to-position) !important; }
      `}</style>
      {children}
    </SiteContext.Provider>
  );
}
