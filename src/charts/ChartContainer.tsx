/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import './ChartContainer.css';
import type { ReactNode } from 'react';
import type { ChartLegendPosition, ChartTooltipData } from './types.js';

export interface LegendItem {
  label: string;
  color: string;
}

export interface ChartContainerProps {
  title?: string;
  subtitle?: string;
  legend?: LegendItem[];
  legendPosition?: ChartLegendPosition;
  tooltip?: ChartTooltipData | null;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

export function ChartContainer({
  title,
  subtitle,
  legend,
  legendPosition = 'top',
  tooltip,
  height = 300,
  className,
  style,
  children,
}: ChartContainerProps) {
  const rootCls = ['sp-chart-container', className].filter(Boolean).join(' ');

  const renderLegend = () => {
    if (!legend || legend.length === 0) return null;
    return (
      <div className={`sp-chart-legend sp-chart-legend--${legendPosition}`}>
        {legend.map((item, idx) => (
          <div key={idx} className="sp-chart-legend-item">
            <span className="sp-chart-legend-dot" style={{ backgroundColor: item.color }} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={rootCls} style={style}>
      {(title || subtitle) && (
        <div className="sp-chart-header">
          {title && <h3 className="sp-chart-title">{title}</h3>}
          {subtitle && <p className="sp-chart-subtitle">{subtitle}</p>}
        </div>
      )}

      {legendPosition === 'top' && renderLegend()}

      <div className="sp-chart-body" style={{ height: typeof height === 'number' ? `${height}px` : height }}>
        {children}

        {tooltip && (
          <div
            className="sp-chart-tooltip"
            style={{
              left: `${tooltip.x ?? 0}px`,
              top: `${tooltip.y ?? 0}px`,
            }}
          >
            {tooltip.seriesName ? (
              <>
                <div className="sp-chart-tooltip-header">{tooltip.label}</div>
                <div className="sp-chart-tooltip-body">
                  {tooltip.color && (
                    <span
                      className="sp-chart-tooltip-badge"
                      style={{ backgroundColor: tooltip.color }}
                    />
                  )}
                  <span>{tooltip.seriesName}: <strong>{tooltip.value}</strong></span>
                </div>
              </>
            ) : (
              <div className="sp-chart-tooltip-body">
                {tooltip.color && (
                  <span
                    className="sp-chart-tooltip-badge"
                    style={{ backgroundColor: tooltip.color }}
                  />
                )}
                <span>{tooltip.label}: <strong>{tooltip.value}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>

      {legendPosition === 'bottom' && renderLegend()}
    </div>
  );
}
