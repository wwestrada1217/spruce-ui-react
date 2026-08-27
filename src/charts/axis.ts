import { niceLinearDomain } from './scales.js';

export function generateTicks(min: number, max: number, count = 5): number[] {
  if (count < 1) return [];
  const [niceMin, niceMax] = niceLinearDomain([min, max], count);
  const step = (niceMax - niceMin) / Math.max(1, count - 1);
  const ticks: number[] = [];
  for (let value = niceMin; value <= niceMax + step * 0.001; value += step) ticks.push(Number(value.toPrecision(12)));
  return ticks;
}

export function formatNumber(value: number, decimals = 0, locale = 'en-US'): string {
  return value.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatCompact(value: number, locale = 'en-US'): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `${(value / 1_000_000_000).toLocaleString(locale, { maximumFractionDigits: 1 })}B`;
  if (abs >= 1_000_000) return `${(value / 1_000_000).toLocaleString(locale, { maximumFractionDigits: 1 })}M`;
  if (abs >= 1_000) return `${(value / 1_000).toLocaleString(locale, { maximumFractionDigits: 1 })}K`;
  if (abs >= 1) return value.toLocaleString(locale, { maximumFractionDigits: 0 });
  if (abs > 0) return value.toPrecision(2);
  return '0';
}

