import type { Metadata } from "next";
import { Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({ variable: "--font-inter-tight", subsets: ["latin"], weight: ["400", "500", "600"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://abumusa-portfolio.web.app"),
  title: "Md. Abu Musa — SaaS, Payments & AI Agent Engineer",
  description:
    "Full-stack engineer building multi-tenant SaaS platforms, payment integrations and AI agents. 6+ years, 20+ apps shipped.",
  openGraph: {
    title: "Md. Abu Musa — SaaS, Payments & AI Agent Engineer",
    description: "Multi-tenant SaaS, payment integrations and AI agents, from architecture to production.",
    type: "website",
    images: ["/images/covers/merchant-agent-cover.jpg"],
  },
};

// Sets the theme before paint: the saved choice, else the OS preference (dark by default).
const themeScript = `try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){document.documentElement.setAttribute('data-theme','dark')}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${interTight.variable} ${jetbrainsMono.variable}`} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
