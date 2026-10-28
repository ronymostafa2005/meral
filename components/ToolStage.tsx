"use client";

import { CardFan } from "./CardFan";
import { useSite } from "./SiteProvider";

export function ToolStage() {
  const { content } = useSite();

  if (!content.programs.items.length) return null;

  // Used to sit inside the old hero, which supplied its own padding and
  // background. It stands on its own now, so it carries a section of its own.
  return (
    <section
      id="tools"
      className="relative w-full border-b border-white/10 px-4 py-10 sm:px-8 sm:py-14"
      style={{ backgroundColor: "var(--page-bg, #050505)" }}
    >
      <div className="relative mx-auto w-full max-w-4xl">
        <CardFan cards={content.programs.items} caption={content.programs.caption} />
      </div>
    </section>
  );
}
