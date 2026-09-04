import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { getRouteHash, getSectionFragment } from './nav';
import './DocsSectionScrubber.css';

export interface DocsScrubberSection {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
}

export interface DocsSectionScrubberProps {
  readonly sections: readonly DocsScrubberSection[];
  readonly ariaLabel?: string;
  readonly rowHeight?: number;
  readonly restLength?: number;
  readonly peakLength?: number;
  readonly radius?: number;
  readonly className?: string;
}

interface ScrubberTick extends DocsScrubberSection {
  index: number;
  length: number;
  opacity: number;
  thickness: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function bump(distance: number, radius: number): number {
  if (radius <= 0 || distance >= radius) return 0;
  return 0.5 * (1 + Math.cos(Math.PI * (distance / radius)));
}

function reducedMotion(): boolean {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * A compact, pointer-magnifying section rail. It owns deep-link fragments,
 * intersection tracking, roving keyboard focus, and reduced-motion scrolling.
 */
export function DocsSectionScrubber({
  sections,
  ariaLabel = 'On this page',
  rowHeight = 24,
  restLength = 14,
  peakLength = 54,
  radius = 4,
  className = '',
}: DocsSectionScrubberProps) {
  const railRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pointerRow, setPointerRow] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const route = typeof window === 'undefined' ? '#/' : getRouteHash(window.location.hash || '#/');

  useEffect(() => {
    if (!sections.length) return;
    const scrollContainer = railRef.current?.closest<HTMLElement>('.docs-main') ?? null;
    const targets = sections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => section !== null);
    const sectionFragment = getSectionFragment(window.location.hash);
    const deepLinkIndex = sections.findIndex((section) => section.id === sectionFragment);
    if (deepLinkIndex >= 0) {
      window.requestAnimationFrame(() => {
        setActiveIndex(deepLinkIndex);
        targets[deepLinkIndex]?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      });
    }

    const activateLastAtEnd = () => {
      if (scrollContainer && Math.abs(scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight) < 2) {
        setActiveIndex(sections.length - 1);
      }
    };
    scrollContainer?.addEventListener('scroll', activateLastAtEnd, { passive: true });

    if (typeof IntersectionObserver !== 'undefined') {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
          const id = visible[0]?.target.id;
          const index = sections.findIndex((section) => section.id === id);
          if (index >= 0) setActiveIndex(index);
        },
        { root: scrollContainer, rootMargin: '-8% 0px -72% 0px', threshold: 0 },
      );
      targets.forEach((target) => observer.observe(target));

      return () => {
        observer.disconnect();
        scrollContainer?.removeEventListener('scroll', activateLastAtEnd);
      };
    }

    return () => scrollContainer?.removeEventListener('scroll', activateLastAtEnd);
  }, [sections]);

  const previewIndex = pointerRow === null ? focusedIndex : clamp(Math.round(pointerRow), 0, sections.length - 1);
  const preview = previewIndex === null ? undefined : sections[previewIndex];
  const ticks = useMemo<readonly ScrubberTick[]>(() => {
    const safePeak = Math.max(restLength, peakLength);
    return sections.map((section, index) => {
      const rise = pointerRow === null ? 0 : bump(Math.abs(index - pointerRow), radius);
      const baseOpacity = index === activeIndex ? 0.55 : 0.22;
      return {
        ...section,
        index,
        length: restLength + rise * (safePeak - restLength),
        opacity: baseOpacity + rise * (1 - baseOpacity),
        thickness: 1 + rise * 0.4,
      };
    });
  }, [activeIndex, peakLength, pointerRow, radius, restLength, sections]);

  function scrollTo(index: number, event?: React.MouseEvent<HTMLAnchorElement>): void {
    event?.preventDefault();
    const section = sections[index];
    const target = section ? document.getElementById(section.id) : null;
    if (!section || !target) return;
    setActiveIndex(index);
    const nextHash = `${route}#${encodeURIComponent(section.id)}`;
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${nextHash}`);
    target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLAnchorElement>, index: number): void {
    let next: number | null = null;
    if (event.key === 'ArrowDown') next = Math.min(index + 1, sections.length - 1);
    if (event.key === 'ArrowUp') next = Math.max(index - 1, 0);
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = sections.length - 1;
    if (next === null) return;
    event.preventDefault();
    scrollTo(next);
    setFocusedIndex(next);
    linkRefs.current[next]?.focus();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLOListElement>): void {
    const rect = event.currentTarget.getBoundingClientRect();
    setPointerRow(clamp((event.clientY - rect.top) / Math.max(1, rowHeight) - 0.5, -0.5, sections.length - 0.5));
  }

  return (
    <nav
      ref={railRef}
      className={['docs-section-scrubber', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
      style={{ '--scrubber-row-height': `${rowHeight}px`, '--scrubber-peak-length': `${peakLength}px` } as CSSProperties}
    >
      <ol className="docs-section-scrubber__rail" onPointerMove={handlePointerMove} onPointerLeave={() => setPointerRow(focusedIndex)}>
        {ticks.map((tick) => (
          <li className="docs-section-scrubber__item" key={tick.id}>
            <a
              ref={(element) => { linkRefs.current[tick.index] = element; }}
              className={['docs-section-scrubber__link', tick.index === activeIndex && 'docs-section-scrubber__link--active'].filter(Boolean).join(' ')}
              href={`${route}#${encodeURIComponent(tick.id)}`}
              aria-label={tick.label}
              aria-current={tick.index === activeIndex ? 'location' : undefined}
              tabIndex={tick.index === activeIndex ? 0 : -1}
              style={{ '--tick-length': `${tick.length}px`, '--tick-opacity': tick.opacity, '--tick-thickness': `${tick.thickness}px`, '--tick-scale': 1 } as CSSProperties}
              onClick={(event) => scrollTo(tick.index, event)}
              onFocus={() => { setFocusedIndex(tick.index); setPointerRow(tick.index); }}
              onBlur={() => { setFocusedIndex(null); setPointerRow(null); }}
              onKeyDown={(event) => handleKeyDown(event, tick.index)}
            >
              <span className="docs-section-scrubber__line" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
      {preview && (
        <div className="docs-section-scrubber__preview-anchor" style={{ '--preview-index': previewIndex } as CSSProperties} aria-hidden="true">
          <div className="docs-section-scrubber__preview">
            <span className="docs-section-scrubber__position">{(previewIndex ?? 0) + 1} / {sections.length}</span>
            <strong>{preview.label}</strong>
            {preview.description && <span className="docs-section-scrubber__description">{preview.description}</span>}
          </div>
        </div>
      )}
    </nav>
  );
}

export const SectionScrubber = DocsSectionScrubber;
