import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
  CylinderChart,
  DiagramEditor,
  FishboneChart,
  GraphChart,
  MapChart,
  PerformanceGraph,
  PyramidChart,
  TinyBar,
  TinyDonut,
  TinyLine,
  TinyPie,
  TinyStacked,
  VennChart,
  WheelDiagram,
  autoLayoutDiagram,
  type DiagramConnector,
  type DiagramShape,
} from '../../src/index.js';
import { expectNoA11yViolations, renderWithSpruce } from '../utils/test-utils.js';

describe('P2-02 missing chart parity', () => {
  it('renders every tiny chart with generated names, native titles, and decorative mode', async () => {
    const { container, getAllByRole } = renderWithSpruce(
      <div>
        <TinyBar data={[1, 2, 3]} config={{ ariaLabel: 'Tiny bars' }} />
        <TinyLine data={[1, 3, 2]} config={{ ariaLabel: 'Tiny line' }} />
        <TinyPie data={[{ label: 'Done', value: 3 }, { label: 'Open', value: 1 }]} config={{ ariaLabel: 'Tiny pie' }} />
        <TinyDonut data={[3, 1]} config={{ ariaLabel: 'Tiny donut' }} />
        <TinyStacked data={[{ label: 'Progress', segments: [{ value: 3 }, { value: 1 }] }]} config={{ ariaLabel: 'Tiny stacked' }} />
      </div>,
    );

    expect(getAllByRole('img')).toHaveLength(5);
    expect(container.querySelectorAll('title').length).toBeGreaterThanOrEqual(5);
    const { container: decorative } = renderWithSpruce(<TinyLine data={[1, 2]} config={{ decorative: true, animate: true }} />);
    expect(decorative.querySelector('svg')).toHaveAttribute('role', 'presentation');
    expect(decorative.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(decorative.querySelector('.sp-tiny__draw, .sp-tiny__grow')).toBeTruthy();
    await expectNoA11yViolations(container);
  });

  it('supports shared chart metadata, labels, and click callbacks across chart additions', async () => {
    const onClick = vi.fn();
    const { container, user } = renderWithSpruce(
      <div>
        <CylinderChart data={[{ label: 'North', value: 8 }]} onDataPointClick={onClick} config={{ animate: false }} />
        <PyramidChart data={[{ label: 'Visitors', value: 10 }]} onDataPointClick={onClick} config={{ animate: false }} />
        <VennChart data={[{ key: 'a', label: 'A' }]} onDataPointClick={onClick} config={{ animate: false }} />
        <WheelDiagram data={[{ label: 'Clarity', iconText: '1' }]} onDataPointClick={onClick} config={{ animate: false }} />
        <MapChart data={{ markers: [{ lat: 0, lng: 0, label: 'Origin', value: 1 }] }} onDataPointClick={onClick} config={{ interactive: false, animate: false }} />
      </div>,
    );

    const points = container.querySelectorAll('[data-chart-point]');
    expect(points.length).toBeGreaterThanOrEqual(5);
    await user.click(points[0]);
    expect(onClick).toHaveBeenCalledWith(expect.objectContaining({ label: expect.any(String) }));
    expect(container.querySelectorAll('[aria-label]').length).toBeGreaterThan(0);
    await expectNoA11yViolations(container);
  });

  it('keeps fishbone and map navigation accessible and resettable', async () => {
    const { container, getByRole, user } = renderWithSpruce(
      <div>
        <FishboneChart effect="Late release" categories={[{ label: 'People', causes: [{ label: 'Training' }] }, { label: 'Process', causes: [{ label: 'Review' }] }]} />
        <MapChart data={{ markers: [{ lat: 10, lng: 10, label: 'Point' }] }} config={{ interactive: true }} />
      </div>,
    );
    expect(getByRole('img', { name: 'Fishbone diagram: Late release' })).toBeInTheDocument();
    const map = container.querySelector('.sp-map__svg') as SVGSVGElement;
    fireEvent.wheel(map, { deltaY: -100 });
    expect(getByRole('button', { name: 'Reset map view' })).toBeInTheDocument();
    await user.click(getByRole('button', { name: 'Reset map view' }));
    expect(container.querySelector('.sp-map__reset')).toBeNull();
    await expectNoA11yViolations(container);
  });

  it('supports graph node activation, trace interaction, and performance defaults', async () => {
    const onNodeClick = vi.fn();
    const nodes = [{ id: 'a', label: 'Alpha' }, { id: 'b', label: 'Beta' }, { id: 'c', label: 'Gamma' }];
    const edges = [{ source: 'a', target: 'b', directed: true }, { source: 'b', target: 'c' }];
    const { container, getAllByRole, user } = renderWithSpruce(
      <div>
        <GraphChart nodes={nodes} edges={edges} onNodeClick={onNodeClick} config={{ layout: 'grid', traceOnHover: true, panEnabled: true }} />
        <PerformanceGraph nodes={nodes} edges={edges} config={{ layout: 'grid' }} />
      </div>,
    );
    const alpha = getAllByRole('button', { name: 'Alpha' })[0];
    await user.click(alpha);
    expect(onNodeClick).toHaveBeenCalledWith('a');
    fireEvent.focus(alpha);
    expect(container.querySelectorAll('.sp-graph-chart__node--trace-active').length).toBeGreaterThan(0);
    await user.keyboard('{Enter}');
    expect(onNodeClick).toHaveBeenCalledTimes(2);
    expect(container.querySelector('.sp-performance-graph')).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('supports diagram selection, keyboard deletion, history, and standalone auto-layout', async () => {
    const shapes: DiagramShape[] = [
      { id: 'a', type: 'rectangle', x: 20, y: 20, width: 100, height: 60, text: 'A' },
      { id: 'b', type: 'diamond', x: 240, y: 20, width: 100, height: 60, text: 'B' },
    ];
    const connectors: DiagramConnector[] = [{ id: 'ab', sourceId: 'a', targetId: 'b', label: 'next' }];
    const onSelection = vi.fn();
    const onShapesChange = vi.fn();
    const { container, getByRole, user } = renderWithSpruce(
      <DiagramEditor shapes={shapes} connectors={connectors} onShapesChange={onShapesChange} onSelectionChange={onSelection} config={{ height: 360 }} />,
    );
    const shape = getByRole('button', { name: 'A' });
    await user.click(shape);
    expect(onSelection).toHaveBeenLastCalledWith({ type: 'shape', id: 'a' });
    await user.keyboard('{Delete}');
    expect(onShapesChange).toHaveBeenLastCalledWith(expect.not.arrayContaining([expect.objectContaining({ id: 'a' })]));
    expect(getByRole('button', { name: 'Undo' })).toBeInTheDocument();
    expect(container.querySelector('[aria-label="Diagram editor"]')).toBeInTheDocument();
    const laidOut = autoLayoutDiagram(shapes, connectors, { direction: 'left-right' });
    expect(laidOut.find((shapeItem) => shapeItem.id === 'a')!.x).toBeLessThan(laidOut.find((shapeItem) => shapeItem.id === 'b')!.x);
    await expectNoA11yViolations(container);
  });
});
