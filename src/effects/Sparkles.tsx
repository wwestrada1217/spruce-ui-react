import './Sparkles.css';
import { useMemo, type ReactNode } from 'react';

export interface SparklesProps {
  children?: ReactNode;
  color?: string;
  count?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface SparkleItem {
  id: string;
  size: number;
  style: {
    top: string;
    left: string;
  };
}

export function Sparkles({
  children,
  color = '#f59e0b',
  count = 6,
  className = '',
  style,
}: SparklesProps) {
  const sparkles = useMemo<SparkleItem[]>(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: `sparkle-${i}`,
      size: (i * 3) % 12 + 10,
      style: {
        top: `${(i * 17) % 80 + 10}%`,
        left: `${(i * 23) % 80 + 10}%`,
      },
    }));
  }, [count]);

  return (
    <span className={['sp-sparkles-container', className].filter(Boolean).join(' ')} style={style}>
      {sparkles.map((s) => (
        <svg
          key={s.id}
          className="sp-sparkle-icon"
          viewBox="0 0 160 160"
          style={{
            ...s.style,
            width: s.size,
            height: s.size,
          }}
        >
          <path
            fill={color}
            d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
          />
        </svg>
      ))}
      <span className="sp-sparkles-child">{children}</span>
    </span>
  );
}
