"use client";

import React from "react";

interface LiquidWaveTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span" | "div" | "p";
  waveSpread?: number;
  interactive?: boolean;
}

export const LiquidWaveText: React.FC<LiquidWaveTextProps> = ({ text, className = "" }) => {
  return <span className={className}>{text}</span>;
};
