"use client";

import { useEffect, useState } from "react";

type ArticleTocItem = {
  id: string;
  title: string;
};

type BlogArticleTocProps = {
  items: ArticleTocItem[];
};

const sectionOffset = 120;

export default function BlogArticleToc({ items }: BlogArticleTocProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement);

    if (sections.length === 0) {
      return;
    }

    const updateActiveSection = () => {
      let nextActiveId = sections[0].id;

      for (const section of sections) {
        if (section.getBoundingClientRect().top - sectionOffset <= 0) {
          nextActiveId = section.id;
          continue;
        }

        break;
      }

      setActiveId(nextActiveId);
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [items]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);

    if (!section) {
      return;
    }

    section.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
    setActiveId(id);
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
