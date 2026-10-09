import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "case-studies");

// Display order on the index page.
export const caseStudySlugs = [
  "merchant-dashboard-agent",
  "multi-tenant-access-control-for-saas",
  "fuxx-sepa-payment-integration",
  "customer-communications-email",
  "customer-communications-letters",
] as const;

export type CaseStudyDoc = {
  slug: string;
  title: string;
  description: string;
  role?: string;
  timeline?: string;
  stack?: string;
  html: string;
};

const field = (md: string, name: string) => md.match(new RegExp(`^- \\*\\*${name}:\\*\\* (.+)$`, "m"))?.[1].trim();

// Strips the parts the page renders itself (back link, H1, byline), then renders the rest.
function render(md: string): string {
  const body = md
    .replace(/^\[← All case studies\]\(\.\.\/\)\s*$/m, "")
    .replace(/^# .+$/m, "")
    .replace(/^\*Case study by .+\*\s*$/m, "");
  return (marked.parse(body, { async: false }) as string)
    .replaceAll("<table>", '<div class="tw"><table>')
    .replaceAll("</table>", "</table></div>")
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}

export function getCaseStudy(slug: string): CaseStudyDoc {
  const { data, content } = matter(fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8"));
  return {
    slug,
    title: String(data.title),
    description: String(data.description ?? ""),
    role: field(content, "Role"),
    timeline: field(content, "Timeline"),
    stack: field(content, "Stack"),
    html: render(content),
  };
}

export const getCaseStudies = () => caseStudySlugs.map(getCaseStudy);
