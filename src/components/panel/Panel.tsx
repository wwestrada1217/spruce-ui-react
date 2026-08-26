/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { CSSProperties, ReactNode } from 'react';
import './Panel.css';
import type { Border, Chrome, Elevation, Radius } from '../../chrome/chrome.js';
import {
  Motif,
  type SpDecorativeBackground,
  type SpMotifAppearanceOption,
  type SpMotifPosition,
} from '../motif/Motif.js';

export type PanelVariant = 'default' | 'outlined' | 'elevated' | 'filled' | 'ghost' | 'flush';
export type PanelPadding = 'none' | 'sm' | 'md' | 'lg';

export interface PanelProps {
  variant?: PanelVariant;
  /** Preferred surface treatment. Defaults to the legacy variant value. */
  chrome?: Chrome;
  radius?: Radius;
  border?: Border;
  elevation?: Elevation;
  padding?: PanelPadding;
  height?: string;
  maxHeight?: string;
  minHeight?: string;
  header?: ReactNode;
  footer?: ReactNode;
  backgroundMotif?: SpDecorativeBackground['motif'];
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
  className?: string;
  style?: CSSProperties;
}

export function Panel({
  variant = 'default',
  chrome,
  radius,
  border,
  elevation,
  padding = 'md',
  height,
  maxHeight,
  minHeight,
  header,
  footer,
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
  className = '',
  style: styleProp,
}: PanelProps) {
  const effectiveChrome = chrome ?? variant;
  const hasMotif = Boolean(
    backgroundMotif || motifIcon || motifSvg || decorativeBackground?.motif ||
      decorativeBackground?.icon || decorativeBackground?.svg,
  );
  const classes = [
    'sp-panel',
    variant !== 'default' && `sp-panel--${variant}`,
    `sp-chrome--${effectiveChrome}`,
    radius && `sp-radius--${radius}`,
    border && `sp-border--${border}`,
    elevation && `sp-elevation--${elevation}`,
    padding !== 'md' && `sp-panel--pad-${padding}`,
    hasMotif && 'sp-panel--has-motif',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const style: CSSProperties = { ...styleProp };
  if (height) style.height = height;
  if (maxHeight) style.maxHeight = maxHeight;
  if (minHeight) style.minHeight = minHeight;

  return (
    <div className={classes} style={Object.keys(style).length > 0 ? style : undefined}>
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
      {header && <div className="sp-panel__header">{header}</div>}
      <div className="sp-panel__body">{children}</div>
      {footer && <div className="sp-panel__footer">{footer}</div>}
    </div>
  );
}
