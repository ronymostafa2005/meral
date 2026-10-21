import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Meral | Graphic Design",
  description:
    "Selected campaign design, art direction, and print by Meral for Lux Realty and Rise Tower Developments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jakarta.variable} ${jetbrains.variable} dark h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full overflow-x-hidden bg-[#050505] text-[#ededed]">
        {children}
      </body>
    </html>
  );
}
