"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import GeneratedCover from "@/components/Cover";
import { caseStudies, projects } from "@/data/profile";

type Slide = {
  group: "cs" | "cw";
  tag: string;
  caption: string;
  href?: string;
  color?: string;
  image?: string;
  domain?: string;
  gen?: (typeof caseStudies)[number]["cover"];
};

const slides: Slide[] = [
  { group: "cs", tag: "AI agents", caption: "Merchant Dashboard Agent", href: caseStudies[0].href, image: "/images/covers/merchant-agent-dashboard.jpg" },
  { group: "cs", tag: caseStudies[1].tag, caption: caseStudies[1].title, href: caseStudies[1].href, color: caseStudies[1].color, gen: caseStudies[1].cover },
  { group: "cs", tag: caseStudies[2].tag, caption: caseStudies[2].title, href: caseStudies[2].href, color: caseStudies[2].color, gen: caseStudies[2].cover },
  ...projects.map((p) => ({
    group: "cw" as const,
    tag: p.name === "FixBil" ? "Automotive · Norway" : p.name === "AndShop" ? "E-commerce template" : p.tag,
    caption: p.name,
    href: p.url,
    image: p.image,
    domain: p.domain,
  })),
];

const groups = [
  { id: "cs" as const, label: "Case studies" },
  { id: "cw" as const, label: "Client work" },
];

export default function Showcase() {
  const [cur, setCur] = useState(0);
  const [caption, setCaption] = useState(slides[0]);
  const [swapping, setSwapping] = useState(false);
  const [pill, setPill] = useState({ left: 3, width: 0 });
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const stageRef = useRef<HTMLDivElement>(null);
  const captionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Moves to a slide; the caption swaps with a short fade.
  const go = useCallback((n: number) => {
    const next = ((n % slides.length) + slides.length) % slides.length;
    setCur(next);
    setSwapping(true);
    if (captionTimer.current) clearTimeout(captionTimer.current);
    captionTimer.current = setTimeout(() => {
      setCaption(slides[next]);
      setSwapping(false);
    }, 180);
  }, []);

  useEffect(() => () => {
    if (captionTimer.current) clearTimeout(captionTimer.current);
  }, []);

  // Sliding pill under the active tab.
  const activeGroup = slides[cur].group;
  useLayoutEffect(() => {
    const place = () => {
      const i = groups.findIndex((g) => g.id === activeGroup);
      const el = tabRefs.current[i];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [activeGroup]);

  // 3D tilt and sheen follow the cursor (skipped for reduced motion).
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const st = stageRef.current;
    if (!st || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = st.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    st.style.transform = `rotateY(${(x - 0.5) * 7}deg) rotateX(${(0.5 - y) * 6}deg)`;
    st.style.setProperty("--mx", `${x * 100}%`);
    st.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    if (stageRef.current) stageRef.current.style.transform = "";
  };

  return (
    <div className="show">
      <div className="show-top">
        <div className="tabs">
          <span className="pill" style={{ left: pill.left, width: pill.width }} />
          {groups.map((g, i) => (
            <button
              key={g.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              className={activeGroup === g.id ? "on" : ""}
              onClick={() => go(slides.findIndex((s) => s.group === g.id))}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="arrows">
          <button aria-label="Previous" onClick={() => go(cur - 1)}>
            <ChevronLeft size={14} strokeWidth={2} />
          </button>
          <button aria-label="Next" onClick={() => go(cur + 1)}>
            <ChevronRight size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="stage" ref={stageRef} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="sheen" />
        {slides.map((s, i) => (
          <div key={s.caption} className={`sl${i === cur ? " on" : ""}`} aria-hidden={i !== cur}>
            {s.gen && s.gen.kind === "gen" ? (
              <div className="cov gen" style={{ "--c": s.color } as React.CSSProperties}>
                <GeneratedCover cover={s.gen} tag={s.tag} />
              </div>
            ) : s.domain ? (
              <div className="bw">
                <div className="bar">
                  <i />
                  <i />
                  <i />
                  <span>{s.domain}</span>
                </div>
                <div className="slotw">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.image} alt={`${s.caption} screenshot`} loading="lazy" />
                </div>
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.image} alt={s.caption} />
            )}
          </div>
        ))}
      </div>

      <div className="show-foot">
        <a className={`capw${swapping ? " sw" : ""}`} href={caption.href} target={caption.href ? "_blank" : undefined} rel="noopener noreferrer">
          <span className="tg">{caption.tag}</span>
          <span className="cap">{caption.caption}</span>
          <span className="go">→</span>
        </a>
        <div className="prog">
          {slides.map((s, i) => (
            <button
              key={s.caption + i + (i === cur ? cur : "")}
              aria-label={`Show ${s.caption}`}
              className={i === cur ? "on" : i < cur ? "done" : ""}
              onClick={() => go(i)}
              onAnimationEnd={() => {
                if (i === cur) go(cur + 1);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
