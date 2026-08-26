/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './Alert.css';
import { useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { useI18n } from '../../i18n/i18n-context.js';
import {
  Motif,
  type SpDecorativeBackground,
  type SpMotifAppearanceOption,
  type SpMotifPosition,
} from '../motif/Motif.js';
import type { SpMotifName } from '../motif/motif-definitions.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';
export type AlertSize = 'sm' | 'md';

export interface AlertProps {
  variant?: AlertVariant;
  size?: AlertSize;
  title?: string;
  dismissible?: boolean;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
  backgroundMotif?: SpMotifName;
  motifIcon?: string;
  motifSvg?: string;
  motifPosition?: SpMotifPosition;
  motifSize?: number | string;
  motifOpacity?: number;
  motifRotation?: number;
  motifOffsetX?: number | string;
  motifOffsetY?: number | string;
  motifAppearance?: SpMotifAppearanceOption;
  motifColor?: string;
  decorativeBackground?: SpDecorativeBackground;
  children?: ReactNode;
}

function iconNameForVariant(variant: AlertVariant): string {
  switch (variant) {
    case 'success': return 'check-circle';
    case 'warning': return 'alert-triangle';
    case 'danger': return 'alert-circle';
    default: return 'info';
  }
}

export function Alert({
  variant = 'info',
  size = 'md',
  title = '',
  dismissible = false,
  onClose,
  className = '',
  style,
  backgroundMotif,
  motifIcon,
  motifSvg,
  motifPosition,
  motifSize,
  motifOpacity,
  motifRotation,
  motifOffsetX,
  motifOffsetY,
  motifAppearance,
  motifColor,
  decorativeBackground,
  children,
}: AlertProps) {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useI18n();

  if (dismissed) return null;

  const hasMotif = Boolean(
    backgroundMotif || motifIcon || motifSvg || decorativeBackground?.motif ||
      decorativeBackground?.icon || decorativeBackground?.svg,
  );
  const classes = [
    'sp-alert',
    `sp-alert--${variant}`,
    size !== 'md' && `sp-alert--${size}`,
    !title && 'sp-alert--no-title',
    hasMotif && 'sp-alert--has-motif',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  function handleDismiss() {
    setDismissed(true);
    onClose?.();
  }

  return (
    <div className={classes} role="alert" style={style}>
      {hasMotif && (
        <Motif
          config={decorativeBackground}
          motif={backgroundMotif}
          icon={motifIcon}
          svg={motifSvg}
          position={motifPosition}
          size={motifSize}
          opacity={motifOpacity}
          rotation={motifRotation}
          offsetX={motifOffsetX}
          offsetY={motifOffsetY}
          appearance={motifAppearance}
          color={motifColor}
        />
      )}
      <Icon name={iconNameForVariant(variant)} size={18} className="sp-alert__icon" />
      <div className="sp-alert__body">
        {title && <div className="sp-alert__title">{title}</div>}
        <div className="sp-alert__message">{children}</div>
      </div>
      {dismissible && (
        <button type="button" className="sp-alert__close" aria-label={t('dismiss')} onClick={handleDismiss}>
          <Icon name="x" size={14} />
        </button>
      )}
    </div>
  );
}
