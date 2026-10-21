export function MeralLogo({
  className = "",
  markClassName = "h-8 w-8",
  wordClassName = "text-xl",
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-white ${className}`}>
      <svg viewBox="0 0 36 36" className={markClassName} aria-hidden="true">
        <rect x="1.2" y="1.2" width="33.6" height="33.6" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9 26.5V10.5L18 19.2L27 10.5V26.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
      <span className={`font-display font-extrabold tracking-[0.18em] leading-none ${wordClassName}`}>
        MERAL
      </span>
    </span>
  );
}
