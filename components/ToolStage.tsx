"use client";

import { CardFan } from "./CardFan";
import { useSite } from "./SiteProvider";

export function ToolStage() {
  const { content } = useSite();

  return (
    <div className="relative mx-auto w-full max-w-4xl">
      <CardFan cards={content.programs.items} glowClassName="bg-[#ff3366]/25" />
      <p className="mt-1 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500">
        {content.programs.caption}
      </p>
    </div>
  );
}
