/*
 * Copyright (c) 2026-2027 Sprucestack. All Rights Reserved.
 * The term "Sprucestack" refers to Sprucestack Inc. and/or its subsidiaries.
 * This software is released under Apache license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export interface ChartDataItem {
  label: string;
  value: number;
  color?: string;
  [key: string]: unknown;
}

export interface ChartSeries {
  name: string;
  data: number[] | ChartDataItem[];
  color?: string;
}

export type ChartLegendPosition = 'top' | 'bottom' | 'left' | 'right';

export interface ChartTooltipData {
  label: string;
  value: number | string;
  color?: string;
  seriesName?: string;
  x?: number;
  y?: number;
}

export const DEFAULT_CHART_COLORS = [
  '#0f766e', // Spruce Teal
  '#0284c7', // Sky Blue
  '#d97706', // Amber
  '#7c3aed', // Violet
  '#dc2626', // Red
  '#16a34a', // Emerald
  '#ea580c', // Orange
  '#2563eb', // Indigo
];
