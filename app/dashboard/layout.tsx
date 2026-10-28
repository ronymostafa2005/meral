import { IBM_Plex_Mono, Manrope, Newsreader } from "next/font/google";

/**
 * Typography for the owner console only.
 *
 * next/font scopes a face to the component that uses it, so loading these here
 * rather than in the root layout keeps the public portfolio's payload exactly
 * as it was — visitors never download the console's faces.
 *
 * The site itself is set in Syne: tall, tight and built to perform. A console
 * is read for an hour at a time, so it asks for the opposite temperament.
 *   Newsreader    — a low-contrast reading serif for headings. Calm and
 *                   editorial, which suits a design studio's back office far
 *                   better than another tight geometric sans.
 *   Manrope       — soft-cornered geometric sans for every control and input.
 *                   Open apertures keep long field labels easy at 12–13px.
 *   IBM Plex Mono — warmer than JetBrains Mono, so the uppercase micro-labels
 *                   read as considered rather than machine-printed.
 */

const consoleSerif = Newsreader({
  variable: "--console-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const consoleSans = Manrope({
  variable: "--console-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const consoleMono = IBM_Plex_Mono({
  variable: "--console-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export default function DashboardLayout(props: LayoutProps<"/dashboard">) {
  return (
    <div className={`${consoleSerif.variable} ${consoleSans.variable} ${consoleMono.variable}`}>
      {props.children}
    </div>
  );
}
