export interface LinearScale {
  (value: number): number;
  domain: [number, number];
  range: [number, number];
  invert: (pixel: number) => number;
  ticks: (count?: number) => number[];
}

export function linearScale(domain: [number, number], range: [number, number]): LinearScale {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const domainSpan = d1 - d0 || 1;
  const rangeSpan = r1 - r0 || 1;
  const scale = ((value: number) => r0 + ((value - d0) / domainSpan) * (r1 - r0)) as LinearScale;
  scale.domain = domain;
  scale.range = range;
  scale.invert = (pixel) => d0 + ((pixel - r0) / rangeSpan) * domainSpan;
  scale.ticks = (count = 5) => {
    const [min, max] = niceLinearDomain(domain, count);
    const step = (max - min) / Math.max(1, count - 1);
    const ticks: number[] = [];
    for (let value = min; value <= max + step * 0.001; value += step) ticks.push(Number(value.toPrecision(12)));
    return ticks;
  };
  return scale;
}

export interface BandScale {
  (label: string): number;
  domain: string[];
  range: [number, number];
  bandwidth: () => number;
  step: () => number;
}

export function bandScale(domain: string[], range: [number, number], padding = 0.1, innerPadding = 0.2): BandScale {
  const [r0, r1] = range;
  const step = (r1 - r0) / Math.max(1, domain.length - innerPadding + padding * 2);
  const bandwidth = step * (1 - innerPadding);
  const positions = new Map(domain.map((label, index) => [label, r0 + step * (padding + index)]));
  const scale = ((label: string) => positions.get(label) ?? r0) as BandScale;
  scale.domain = domain;
  scale.range = range;
  scale.bandwidth = () => bandwidth;
  scale.step = () => step;
  return scale;
}

export function niceLinearDomain(domain: [number, number], tickCount = 5): [number, number] {
  let [lo, hi] = domain;
  if (lo === hi) { if (lo === 0) return [0, 1]; lo *= lo < 0 ? 1.1 : 0.9; hi *= hi < 0 ? 0.9 : 1.1; }
  const span = niceNumber(hi - lo, false);
  const step = niceNumber(span / Math.max(1, tickCount - 1), true);
  return [Math.floor(lo / step) * step, Math.ceil(hi / step) * step];
}

function niceNumber(value: number, round: boolean): number {
  if (value === 0) return 1;
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const fraction = value / 10 ** exponent;
  const nice = round ? (fraction < 1.5 ? 1 : fraction < 3 ? 2 : fraction < 7 ? 5 : 10) : (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10);
  return nice * 10 ** exponent;
}
