import Link from "next/link";
import type { Metadata } from "next";
import CaseStudyChrome from "@/components/CaseStudyChrome";
import { caseStudySlugs, getCaseStudy } from "@/lib/caseStudies";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  return {
    title: `${cs.title} — Case study by Md. Abu Musa`,
    description: cs.description,
    openGraph: { title: cs.title, description: cs.description, images: [`/case-studies/${slug}/architecture.png`] },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-studies/[slug]">) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  return (
    <CaseStudyChrome>
      <main className="cs">
        <div className="wrap">
          <Link href="/case-studies/" className="cs-back">← All case studies</Link>
          <div className="eye">Case study</div>
          <h1>{cs.title}</h1>
          <article className="cs-body" dangerouslySetInnerHTML={{ __html: cs.html }} />
        </div>
      </main>
    </CaseStudyChrome>
  );
}
