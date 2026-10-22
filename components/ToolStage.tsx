"use client";

import { CardFan } from "./CardFan";
import { useSite } from "./SiteProvider";

export function ToolStage() {
  const { content } = useSite();

  return (
    <div className="relative mx-auto w-full max-w-4xl py-1">
      <CardFan cards={content.programs.items} caption={content.programs.caption} />
    </div>
  );
}
