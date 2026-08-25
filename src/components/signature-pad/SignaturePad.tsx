import './SignaturePad.css';
import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef, useState, type PointerEvent } from 'react';
import { useI18n } from '../../i18n/i18n-context.js';
import { useFormFieldContext } from '../field/FormFieldContext.js';
import { firstFormError, type FormBorder, type FormChrome, type FormRadius, type FormValidationError } from '../field/form-types.js';

export interface SignaturePadHandle {
  clear: () => void;
  toDataURL: () => string | null;
}

export interface SignaturePadProps {
  value?: string | null;
  onChange?: (dataUrl: string | null) => void;
  color?: string;
  brushSize?: number;
  onColorChange?: (color: string) => void;
  onBrushSizeChange?: (size: number) => void;
  penColor?: string;
  penWidth?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  invalid?: boolean;
  errors?: readonly FormValidationError[];
  required?: boolean;
  error?: string;
  hint?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  chrome?: FormChrome;
  radius?: FormRadius;
  border?: FormBorder;
  className?: string;
  style?: React.CSSProperties;
}

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(function SignaturePad({
  value: controlledValue,
  onChange,
  color,
  brushSize,
  onColorChange,
  onBrushSizeChange,
  penColor,
  penWidth,
  backgroundColor = '#ffffff',
  width = 400,
  height = 180,
  disabled = false,
  readOnly = false,
  hidden = false,
  invalid,
  errors,
  required = false,
  error,
  hint,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  chrome = 'default',
  radius,
  border = 'default',
  className = '',
  style,
}, ref) {
  const { t } = useI18n();
  const field = useFormFieldContext();
  const instanceId = useId().replace(/:/g, '');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [internalValue, setInternalValue] = useState<string | null>(null);
  const [internalColor, setInternalColor] = useState(penColor ?? '#000000');
  const [internalBrushSize, setInternalBrushSize] = useState(penWidth ?? 2);
  const currentColor = color ?? penColor ?? internalColor;
  const currentBrushSize = brushSize ?? penWidth ?? internalBrushSize;
  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const effectiveDisabled = disabled || Boolean(field?.disabled);
  const effectiveReadOnly = readOnly || Boolean(field?.readOnly);
  const effectiveHidden = hidden || Boolean(field?.hidden);
  const errorMessage = firstFormError(errors || field?.errors, error);
  const hasError = Boolean(errorMessage) || Boolean(invalid ?? field?.invalid);
  const effectiveRequired = required || Boolean(field?.required);
  const effectiveHint = hint || field?.hint;
  const errorId = `sp-signature-${instanceId}-error`;
  const hintId = `sp-signature-${instanceId}-hint`;
  const describedBy = ariaDescribedBy || field?.describedBy || (errorMessage ? errorId : effectiveHint ? hintId : undefined);

  const context = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return { canvas, ctx: canvas.getContext('2d'), scaleX: canvas.width / rect.width, scaleY: canvas.height / rect.height, rect };
  };
  const emitValue = useCallback((next: string | null) => {
    if (controlledValue === undefined) setInternalValue(next);
    onChange?.(next);
  }, [controlledValue, onChange]);
  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    emitValue(null);
  }, [emitValue]);
  const toDataURL = useCallback(() => {
    const canvas = canvasRef.current;
    return canvas && currentValue !== null ? canvas.toDataURL() : null;
  }, [currentValue]);
  useImperativeHandle(ref, () => ({ clear, toDataURL }), [clear, toDataURL]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentBrushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [currentBrushSize, currentColor]);

  useEffect(() => {
    if (!currentValue) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const image = new Image();
    image.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(image, 0, 0, canvas.width, canvas.height); };
    image.src = currentValue;
  }, [currentValue]);

  function start(event: PointerEvent<HTMLCanvasElement>) {
    if (effectiveDisabled || effectiveReadOnly) return;
    const data = context();
    if (!data?.ctx) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawing.current = true;
    const x = (event.clientX - data.rect.left) * data.scaleX;
    const y = (event.clientY - data.rect.top) * data.scaleY;
    data.ctx.beginPath();
    data.ctx.moveTo(x, y);
  }
  function move(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const data = context();
    if (!data?.ctx) return;
    data.ctx.lineTo((event.clientX - data.rect.left) * data.scaleX, (event.clientY - data.rect.top) * data.scaleY);
    data.ctx.stroke();
  }
  function end(event: PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    drawing.current = false;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
    emitValue(canvasRef.current?.toDataURL() ?? null);
  }
  function setColor(next: string) {
    if (color === undefined && penColor === undefined) setInternalColor(next);
    onColorChange?.(next);
  }
  function setSize(next: number) {
    if (brushSize === undefined && penWidth === undefined) setInternalBrushSize(next);
    onBrushSizeChange?.(next);
  }

  if (effectiveHidden) return null;
  const classes = ['sp-signature-pad', `sp-signature-pad--chrome-${chrome}`,
    radius && `sp-signature-pad--radius-${radius}`, border && `sp-signature-pad--border-${border}`,
    effectiveDisabled && 'sp-signature-pad--disabled', effectiveReadOnly && 'sp-signature-pad--readonly',
    hasError && 'sp-signature-pad--invalid', className].filter(Boolean).join(' ');
  return (
    <div className={classes} style={style}>
      <div className="sp-signature-pad__toolbar" role="toolbar" aria-label={t('signatureDrawingTools')}>
        <label className="sp-signature-pad__tool-label" htmlFor={`${instanceId}-color`}>{t('color')}</label>
        <input id={`${instanceId}-color`} className="sp-signature-pad__color-input" type="color" value={currentColor}
          disabled={effectiveDisabled || effectiveReadOnly} aria-label={t('color')} onChange={(event) => setColor(event.target.value)} />
        <label className="sp-signature-pad__tool-label" htmlFor={`${instanceId}-size`}>{t('size')}</label>
        <input id={`${instanceId}-size`} className="sp-signature-pad__size-slider" type="range" min="1" max="20" step="0.5"
          value={currentBrushSize} disabled={effectiveDisabled || effectiveReadOnly} aria-label={`${t('size')} ${currentBrushSize}px`}
          onChange={(event) => setSize(Number(event.target.value))} />
        <span className="sp-signature-pad__size-value" aria-hidden="true">{currentBrushSize}px</span>
        <span className="sp-signature-pad__tool-spacer" />
        <button className="sp-signature-pad__clear" type="button" onClick={clear}
          disabled={effectiveDisabled || effectiveReadOnly || !currentValue} aria-label={t('clearSignature')}>{t('clear')}</button>
      </div>
      <div className="sp-signature-pad__canvas-wrap">
        <canvas ref={canvasRef} width={width} height={height} className="sp-signature-pad__canvas" role="img"
          aria-label={ariaLabel || t('signatureDrawingArea')} aria-labelledby={ariaLabelledBy || undefined}
          aria-describedby={describedBy} aria-invalid={hasError || undefined} aria-required={effectiveRequired || undefined}
          style={{ backgroundColor }} onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} />
        {!currentValue && <span className="sp-signature-pad__placeholder" aria-hidden="true">{t('signHere')}</span>}
      </div>
      {errorMessage && <p className="sp-signature-pad__error" role="alert" id={errorId}>{errorMessage}</p>}
      {!errorMessage && effectiveHint && <p className="sp-signature-pad__hint" id={hintId}>{effectiveHint}</p>}
    </div>
  );
});
