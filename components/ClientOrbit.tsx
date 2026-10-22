"use client";

import { Project } from "../types/portfolio";

const SLOTS = [
  { x: 22, y: 32, rotate: -16, tilt: 10, w: 27, z: 2 },
  { x: 79, y: 28, rotate: 14, tilt: 8, w: 26, z: 3 },
  { x: 20, y: 74, rotate: 11, tilt: -6, w: 24, z: 2 },
  { x: 81, y: 72, rotate: -13, tilt: 6, w: 25, z: 3 },
  { x: 50, y: 16, rotate: -6, tilt: 12, w: 20, z: 1 },
];

function piecesFor(projects: Project[]) {
  const pieces: { src: string; project: Project }[] = [];
  const seen = new Set<string>();
  const push = (src: string, project: Project) => {
    if (seen.has(src) || pieces.length >= SLOTS.length) return;
    seen.add(src);
    pieces.push({ src, project });
  };
  for (const project of projects) push(project.coverImage, project);
  for (const project of projects) {
    for (const src of project.galleryImages) push(src, project);
  }
  return pieces;
}

function ClientMark({ client, logo }: { client: string; logo?: string }) {
  if (logo) {
    return <img src={logo} alt="" className="h-[46%] w-[46%] object-contain" />;
  }
  if (client.toLowerCase().includes("rise")) {
    return (
      <svg viewBox="0 0 64 64" className="h-[42%] w-[42%]" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <ellipse
            key={index}
            cx="32"
            cy="16"
            rx="3.2"
            ry="9"
            fill="white"
            transform={`rotate(${index * 60} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="3.2" fill="white" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" className="h-[46%] w-[46%]" aria-hidden="true">
      <path d="M8 30 L32 10 L56 30" fill="none" stroke="white" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M16 28 V52 H48 V28" fill="none" stroke="white" strokeWidth="2.4" />
      <path d="M28 52 V38 H36 V52" fill="none" stroke="white" strokeWidth="2.2" />
    </svg>
  );
}

export function ClientOrbit({
  client,
  projects,
  onOpen,
}: {
  client: string;
  projects: Project[];
  onOpen: (project: Project) => void;
}) {
  const pieces = piecesFor(projects);
  const accent = projects[0]?.accentColor ?? "#1a2744";
  const year = projects[0]?.year;
  const categories = [...new Set(projects.map((project) => project.category))];

  return (
    <div className="px-3 pb-1 pt-3 sm:px-4">
      <div
        className="relative mx-auto aspect-[16/10] w-[88%] overflow-visible rounded-2xl bg-[#07080c]"
      >
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 46%, ${accent} 0%, #07080c 70%)`,
          }}
        />
        {pieces.map((piece, index) => {
          const slot = SLOTS[index];
          const dx = slot.x - 50;
          const dy = slot.y - 48;
          const length = Math.hypot(dx, dy) || 1;

          return (
            <button
              key={piece.src}
              type="button"
              aria-label={piece.project.title}
              onClick={(event) => {
                event.stopPropagation();
                onOpen(piece.project);
              }}
              style={{
                left: `${slot.x}%`,
                top: `${slot.y}%`,
                width: `${slot.w}%`,
                zIndex: slot.z,
                ["--tilt" as string]: `${slot.rotate}deg`,
                ["--shift-x" as string]: `${(dx / length) * 10}%`,
                ["--shift-y" as string]: `${(dy / length) * 10}%`,
              }}
              className="orbit-piece absolute aspect-[4/5] overflow-hidden rounded-[14%] border border-white/30 bg-black shadow-[0_10px_18px_rgba(0,0,0,0.4)] outline-none"
            >
              <img src={piece.src} alt="" decoding="async" className="pointer-events-none h-full w-full object-cover" />
            </button>
          );
        })}

        <div className="absolute left-1/2 top-1/2 z-20 flex aspect-square w-[24%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[30%] border border-white/30 bg-[#090909] shadow-[0_16px_28px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]">
          <ClientMark client={client} logo={projects.find((item) => item.clientLogo)?.clientLogo} />
          <span className="mt-0.5 max-w-[84%] text-center font-mono text-[clamp(0.38rem,0.75vw,0.52rem)] uppercase leading-tight tracking-[0.12em] text-white/80">
            {client.replace(" Developments", "")}
          </span>
        </div>

        <div className="pointer-events-none absolute left-3 right-3 top-3 z-40 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {year && (
              <span className="rounded-full border border-white/20 bg-black/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
                {year}
              </span>
            )}
            <span className="rounded-full bg-red-600/80 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
              {categories.length === 1 ? categories[0] : `${projects.length} works`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
