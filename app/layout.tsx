import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://abumusa-portfolio.web.app"),
  title: "Md. Abu Musa — Full-Stack Software Engineer",
  description:
    "Full-stack engineer building multi-tenant SaaS platforms, payment integrations and AI agents. 6+ years, 20+ apps shipped.",
  openGraph: {
    title: "Md. Abu Musa — Full-Stack Software Engineer",
    description: "Multi-tenant SaaS, payment integrations and AI agents, from architecture to production.",
    type: "website",
    images: ["/images/musa.jpeg"],
  },
};

// Applies a saved theme before paint, so a light-mode visitor never sees a dark flash.
const themeScript = `try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
