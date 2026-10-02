"use client";

import { useEffect } from "react";

// Page-wide effects: scroll reveal, cursor spotlight on cards, and the stats count-up.
export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    // Scroll reveal. Classes are added here, so content stays visible without JS.
    if (!reduce) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const t = e.target as HTMLElement;
            t.classList.add("in");
            io.unobserve(t);
            const i = Number(t.style.getPropertyValue("--i")) || 0;
            // Remove the reveal class afterwards so hover transforms work normally.
            setTimeout(() => {
              t.classList.remove("rv", "in");
              t.style.removeProperty("--i");
            }, 900 + i * 80);
          }
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
      );
      const reveal = (el: Element, i = 0) => {
        el.classList.add("rv");
        (el as HTMLElement).style.setProperty("--i", String(i));
        io.observe(el);
      };
      document.querySelectorAll("section.s .sh").forEach((el) => reveal(el));
      document.querySelectorAll(".contact .wrap > *").forEach((el, i) => reveal(el, i % 6));
      [".work", ".bento", ".skills", ".tl", ".side"].forEach((sel) => {
        const p = document.querySelector(sel);
        if (p) [...p.children].forEach((c, i) => reveal(c, i));
      });
      cleanups.push(() => io.disconnect());
    }

    // Cursor spotlight on case study and service cards.
    const spot = (e: MouseEvent) => {
      const card = e.currentTarget as HTMLElement;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.querySelectorAll<HTMLElement>(".bx, .wc").forEach((c) => {
      c.addEventListener("mousemove", spot);
      cleanups.push(() => c.removeEventListener("mousemove", spot));
    });

    // Stats count up when the strip enters the viewport.
    const stats = document.querySelector(".stats");
    if (stats && !reduce) {
      const so = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          so.disconnect();
          stats.querySelectorAll("b").forEach((b) => {
            const m = b.textContent?.match(/^(\d+)(.*)$/);
            if (!m) return;
            const n = Number(m[1]);
            const suffix = m[2];
            b.textContent = `0${suffix}`;
            setTimeout(() => {
              const t0 = performance.now();
              const step = (t: number) => {
                const k = Math.min(1, (t - t0) / 1100);
                b.textContent = `${Math.round(n * (1 - Math.pow(1 - k, 3)))}${suffix}`;
                if (k < 1) requestAnimationFrame(step);
              };
              requestAnimationFrame(step);
            }, 600);
          });
        },
        { threshold: 0.4 },
      );
      so.observe(stats);
      cleanups.push(() => so.disconnect());
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return null;
}
