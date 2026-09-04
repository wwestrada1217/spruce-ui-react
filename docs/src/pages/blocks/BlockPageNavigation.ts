import { useEffect, useRef, useState } from 'react';

export interface BlockPageSection {
  readonly id: string;
  readonly label: string;
}

function hasReducedMotionPreference(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useBlockPageNavigation(
  sections: readonly BlockPageSection[],
  initialSection = sections[0]?.id ?? '',
) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        const firstVisible = visible[0]?.target.id;
        if (firstVisible) setActiveSection(firstVisible);
      },
      { threshold: 0.25 },
    );

    sections.forEach(({ id }) => {
      const section = mainRef.current?.querySelector(`#${id}`);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, [sections]);

  function scrollToSection(id: string): void {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: hasReducedMotionPreference() ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  return { mainRef, activeSection, scrollToSection };
}
