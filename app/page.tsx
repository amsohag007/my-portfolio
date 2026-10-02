import type { CSSProperties, ReactNode } from "react";
import {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Cloud,
  Code,
  CreditCard,
  Database,
  Lightbulb,
  Server,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import GeneratedCover from "@/components/Cover";
import Motion from "@/components/Motion";
import Projects from "@/components/Projects";
import Showcase from "@/components/Showcase";
import ThemeToggle from "@/components/ThemeToggle";
import {
  caseStudies,
  caseStudiesIndex,
  education,
  enquiryMailto,
  experience,
  industries,
  marquee,
  profile,
  services,
  skills,
  stats,
  type ServiceIcon,
  type SkillIcon,
} from "@/data/profile";

const cssVar = (vars: Record<string, string | number>) => vars as CSSProperties;
const rise = (seconds: number) => cssVar({ "--d": `${seconds}s` });

const serviceIcons: Record<ServiceIcon, ReactNode> = {
  lightbulb: <Lightbulb size={20} strokeWidth={1.7} />,
  code: <Code size={20} strokeWidth={1.7} />,
  card: <CreditCard size={20} strokeWidth={1.7} />,
  sparkles: <Sparkles size={20} strokeWidth={1.7} />,
  users: <Users size={20} strokeWidth={1.7} />,
};

const skillIcons: Record<SkillIcon, ReactNode> = {
  server: <Server size={18} strokeWidth={1.7} />,
  frontend: <AppWindow size={18} strokeWidth={1.7} />,
  sparkles: <Sparkles size={18} strokeWidth={1.7} />,
  card: <CreditCard size={18} strokeWidth={1.7} />,
  database: <Database size={18} strokeWidth={1.7} />,
  cloud: <Cloud size={18} strokeWidth={1.7} />,
};

function SectionHead({ eye, title, intro, children }: { eye: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <div className="sh">
      <div>
        <div className="eye">{eye}</div>
        <h2>{title}</h2>
        <p>{intro}</p>
      </div>
      {children}
    </div>
  );
}

function SocialLinks() {
  return (
    <>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
      <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
      <a href={profile.upwork} target="_blank" rel="noopener noreferrer">Upwork ↗</a>
    </>
  );
}

export default function Home() {
  return (
    <>
      <Motion />

      <nav className="nav">
        <div className="wrap">
          <a href="#top" className="logo">
            <i>M</i>
            {profile.name}
          </a>
          <div className="links">
            <a href="#work">Work</a>
            <a href="#services">Services</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
          </div>
          <div className="nav-right">
            <ThemeToggle />
            <a href="#contact" className="btn btn-p nav-cta">Get in touch</a>
          </div>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="wrap">
          <div className="hero-g">
            <div>
              <div className="who rise" style={rise(0)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profile.photo} alt={profile.name} />
                <div>
                  <div className="n">{profile.name}</div>
                  <div className="m">{profile.title} · {profile.location}</div>
                </div>
              </div>
              <h1 className="rise" style={rise(0.08)}>
                I build <em>SaaS platforms, payment integrations and AI agents</em> that hold up in production.
              </h1>
              <p className="lede rise" style={rise(0.16)}>
                6+ years turning product ideas into scalable web applications, end to end: architecture, back end, front end,
                testing and deployment.
              </p>
              <div className="cta rise" style={rise(0.24)}>
                <a href="#work" className="btn btn-p">
                  View case studies <ArrowRight size={14} strokeWidth={2} />
                </a>
                <a href={`mailto:${profile.email}`} className="btn btn-s">Email me</a>
              </div>
              <div className="social rise" style={rise(0.32)}>
                <span className="avail">Available for freelance and contract work</span>
              </div>
              <div className="social rise" style={rise(0.4)}>
                <SocialLinks />
              </div>
            </div>
            <div className="rise" style={rise(0.48)}>
              <Showcase />
            </div>
          </div>

          <div className="stats rise" style={rise(0.56)}>
            {stats.map((s) => (
              <div key={s.value}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <div className="marq rise" style={rise(0.64)}>
            <span className="ml">Clients &amp; teams</span>
            <div className="mq">
              <div className="mt">
                {[...marquee, ...marquee].map((m, i) => (
                  <span key={m + i} aria-hidden={i >= marquee.length}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="s" id="work">
        <div className="wrap">
          <SectionHead eye="Featured work" title="Case studies" intro="In-depth case studies: the problem, the architecture, the decisions and what I learned.">
            <a href={caseStudiesIndex} className="btn btn-s" target="_blank" rel="noopener noreferrer">See all case studies →</a>
          </SectionHead>
          <div className="work">
            {caseStudies.map((c) => (
              <a key={c.title} className="wc" style={cssVar({ "--c": c.color })} href={c.href} target="_blank" rel="noopener noreferrer">
                {c.cover.kind === "image" ? (
                  <div className="cov">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.cover.src} alt="" loading="lazy" />
                  </div>
                ) : (
                  <div className="cov gen">
                    <GeneratedCover cover={c.cover} tag={c.tag} />
                  </div>
                )}
                <div className="bd">
                  <span className="cat">{c.tag}</span>
                  <h3>{c.title}</h3>
                  <p>{c.summary}</p>
                  <div className="stack">
                    {c.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                  <span className="read">{c.cta} →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="s" id="services">
        <div className="wrap">
          <SectionHead eye="Services" title="What I can help with" intro="From the first architecture sketch to a feature running in production." />
          <div className="bento">
            {services.map((s) => (
              <div key={s.no} className={`bx${s.wide ? " w2" : ""}`} style={cssVar({ "--c": s.color })}>
                <span className="bic">{serviceIcons[s.icon]}</span>
                <span className="no">{s.no}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                {s.flow && (
                  <div className="flow">
                    {s.flow.map((f, i) => (
                      <span key={f} style={{ display: "contents" }}>
                        {i > 0 && <i>→</i>}
                        <span className={i === s.flow!.length - 1 ? "hl" : ""}>{f}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="bx w2 hire2">
              <div>
                <span className="avail">Open for new projects</span>
                <h3>Available for freelance and contract work</h3>
                <p>Tell me what you&apos;re building and where you need help.</p>
              </div>
              <a href={enquiryMailto} className="hbtn">
                Get in touch <ArrowRight size={14} strokeWidth={2} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="s" id="projects">
        <div className="wrap">
          <SectionHead eye="Client projects" title="Products I built or worked on" intro="Products I built or worked on for clients and employers." />
          <Projects />
        </div>
      </section>

      <section className="s" id="skills">
        <div className="wrap">
          <SectionHead eye="Skills" title="The tools I use" intro="The tools I use to take a product from idea to production." />
          <div className="skills">
            {skills.map((s) => (
              <div key={s.group} className="sk" style={cssVar({ "--c": s.color })}>
                <div className="hd">
                  <span className="ic">{skillIcons[s.icon]}</span>
                  <h3>{s.group}</h3>
                  <span className="ct">{String(s.items.length).padStart(2, "0")}</span>
                </div>
                <div className="chips">
                  {s.items.map((i) => (
                    <span key={i}>{i}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s" id="experience">
        <div className="wrap">
          <SectionHead eye="Experience" title="Where I've worked" intro="Product companies, agencies and freelance clients across Europe and Asia." />
          <div className="xp">
            <div className="tl">
              {experience.map((j) => (
                <div key={j.org + j.when} className={`job${j.now ? " now" : ""}${j.points.length === 0 ? " mini" : ""}`}>
                  <div className="when">{j.when}</div>
                  <h3>
                    {j.role}{" "}
                    <span>
                      ·{" "}
                      {j.upwork ? (
                        <a className="uplink" href={profile.upwork} target="_blank" rel="noopener noreferrer">
                          Upwork
                        </a>
                      ) : (
                        j.org
                      )}
                    </span>
                  </h3>
                  {j.points.length > 0 && (
                    <ul>
                      {j.points.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="side">
              <a className="box upw" href={profile.upwork} target="_blank" rel="noopener noreferrer">
                <div className="uh">
                  <span className="ulogo">Up</span>
                  <div>
                    <b>Freelancing on Upwork</b>
                    <span className="us">Freelance Full Stack Engineer · 2021 – 2025</span>
                  </div>
                  <ArrowUpRight className="ua" size={16} strokeWidth={2} />
                </div>
                <span className="trb">
                  <Star size={12} fill="currentColor" strokeWidth={0} />
                  Freelance since 2021
                </span>
              </a>
              <div className="box">
                <h4>Industries</h4>
                <div className="ind">
                  {industries.map((i) => (
                    <span key={i}>{i}</span>
                  ))}
                </div>
              </div>
              <div className="box">
                <h4>Education</h4>
                <div className="edu">
                  {education.map((e) => (
                    <div key={e.short} className="ed">
                      <span className="eic">{e.short}</span>
                      <div>
                        <b>{e.degree}</b>
                        <span>{e.school}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="wrap">
          <div className="eye" style={{ justifyContent: "center" }}>Contact</div>
          <h2>Let&apos;s build something</h2>
          <p>
            Building a SaaS product, a payment integration or an AI feature? I&apos;m happy to talk through the idea and how to get it
            to production.
          </p>
          <a className="mail" href={`mailto:${profile.email}`}>
            {profile.email} <span className="cp">↗</span>
          </a>
          <div className="social" style={{ justifyContent: "center", marginTop: 24 }}>
            <SocialLinks />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with Next.js, TypeScript and Tailwind CSS</span>
        </div>
      </footer>
    </>
  );
}
