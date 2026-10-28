"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import { sound } from "../utils/audio";
import { useSite } from "./SiteProvider";
import type { ArchiveItem } from "../types/portfolio";

/**
 * The full archive, printed under the featured case studies.
 *
 * Featured work is argued: each project gets a challenge, a solution and a
 * gallery. This is the opposite — a contact sheet you scan. Each row behaves
 * as an accordion: the frame under the cursor takes the row and plays its
 * images as a carousel, while its neighbours fold down to slivers that stay
 * reachable. Nothing overlaps and nothing reflows, because the widths are
 * redistributed inside the row rather than the card being scaled over it.
 *
 * Below `lg` this all falls away: slivers are useless on a phone, so the rows
 * stack into ordinary full-width cards that advance on tap.
 */

const PAGE_WINDOW = 5;
/** How long each frame holds while a card is open. */
const FRAME_MS = 1500;
/** Cards per accordion row on a wide screen. */
const ROW_SIZE = 3;
/** Space left for the fixed site header when nudging the grid into view. */
const HEADER_CLEARANCE = 96;

const archiveStyles = `
.archive-wash { transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1); }
.archive-slide { transition: opacity 0.55s ease; }
.archive-veil, .archive-title, .archive-extra, .archive-spine {
  transition: opacity 0.45s ease, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes archiveTick { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.archive-tick { transform-origin: left center; animation: archiveTick var(--tick, 1500ms) linear forwards; }

/* Gated on a real pointer and on there being room for slivers. A touchscreen
   fires hover and never releases it, which would strand a row half-open. */
@media (hover: hover) and (pointer: fine) and (min-width: 1024px) {
  .archive-card {
    transition: flex-grow 0.62s cubic-bezier(0.22, 1, 0.36, 1),
                filter 0.45s ease;
  }
  /* The row's widths are redistributed, not overridden: the open card asks
     for seven shares against its neighbours' one, so three cards resolve to
     roughly 78 / 11 / 11 without a single measurement in JS — the open piece
     takes the row and its neighbours fold to reachable slivers.

     Width alone does not enlarge the work: these are 4:5 key visuals, so the
     picture is capped by the row's height, and card width past that point
     becomes mat rather than image. The row height below is the lever that
     actually makes the piece bigger. */
  .archive-card:hover,
  .archive-card:focus-within { flex-grow: 7; }

  /* Folded and at rest the frame is taller than it is wide, which is the
     artwork's own shape, so cover fills it with almost nothing lost. Only the
     open card — a landscape box holding upright work — switches to contain,
     where the whole design has to be visible. */
  .archive-card:hover .archive-art,
  .archive-card:focus-within .archive-art { object-fit: contain; }
  .archive-row:hover .archive-card:not(:hover):not(:focus-within) { filter: brightness(0.62); }

  /* Only the blurred backdrop drifts. Scaling the contained artwork would
     push it past the frame and crop it again. */
  .archive-card:hover .archive-wash,
  .archive-card:focus-within .archive-wash { transform: scale(1.2); }
  .archive-card:hover .archive-veil,
  .archive-card:focus-within .archive-veil { opacity: 1; }

  /* At rest every card shows its title flat. The caption, the controls and
     the frame ticks are the reward for opening one. */
  .archive-extra { opacity: 0; transform: translateY(10px); }
  .archive-card:hover .archive-extra,
  .archive-card:focus-within .archive-extra { opacity: 1; transform: translateY(0); }

  /* The upright title belongs to the folded sliver and nowhere else: on a
     full-width card it would read as a mistake. */
  .archive-spine { opacity: 0; transform: translateY(8px); }
  .archive-row:hover .archive-card:not(:hover):not(:focus-within) .archive-spine,
  .archive-row:focus-within .archive-card:not(:hover):not(:focus-within) .archive-spine {
    opacity: 1;
    transform: translateY(0);
  }
  .archive-row:hover .archive-card:not(:hover):not(:focus-within) .archive-title,
  .archive-row:focus-within .archive-card:not(:hover):not(:focus-within) .archive-title {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .archive-card, .archive-shot, .archive-slide, .archive-veil,
  .archive-open, .archive-spine, .archive-arrows { transition: none; }
  .archive-tick { animation: none; transform: scaleX(1); }
}
`;

/** Page numbers around the current page, with gaps marked as null. */
function pageList(current: number, total: number): (number | null)[] {
  if (total <= PAGE_WINDOW + 2) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = new Set<number>([1, total, current]);
  for (let offset = 1; offset <= Math.floor(PAGE_WINDOW / 2); offset += 1) {
    if (current - offset > 1) pages.add(current - offset);
    if (current + offset < total) pages.add(current + offset);
  }
  const ordered = Array.from(pages).sort((a, b) => a - b);
  const output: (number | null)[] = [];
  ordered.forEach((page, index) => {
    if (index > 0 && page - ordered[index - 1] > 1) output.push(null);
    output.push(page);
  });
  return output;
}

function chunk<T>(list: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
}

function ArchiveCard({ item, index }: { item: ArchiveItem; index: number }) {
  const [frame, setFrame] = useState(0);
  const [open, setOpen] = useState(false);
  const images = item.images.length ? item.images : ["/work/rise-1.jpg"];
  const multiple = images.length > 1;

  // Opening a card plays its set. Asking for a click per frame means most of
  // the work is never seen, so the cursor does the work and the arrows take
  // over for anyone who wants to drive.
  useEffect(() => {
    if (!open || !multiple) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setFrame((previous) => (previous + 1) % images.length);
    }, FRAME_MS);
    return () => window.clearInterval(timer);
  }, [open, multiple, images.length]);

  const step = (direction: 1 | -1) => {
    sound.playWaterDrop();
    setFrame((previous) => (previous + direction + images.length) % images.length);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index, 5) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => {
        sound.playHover();
        setOpen(true);
      }}
      onMouseLeave={() => {
        setOpen(false);
        setFrame(0);
      }}
      className="archive-card group relative w-full lg:h-full lg:min-w-0 lg:flex-1 lg:basis-0"
    >
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-[#111] lg:aspect-auto lg:h-full ${
          multiple ? "lg:cursor-pointer" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => multiple && step(1)}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            setFrame(0);
          }}
          aria-label={
            multiple
              ? `${item.title} — frame ${frame + 1} of ${images.length}. Click for the next.`
              : item.title
          }
          className="absolute inset-0 block w-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--brand,#c4a574)]"
        >
          {/* Every frame is mounted and cross-faded. Swapping one src flashes
              white while the next file decodes; only the first loads eagerly.

              Each frame is drawn twice. The card is a wide box and the work is
              usually upright, so object-cover would have to cut the top and
              bottom off the design — the whole point of the archive. Instead
              the artwork is contained, whole, over a blurred enlargement of
              itself, which fills the frame in the piece's own colours rather
              than letterboxing it onto flat black. */}
          {images.map((src, slide) => (
            <span
              key={`${src}-${slide}`}
              className={`archive-slide absolute inset-0 ${
                slide === frame ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={slide !== frame}
            >
              <img
                src={src}
                alt=""
                aria-hidden
                loading={slide === 0 ? undefined : "lazy"}
                className="archive-wash absolute inset-0 h-full w-full scale-110 object-cover opacity-90 blur-xl"
              />
              <img
                src={src}
                alt={slide === 0 ? item.title : ""}
                loading={slide === 0 ? undefined : "lazy"}
                className="archive-art absolute inset-0 h-full w-full object-cover"
              />
            </span>
          ))}

          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
          <span className="archive-veil pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0" />
        </button>

        {item.category && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 max-w-[calc(100%-1.5rem)] truncate rounded-full border border-white/15 bg-black/65 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
            {item.category}
          </span>
        )}

        {multiple && (
          <span className="pointer-events-none absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
            <Layers className="h-3 w-3" />
            {frame + 1} / {images.length}
          </span>
        )}

        {/* Folded state: the title stands upright on the sliver, the way a
            spine reads on a shelf. Wide screens only — below lg the card is
            never folded. */}
        <span className="archive-spine pointer-events-none absolute bottom-4 left-0 right-0 z-10 hidden justify-center lg:flex">
          <span
            className="max-h-[14rem] truncate font-display text-[13px] font-bold tracking-tight text-white/90"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            {item.title}
          </span>
        </span>

        {/* Open state: the full caption, and the carousel controls with it. */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-4 text-left">
          <span className="archive-title flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate font-display text-lg font-bold tracking-tight text-white">
              {item.title}
            </span>
            {item.titleAr && (
              <span dir="rtl" className="shrink-0 text-sm text-neutral-300">
                {item.titleAr}
              </span>
            )}
          </span>

          <span className="archive-extra block">
            {item.description && (
              <span className="mt-1.5 line-clamp-2 block max-w-xl text-[12.5px] font-light leading-5 text-neutral-300">
                {item.description}
              </span>
            )}

            {multiple && (
              <>
                <span className="pointer-events-auto mt-3 flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous frame"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(-1);
                  }}
                  className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/85"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Next frame"
                  onClick={(event) => {
                    event.stopPropagation();
                    step(1);
                  }}
                  className="grid h-7 w-7 place-items-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/85"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </span>

              {/* One segment per frame; the live one fills over its dwell
                  time, so the card shows how far through the set it is. */}
              <span className="mt-3 flex gap-1">
                {images.map((src, slide) => (
                  <span
                    key={`tick-${src}-${slide}`}
                    className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
                  >
                    {slide === frame && open && (
                      <span
                        key={frame}
                        className="archive-tick absolute inset-0 rounded-full bg-white"
                        style={{ ["--tick" as string]: `${FRAME_MS}ms` }}
                      />
                    )}
                    {slide === frame && !open && (
                      <span className="absolute inset-0 rounded-full bg-white" />
                    )}
                    {slide < frame && <span className="absolute inset-0 rounded-full bg-white/70" />}
                  </span>
                ))}
                </span>
              </>
            )}
          </span>
        </span>
      </div>
    </motion.article>
  );
}

export function ProjectArchive() {
  const { content } = useSite();
  const archive = content.archive;
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(archive.items.map((item) => item.category).filter(Boolean)))],
    [archive.items],
  );

  const filtered = useMemo(
    () =>
      category === "All"
        ? archive.items
        : archive.items.filter((item) => item.category === category),
    [archive.items, category],
  );

  const perPage = Math.max(1, archive.perPage);
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage));
  // Clamped while rendering rather than corrected in an effect, so deleting a
  // project or switching filter can never leave the grid on an empty page.
  const current = Math.min(page, pageCount);
  const start = (current - 1) * perPage;
  const visible = filtered.slice(start, start + perPage);
  const rows = chunk(visible, ROW_SIZE);

  const goToPage = (next: number) => {
    const target = Math.min(Math.max(next, 1), pageCount);
    if (target === current) return;
    sound.playWaterDrop();
    setPage(target);

    // Pinning the section to the top of the viewport pushed the pager itself
    // below the fold, so a second click meant scrolling back down for it.
    // Only pull the grid into view when its first row is actually cut off
    // above; otherwise leave the scroll alone and the pager stays put.
    const grid = document.getElementById("archive-grid");
    if (!grid) return;
    const top = grid.getBoundingClientRect().top;
    if (top < HEADER_CLEARANCE) {
      window.scrollTo({ top: window.scrollY + top - HEADER_CLEARANCE, behavior: "smooth" });
    }
  };

  if (!archive.items.length) return null;

  return (
    <section
      id="archive"
      className="relative w-full scroll-mt-20 border-b border-white/10 bg-[#050505]/55 px-4 py-12 sm:px-8 sm:py-16"
    >
      <style>{archiveStyles}</style>

      <div
        className="pointer-events-none absolute left-10 top-1/4 h-96 w-96 rounded-full blur-[140px]"
        style={{ backgroundColor: "color-mix(in srgb, var(--brand, #c4a574) 7%, transparent)" }}
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8">
        {/* Section header */}
        <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-4 md:flex-row md:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--brand, #c4a574)" }}
              />
              <span style={{ color: "var(--brand, #c4a574)" }}>{archive.kicker}</span>
            </div>
            <h2 className="font-display text-3xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-5xl md:text-6xl">
              {archive.titleA}{" "}
              <span style={{ color: "var(--brand, #c4a574)" }}>{archive.titleB}</span>
            </h2>
          </div>

          <div className="max-w-md">
            <p className="text-xs font-light leading-relaxed text-neutral-400 sm:text-sm">
              {archive.intro}
            </p>
            <p className="mt-2 hidden font-mono text-[10px] uppercase tracking-[0.16em] text-neutral-600 lg:block">
              Hover a frame to open it
            </p>
          </div>
        </div>

        {/* Category filter */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((entry) => {
              const active = category === entry;
              return (
                <button
                  key={entry}
                  type="button"
                  onMouseEnter={() => sound.playHover()}
                  onClick={() => {
                    sound.playWaterDrop();
                    setCategory(entry);
                    setPage(1);
                  }}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-300 ${
                    active
                      ? "border border-white bg-white font-bold text-black"
                      : "border border-white/10 bg-[#111111] text-neutral-400 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {entry}
                </button>
              );
            })}
          </div>
        )}

        {/* Accordion rows */}
        <div id="archive-grid" key={`${category}-${current}`} className="flex flex-col gap-4 lg:gap-5">
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              /* Tall on purpose: the work is 4:5, so the row's height is what
                 sets how large a piece can be drawn. Capped at lg so a row
                 still fits a 768px laptop, and opened up at xl. */
              className="archive-row flex flex-col gap-4 lg:h-[40rem] lg:flex-row lg:gap-3 xl:h-[52rem]"
            >
              {row.map((item, i) => (
                <ArchiveCard key={item.id} item={item} index={rowIndex * ROW_SIZE + i} />
              ))}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <nav
            aria-label="Archive pages"
            className="mt-2 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-neutral-500">
              Showing {start + 1}–{Math.min(start + perPage, filtered.length)} of {filtered.length}
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => goToPage(current - 1)}
                disabled={current === 1}
                aria-label="Previous page"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-neutral-300 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {pageList(current, pageCount).map((entry, index) =>
                entry === null ? (
                  <span
                    key={`gap-${index}`}
                    className="px-1 font-mono text-xs text-neutral-600"
                    aria-hidden
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => goToPage(entry)}
                    aria-current={entry === current ? "page" : undefined}
                    className={`h-9 min-w-9 rounded-full px-3 font-mono text-xs transition-colors ${
                      entry === current
                        ? "font-bold text-black"
                        : "border border-white/15 text-neutral-300 hover:border-white/40 hover:text-white"
                    }`}
                    style={
                      entry === current ? { backgroundColor: "var(--brand, #c4a574)" } : undefined
                    }
                  >
                    {String(entry).padStart(2, "0")}
                  </button>
                ),
              )}

              <button
                type="button"
                onClick={() => goToPage(current + 1)}
                disabled={current === pageCount}
                aria-label="Next page"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-neutral-300 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:border-white/15"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </section>
  );
}
