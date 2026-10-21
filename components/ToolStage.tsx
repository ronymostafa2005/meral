"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

const TOOLS = [
  { name: "Photoshop", mark: "Ps", from: "#0B1C2C", to: "#31A8FF" },
  { name: "Illustrator", mark: "Ai", from: "#2A1400", to: "#FF9A00" },
  { name: "InDesign", mark: "Id", from: "#2C0614", to: "#FF3366" },
  { name: "After Effects", mark: "Ae", from: "#12082A", to: "#9B8CFF" },
  { name: "Lightroom", mark: "Lr", from: "#071820", to: "#4CC2FF" },
  { name: "Figma", mark: "Fg", from: "#1A1024", to: "#A259FF" },
];

export function ToolStage() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end start"],
  });
  const spin = useSpring(useTransform(scrollYProgress, [0, 1], [-18, 250]), {
    stiffness: 42,
    damping: 22,
    mass: 0.7,
  });
  const tilt = useTransform(scrollYProgress, [0, 1], [12, -8]);

  return (
    <div ref={ref} className="relative mx-auto h-[200px] w-full max-w-3xl sm:h-[250px] lg:h-[280px]">
      <div className="pointer-events-none absolute inset-x-16 top-8 h-40 rounded-full bg-white/5 blur-3xl" />
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          style={{ rotateY: spin, rotateX: tilt, transformStyle: "preserve-3d" }}
          className="relative h-36 w-36 origin-center scale-[0.62] sm:scale-90 lg:scale-100"
        >
          {TOOLS.map((tool, index) => {
            const angle = (360 / TOOLS.length) * index;
            return (
              <div
                key={tool.name}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(150px)`,
                  transformStyle: "preserve-3d",
                }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4.6 + index * 0.25,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-32 w-24 flex-col items-center justify-between rounded-2xl border border-white/25 px-2 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                  style={{
                    background: `linear-gradient(165deg, ${tool.to} 0%, ${tool.from} 78%)`,
                  }}
                >
                  <span className="font-display text-4xl font-bold leading-none text-white">
                    {tool.mark}
                  </span>
                  <span className="text-center text-[9px] font-mono uppercase tracking-[0.16em] text-white/85">
                    {tool.name}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>
      <p className="absolute bottom-2 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-neutral-500">
        Design tools in motion
      </p>
    </div>
  );
}
