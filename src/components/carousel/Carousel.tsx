/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Carousel.css';
import { useState, useRef, useCallback, useEffect, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';

export type CarouselIndicator = 'dots' | 'bars' | 'none';

export interface CarouselProps {
  /** Slide elements. Each direct child is one slide. */
  children?: ReactNode;
  /** Controlled active index. */
  activeIndex?: number;
  /** Show prev/next arrows on hover. */
  showArrows?: boolean;
  /** Indicator style: dots, bars, or none. */
  indicator?: CarouselIndicator;
  /** Wrap from last to first slide and vice versa. */
  loop?: boolean;
  /** Autoplay interval in ms (0 to disable). */
  autoplay?: number;
  /** Accessible label for the carousel region. */
  ariaLabel?: string;
  /** Called when the active slide changes. */
  onSlideChange?: (index: number) => void;
  /** Additional CSS class name(s). */
  className?: string;
}

export function Carousel({
  children,
  activeIndex: controlledIndex,
  showArrows = true,
  indicator = 'dots',
  loop = true,
  autoplay = 0,
  ariaLabel = 'Carousel',
  onSlideChange,
  className = '',
}: CarouselProps) {
  const { t } = useI18n();
  const resolvedAriaLabel = ariaLabel === 'Carousel' ? t('carousel') : ariaLabel;
  const slides = Array.isArray(children) ? children : children ? [children] : [];
  const slideCount = slides.length;

  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled = controlledIndex !== undefined;
  const currentIndex = Math.max(
    0,
    Math.min(slideCount > 0 ? slideCount - 1 : 0, isControlled ? controlledIndex : internalIndex),
  );

  const [dragging, setDragging] = useState(false);
  const pausedRef = useRef(false);

  // Pointer/touch swipe state
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (slideCount === 0) return;
      if (loop) {
        index = ((index % slideCount) + slideCount) % slideCount;
      } else {
        index = Math.max(0, Math.min(index, slideCount - 1));
      }
      if (!isControlled) setInternalIndex(index);
      onSlideChange?.(index);
    },
    [slideCount, loop, isControlled, onSlideChange],
  );

  const next = useCallback(() => goTo(currentIndex + 1), [goTo, currentIndex]);
  const prev = useCallback(() => goTo(currentIndex - 1), [goTo, currentIndex]);

  useEffect(() => {
    if (autoplay <= 0 || pausedRef.current) return;
    const timer = setInterval(() => {
      if (!pausedRef.current) goTo(currentIndex + 1);
    }, autoplay);
    return () => clearInterval(timer);
  }, [autoplay, currentIndex, goTo]);

  const pauseAutoplay = useCallback(() => {
    pausedRef.current = true;
  }, []);

  const resumeAutoplay = useCallback(() => {
    pausedRef.current = false;
    // autoplay effect will handle restart
  }, []);

  const onKeydown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        prev();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      } else if (event.key === 'Home') {
        event.preventDefault();
        goTo(0);
      } else if (event.key === 'End') {
        event.preventDefault();
        goTo(slideCount - 1);
      }
    },
    [prev, next, goTo, slideCount],
  );

  // Pointer/touch swipe handlers
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      pointerStartRef.current = { x: e.clientX, y: e.clientY };
      setDragging(true);
    },
    [],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStartRef.current) return;
      const dx = e.clientX - pointerStartRef.current.x;
      const threshold = 50;
      if (Math.abs(dx) > threshold) {
        if (dx < 0) next();
        else prev();
      }
      pointerStartRef.current = null;
      setDragging(false);
    },
    [next, prev],
  );

  const onPointerCancel = useCallback(() => {
    pointerStartRef.current = null;
    setDragging(false);
  }, []);

  const slideIndices = Array.from({ length: slideCount }, (_, i) => i);

  const rootClasses = ['sp-carousel', className].filter(Boolean).join(' ');

  return (
    <div
      className={rootClasses}
      role="region"
      aria-roledescription="carousel"
      aria-label={resolvedAriaLabel}
      onKeyDown={onKeydown}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onFocus={pauseAutoplay}
      onBlur={resumeAutoplay}
      tabIndex={0}
    >
      <div
        className="sp-carousel__viewport"
        aria-live="polite"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div
          className="sp-carousel__track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: dragging
              ? 'none'
              : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              id={`sp-carousel-slide-${i}`}
              className="sp-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slideCount}`}
              aria-hidden={currentIndex !== i}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            className="sp-carousel__arrow sp-carousel__arrow--prev"
            onClick={prev}
            aria-label={t('previousSlide')}
            disabled={!loop && currentIndex === 0}
          >
            <Icon name="chevron-left" size={20} />
          </button>
          <button
            className="sp-carousel__arrow sp-carousel__arrow--next"
            onClick={next}
            aria-label={t('nextSlide')}
            disabled={!loop && currentIndex === slideCount - 1}
          >
            <Icon name="chevron-right" size={20} />
          </button>
        </>
      )}

      {indicator !== 'none' && slideCount > 1 && (
        <div
          className="sp-carousel__indicators"
          role="tablist"
          aria-label={t('slideControls')}
        >
          {slideIndices.map((i) => (
            <button
              key={i}
              className={[
                'sp-carousel__dot',
                currentIndex === i && 'sp-carousel__dot--active',
                indicator === 'bars' && 'sp-carousel__dot--bar',
              ]
                .filter(Boolean)
                .join(' ')}
              role="tab"
              aria-selected={currentIndex === i}
              aria-controls={`sp-carousel-slide-${i}`}
              aria-label={`${t('slideControls')}: ${i + 1}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
