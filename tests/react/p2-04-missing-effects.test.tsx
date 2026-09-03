import { act, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Aura,
  Fire,
  Fireworks,
  FluidFill,
  Hourglass,
  Snowflakes,
  Thermometer,
  WheelOfFortune,
  type FireworksHandle,
  type HourglassHandle,
  type WheelOfFortuneHandle,
} from '../../src/index.js';
import { expectNoA11yViolations, renderWithSpruce } from '../utils/test-utils.js';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function mockCanvas(): void {
  const context = {
    arc: vi.fn(),
    beginPath: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    restore: vi.fn(),
    save: vi.fn(),
    setTransform: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
}

describe('P2-04 missing effects parity', () => {
  it('renders every effect with Angular-compatible controls and accessible output', async () => {
    mockCanvas();
    const view = renderWithSpruce(
      <div>
        <Aura auraColors={['#6366f1', '#ec4899']} auraWidth={3} auraBlur={20}>Aura</Aura>
        <Fire enabled={false}>Fire</Fire>
        <Fireworks enabled={false} autoLaunch={false}>Fireworks</Fireworks>
        <FluidFill fluidLevel={65} waveHeight={12} showBubbles />
        <Hourglass progress={45} running size="lg" />
        <Snowflakes count={12} size="sm">Snow</Snowflakes>
        <Thermometer temperature={45} size="lg" />
        <WheelOfFortune size="sm" duration={0.01} />
      </div>,
    );

    expect(view.container.querySelector('.sp-aura')).toHaveStyle('--sp-aura-width: 3px');
    expect(view.container.querySelector('.sp-aura-cover')).toHaveAttribute('aria-hidden', 'true');
    expect(view.container.querySelector('.sp-fire-glow')).toBeNull();
    expect(view.container.querySelector('.sp-fluid-body')).toHaveStyle('height: 65%');
    expect(view.container.querySelectorAll('.sp-fluid-bubble')).toHaveLength(5);
    expect(view.container.querySelector('.sp-sand-stream-line')).toBeInTheDocument();
    expect(view.container.querySelectorAll('.sp-snowflake-particle')).toHaveLength(12);
    expect(view.getByRole('img', { name: 'Thermometer: 45°C' })).toBeInTheDocument();
    expect(view.container.querySelector('.sp-bulb-pulse')).toBeInTheDocument();
    expect(view.getByRole('button', { name: 'SPIN' })).toBeInTheDocument();
    await expectNoA11yViolations(view.container);
  });

  it('supports imperative and callback interactions for motion components', () => {
    vi.useFakeTimers();
    mockCanvas();
    const onBurst = vi.fn();
    const onComplete = vi.fn();
    const onSpinStart = vi.fn();
    const onSpinComplete = vi.fn();
    const fireworksRef: { current: FireworksHandle | null } = { current: null };
    const hourglassRef: { current: HourglassHandle | null } = { current: null };
    const wheelRef: { current: WheelOfFortuneHandle | null } = { current: null };
    const view = renderWithSpruce(
      <div>
        <Fireworks ref={fireworksRef} autoLaunch={false} onBurst={onBurst} />
        <Hourglass ref={hourglassRef} progress={20} duration={0.1} onComplete={onComplete} />
        <WheelOfFortune ref={wheelRef} duration={0.01} onSpinStart={onSpinStart} onSpinComplete={onSpinComplete} />
      </div>,
    );

    act(() => {
      fireworksRef.current?.launch(40, 30);
      wheelRef.current?.spin();
      vi.advanceTimersByTime(20);
    });
    expect(onSpinStart).toHaveBeenCalledTimes(1);
    expect(onSpinComplete).toHaveBeenCalledTimes(1);
    act(() => hourglassRef.current?.flip());
    expect(view.container.querySelector('.sp-hourglass--flipping')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1000));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onBurst).toHaveBeenCalledWith({ x: 40, y: 30 });
    fireEvent.click(view.getByRole('button', { name: 'SPIN' }));
    expect(onSpinStart).toHaveBeenCalledTimes(2);
  });

  it('removes motion-sensitive work when reduced motion is requested', async () => {
    mockCanvas();
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    } as unknown as MediaQueryList);
    const view = renderWithSpruce(
      <div>
        <Aura>Aura</Aura>
        <Fire>Fire</Fire>
        <Fireworks autoLaunch>Fireworks</Fireworks>
        <FluidFill fluidLevel={60} />
        <Hourglass progress={45} />
        <Snowflakes count={4}>Snow</Snowflakes>
        <Thermometer temperature={45} />
        <WheelOfFortune duration={0.01} />
      </div>,
    );

    expect(view.container.querySelector('.sp-aura--reduced-motion')).toBeInTheDocument();
    expect(view.container.querySelector('.sp-fire-host--reduced-motion .sp-fire-ember')).toBeNull();
    expect(view.container.querySelector('.sp-fireworks-host--reduced-motion')).toBeInTheDocument();
    expect(view.container.querySelector('.sp-fluid-fill--reduced-motion')).toBeInTheDocument();
    expect(view.container.querySelector('.sp-hourglass--reduced-motion')).toBeInTheDocument();
    expect(view.container.querySelector('.sp-snow-host--reduced-motion')).toBeInTheDocument();
    expect(view.container.querySelector('.sp-thermometer--reduced-motion')).toBeInTheDocument();
    await expectNoA11yViolations(view.container);
  });
});
