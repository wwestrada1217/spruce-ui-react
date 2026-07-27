import './SignaturePad.css';
import { useRef, useState, useEffect } from 'react';
import { Button } from '../button/Button.js';

export interface SignaturePadProps {
  width?: number;
  height?: number;
  penColor?: string;
  penWidth?: number;
  onChange?: (dataUrl: string | null) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function SignaturePad({
  width = 400,
  height = 180,
  penColor = '#0f766e',
  penWidth = 2,
  onChange,
  className = '',
  style,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [penColor, penWidth]);

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    setIsDrawing(true);
    setIsEmpty(false);
    draw(e);
  }

  function stopDrawing() {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas && ctxRefCurrent()) {
      ctxRefCurrent()?.beginPath();
      if (onChange) onChange(canvas.toDataURL());
    }
  }

  function ctxRefCurrent() {
    return canvasRef.current?.getContext('2d');
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = ctxRefCurrent();
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = ctxRefCurrent();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    setIsEmpty(true);
    if (onChange) onChange(null);
  }

  return (
    <div className={['sp-signature-pad', className].filter(Boolean).join(' ')} style={style}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="sp-signature-canvas"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
      />
      <div className="sp-signature-actions">
        <Button variant="outline" size="sm" onClick={handleClear} disabled={isEmpty}>
          Clear Signature
        </Button>
      </div>
    </div>
  );
}
