"use client";

import React from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className = "" }) => {
  return <span className={className}>{text}</span>;
};
