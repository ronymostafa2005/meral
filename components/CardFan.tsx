"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export type FanCardData = {
  id: string;
  title: string;
  image?: string;
  mark?: string;
  from?: string;
  to?: string;
  icon?: string;
};

function slotsFor(count: number) {
  const mid = (count - 1) / 2;
  const spread = count > 5 ? 12 : 15;
  return Array.from({ length: count }, (_, index) => {
    const offset = index - mid;
    const distance = Math.abs(offset);
    return {
      x: offset * spread,
      y: distance * 4,
      rotate: offset * 2.2,
      rotateY: offset * -6,
      scale: 1 - distance * 0.045,
      z: count - Math.round(distance),
    };
  });
}

export function CardFan({
  cards,
  glowClassName = "bg-white/10",
  onSelect,
}: {
  cards: FanCardData[];
  glowClassName?: string;
  onSelect?: (card: FanCardData) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [settled, setSettled] = useState(false);
  const shown = cards.slice(0, 7);
  const slots = slotsFor(shown.length);

  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative mx-auto aspect-[1000/520] w-full max-w-[1000px]">
      <div className="pointer-events-none absolute left-[12%] top-[28%] h-28 w-28 rounded-full bg-[#31A8FF]/30 blur-3xl" />
      <div className="pointer-events-none absolute right-[14%] top-[22%] h-32 w-32 rounded-full bg-[#FF3366]/25 blur-3xl" />
      <div className={`pointer-events-none absolute left-1/2 top-[36%] h-24 w-40 -translate-x-1/2 rounded-full blur-3xl ${glowClassName}`} />
      <div className="pointer-events-none absolute bottom-[6%] left-1/2 h-[8%] w-[46%] -translate-x-1/2 rounded-full bg-black/70 blur-2xl" />

      {shown.map((card, index) => {
        const slot = slots[index] ?? slots[Math.floor(slots.length / 2)];
        const active = hovered === index;
        const Tag = onSelect ? motion.button : motion.div;

        return (
          <Tag
            key={card.id}
            type={onSelect ? "button" : undefined}
            aria-label={card.title}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
            onClick={() => onSelect?.(card)}
            initial={{ opacity: 0, x: "-50%", y: 24, rotate: 0, rotateY: 0, scale: 0.86 }}
            animate={{
              opacity: 1,
              x: "-50%",
              y: active ? slot.y - 12 : slot.y,
              rotate: active ? 0 : slot.rotate,
              rotateY: active ? 0 : slot.rotateY,
              scale: active ? slot.scale * 1.05 : slot.scale,
            }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 24,
              delay: settled ? 0 : index * 0.05,
            }}
            style={{
              left: `${50 + slot.x}%`,
              zIndex: active ? 30 : slot.z,
              transformOrigin: "50% 100%",
              transformPerspective: 1100,
            }}
            className="group absolute bottom-[10%] h-[38%] w-[17%] cursor-pointer overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <span className="absolute inset-0 overflow-hidden rounded-[12%] border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_18px_34px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              <span
                className="pointer-events-none absolute -top-[20%] left-1/2 h-[70%] w-[90%] -translate-x-1/2 rounded-full opacity-70 blur-2xl"
                style={{ background: card.to ?? "#ffffff" }}
              />
              {card.image ? (
                <img
                  src={card.image}
                  alt=""
                  className="relative h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <span
                  className="relative flex h-full w-full items-end justify-center bg-white/[0.07] px-[8%] pb-[14%]"
                  style={{
                    background: `linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 38%, rgba(255,255,255,0.03) 100%), radial-gradient(120% 70% at 50% 0%, ${card.to ?? "#fff"}66, transparent 62%)`,
                  }}
                >
                  <span className="w-[90%] text-center font-display text-[clamp(0.42rem,0.9vw,0.68rem)] font-semibold leading-tight text-white">
                    {card.title.includes(" ") ? (
                      <>
                        {card.title.split(" ")[0]}
                        <br />
                        {card.title.split(" ").slice(1).join(" ")}
                      </>
                    ) : (
                      card.title
                    )}
                  </span>
                </span>
              )}
            </span>
            {card.icon && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 z-10 aspect-square w-[70%]"
                initial={{ x: "-50%", y: "-42%" }}
                animate={{ x: "-50%", y: active ? "-56%" : "-42%" }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
              >
                <span className="absolute inset-x-[10%] bottom-[6%] h-[16%] translate-y-[70%] rounded-full bg-black/55 blur-[5px]" />
                <span className="relative block h-full w-full overflow-hidden rounded-[24%] shadow-[0_12px_18px_rgba(0,0,0,0.4)]">
                  <img
                    src={card.icon}
                    alt=""
                    className={`h-full w-full object-cover ${card.id === "fg" ? "scale-[1.85]" : ""}`}
                  />
                </span>
              </motion.span>
            )}
            {card.image && (
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent px-2 pb-[8%] pt-[22%] text-center font-display text-[0.7em] tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:text-sm">
                {card.title}
              </span>
            )}
          </Tag>
        );
      })}
    </div>
  );
}
