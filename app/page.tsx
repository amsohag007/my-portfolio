import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import {
  caseStudies,
  caseStudiesIndex,
  clientProjects,
  education,
  experience,
  industries,
  profile,
  skills,
  stats,
} from "@/data/profile";

const wrap = "mx-auto w-full max-w-5xl px-5";
const btn =
  "inline-flex h-11 items-center rounded-[10px] border border-line bg-surface px-[18px] text-[15px] font-semibold text-text hover:border-accent";
const btnPrimary =
  "inline-flex h-11 items-center rounded-[10px] border border-accent bg-accent px-[18px] text-[15px] font-semibold text-accent-ink hover:opacity-90";
const card = "rounded-[14px] border border-line bg-surface";

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <>
      <h2 className="mb-2 text-[26px] font-semibold tracking-tight">{title}</h2>
      <p className="mb-7 text-muted">{sub}</p>
    </>
  );
}

export default function Home() {
  return (
    <>
      <nav className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
        <div className={`${wrap} flex h-14 items-center justify-between gap-4`}>
          <a href="#top" className="font-bold">
            {profile.name}
          </a>
          <ul className="hidden gap-5 text-sm text-muted md:flex">
            <li><a className="hover:text-text" href="#work">Work</a></li>
            <li><a className="hover:text-text" href="#projects">Projects</a></li>
            <li><a className="hover:text-text" href="#skills">Skills</a></li>
            <li><a className="hover:text-text" href="#experience">Experience</a></li>
            <li><a className="hover:text-text" href="#contact">Contact</a></li>
          </ul>
          <ThemeToggle />
        </div>
      </nav>

      <header id="top" className={`${wrap} pt-14 pb-10 md:pt-22 md:pb-14`}>
        <div className="flex flex-col-reverse items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-semibold tracking-wide text-hl">
              {profile.title} · {profile.location}
            </p>
            <h1 className="mb-4 text-[34px] leading-[1.1] font-bold tracking-tight md:text-[52px]">
              {profile.headline}
            </h1>
            <p className="mb-7 text-[17px] text-muted md:text-[19px]">{profile.lead}</p>
            <div className="flex flex-wrap gap-3">
              <a className={btnPrimary} href="#work">View case studies</a>
              <a className={btn} href={`mailto:${profile.email}`}>Email me</a>
              <a className={btn} href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className={btn} href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
          <Image
            src={profile.photo}
            alt={profile.name}
            width={176}
            height={176}
            priority
            className="h-28 w-28 shrink-0 rounded-full border-2 border-accent object-cover md:h-44 md:w-44"
          />
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.value} className={`${card} p-4`}>
              <b className="block text-2xl tracking-tight">{s.value}</b>
              <span className="text-sm text-muted">{s.label}</span>
            </div>
          ))}
        </div>
      </header>

      <section id="work" className="border-t border-line py-14">
        <div className={wrap}>
          <SectionHeader title="Featured work" sub="In-depth case studies: the problem, the architecture, the decisions and what I learned." />
          <div className="grid gap-4 md:grid-cols-2">
            {caseStudies.map((c) => (
              <a key={c.title} href={c.href} target="_blank" rel="noopener noreferrer" className={`${card} flex flex-col p-[22px] hover:border-accent`}>
                <span className="text-xs font-semibold tracking-widest text-hl uppercase">{c.tag}</span>
                <h3 className="mt-1.5 mb-2 text-lg font-semibold">{c.title}</h3>
                <p className="mb-3.5 text-[15px] text-muted">{c.summary}</p>
                <span className="mt-auto text-[13px] text-muted">{c.stack}</span>
                <span className="mt-3 text-sm font-semibold text-accent">{c.cta} →</span>
              </a>
            ))}
          </div>
          <p className="mt-4">
            <a className="text-accent hover:underline" href={caseStudiesIndex} target="_blank" rel="noopener noreferrer">
              See all case studies →
            </a>
          </p>
        </div>
      </section>

      <section id="projects" className="border-t border-line py-14">
        <div className={wrap}>
          <SectionHeader title="Client projects" sub="Products I built or worked on for clients and employers." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {clientProjects.map((p) => (
              <a key={p.title} href={p.href} target="_blank" rel="noopener noreferrer" className={`${card} overflow-hidden hover:border-accent`}>
                <div className="relative aspect-[16/10] border-b border-line bg-chip">
                  <Image src={p.image} alt={`${p.title} screenshot`} fill sizes="(min-width: 1024px) 320px, 50vw" className="object-cover object-top" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted">{p.summary}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="skills" className="border-t border-line py-14">
        <div className={wrap}>
          <SectionHeader title="Skills" sub="The tools I use to take a product from idea to production." />
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map((s) => (
              <div key={s.group} className={`${card} p-5`}>
                <h3 className="mb-3 text-[15px] font-semibold">{s.group}</h3>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((i) => (
                    <span key={i} className="rounded-full bg-chip px-3 py-1 text-[13px] text-chip-text">{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="border-t border-line py-14">
        <div className={wrap}>
          <SectionHeader title="Experience" sub="Product companies, agencies and freelance clients across Europe and Asia." />
          <div className="ml-1.5">
            {experience.map((j, idx) => (
              <div key={j.org + j.when} className={`relative border-l-2 border-line pl-7 ${idx === experience.length - 1 ? "" : "pb-7"}`}>
                <span className="absolute top-1.5 -left-[7px] h-3 w-3 rounded-full border-2 border-hl bg-surface" />
                <div className="flex flex-wrap justify-between gap-x-4 gap-y-1">
                  <h3 className="text-[17px] font-semibold">
                    {j.role} <span className="font-medium text-muted">· {j.org}</span>
                  </h3>
                  <span className="text-sm whitespace-nowrap text-muted">{j.when}</span>
                </div>
                {j.points.length > 0 && (
                  <ul className="mt-2 list-disc pl-[18px] text-[15px] text-muted">
                    {j.points.map((p) => (
                      <li key={p} className="my-0.5">{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-14">
        <div className={`${wrap} grid gap-4 md:grid-cols-2`}>
          <div className={`${card} p-5`}>
            <h3 className="mb-2.5 text-[15px] font-semibold">Industries</h3>
            <p className="text-[15px] text-muted">{industries}</p>
          </div>
          <div className={`${card} p-5`}>
            <h3 className="mb-2.5 text-[15px] font-semibold">Education</h3>
            {education.map((e) => (
              <p key={e.degree} className="mb-2 text-[15px] text-muted">
                <b className="font-semibold text-text">{e.degree}</b>
                <br />
                {e.school}, {e.years}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-line py-14">
        <div className={wrap}>
          <div className="rounded-2xl bg-accent-soft p-6 md:p-8">
            <h2 className="mb-2 text-[26px] font-semibold tracking-tight">Let&apos;s build something</h2>
            <p className="mb-5 max-w-xl text-muted">
              Building a SaaS product, a payment integration or an AI feature? I&apos;m happy to talk through the idea and how to get it to production.
            </p>
            <div className="flex flex-wrap gap-3">
              <a className={btnPrimary} href={`mailto:${profile.email}`}>{profile.email}</a>
              <a className={btn} href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className={btn} href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </section>

      <footer className={`${wrap} pt-8 pb-12 text-[13px] text-muted`}>
        © {new Date().getFullYear()} {profile.name} · Built with Next.js, TypeScript and Tailwind CSS
      </footer>
    </>
  );
}
