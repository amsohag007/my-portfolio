"use client";

import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { projects, tagColor } from "@/data/profile";

const LIMIT = 6;

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(false);

  const tags = ["All", ...new Set(projects.map((p) => p.tag))];
  const list = projects.filter((p) => filter === "All" || p.tag === filter);
  const shown = expanded ? list : list.slice(0, LIMIT);

  return (
    <>
      <div className="pfil">
        {tags.map((t) => (
          <button
            key={t}
            className={filter === t ? "on" : ""}
            style={{ "--c": t === "All" ? "var(--sig)" : tagColor(t) } as React.CSSProperties}
            onClick={() => {
              setFilter(t);
              setExpanded(false);
            }}
          >
            {t}
            <span>{t === "All" ? projects.length : projects.filter((p) => p.tag === t).length}</span>
          </button>
        ))}
      </div>

      {/* Keyed by filter so the cards replay their entrance on every change. */}
      <div className="clients" key={filter + String(expanded)}>
        {shown.map((p, i) => (
          <div key={p.name} className="pc" style={{ "--c": tagColor(p.tag), "--i": i } as React.CSSProperties}>
            <div className="pshot">
              <div className="bar">
                <i />
                <i />
                <i />
                <span>{p.domain}</span>
              </div>
              <div className="slotw">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {p.image && <img src={p.image} alt={`${p.name} screenshot`} loading="lazy" />}
              </div>
            </div>
            <div className="pb">
              <span className="ptag">{p.tag}</span>
              <a className="pn" href={p.url} target="_blank" rel="noopener noreferrer">
                {p.name}
                <ArrowUpRight size={15} strokeWidth={2} />
              </a>
              <p>{p.description}</p>
            </div>
          </div>
        ))}
      </div>

      {list.length > LIMIT && (
        <div className="pmore">
          <button className="btn btn-s" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Show fewer" : `Show all ${list.length} projects`}
          </button>
        </div>
      )}
    </>
  );
}
