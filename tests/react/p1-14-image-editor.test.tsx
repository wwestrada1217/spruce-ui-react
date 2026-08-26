import { fireEvent, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ImageEditor } from '../../src/index.js';
import { expectNoA11yViolations, renderWithSpruce, renderWithTheme } from '../utils/test-utils.js';

class MockImage {
  naturalWidth = 640;
  naturalHeight = 480;
  decoding = '';
  crossOrigin: string | null = null;
  private source = '';
  private readonly listeners = new Map<string, EventListener[]>();

  addEventListener(type: string, listener: EventListener): void {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  removeEventListener(type: string, listener: EventListener): void {
    this.listeners.set(type, (this.listeners.get(type) ?? []).filter((item) => item !== listener));
  }

  set src(value: string) {
    this.source = value;
    if (value) queueMicrotask(() => this.listeners.get('load')?.forEach((listener) => listener(new Event('load'))));
  }

  get src(): string {
    return this.source;
  }
}

const context = {
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  scale: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  clip: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  strokeRect: vi.fn(),
  ellipse: vi.fn(),
  fillText: vi.fn(),
  filter: '',
  globalAlpha: 1,
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 1,
  lineCap: 'round',
  lineJoin: 'round',
  font: '',
  textAlign: 'center',
  textBaseline: 'middle',
  shadowColor: '',
  shadowBlur: 0,
};

beforeEach(() => {
  vi.stubGlobal('Image', MockImage);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(
    'data:image/png;base64,aW1hZ2U=',
  );
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockImplementation(function (this: HTMLCanvasElement) {
    return {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: this.width,
      bottom: this.height,
      width: this.width,
      height: this.height,
      toJSON: () => undefined,
    };
  });
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('P1.0-14 ImageEditor parity', () => {
  it('renders the empty editor with localized accessible controls', async () => {
    const view = renderWithSpruce(<ImageEditor />);

    expect(view.getByRole('application', { name: 'Image editor' })).toBeInTheDocument();
    expect(view.getByText('Load an image to start editing.')).toBeInTheDocument();
    expect(view.getByRole('button', { name: 'Image adjustments' })).toHaveAttribute('aria-expanded', 'false');
    expect(view.getByRole('combobox', { name: 'Aspect ratio' })).toBeInTheDocument();
    await expectNoA11yViolations(view.container);
  });

  it('exposes controlled aspect and tool callbacks', async () => {
    const onAspectChange = vi.fn();
    const onToolChange = vi.fn();
    const view = renderWithSpruce(
      <ImageEditor aspect="free" onAspectChange={onAspectChange} onToolChange={onToolChange} />,
    );

    await view.user.selectOptions(view.getByRole('combobox', { name: 'Aspect ratio' }), '4:3');
    await view.user.click(view.getByRole('button', { name: 'Text annotation' }));

    expect(onAspectChange).toHaveBeenCalledWith('4:3');
    expect(onToolChange).toHaveBeenCalledWith('text');
  });

  it('loads images, supports adjustments and emits crop/export payloads', async () => {
    const onChange = vi.fn();
    const onCrop = vi.fn();
    const view = renderWithTheme(
      <ImageEditor src="data:image/png;base64,aW1hZ2U=" format="image/png" onChange={onChange} onCrop={onCrop} />,
      'dark',
      { providerProps: { direction: 'rtl', locale: 'ar' } },
    );

    await waitFor(() => expect(view.container.querySelector('canvas')).toBeInTheDocument());
    expect(document.documentElement).toHaveAttribute('dir', 'rtl');
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    await view.user.click(view.getByRole('button', { name: 'تعديلات الصورة' }));
    expect(view.getByRole('slider', { name: 'Brightness' })).toHaveValue('100');
    await view.user.click(view.getByRole('button', { name: 'تصدير' }));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ format: 'image/png', blob: expect.any(Blob) }));

    await view.user.click(view.getByRole('button', { name: 'اقتصاص' }));
    expect(onCrop).toHaveBeenCalledWith(expect.objectContaining({ selectionShape: 'rectangle' }));
  });

  it('supports pointer selection and one/ten pixel keyboard nudges', async () => {
    const onChange = vi.fn();
    const view = renderWithSpruce(<ImageEditor src="data:image/png;base64,aW1hZ2U=" onChange={onChange} />);
    await waitFor(() => expect(view.container.querySelector('canvas')).toBeInTheDocument());

    const viewport = view.getByRole('application', { name: 'Image editor' });
    fireEvent.pointerDown(viewport, { button: 0, pointerId: 1, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(viewport, { pointerId: 1, clientX: 120, clientY: 100 });
    fireEvent.pointerUp(viewport, { pointerId: 1, clientX: 120, clientY: 100 });
    expect(view.container.querySelector('.sp-image-editor__selection')).toBeInTheDocument();

    viewport.focus();
    fireEvent.keyDown(viewport, { key: 'ArrowRight' });
    fireEvent.keyDown(viewport, { key: 'ArrowDown', shiftKey: true });
    expect(onChange).toHaveBeenCalled();
  });

  it('creates accessible text annotations and reports controlled annotation state', async () => {
    const onAnnotationsChange = vi.fn();
    const view = renderWithSpruce(
      <ImageEditor src="data:image/png;base64,aW1hZ2U=" onAnnotationsChange={onAnnotationsChange} />,
    );
    await waitFor(() => expect(view.container.querySelector('canvas')).toBeInTheDocument());

    await view.user.click(view.getByRole('button', { name: 'Add annotation' }));

    expect(onAnnotationsChange).toHaveBeenCalledWith([
      expect.objectContaining({ kind: 'text', text: 'Note' }),
    ]);
    expect(view.getByRole('button', { name: 'Move annotation: Note' })).toBeInTheDocument();
  });
});
