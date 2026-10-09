import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { enquiryMailto, profile } from "@/data/profile";

// Shared nav, call to action and footer for the case-study pages.
export default function CaseStudyChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <nav className="nav">
        <div className="wrap">
          <Link href="/" className="logo">
            <i>M</i>
            {profile.name}
          </Link>
          <div className="links">
            <Link href="/#work">Work</Link>
            <Link href="/case-studies/">Case studies</Link>
            <Link href="/#services">Services</Link>
          </div>
          <div className="nav-right">
            <ThemeToggle />
            <Link href="/#contact" className="btn btn-p nav-cta">Get in touch</Link>
          </div>
        </div>
      </nav>

      {children}

      <section className="cs-cta">
        <div className="wrap">
          <div className="cs-cta-box">
            <div>
              <span className="avail">Open for new projects</span>
              <h2>Building something similar?</h2>
              <p>
                SaaS platforms, payment integrations and AI features that hold up in production. Tell me what you&apos;re building.
              </p>
            </div>
            <a href={enquiryMailto} className="btn btn-p">
              Get in touch <ArrowRight size={14} strokeWidth={2} />
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <Link href="/">abumusa-portfolio.web.app</Link>
        </div>
      </footer>
    </>
  );
}
