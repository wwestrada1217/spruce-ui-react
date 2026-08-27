import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BarChart, ChartContainer, formatCompact, generateTicks, linearScale } from '../../src/index.js';
import {
  expectNoA11yViolations,
  renderWithSpruce,
} from '../utils/test-utils.js';

describe('P2-01 shared chart kernel', () => {
  it('provides an accessible interactive legend and visibility callbacks', async () => {
    const onLegendClick = vi.fn();
    const onVisibilityChange = vi.fn();
    const { container, getByRole, user } = renderWithSpruce(
      <BarChart
        title="Quarterly results"
        categories={['Q1', 'Q2']}
        series={[{ name: 'Revenue', data: [10, 12] }, { name: 'Cost', data: [6, 7] }]}
        config={{ interactiveLegend: true }}
        onLegendClick={onLegendClick}
        onSeriesVisibilityChange={onVisibilityChange}
      />,
    );

    const revenue = getByRole('button', { name: 'Revenue' });
    expect(revenue).toHaveAttribute('aria-pressed', 'true');
    await user.click(revenue);

    expect(revenue).toHaveAttribute('aria-pressed', 'false');
    expect(container.querySelector('.sp-chart-container')).toHaveAttribute('data-hidden-series-indexes', '0');
    expect(onLegendClick).toHaveBeenLastCalledWith(expect.objectContaining({ label: 'Revenue', hidden: true }));
    expect(onVisibilityChange).toHaveBeenLastCalledWith(['Revenue']);
    await expectNoA11yViolations(container);
  });

  it('supports responsive zoom, pan surface semantics, reset, animation, and localization', async () => {
    const onZoomChange = vi.fn();
    const onZoomReset = vi.fn();
    const { container, getByRole, user } = renderWithSpruce(
      <ChartContainer
        title="Zoomable chart"
        config={{ zoomEnabled: true, maxZoom: 4, animationDuration: 250 }}
        onZoomChange={onZoomChange}
        onZoomReset={onZoomReset}
      >
        <svg role="img" aria-label="Zoomable chart" viewBox="0 0 100 50">
          <rect width="100" height="50" fill="currentColor" />
        </svg>
      </ChartContainer>,
    );

    const body = container.querySelector('.sp-chart-body') as HTMLElement;
    expect(body).toHaveAttribute('aria-label', 'Zoomable chart zoom and pan surface');
    expect(container.querySelector('.sp-chart-content')).toHaveClass('sp-chart-content--animated');
    fireEvent.wheel(body, { deltaY: -100, clientX: 40, clientY: 20 });
    expect(container.querySelector('.sp-chart-container')).toHaveAttribute('data-zoomed', 'true');
    expect(onZoomChange).toHaveBeenCalledWith(expect.objectContaining({ scale: expect.any(Number) }));

    const reset = getByRole('button', { name: 'Reset zoom and pan' });
    await user.click(reset);
    expect(container.querySelector('.sp-chart-container')).toHaveAttribute('data-zoomed', 'false');
    expect(onZoomReset).toHaveBeenCalledWith(expect.objectContaining({ originalEvent: expect.any(Event) }));
  });

  it('uses shared tooltip formatting and normalizes point callback metadata', async () => {
    const onDataPointClick = vi.fn();
    const onDataPointHover = vi.fn();
    const { container, getByRole, user } = renderWithSpruce(
      <BarChart
        categories={['A']}
        series={[{ name: 'Revenue', data: [10] }]}
        config={{ tooltip: { formatValue: (value) => `value=${value}` } }}
        onDataPointClick={onDataPointClick}
        onDataPointHover={onDataPointHover}
      />,
    );

    const bar = container.querySelector('[data-chart-point]') as SVGRectElement;
    fireEvent.mouseEnter(bar);
    expect(getByRole('tooltip')).toHaveTextContent('value=10');
    await user.click(bar);
    expect(onDataPointClick).toHaveBeenLastCalledWith(expect.objectContaining({ label: 'A', seriesName: 'Revenue', value: 10, index: 0 }));
    expect(onDataPointHover).toHaveBeenCalledWith(expect.objectContaining({ label: 'A', seriesName: 'Revenue' }));
  });

  it('refreshes the harmony palette through the theme revision contract', () => {
    const { container } = renderWithSpruce(
      <BarChart
        categories={['A', 'B']}
        series={[{ name: 'Revenue', data: [10, 12] }, { name: 'Cost', data: [6, 7] }]}
        config={{ palette: 'harmony', animate: false }}
      />,
      { providerProps: { defaultAccentHarmony: 'triadic', persist: false } },
    );

    const chart = container.querySelector('.sp-chart-container');
    expect(chart).toHaveAttribute('data-theme-revision');
    expect(container.querySelector('.sp-chart-content')).not.toHaveClass('sp-chart-content--animated');
    expect(container.querySelectorAll('[data-chart-series-index]').length).toBeGreaterThan(1);
  });

  it('keeps shared axis math and visual token output deterministic', () => {
    expect(generateTicks(0, 100, 5)).toEqual([0, 25, 50, 75, 100]);
    expect(formatCompact(1250)).toBe('1.3K');
    const scale = linearScale([0, 10], [20, 120]);
    expect(scale(5)).toBe(70);
    expect(scale.invert(70)).toBe(5);

    const { container } = renderWithSpruce(
      <BarChart title="Token chart" categories={['A']} series={[{ name: 'Value', data: [5] }]} config={{ animate: false, showAxes: false, showLabels: false }} />,
    );
    const chart = container.querySelector('.sp-chart-container');
    expect(chart).toHaveStyle({ '--sp-chart-animation-duration': '600ms' });
    expect(chart).toHaveAttribute('data-show-axes', 'false');
    expect(chart).toHaveAttribute('data-show-labels', 'false');
  });
});
