import React from 'react';
import './PasswordProgress.css';

export type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';

export interface PasswordProgressProps {
  password?: string;
  showLabel?: boolean;
  className?: string;
}

function computeScore(pw: string): number {
  let count = 0;
  if (pw.length >= 8) count++;
  if (/[A-Z]/.test(pw)) count++;
  if (/[a-z]/.test(pw)) count++;
  if (/[0-9]/.test(pw)) count++;
  if (/[^A-Za-z0-9]/.test(pw)) count++;
  return count;
}

function getStrength(score: number): PasswordStrength {
  if (score <= 1) return 'weak';
  if (score === 2) return 'fair';
  if (score === 3) return 'good';
  return 'strong';
}

function getColor(strength: PasswordStrength): string {
  switch (strength) {
    case 'weak':   return 'var(--sp-danger, #dc2626)';
    case 'fair':   return 'var(--sp-warning, #d97706)';
    case 'good':   return 'var(--sp-info, #0891b2)';
    case 'strong': return 'var(--sp-success, #16a34a)';
  }
}

export function PasswordProgress({
  password = '',
  showLabel = true,
  className,
}: PasswordProgressProps) {
  const score = computeScore(password);
  const strength = getStrength(score);
  const color = getColor(strength);

  return (
    <div className={['sp-password-progress', className].filter(Boolean).join(' ')}>
      <div className="sp-password__bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={['sp-password__bar', score >= i ? 'sp-password__bar--filled' : ''].filter(Boolean).join(' ')}
            style={score >= i ? { background: color } : undefined}
          />
        ))}
      </div>
      {showLabel && (
        <span className="sp-password__label" style={{ color }}>{strength}</span>
      )}
    </div>
  );
}
