import { act, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Confetti,
  Fade,
  Glow,
  Marquee,
  Rainbow,
  Shimmer,
  Shine,
  Sparkles,
  type ConfettiHandle,
} from '../../src/index.js';
import { expectNoA11yViolations, renderWithSpruce } from '../utils/test-utils.js';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('P2-03 effects parity', () => {
  it('renders the shared effect controls with accessible decorative content', async () => {
    const view = renderWithSpruce(
      <div>
        <Sparkles enabled={false} sparkleColor="rainbow" sparkleSize="lg" sparkleCount={3} sparkleInterval={100}>
          <span>Sparkle content</span>
        </Sparkles>
        <Shimmer enabled shimmerSkeleton width={120} height={20} aria-label="Loading item" />
        <Rainbow rainbowMode="border" rainbowColors={['#3b82f6', '#ec4899']} rainbowAnimate={false}>Rainbow</Rainbow>
        <Shine shineAngle={150} shineWidth={80} shineDuration={1000} shineDelay={500}>Shine</Shine>
        <Glow glowVariant="breathe" glowColor="#a855f7" glowRadius={20} glowIntensity={0.8}>Glow</Glow>
        <Marquee direction="down" speed={10} gap={8} ariaLabel="Updates"><span>Update</span></Marquee>
      </div>,
    );

    expect(view.container.querySelector('.sp-sparkle-icon')).toBeNull();
    expect(view.getByLabelText('Loading item')).toHaveAttribute('aria-busy', 'true');
    expect(view.container.querySelector('.sp-rainbow--border')).toHaveStyle('--sp-rainbow-speed: 3s');
    expect(view.container.querySelector('.sp-shine--active')).toHaveStyle('--sp-shine-angle: 150deg');
    expect(view.container.querySelector('.sp-glow--breathe')).toHaveStyle('--sp-glow-intensity: 0.8');
    const marquee = view.getByRole('marquee', { name: 'Updates' });
    expect(marquee.querySelector('.sp-marquee__track--down')).toBeInTheDocument();
    expect(marquee.querySelector('[aria-hidden="true"]')).toHaveAttribute('inert');
    await expectNoA11yViolations(view.container);
  });

  it('spawns sparkles at the configured interval and stops when disabled', () => {
    vi.useFakeTimers();
    const view = renderWithSpruce(<Sparkles sparkleCount={2} sparkleInterval={100}>Content</Sparkles>);

    act(() => vi.advanceTimersByTime(100));
    expect(view.container.querySelectorAll('.sp-sparkle-icon').length).toBeGreaterThan(0);

    view.rerender(<Sparkles enabled={false} sparkleCount={2}>Content</Sparkles>);
    expect(view.container.querySelectorAll('.sp-sparkle-icon')).toHaveLength(0);
  });

  it('supports click and imperative confetti bursts with lifecycle callbacks', async () => {
    vi.useFakeTimers();
    const onStart = vi.fn();
    const onComplete = vi.fn();
    const ref: { current: ConfettiHandle | null } = { current: null };
    const view = renderWithSpruce(
      <Confetti ref={ref} confettiOnClick={false} count={3} duration={10} onStart={onStart} onComplete={onComplete}>
        <button type="button">Celebrate</button>
      </Confetti>,
    );

    fireEvent.click(view.getByRole('button', { name: 'Celebrate' }));
    expect(onStart).not.toHaveBeenCalled();
    act(() => ref.current?.fire({ shapes: ['circle'], spread: 20 }));
    expect(onStart).toHaveBeenCalledTimes(1);
    expect(document.body.querySelectorAll('.sp-confetti-particle')).toHaveLength(3);
    expect(document.body.querySelector('.sp-confetti-particle')).toHaveStyle('border-radius: 50%');

    act(() => vi.advanceTimersByTime(220));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(document.body.querySelector('.sp-confetti-burst')).toBeNull();

    const clickView = renderWithSpruce(
      <Confetti confettiOnClick count={1} duration={10} onStart={onStart}><button type="button">Click burst</button></Confetti>,
    );
    fireEvent.click(clickView.getByRole('button', { name: 'Click burst' }));
    expect(onStart).toHaveBeenCalledTimes(2);
  });

  it('reveals fade content on mount and supports repeatable viewport entry', () => {
    vi.useFakeTimers();
    class MockIntersectionObserver {
      static last: MockIntersectionObserver | undefined;
      readonly callback: IntersectionObserverCallback;
      readonly options: IntersectionObserverInit | undefined;
      constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
        this.callback = callback;
        this.options = options;
        MockIntersectionObserver.last = this;
      }
      observe = vi.fn();
      disconnect = vi.fn();
      trigger(isIntersecting: boolean): void {
        this.callback([{ isIntersecting, target: document.querySelector('.sp-fade')! } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
    }
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    const view = renderWithSpruce(<Fade fadeOnce={false} fadeThreshold={0.25}>Viewport content</Fade>);
    const root = view.container.querySelector('.sp-fade') as HTMLElement;
    expect(root).toHaveStyle('opacity: 0');
    expect(MockIntersectionObserver.last?.options).toEqual({ threshold: 0.25 });

    act(() => MockIntersectionObserver.last?.trigger(true));
    expect(root).toHaveStyle('opacity: 1');
    act(() => MockIntersectionObserver.last?.trigger(false));
    expect(root).toHaveStyle('opacity: 0');

    const mountView = renderWithSpruce(<Fade fadeTrigger="mount" fadeDirection="left" fadeDistance={18}>Mount content</Fade>);
    expect(mountView.container.querySelector('.sp-fade')).toHaveStyle('transform: translateX(18px)');
    act(() => vi.runAllTimers());
    expect(mountView.container.querySelector('.sp-fade')).toHaveStyle('opacity: 1');
  });

  it('disables motion-sensitive output when reduced motion is requested', async () => {
    const media = {
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    } as unknown as MediaQueryList;
    vi.spyOn(window, 'matchMedia').mockReturnValue(media);
    const view = renderWithSpruce(
      <div>
        <Sparkles sparkleCount={2}>Sparkles</Sparkles>
        <Confetti active count={1} duration={10} />
        <Fade fadeTrigger="viewport">Fade</Fade>
        <Marquee><span>Marquee</span></Marquee>
      </div>,
      { providerProps: { defaultTheme: 'light' } },
    );

    await waitFor(() => expect(view.container.querySelectorAll('.sp-sparkle-icon')).toHaveLength(0));
    expect(document.body.querySelector('.sp-confetti-burst--reduced-motion')).toBeInTheDocument();
    expect(view.container.querySelector('.sp-fade')).toHaveStyle('opacity: 1');
    expect(view.container.querySelector('.sp-marquee__track')).toBeInTheDocument();
    await expectNoA11yViolations(view.container);
  });
});
