/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '../../icons/Icon.js';
import './Coachmark.css';

// ── Types ────────────────────────────────────────────────────────────────────

export interface CoachmarkStep {
  target: string | HTMLElement;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  spotlightPadding?: number;
}

export interface CoachmarkProps {
  steps: CoachmarkStep[];
  active?: boolean;
  showProgress?: boolean;
  showArrow?: boolean;
  /** Show the dimmed backdrop overlay around the spotlight. Default: true. */
  showBackdrop?: boolean;
  closeOnBackdrop?: boolean;
  spotlightPadding?: number;
  onStepChange?: (index: number) => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

type Placement = 'top' | 'bottom' | 'left' | 'right';

function resolveTarget(target: string | HTMLElement): HTMLElement | null {
  if (typeof target === 'string') return document.querySelector<HTMLElement>(target);
  return target;
}

function getOppositeSide(placement: Placement): string {
  const map: Record<string, string> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  return map[placement] ?? 'top';
}

/**
 * Position the card relative to the target, with flip if it overflows viewport.
 * Returns { top, left, placement } where placement may differ from preferred.
 */
function computeCardPos(
  targetRect: DOMRect,
  cardEl: HTMLElement,
  preferred: Placement,
  gap: number,
): { top: number; left: number; placement: Placement } {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const cw = cardEl.offsetWidth;
  const ch = cardEl.offsetHeight;

  function tryPlace(p: Placement): { top: number; left: number } | null {
    let t: number, l: number;
    switch (p) {
      case 'bottom':
        t = targetRect.bottom + gap;
        l = targetRect.left + targetRect.width / 2 - cw / 2;
        if (t + ch > vh) return null;
        break;
      case 'top':
        t = targetRect.top - ch - gap;
        l = targetRect.left + targetRect.width / 2 - cw / 2;
        if (t < 0) return null;
        break;
      case 'right':
        t = targetRect.top + targetRect.height / 2 - ch / 2;
        l = targetRect.right + gap;
        if (l + cw > vw) return null;
        break;
      case 'left':
        t = targetRect.top + targetRect.height / 2 - ch / 2;
        l = targetRect.left - cw - gap;
        if (l < 0) return null;
        break;
    }
    // Clamp to viewport
    l = Math.max(8, Math.min(l, vw - cw - 8));
    t = Math.max(8, Math.min(t, vh - ch - 8));
    return { top: t, left: l };
  }

  const order: Placement[] = [preferred, ...(['bottom', 'top', 'right', 'left'] as Placement[]).filter((p) => p !== preferred)];
  for (const p of order) {
    const pos = tryPlace(p);
    if (pos) return { ...pos, placement: p };
  }
  // Fallback
  const pos = tryPlace(preferred)!;
  return { top: pos?.top ?? 0, left: pos?.left ?? 0, placement: preferred };
}

// ── Component ────────────────────────────────────────────────────────────────

export function Coachmark({
  steps,
  active = false,
  showProgress = true,
  showArrow = true,
  showBackdrop = true,
  closeOnBackdrop = false,
  spotlightPadding: globalPadding = 8,
  onStepChange,
  onComplete,
  onSkip,
}: CoachmarkProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<{ top: number; left: number; width: number; height: number; radius: number } | null>(null);
  const [cardPos, setCardPos] = useState({ top: 0, left: 0 });
  const [arrowSide, setArrowSide] = useState<string>('top');
  const [ready, setReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const step = steps[currentIndex] ?? null;
  const isLastStep = currentIndex === steps.length - 1;

  // ── Position for current step ─────────────────────────────────────────────
  const positionForCurrentStep = useCallback(() => {
    if (!step) return;
    const targetEl = resolveTarget(step.target);
    if (!targetEl) {
      setSpotlight(null);
      setReady(false);
      return;
    }

    // Scroll target into view
    targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });

    requestAnimationFrame(() => {
      const rect = targetEl.getBoundingClientRect();
      const padding = step.spotlightPadding ?? globalPadding;
      const computedStyle = getComputedStyle(targetEl);
      const borderRadius = parseFloat(computedStyle.borderRadius) || 0;

      // Spotlight cutout
      const cut = {
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
        radius: borderRadius + padding / 2,
      };
      setSpotlight(cut);

      // Card position
      requestAnimationFrame(() => {
        const card = cardRef.current;
        if (!card) return;
        const placement = step.placement ?? 'bottom';
        const result = computeCardPos(rect, card, placement, 16);
        setCardPos({ top: result.top, left: result.left });
        setArrowSide(getOppositeSide(result.placement));
        setReady(true);

        // Focus card for keyboard accessibility
        card.focus({ preventScroll: true });
      });
    });
  }, [step, globalPadding]);

  // ── Reset on activate ─────────────────────────────────────────────────────
  useEffect(() => {
    if (active) {
      setCurrentIndex(0);
      setReady(false);
    }
  }, [active]);

  // ── Position on step change ───────────────────────────────────────────────
  useEffect(() => {
    if (!active || !step) return;
    setReady(false);
    const raf = requestAnimationFrame(() => positionForCurrentStep());
    return () => cancelAnimationFrame(raf);
  }, [active, currentIndex, positionForCurrentStep, step]);

  // ── Resize / scroll reposition ────────────────────────────────────────────
  useEffect(() => {
    if (!active) return;
    const handle = () => positionForCurrentStep();
    window.addEventListener('resize', handle, { passive: true });
    window.addEventListener('scroll', handle, { capture: true, passive: true });
    return () => {
      window.removeEventListener('resize', handle);
      window.removeEventListener('scroll', handle, { capture: true } as EventListenerOptions);
    };
  }, [active, positionForCurrentStep]);

  // ── Keyboard: Escape, Arrow keys ──────────────────────────────────────────
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSkip?.();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goBack();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, currentIndex, steps.length]);

  // ── Navigation ────────────────────────────────────────────────────────────
  function goNext() {
    if (currentIndex < steps.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      onStepChange?.(next);
    } else {
      onComplete?.();
    }
  }

  function goBack() {
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      onStepChange?.(prev);
    }
  }

  function handleBackdropClick() {
    if (closeOnBackdrop) {
      onSkip?.();
    }
  }

  if (!active || !step) return null;

  return createPortal(
    <div
      className={`sp-coachmark-backdrop${!showBackdrop ? ' sp-coachmark-backdrop--no-overlay' : ''}`}
      ref={backdropRef}
      onClick={handleBackdropClick}
    >
      {/* Spotlight cutout via box-shadow */}
      {showBackdrop && spotlight && (
        <div
          className="sp-coachmark-spotlight"
          style={{
            position: 'fixed',
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            borderRadius: spotlight.radius,
          }}
        />
      )}

      {/* Card */}
      <div
        ref={cardRef}
        className="sp-coachmark-card"
        role="dialog"
        aria-label={step.title}
        aria-modal="true"
        tabIndex={-1}
        style={{
          position: 'fixed',
          top: cardPos.top,
          left: cardPos.left,
          opacity: ready ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {showArrow && (
          <div className="sp-coachmark-arrow" data-side={arrowSide} />
        )}
        <div className="sp-coachmark-card__body">
          <p className="sp-coachmark-card__title">{step.title}</p>
          <p className="sp-coachmark-card__desc">{step.content}</p>
        </div>
        <div className="sp-coachmark-card__footer">
          {showProgress && (
            <span className="sp-coachmark-card__progress">
              {currentIndex + 1} / {steps.length}
            </span>
          )}
          <div className="sp-coachmark-card__actions">
            {steps.length > 1 && (
              <button
                type="button"
                className="sp-coachmark-btn sp-coachmark-btn--ghost"
                onClick={(e) => { e.stopPropagation(); onSkip?.(); }}
              >
                Skip
              </button>
            )}
            {currentIndex > 0 && (
              <button
                type="button"
                className="sp-coachmark-btn sp-coachmark-btn--outline"
                onClick={(e) => { e.stopPropagation(); goBack(); }}
              >
                <Icon name="chevron-left" size={14} />
                Back
              </button>
            )}
            {!isLastStep ? (
              <button
                type="button"
                className="sp-coachmark-btn sp-coachmark-btn--primary"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
              >
                Next
                <Icon name="chevron-right" size={14} />
              </button>
            ) : (
              <button
                type="button"
                className="sp-coachmark-btn sp-coachmark-btn--primary"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
              >
                Done
                <Icon name="check" size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
