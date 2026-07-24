/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { useMemo } from 'react';
import './CreditCard.css';

export type CardColor = 'dark' | 'blue' | 'purple' | 'green' | 'gold' | 'red';

const COLOR_GRADIENTS: Record<CardColor, string> = {
  dark: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  blue: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)',
  purple: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)',
  green: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #34d399 100%)',
  gold: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #fbbf24 100%)',
  red: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 50%, #f87171 100%)',
};

export interface CreditCardProps {
  /** Card number */
  number?: string;
  /** Cardholder name */
  holderName?: string;
  /** Expiration date */
  expiry?: string;
  /** Card color theme */
  color?: CardColor;
  /** Card network logo */
  network?: 'visa' | 'mastercard' | 'amex' | 'discover' | '';
  /** Show contactless icon */
  contactless?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Inline style overrides */
  style?: React.CSSProperties;
}

export function CreditCard({
  number = '**** **** **** ****',
  holderName = 'CARD HOLDER',
  expiry = 'MM/YY',
  color = 'dark',
  network = '',
  contactless = true,
  className = '',
  style,
}: CreditCardProps) {
  const gradient = COLOR_GRADIENTS[color] ?? COLOR_GRADIENTS['dark'];

  const numberGroups = useMemo(() => {
    const num = number.replace(/\s+/g, '');
    const groups: string[] = [];
    for (let i = 0; i < num.length; i += 4) {
      groups.push(num.slice(i, i + 4));
    }
    return groups.length ? groups : ['****', '****', '****', '****'];
  }, [number]);

  const lastFour = useMemo(() => {
    const num = number.replace(/[\s*]/g, '');
    return num.slice(-4) || '****';
  }, [number]);

  const rootClasses = ['sp-credit-card', className].filter(Boolean).join(' ');

  return (
    <div
      className={rootClasses}
      style={{ ...style, background: gradient }}
      role="img"
      aria-label={`Credit card ending in ${lastFour}`}
    >
      {/* Chip & contactless */}
      <div className="sp-credit-card__top">
        <div className="sp-credit-card__chip">
          <div className="sp-credit-card__chip-line" />
          <div className="sp-credit-card__chip-line" />
          <div className="sp-credit-card__chip-line" />
        </div>
        {contactless && (
          <svg
            className="sp-credit-card__contactless"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <path d="M6 18.5a9 9 0 0 1 0-13" />
            <path d="M10 15.5a5 5 0 0 1 0-7" />
            <path d="M14 12.5a1 1 0 0 1 0-1" />
          </svg>
        )}
      </div>

      {/* Card number */}
      <div className="sp-credit-card__number">
        {numberGroups.map((group, i) => (
          <span key={i}>{group}</span>
        ))}
      </div>

      {/* Bottom row */}
      <div className="sp-credit-card__bottom">
        <div className="sp-credit-card__info">
          <span className="sp-credit-card__label">Card Holder</span>
          <span className="sp-credit-card__value">{holderName}</span>
        </div>
        <div className="sp-credit-card__info sp-credit-card__info--right">
          <span className="sp-credit-card__label">Expires</span>
          <span className="sp-credit-card__value">{expiry}</span>
        </div>
        {network && (
          <div className="sp-credit-card__network">
            {network === 'visa' && (
              <span className="sp-credit-card__network-text sp-credit-card__network-text--visa">
                VISA
              </span>
            )}
            {network === 'mastercard' && (
              <svg className="sp-credit-card__network-logo" viewBox="0 0 40 24">
                <circle cx="14" cy="12" r="10" fill="#eb001b" opacity={0.8} />
                <circle cx="26" cy="12" r="10" fill="#f79e1b" opacity={0.8} />
              </svg>
            )}
            {network === 'amex' && (
              <span className="sp-credit-card__network-text sp-credit-card__network-text--amex">
                AMEX
              </span>
            )}
            {network === 'discover' && (
              <span className="sp-credit-card__network-text sp-credit-card__network-text--discover">
                DISCOVER
              </span>
            )}
          </div>
        )}
      </div>

      {/* Holographic shimmer overlay */}
      <div className="sp-credit-card__shimmer" />
    </div>
  );
}
