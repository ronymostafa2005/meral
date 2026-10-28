"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { sound } from "../utils/audio";
import type { ArchiveItem } from "../types/portfolio";

/**
 * Full-screen viewer for one archive piece.
 *
 * The grid is a contact sheet: cards share a row, so a piece is always drawn
 * into a box of the layout's choosing. The work here is 4:5, which means that
 * box either crops it or mats it — there is no third option while it shares a
 * row. This is the third option: the piece gets the screen and is scaled to
 * its own proportions, so nothing is cropped and nothing is padded.
 */
export function ArchiveLightbox({
  item,
  startFrame = 0,
  onClose,
}: {
  item: ArchiveItem;
  startFrame?: number;
  onClose: () => void;
}) {
  const images = item.images.length ? item.images : ["/work/rise-1.jpg"];
  const [frame, setFrame] = useState(() => Math.min(startFrame, images.length - 1));
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const step = useCallback(
    (direction: 1 | -1) => {
      if (images.length < 2) return;
      sound.playWaterDrop();
      setFrame((previous) => (previous + direction + images.length) % images.length);
    },
    [images.length],
  );

  // Esc closes, arrows step, Tab stays inside the dialog. Without the trap,
  // tabbing walks into the page behind the overlay, which a screen reader
  // then reads while the viewer is still covering it.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, step]);

  // The page behind must not scroll under the overlay. The scrollbar's width
  // is replaced as padding so the layout does not jump as it disappears.
  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (gap > 0) body.style.paddingRight = `${gap}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, []);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const multiple = images.length > 1;

  /* Rendered into <body>, not in place. The archive lives inside
     <main class="relative z-[1]">, and a positioned ancestor with a z-index
     opens a stacking context — so a `fixed z-[70]` child is still confined
     to z-1 against the page, and the site header at z-40 paints over it.
     The portal takes the overlay out of that context entirely. */
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title}${multiple ? ` — frame ${frame + 1} of ${images.length}` : ""}`}
      className="fixed inset-0 z-[70] flex flex-col bg-black/92 backdrop-blur-xl"
      onClick={onClose}
    >
      <div ref={panelRef} className="flex h-full flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-6 px-4 pt-4 sm:px-8 sm:pt-6">
          <div className="min-w-0">
            {item.category && (
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: "var(--brand, #c4a574)" }}
              >
                {item.category}
              </span>
            )}
            <h2 className="mt-1 truncate font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
              {item.title}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            {multiple && (
              <span className="hidden font-mono text-[11px] tabular-nums text-neutral-400 sm:inline">
                {String(frame + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close viewer"
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-white/20 text-neutral-200 outline-none transition-colors hover:border-white/50 hover:text-white focus-visible:ring-2 focus-visible:ring-[var(--brand,#c4a574)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* The piece, scaled to fit at its own proportions. */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-4 sm:px-16">
          {multiple && (
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous frame"
              className="absolute left-2 z-10 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/50 text-white outline-none backdrop-blur transition-colors hover:border-white/50 hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-[var(--brand,#c4a574)] sm:left-5"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}

          <motion.img
            key={images[frame]}
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            src={images[frame]}
            alt={`${item.title}${multiple ? ` — frame ${frame + 1}` : ""}`}
            className="max-h-full max-w-full object-contain shadow-[0_30px_90px_-20px_rgba(0,0,0,0.9)]"
          />

          {multiple && (
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next frame"
              className="absolute right-2 z-10 grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/20 bg-black/50 text-white outline-none backdrop-blur transition-colors hover:border-white/50 hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-[var(--brand,#c4a574)] sm:right-5"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Caption */}
        <div className="shrink-0 px-4 pb-5 sm:px-8 sm:pb-7">
          <div className="mx-auto flex max-w-3xl flex-col gap-2">
            {(item.description || item.titleAr) && (
              <div className="flex items-baseline justify-between gap-6">
                {item.description ? (
                  <p className="min-w-0 text-[13px] font-light leading-6 text-neutral-300">
                    {item.description}
                  </p>
                ) : (
                  <span />
                )}
                {item.titleAr && (
                  <span dir="rtl" className="shrink-0 text-sm text-neutral-400">
                    {item.titleAr}
                  </span>
                )}
              </div>
            )}

            {multiple && (
              <div className="flex items-center gap-1.5 pt-1">
                {images.map((src, slide) => (
                  <button
                    key={`${src}-${slide}`}
                    type="button"
                    onClick={() => setFrame(slide)}
                    aria-label={`Show frame ${slide + 1}`}
                    aria-current={slide === frame}
                    className="group h-1.5 flex-1 cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand,#c4a574)]"
                  >
                    <span
                      className="block h-full w-full rounded-full transition-colors"
                      style={{
                        backgroundColor:
                          slide === frame
                            ? "var(--brand, #c4a574)"
                            : "rgba(255,255,255,0.22)",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
}
