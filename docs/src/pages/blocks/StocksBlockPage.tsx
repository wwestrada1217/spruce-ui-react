import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  CandlestickChart,
  Icon,
  Sparkline,
  useReducedMotion,
} from 'spruce-react';
import type { CandlestickDataItem } from 'spruce-react';
import { CodePreview } from '../../components/CodePreview';
import { BlockPageLayout, type BlockPageSection } from './BlockPageLayout';

export type StockPeriod = '1W' | '1M' | '3M' | 'YTD';

export interface StockCandle extends CandlestickDataItem {
  readonly volume: number;
}

export interface StockTicker {
  readonly symbol: string;
  readonly name: string;
  readonly exchange: string;
  readonly price: number;
  readonly change: number;
  readonly changePct: number;
  readonly spark: readonly number[];
  readonly candles: readonly StockCandle[];
  readonly stats: readonly { label: string; value: string }[];
}

export interface MarketIndex {
  readonly label: string;
  readonly value: string;
  readonly change: string;
  readonly up: boolean;
}

const SECTIONS: readonly BlockPageSection[] = [
  { id: 'full', label: 'Full App' },
  { id: 'ticker-strip', label: 'Ticker Strip' },
  { id: 'stock-card', label: 'Stock Cards' },
  { id: 'code', label: 'Source Code' },
];

const MARKET_CAP: Readonly<Record<string, string>> = {
  AAPL: '2.93T',
  MSFT: '3.07T',
  GOOGL: '2.18T',
  TSLA: '782B',
  NVDA: '2.15T',
};

const RAW_TICKERS = [
  { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', price: 189.45, change: 2.34, changePct: 1.25, seed: 101 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', exchange: 'NASDAQ', price: 412.87, change: 5.12, changePct: 1.26, seed: 202 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', price: 178.23, change: -0.87, changePct: -0.49, seed: 303 },
  { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', price: 245.67, change: 8.43, changePct: 3.55, seed: 404 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', exchange: 'NASDAQ', price: 875.4, change: 16.7, changePct: 1.94, seed: 505 },
] as const;

const INDICES: readonly MarketIndex[] = [
  { label: 'S&P 500', value: '5,234.18', change: '0.82', up: true },
  { label: 'NASDAQ', value: '16,421.05', change: '1.14', up: true },
  { label: 'DOW', value: '39,127.80', change: '0.52', up: true },
  { label: 'VIX', value: '14.23', change: '3.10', up: false },
];

function lcg(seed: number): () => number {
  let value = (seed ^ 0x12345678) >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function generateCandles(base: number, count: number, seed: number): StockCandle[] {
  const random = lcg(seed);
  const candles: StockCandle[] = [];
  let price = base;
  let offset = 0;
  for (let index = 0; index < count; index += 1) {
    let date: Date;
    do {
      date = new Date(2025, 6, 1 + offset);
      offset += 1;
    } while (date.getDay() === 0 || date.getDay() === 6);
    const open = Number(price.toFixed(2));
    const move = (random() - 0.485) * 0.024 + 0.0003;
    const close = Number((price * (1 + move)).toFixed(2));
    const high = Number((Math.max(open, close) * (1 + random() * 0.008)).toFixed(2));
    const low = Number((Math.min(open, close) * (1 - random() * 0.008)).toFixed(2));
    candles.push({
      x: `${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}`,
      open,
      close,
      high,
      low,
      volume: Math.floor((random() * 0.55 + 0.45) * 68_000_000),
    });
    price = close;
  }
  return candles;
}

function generateSparkline(count: number, seed: number): number[] {
  const random = lcg(seed);
  let value = 100;
  return Array.from({ length: count }, () => {
    value *= 1 + (random() - 0.483) * 0.022;
    return Number(value.toFixed(2));
  });
}

function formatVolume(value: number): string {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
  return String(value);
}

// This deterministic builder is exported for docs/test reuse alongside the block.
// eslint-disable-next-line react-refresh/only-export-components
export function buildStockTickers(): StockTicker[] {
  return RAW_TICKERS.map((raw) => {
    const candles = generateCandles(raw.price * 0.87, 90, raw.seed);
    const last = candles[candles.length - 1];
    const highs = candles.map((candle) => candle.high);
    const lows = candles.map((candle) => candle.low);
    const averageVolume = Math.round(candles.reduce((total, candle) => total + candle.volume, 0) / candles.length);
    return {
      symbol: raw.symbol,
      name: raw.name,
      exchange: raw.exchange,
      price: raw.price,
      change: raw.change,
      changePct: raw.changePct,
      spark: generateSparkline(30, raw.seed + 1),
      candles,
      stats: [
        { label: 'Open', value: `$${last.open.toFixed(2)}` },
        { label: 'High', value: `$${last.high.toFixed(2)}` },
        { label: 'Low', value: `$${last.low.toFixed(2)}` },
        { label: 'Close', value: `$${last.close.toFixed(2)}` },
        { label: '52W High', value: `$${Math.max(...highs).toFixed(2)}` },
        { label: '52W Low', value: `$${Math.min(...lows).toFixed(2)}` },
        { label: 'Avg Vol', value: formatVolume(averageVolume) },
        { label: 'Mkt Cap', value: MARKET_CAP[raw.symbol] },
      ],
    };
  });
}

const STOCKS_CODE = `import { Badge, Button, CandlestickChart, Sparkline } from 'spruce-react';

<button
  type="button"
  aria-pressed={selectedSymbol === ticker.symbol}
  onClick={() => setSelectedSymbol(ticker.symbol)}
>
  {ticker.symbol} · {ticker.price.toFixed(2)}
  <Sparkline data={ticker.spark} ariaLabel={ticker.symbol + ' trend'} />
</button>

<CandlestickChart
  data={selected.candles.slice(-periodSlice[period])}
  ariaLabel={selected.symbol + ' price history'}
  config={{ animate: false, showGrid: true }}
/>`;

export function StocksBlockPage() {
  const reducedMotion = useReducedMotion();
  const tickers = useMemo(() => buildStockTickers(), []);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [period, setPeriod] = useState<StockPeriod>('1M');
  const periodSlice: Record<StockPeriod, number> = { '1W': 5, '1M': 22, '3M': 66, YTD: 90 };
  const selected = tickers.find((ticker) => ticker.symbol === selectedSymbol) ?? tickers[0];
  const chartData: CandlestickDataItem[] = selected.candles.slice(-periodSlice[period]);

  return (
    <BlockPageLayout
      title="Stocks App"
      description="A financial markets dashboard with a live ticker strip, full OHLCV candlestick chart, period controls, and a watchlist sidebar — all built from Spruce charts and components."
      sections={SECTIONS}
    >
      <section id="full" className="demo-section" aria-labelledby="stocks-full-heading">
        <h2 id="stocks-full-heading">Full App</h2>
        <div className="sp-block-frame sp-block-stocks">
          <div className="sp-block-stocks__header">
            <div className="sp-block-stocks__brand"><Icon name="trending-up" size={16} aria-hidden="true" /><span>MarketsView</span></div>
            <Badge variant="success" size="sm">● Market Open</Badge>
            <div className="sp-block-stocks__market-time"><Icon name="clock" size={13} aria-hidden="true" /><span>NYSE · Apr 10, 2026 · 14:32 EST</span></div>
          </div>

          <div className="sp-block-stocks__ticker-strip" role="list" aria-label="Stock tickers">
            {tickers.map((ticker) => (
              <div key={ticker.symbol} role="listitem">
                <button type="button" className="sp-block-stocks__ticker" aria-pressed={selectedSymbol === ticker.symbol} aria-label={`${ticker.symbol} $${ticker.price.toFixed(2)} ${ticker.changePct >= 0 ? 'up' : 'down'} ${ticker.changePct.toFixed(2)} percent`} onClick={() => setSelectedSymbol(ticker.symbol)}>
                  <span className="sp-block-stocks__ticker-info"><span className="sp-block-stocks__symbol">{ticker.symbol}</span><span className="sp-block-stocks__price">${ticker.price.toFixed(2)}</span><span className={`sp-block-stocks__ticker-pct ${ticker.changePct >= 0 ? 'sp-block-stocks__up' : 'sp-block-stocks__down'}`}>{ticker.changePct >= 0 ? '+' : ''}{ticker.changePct.toFixed(2)}%</span></span>
                  <Sparkline data={[...ticker.spark]} width={90} height={36} config={{ animate: !reducedMotion, showTooltip: false }} ariaLabel={`${ticker.symbol} trend`} />
                </button>
              </div>
            ))}
          </div>

          <div className="sp-block-stocks__body">
            <div className="sp-block-stocks__main">
              <div className="sp-block-stocks__company">
                <div><div className="sp-block-stocks__company-name">{selected.name}</div><div className="sp-block-stocks__company-meta">{selected.symbol} · {selected.exchange}</div></div>
                <div><div className="sp-block-stocks__company-price">${selected.price.toFixed(2)}</div><div className={`sp-block-stocks__delta ${selected.changePct >= 0 ? 'sp-block-stocks__up' : 'sp-block-stocks__down'}`}><Icon name={selected.changePct >= 0 ? 'arrow-up' : 'arrow-down'} size={11} aria-hidden="true" />{selected.change >= 0 ? '+' : ''}{selected.change.toFixed(2)} ({selected.changePct >= 0 ? '+' : ''}{selected.changePct.toFixed(2)}%)</div></div>
                <Button size="sm" variant="primary">Trade</Button>
              </div>

              <div className="sp-block-stocks__periods" role="group" aria-label="Chart period">
                {(Object.keys(periodSlice) as StockPeriod[]).map((option) => <button key={option} type="button" className="sp-block-stocks__period" aria-pressed={period === option} onClick={() => setPeriod(option)}>{option}</button>)}
              </div>
              <CandlestickChart data={chartData} height={260} ariaLabel={`${selected.symbol} price history`} config={{ animate: !reducedMotion, showGrid: true }} />
              <div className="sp-block-stocks__stats" role="list" aria-label="Key statistics">
                {selected.stats.map((stat) => <div className="sp-block-stocks__stat" role="listitem" key={stat.label}><span className="sp-block-stocks__stat-label">{stat.label}</span><span className="sp-block-stocks__stat-value">{stat.value}</span></div>)}
              </div>
            </div>

            <aside className="sp-block-stocks__sidebar" aria-label="Watchlist and market indices">
              <div className="sp-block-stocks__sidebar-section"><p className="sp-block-stocks__sidebar-heading">Watchlist</p>{tickers.map((ticker) => <button key={ticker.symbol} type="button" className="sp-block-stocks__watch" aria-current={selectedSymbol === ticker.symbol ? 'true' : undefined} onClick={() => setSelectedSymbol(ticker.symbol)}><span className="sp-block-stocks__watch-left"><span className="sp-block-stocks__symbol">{ticker.symbol}</span><span className="sp-block-stocks__watch-name">{ticker.name}</span></span><span className="sp-block-stocks__watch-right"><span className="sp-block-stocks__price">${ticker.price.toFixed(2)}</span><span className={`sp-block-stocks__watch-pct ${ticker.changePct >= 0 ? 'sp-block-stocks__up' : 'sp-block-stocks__down'}`}>{ticker.changePct >= 0 ? '+' : ''}{ticker.changePct.toFixed(2)}%</span></span></button>)}</div>
              <div className="sp-block-stocks__sidebar-section"><p className="sp-block-stocks__sidebar-heading">Indices</p>{INDICES.map((index) => <div className="sp-block-stocks__index" key={index.label}><span className="sp-block-stocks__index-left"><span className="sp-block-stocks__symbol">{index.label}</span><span className="sp-block-stocks__index-value">{index.value}</span></span><span className={`sp-block-stocks__index-change ${index.up ? 'sp-block-stocks__up' : 'sp-block-stocks__down'}`}>{index.up ? '+' : '-'}{index.change}%</span></div>)}</div>
            </aside>
          </div>
        </div>
      </section>

      <section id="ticker-strip" className="demo-section" aria-labelledby="ticker-heading">
        <h2 id="ticker-heading">Ticker Strip</h2>
        <p className="section-desc">A horizontally scrollable row of tickers with sparklines and live change indicators.</p>
        <div className="sp-block-frame sp-block-frame--pad"><div className="sp-block-stocks__ticker-strip" role="list" aria-label="Ticker strip preview">{tickers.map((ticker) => <div className="sp-block-stocks__ticker" key={ticker.symbol} role="listitem"><span className="sp-block-stocks__ticker-info"><span className="sp-block-stocks__symbol">{ticker.symbol}</span><span className="sp-block-stocks__price">${ticker.price.toFixed(2)}</span><span className={`sp-block-stocks__ticker-pct ${ticker.changePct >= 0 ? 'sp-block-stocks__up' : 'sp-block-stocks__down'}`}>{ticker.changePct >= 0 ? '+' : ''}{ticker.changePct.toFixed(2)}%</span></span><Sparkline data={[...ticker.spark]} width={90} height={36} config={{ animate: !reducedMotion, showTooltip: false }} ariaLabel={`${ticker.symbol} trend`} /></div>)}</div></div>
      </section>

      <section id="stock-card" className="demo-section" aria-labelledby="stock-card-heading">
        <h2 id="stock-card-heading">Stock Cards</h2>
        <p className="section-desc">Compact cards for portfolio or watchlist views. Each card shows the symbol, price, trend sparkline, and daily change badge.</p>
        <div className="sp-block-frame sp-block-frame--pad"><div className="sp-block-stock-grid">{tickers.map((ticker) => <article className="sp-block-stock-card" key={ticker.symbol}><div className="sp-block-stock-card__header"><div><strong>{ticker.symbol}</strong><div className="sp-block-stock-card__name">{ticker.name}</div></div><Badge variant={ticker.changePct >= 0 ? 'success' : 'danger'} size="sm">{ticker.changePct >= 0 ? '+' : ''}{ticker.changePct.toFixed(2)}%</Badge></div><div className="sp-block-stock-card__price">${ticker.price.toFixed(2)}</div><Sparkline data={[...ticker.spark]} height={48} config={{ animate: !reducedMotion, showTooltip: false }} ariaLabel={`${ticker.symbol} trend`} /><div className={`sp-block-stock-card__change ${ticker.changePct >= 0 ? 'sp-block-stocks__up' : 'sp-block-stocks__down'}`}><Icon name={ticker.changePct >= 0 ? 'trending-up' : 'trending-down'} size={12} aria-hidden="true" />{ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)} today</div></article>)}</div></div>
      </section>

      <section id="code" className="demo-section" aria-labelledby="stocks-code-heading">
        <h2 id="stocks-code-heading">Source Code</h2>
        <CodePreview code={STOCKS_CODE} language="typescript" codeOnly title="Stocks block composition" />
      </section>
    </BlockPageLayout>
  );
}
