"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button type="button" className="tt" onClick={toggle} aria-label="Toggle theme">
      <Sun className="sun" size={16} strokeWidth={2} />
      <Moon className="moon" size={16} strokeWidth={2} />
    </button>
  );
}
