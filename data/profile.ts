export const profile = {
  name: "Md. Abu Musa",
  title: "Full-Stack Software Engineer",
  location: "Khulna, Bangladesh · Remote",
  email: "amsohag007@gmail.com",
  linkedin: "https://www.linkedin.com/in/abumusa007",
  github: "https://github.com/amsohag007",
  photo: "/images/abu-musa-profile.jpg",
  // Public Upwork profile URL; leave empty to show the Upwork card without a link.
  upwork: "https://www.upwork.com/freelancers/~014c9e96d68971f40c",
};

export const upworkStats = [
  { value: "$30K+", label: "earned" },
  { value: "100%", label: "Job Success" },
];

export const enquiryMailto = `mailto:${profile.email}?subject=Project%20enquiry`;

export const stats = [
  { value: "6+ years", label: "building for the web" },
  { value: "20+ apps", label: "shipped to production" },
  { value: "5 case studies", label: "written in depth" },
];

export const marquee = [
  "Rocketlink Technologies",
  "EA-TECH",
  "FixBil",
  "Inoqare",
  "FoodJocky",
  "NETMARK",
  "Russgo",
  "SOFTIC",
  "Andit",
  "AndShop",
];

const CS = "/case-studies";
export const caseStudiesIndex = `${CS}/`;

export type Cover =
  | { kind: "image"; src: string }
  | { kind: "gen"; big: string; code: [string, string] };

export type CaseStudy = {
  tag: string;
  color: string;
  title: string;
  summary: string;
  stack: string[];
  href: string;
  cta: string;
  cover: Cover;
};

// In `code` lines, **word** renders in the card colour.
export const caseStudies: CaseStudy[] = [
  {
    tag: "AI agents",
    color: "#8A7BFF",
    title: "Merchant Dashboard Agent",
    summary:
      "An embedded AI assistant that turns plain-language questions into live dashboard views, with Skills, cost limits and tenant isolation.",
    stack: ["Python", "Django", "Anthropic Claude", "SSE", "Playwright"],
    href: `${CS}/merchant-dashboard-agent/`,
    cta: "Read the case study",
    cover: { kind: "image", src: "/images/covers/merchant-agent-cover.jpg" },
  },
  {
    tag: "Multi-tenant SaaS",
    color: "#34D39A",
    title: "Multi-Tenant Access Control for SaaS",
    summary:
      "Custom roles and section-wise permissions per tenant, a cross-tenant support role and privilege-escalation guardrails.",
    stack: ["Django", "django-tenants", "PostgreSQL", "Next.js"],
    href: `${CS}/multi-tenant-access-control-for-saas/`,
    cta: "Read the case study",
    cover: {
      kind: "gen",
      big: "Custom roles, per tenant.",
      code: ['**tenant**.role("support").can("view:billing") → **false**', "escalation_guard · cross_tenant_support"],
    },
  },
  {
    tag: "Payments",
    color: "#5BB7FF",
    title: "Fuxx (Liquva) SEPA Payment Integration",
    summary:
      "A SEPA Direct Debit provider by API and CSV batch, with RSA-signed webhooks, polling, reconciliation and a full provider mock.",
    stack: ["Python", "Django", "Celery", "Node.js", "Playwright"],
    href: `${CS}/fuxx-sepa-payment-integration/`,
    cta: "Read the case study",
    cover: {
      kind: "gen",
      big: "SEPA Direct Debit, by API and CSV batch.",
      code: ["webhook · **RSA-signed** → verified", "poll → reconcile → **matched**"],
    },
  },
  {
    tag: "Event-driven systems",
    color: "#F4B740",
    title: "Customer Communications: Email and Letters",
    summary:
      "Event-driven transactional email with legal pre-notifications and GDPR purging, then printed letters through a print-and-mail API.",
    stack: ["Django", "Celery", "Redis", "Jinja2", "Gotenberg", "Pingen"],
    href: `${CS}/customer-communications-email/`,
    cta: "Read parts 1 and 2",
    cover: {
      kind: "gen",
      big: "Email first, then printed letters.",
      code: ["event → **email** · pre-notification", "event → **letter** · print-and-mail API"],
    },
  },
];

export type Project = {
  name: string;
  tag: string;
  url?: string;
  domain: string;
  description: string;
  image?: string;
};

export const projects: Project[] = [
  {
    name: "FixBil",
    tag: "Automotive",
    url: "https://web.fixbil.no/",
    domain: "web.fixbil.no",
    description: "Car maintenance and servicing platform for the Norwegian market.",
    image: "/images/projects/fixbil.jpg",
  },
  {
    name: "Inoqare",
    tag: "Healthcare",
    url: "https://inoqare.com/",
    domain: "inoqare.com",
    description: "Healthcare service platform.",
    image: "/images/projects/inoqare.jpg",
  },
  {
    name: "FoodJocky",
    tag: "Food delivery",
    url: "https://foodjocky.com/",
    domain: "foodjocky.com",
    description: "Food delivery platform: vouchers, order reporting and pricing rules on a Next.js, GraphQL and MongoDB stack.",
    image: "/images/projects/foodjocky.jpg",
  },
  {
    name: "Russgo",
    tag: "Digital cards",
    domain: "Russgo",
    description: "Digital card service.",
    image: "/images/projects/russgo.jpg",
  },
  {
    name: "AndShop",
    tag: "E-commerce",
    url: "https://themeforest.net/item/andshop-ecommerce-react-js-template/33822003",
    domain: "themeforest.net",
    description: "React e-commerce template with an admin dashboard, sold on ThemeForest.",
    image: "/images/projects/andshop.jpg",
  },
];

export const tagColors: Record<string, string> = {
  Automotive: "#5BB7FF",
  Healthcare: "#34D39A",
  "Food delivery": "#F4B740",
  "Digital cards": "#E879F9",
  "E-commerce": "#FF8A65",
};
const tagPalette = ["#8A7BFF", "#2DD4BF", "#FB7185", "#60A5FA", "#FBBF24"];

export function tagColor(tag: string): string {
  if (tagColors[tag]) return tagColors[tag];
  const extra = [...new Set(projects.map((p) => p.tag))].filter((t) => !tagColors[t]);
  return tagPalette[Math.max(0, extra.indexOf(tag)) % tagPalette.length];
}

export type ServiceIcon = "lightbulb" | "code" | "card" | "sparkles" | "users";

export const services: { no: string; title: string; text: string; color: string; icon: ServiceIcon; wide?: boolean; flow?: string[] }[] = [
  {
    no: "01",
    title: "Discovery and architecture",
    text: "I turn ideas and ambiguous requirements into a technical plan, estimates and a clear implementation path.",
    color: "#5BB7FF",
    icon: "lightbulb",
    wide: true,
    flow: ["Idea", "Plan", "Estimate", "Build"],
  },
  {
    no: "02",
    title: "Full-stack delivery",
    text: "I build SaaS features, dashboards, APIs and integrations end to end, with tests, through to production.",
    color: "#8A7BFF",
    icon: "code",
  },
  {
    no: "03",
    title: "Payments and integrations",
    text: "Payment providers, signed webhooks, reconciliation and third-party APIs, including the failure cases.",
    color: "#34D39A",
    icon: "card",
  },
  {
    no: "04",
    title: "AI features",
    text: "Agents with tool use, streaming interfaces, evaluation, and cost and rate controls.",
    color: "#E879F9",
    icon: "sparkles",
  },
  {
    no: "05",
    title: "Senior engineering support",
    text: "I join an existing team and codebase when you need senior capacity without a permanent hire.",
    color: "#F4B740",
    icon: "users",
  },
];

export type SkillIcon = "server" | "frontend" | "sparkles" | "card" | "database" | "cloud";

export const skills: { group: string; color: string; icon: SkillIcon; items: string[] }[] = [
  { group: "Back end", color: "#5BB7FF", icon: "server", items: ["Node.js", "NestJS", "Express", "Fastify", "Python", "Django", "REST", "GraphQL", "Celery"] },
  { group: "Front end", color: "#8A7BFF", icon: "frontend", items: ["React", "Next.js", "TypeScript", "JavaScript", "Redux", "Tailwind CSS"] },
  { group: "AI and agents", color: "#E879F9", icon: "sparkles", items: ["Anthropic Claude", "Tool-use agent loops", "Streaming (SSE)", "Eval harnesses", "Cost and rate limits"] },
  { group: "Payments and fintech", color: "#34D39A", icon: "card", items: ["SEPA Direct Debit", "Payment gateway integration", "Signed webhooks", "Reconciliation", "Third-party APIs"] },
  { group: "Data", color: "#F4B740", icon: "database", items: ["PostgreSQL", "MySQL", "MongoDB", "Prisma", "Redis", "Multi-tenant schemas"] },
  { group: "Cloud, DevOps and testing", color: "#FF8A65", icon: "cloud", items: ["AWS", "Vercel", "DigitalOcean", "Docker", "Jenkins", "CI/CD", "Serverless", "Playwright", "pytest"] },
];

export const experience: { role: string; org: string; when: string; points: string[]; now?: boolean }[] = [
  {
    role: "Software Developer",
    org: "Rocketlink Technologies",
    when: "Jun 2024 – Present",
    now: true,
    points: [
      "Core engineer on a multi-tenant payments SaaS used by merchants across Europe, owning features end to end from database design to the merchant-facing UI.",
      "Built payment-gateway adapters for SEPA Direct Debit and card processors: submission, webhooks, settlement reconciliation and chargebacks.",
      "Designed background import pipelines for large settlement, chargeback and lead CSVs, safe to resume after a crash.",
      "Shipped configurable roles and permissions, an AI assistant with per-tenant usage limits and cost tracking, and email and physical-letter autoresponders.",
    ],
  },
  {
    role: "Full Stack Engineer",
    org: "EA-TECH",
    when: "Dec 2023 – Oct 2025",
    points: [
      "Delivered client products end to end, from architecture and APIs to landing pages and cloud deployment.",
      "Built backends and REST/GraphQL APIs with Node.js, NestJS, Fastify and Express; web apps in React and Next.js optimised for speed, SEO and conversion.",
      "Set up serverless deployments on AWS and Vercel with CI/CD, working directly with founders and marketing teams.",
    ],
  },
  {
    role: "Freelance Full Stack Engineer",
    org: "Upwork",
    when: "Jan 2020 – Jun 2025",
    points: [
      "Took startup and small-business ideas from scope to production: web apps, dashboards and APIs across e-commerce, hospitality, healthcare and automotive.",
      "Integrated payment gateways and third-party APIs, and set up serverless deployments and CI/CD so clients could ship without a DevOps hire.",
    ],
  },
  {
    role: "Software Engineer",
    org: "NETMARK",
    when: "Nov 2022 – Nov 2023",
    points: [
      "Car-service booking platform for a Norwegian product company: booking flow, three handover options (drop-off, pickup, roadside trailer), real-time customer–technician chat and invoicing.",
      "Digital NFC business card: card designer, profile editor and the public profile page that opens on tap.",
    ],
  },
  {
    role: "Software Engineer",
    org: "SOFTIC",
    when: "Jul 2022 – Jan 2023",
    points: [
      "Founding backend engineer on a live sports portal: set up the NestJS codebase, designed the database and built real-time score updates and push notifications, with RabbitMQ for match-day traffic spikes.",
    ],
  },
  {
    role: "Full Stack Engineer",
    org: "Andit",
    when: "Jun 2021 – Aug 2022",
    points: [
      "Grew from shipping features to owning the whole food-delivery platform: restaurant dashboard, customer ordering app and rider flow on one GraphQL API.",
      "Shipped vouchers, configurable pricing rules and order reporting; also built supermarket management software.",
    ],
  },
];

export const industries = [
  "Fintech and payments",
  "multi-tenant SaaS",
  "CRM",
  "AI and agents",
  "e-commerce",
  "automotive services",
  "healthcare and charity",
  "marketing tools",
];

export const education = [
  { short: "MSc", degree: "MSc Eng, Information and Communication Technology", school: "Khulna University of Engineering and Technology, 2020–2021" },
  { short: "BSc", degree: "BSc, Computer Science and Engineering", school: "North Western University, Khulna, 2015–2019" },
];
