import type { Metadata } from "next";
import CaseStudyChrome from "@/components/CaseStudyChrome";
import { getCaseStudies } from "@/lib/caseStudies";

export const metadata: Metadata = {
  title: "Case studies — Md. Abu Musa",
  description: "In-depth case studies on AI agents, multi-tenant SaaS, payment integrations and customer communications.",
};

export default function CaseStudiesIndex() {
  const studies = getCaseStudies();
  return (
    <CaseStudyChrome>
      <main className="cs">
        <div className="wrap">
          <div className="eye">Case studies</div>
          <h1>Case studies</h1>
          <p className="cs-intro">The problem, the architecture, the decisions and what I learned, for each project.</p>
          <div className="cs-list">
            {studies.map((cs) => (
              <a key={cs.slug} href={`/case-studies/${cs.slug}/`} className="cs-item">
                <h2>{cs.title}</h2>
                <p>{cs.description}</p>
                <dl>
                  {cs.role && (<><dt>Role</dt><dd>{cs.role}</dd></>)}
                  {cs.timeline && (<><dt>Timeframe</dt><dd>{cs.timeline}</dd></>)}
                  {cs.stack && (<><dt>Stack</dt><dd>{cs.stack}</dd></>)}
                </dl>
                <span className="read">Read the case study →</span>
              </a>
            ))}
          </div>
        </div>
      </main>
    </CaseStudyChrome>
  );
}
