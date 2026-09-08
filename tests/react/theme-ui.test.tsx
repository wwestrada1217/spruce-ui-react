import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { HarmonyWheel, ThemeSwitcher, ThemeSwitcherPanel, type HarmonySelection } from '../../src/index.js';
import { expectNoA11yViolations, renderWithSpruce } from '../utils/test-utils.js';

describe('T-02 HarmonyWheel', () => {
  it('exposes three keyboard-editable sliders and snaps named schemes', async () => {
    const onBaseChange = vi.fn();
    const onSelectionChange = vi.fn();
    const { getAllByRole, user, container } = renderWithSpruce(
      <HarmonyWheel base="#2563eb" selection="triadic" onBaseChange={onBaseChange} onSelectionChange={onSelectionChange} />,
    );
    const sliders = getAllByRole('slider');
    expect(sliders).toHaveLength(3);
    sliders[0].focus();
    await user.keyboard('{ArrowRight}');
    expect(onBaseChange).toHaveBeenCalledWith(expect.stringMatching(/^#[0-9a-f]{6}$/));
    sliders[1].focus();
    await user.keyboard('{Shift>}{ArrowRight}{/Shift}');
    expect(onSelectionChange).toHaveBeenCalled();
    await expectNoA11yViolations(container);
  });

  it('supports controlled custom offsets and disabled interaction', async () => {
    function Harness() {
      const [selection, setSelection] = useState<HarmonySelection>({ secondary: 70, tertiary: -80 });
      return <HarmonyWheel selection={selection} onSelectionChange={setSelection} disabled />;
    }
    const { getAllByRole, user } = renderWithSpruce(<Harness />);
    const slider = getAllByRole('slider')[1];
    expect(slider).toHaveAttribute('aria-disabled', 'true');
    expect(slider).toHaveAttribute('tabindex', '-1');
    await user.click(slider);
    expect(slider).toHaveAttribute('aria-valuetext', expect.stringContaining('70 degree offset'));
  });
});

describe('T-01 ThemeSwitcher', () => {
  it('offers controlled panel view, density, motion, reset, and apply callbacks', async () => {
    const onViewChange = vi.fn();
    const onDensityChange = vi.fn();
    const onReducedMotionChange = vi.fn();
    const onReset = vi.fn();
    const onApply = vi.fn();
    const { getByRole, user, container } = renderWithSpruce(
      <ThemeSwitcherPanel
        view="grid"
        onViewChange={onViewChange}
        onDensityChange={onDensityChange}
        onReducedMotionChange={onReducedMotionChange}
        onReset={onReset}
        onApply={onApply}
      />,
      { providerProps: { persist: false } },
    );
    await user.click(getByRole('button', { name: 'list view' }));
    expect(onViewChange).toHaveBeenCalledWith('list');
    await user.click(getByRole('radio', { name: /Compact/ }));
    expect(onDensityChange).toHaveBeenCalledWith('dense');
    await user.click(getByRole('switch', { name: 'Reduce motion' }));
    expect(onReducedMotionChange).toHaveBeenCalledWith(true);
    await user.click(getByRole('button', { name: /Reset/ }));
    expect(onReset).toHaveBeenCalled();
    await user.click(getByRole('button', { name: 'Done' }));
    expect(onApply).toHaveBeenCalled();
    await expectNoA11yViolations(container);
  });

  it('supports icon and custom triggers with controlled open state', async () => {
    const onOpenChange = vi.fn();
    const { getByRole, user, rerender } = renderWithSpruce(<ThemeSwitcher trigger="icon" onOpenChange={onOpenChange} />);
    await user.click(getByRole('button', { name: /Appearance:/ }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    rerender(<ThemeSwitcher trigger="custom"><button type="button">Brand settings</button></ThemeSwitcher>);
    expect(getByRole('button', { name: 'Brand settings' })).toBeInTheDocument();
  });
});
