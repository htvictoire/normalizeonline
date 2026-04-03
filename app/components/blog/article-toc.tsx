"use client";

import { useEffect, useRef, useState } from "react";

type TocItem = {
  id: string;
  title: string;
};

export default function BlogArticleToc({
  items,
  onNavigate,
}: {
  items: TocItem[];
  onNavigate?: () => void;
}) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const visibleRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const pick = () => {
      const first = elements.find((el) => visibleRef.current.has(el.id));
      if (first) setActiveId(first.id);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleRef.current.add(entry.target.id);
          } else {
            visibleRef.current.delete(entry.target.id);
          }
        });
        pick();
      },
      { rootMargin: "-80px 0px -40% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
    onNavigate?.();
  };

  return (
    <ul className="mt-4 space-y-1 text-sm leading-6">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => scrollToSection(item.id)}
              aria-current={isActive ? "location" : undefined}
              className={[
                "w-full border-l pl-3 text-left transition-colors",
                isActive
                  ? "border-brand font-medium text-ink"
                  : "border-transparent text-ink-muted hover:border-border hover:text-ink",
              ].join(" ")}
            >
              {item.title}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
