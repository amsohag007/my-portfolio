export const profile = {
  name: "Md. Abu Musa",
  title: "Full-Stack Software Engineer",
  location: "Khulna, Bangladesh · Remote",
  headline: "I build SaaS platforms, payment integrations and AI agents that hold up in production.",
  lead:
    "6+ years turning product ideas into scalable web applications, end to end: architecture, back end, front end, testing and deployment. Recently: multi-tenant access control, SEPA payment providers, transactional communications and an embedded AI dashboard agent.",
  email: "amsohag007@gmail.com",
  linkedin: "https://www.linkedin.com/in/abumusa007",
  github: "https://github.com/amsohag007",
  photo: "/images/musa.jpeg",
};

export const stats = [
  { value: "6+ years", label: "building for the web" },
  { value: "20+ apps", label: "shipped to production" },
  { value: "5 case studies", label: "written in depth" },
  { value: "MSc in ICT", label: "KUET, Bangladesh" },
];

export const services = [
  {
    title: "Discovery and architecture",
    text: "I turn ideas and ambiguous requirements into a technical plan, estimates and a clear implementation path.",
  },
  {
    title: "Full-stack delivery",
    text: "I build SaaS features, dashboards, APIs and integrations end to end, with tests, through to production.",
  },
  {
    title: "Payments and integrations",
    text: "Payment providers, signed webhooks, reconciliation and third-party APIs, including the failure cases.",
  },
  {
    title: "AI features",
    text: "Agents with tool use, streaming interfaces, evaluation, and cost and rate controls.",
  },
  {
    title: "Senior engineering support",
    text: "I join an existing team and codebase when you need senior capacity without a permanent hire.",
  },
];

const CS = "https://amsohag007.github.io/case-studies";

export const caseStudies = [
  {
    tag: "AI agents",
    title: "Merchant Dashboard Agent",
    summary:
      "An embedded AI assistant that turns plain-language questions into live dashboard views, with Skills, cost limits and tenant isolation.",
    stack: "Python · Django · Anthropic Claude · SSE · Playwright",
    href: `${CS}/merchant-dashboard-agent/`,
    cta: "Read the case study",
  },
  {
    tag: "Multi-tenant SaaS",
    title: "Multi-Tenant Access Control for SaaS",
    summary:
      "Custom roles and section-wise permissions per tenant, a cross-tenant support role and privilege-escalation guardrails.",
    stack: "Django · django-tenants · PostgreSQL · Next.js",
    href: `${CS}/multi-tenant-access-control-for-saas/`,
    cta: "Read the case study",
  },
  {
    tag: "Payments",
    title: "Fuxx (Liquva) SEPA Payment Integration",
    summary:
      "A SEPA Direct Debit provider by API and CSV batch, with RSA-signed webhooks, polling, reconciliation and a full provider mock.",
    stack: "Python · Django · Celery · Node.js · Playwright",
    href: `${CS}/fuxx-sepa-payment-integration/`,
    cta: "Read the case study",
  },
  {
    tag: "Event-driven systems",
    title: "Customer Communications: Email and Letters",
    summary:
      "Event-driven transactional email with legal pre-notifications and GDPR purging, then printed letters through a print-and-mail API.",
    stack: "Django · Celery · Redis · Jinja2 · Gotenberg · Pingen",
    href: `${CS}/customer-communications-email/`,
    cta: "Read parts 1 and 2",
  },
];

export const caseStudiesIndex = `${CS}/`;

export const clientProjects = [
  {
    title: "FixBil",
    summary: "Car maintenance and servicing platform for the Norwegian market.",
    image: "/images/projects/fixbil.png",
    href: "https://web.fixbil.no/",
  },
  {
    title: "Inoqare",
    summary: "Healthcare service platform.",
    image: "/images/projects/inoqare.png",
    href: "https://inoqare.com/",
  },
  {
    title: "FoodJocky",
    summary: "Food delivery platform: vouchers, order reporting and pricing rules on a Next.js, GraphQL and MongoDB stack.",
    image: "/images/projects/foodjocky.png",
    href: "https://foodjocky.com/",
  },
  {
    title: "Russgo",
    summary: "Digital card service.",
    image: "/images/projects/russgo.png",
    href: "https://russgo.staging.netmark.no/",
  },
  {
    title: "AndShop",
    summary: "React e-commerce template with an admin dashboard, sold on ThemeForest.",
    image: "/images/projects/andshop.png",
    href: "https://themeforest.net/item/andshop-ecommerce-react-js-template/33822003",
  },
];

export const skills = [
  { group: "Back end", items: ["Node.js", "NestJS", "Express", "Fastify", "Python", "Django", "REST", "GraphQL", "Celery"] },
  { group: "Front end", items: ["React", "Next.js", "TypeScript", "JavaScript", "Redux", "Tailwind CSS"] },
  { group: "AI and agents", items: ["Anthropic Claude", "Tool-use agent loops", "Streaming (SSE)", "Eval harnesses", "Cost and rate limits"] },
  { group: "Payments and fintech", items: ["SEPA Direct Debit", "Payment gateway integration", "Signed webhooks", "Reconciliation", "Third-party APIs"] },
  { group: "Data", items: ["PostgreSQL", "MySQL", "MongoDB", "Prisma", "Redis", "Multi-tenant schemas"] },
  { group: "Cloud, DevOps and testing", items: ["AWS", "Vercel", "DigitalOcean", "Docker", "Jenkins", "CI/CD", "Serverless", "Playwright", "pytest"] },
];

export const experience = [
  {
    role: "Software Developer",
    org: "Rocketlink Technologies",
    when: "Jun 2024 – Present",
    points: [
      "Build scalable, secure web applications across front end and back end with clean architecture.",
      "Develop REST APIs with authentication and role-based access; integrate third-party APIs and payment gateways.",
      "Manage PostgreSQL and MySQL schemas; deploy on AWS, Vercel and Docker with CI/CD.",
    ],
  },
  {
    role: "Full Stack Engineer",
    org: "EA-TECH",
    when: "Dec 2023 – Oct 2025",
    points: [
      "Built end-to-end web applications with Node.js, NestJS, Fastify, Express, React and Next.js.",
      "Developed high-performance REST and GraphQL APIs and high-converting, SEO-optimised landing pages.",
      "Implemented serverless architectures and CI/CD pipelines on AWS and Vercel.",
    ],
  },
  {
    role: "Freelance Full Stack Engineer",
    org: "Upwork",
    when: "Jan 2021 – Jun 2025",
    points: [
      "Delivered production-ready web apps for startups and businesses with React, Next.js, Node.js and Express.",
      "Worked with MongoDB, MySQL and PostgreSQL, REST and GraphQL, serverless and CI/CD.",
    ],
  },
  { role: "Software Engineer", org: "NETMARK", when: "Nov 2022 – Nov 2023", points: [] },
  { role: "Software Engineer", org: "SOFTIC", when: "Jul 2022 – Jan 2023", points: [] },
  {
    role: "Full Stack Engineer (MERN)",
    org: "Andit",
    when: "Jun 2021 – Aug 2022",
    points: [
      "Maintained the front end and back end of a food delivery platform built with Next.js, GraphQL, Node.js, Express and MongoDB.",
      "Built vouchers, order reporting and pricing rules, and fixed bugs across the stack.",
    ],
  },
  {
    role: "React Developer",
    org: "Appstick",
    when: "Jul 2020 – May 2021",
    points: ["Updated designs and fixed bugs in React apps; built REST APIs with Node.js, Express and MySQL on Docker."],
  },
];

export const industries =
  "Fintech and payments · multi-tenant SaaS · food delivery and restaurants · hotel management · e-commerce · automotive services · healthcare and charity · marketing tools";

export const education = [
  { degree: "MSc Eng, Information and Communication Technology", school: "Khulna University of Engineering and Technology", years: "2020–2021" },
  { degree: "BSc, Computer Science and Engineering", school: "North Western University, Khulna", years: "2015–2019" },
];
