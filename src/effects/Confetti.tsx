import './Confetti.css';
import { useEffect, useMemo } from 'react';

export interface ConfettiProps {
  active?: boolean;
  count?: number;
  duration?: number;
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

interface Piece {
  id: number;
  x: number;
  color: string;
  size: number;
  rotation: number;
  duration: number;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function Confetti({
  active = false,
  count = 50,
  duration = 3000,
  onComplete,
  className = '',
  style,
}: ConfettiProps) {
  const pieces = useMemo<Piece[]>(() => {
    if (!active) return [];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: (i * 17) % 100,
      color: COLORS[i % COLORS.length],
      size: (i % 8) + 6,
      rotation: (i * 45) % 360,
      duration: (i % 3) * 0.5 + 1.5,
    }));
  }, [active, count]);

  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [active, duration, onComplete]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className={['sp-confetti-wrap', className].filter(Boolean).join(' ')} style={style}>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="sp-confetti-piece"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size * 1.4,
            transform: `rotate(${p.rotation}deg)`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
