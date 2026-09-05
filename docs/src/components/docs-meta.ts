import { flattenNavSections, getRouteHash, NAV_SECTIONS, type NavLeaf } from './nav';

export type DocsPageKind = 'foundation' | 'component' | 'chart' | 'effect' | 'utility' | 'block' | 'core' | 'general';

export interface DocsPageMetadata {
  readonly route: string;
  readonly title: string;
  readonly description: string;
  readonly section: string;
  readonly keywords: readonly string[];
  readonly kind: DocsPageKind;
  readonly packageName?: string;
  readonly symbols?: readonly string[];
}

const SYMBOLS: Record<string, readonly string[]> = {
  '#/components/app-shell': ['AppShell'],
  '#/components/barcode-qr': ['Barcode', 'QrCode'],
  '#/components/breadcrumbs': ['Breadcrumb'],
  '#/components/company-switcher': ['CompanySwitcher'],
  '#/components/datagridex': ['Datagridex'],
  '#/components/datetime-picker': ['DatetimePicker'],
  '#/components/daterange-picker': ['DateRangePicker'],
  '#/components/form-builder': ['FormBuilder'],
  '#/components/gantt': ['GanttChart'],
  '#/components/image-compare': ['ImageCompare'],
  '#/components/image-editor': ['ImageEditor'],
  '#/components/inplace-editor': ['InplaceEditor'],
  '#/components/input-group': ['InputGroup'],
  '#/components/notification-center': ['NotificationCenter'],
  '#/components/otp-input': ['OtpInput'],
  '#/components/password-input': ['PasswordInput'],
  '#/components/password-progress': ['PasswordProgress'],
  '#/components/range-calendar': ['RangeCalendar'],
  '#/components/segmented': ['SegmentedControl'],
  '#/components/signature-pad': ['SignaturePad'],
  '#/components/slider-range': ['Slider', 'Range'],
  '#/components/text-diff': ['TextDiff'],
  '#/components/time-picker': ['TimePicker'],
  '#/components/tree': ['Tree'],
  '#/components/datepicker': ['DatePicker'],
  '#/charts/bar-race-chart': ['BarRaceChart'],
  '#/charts/calendar-heatmap-chart': ['CalendarHeatmapChart'],
  '#/charts/candlestick-chart': ['CandlestickChart'],
  '#/charts/chart-kernel': ['ChartKernel'],
  '#/charts/line-chart': ['LineChart'],
  '#/charts/sparkline-chart': ['Sparkline'],
  '#/charts/stacked-bar-chart': ['StackedBarChart'],
  '#/charts/stacked-area-chart': ['StackedAreaChart'],
  '#/charts/tiny-charts': ['TinyBar', 'TinyLine', 'TinyPie', 'TinyDonut', 'TinyStacked'],
  '#/utils/code-preview': ['CodePreview'],
  '#/utils/focus-utilities': ['FocusTrap', 'AutoFocus'],
  '#/utils/highlight': ['Highlight'],
};

function kindForRoute(route: string): DocsPageKind {
  if (route.startsWith('#/foundation/')) return 'foundation';
  if (route.startsWith('#/components/')) return 'component';
  if (route.startsWith('#/charts/')) return 'chart';
  if (route.startsWith('#/effects/')) return 'effect';
  if (route.startsWith('#/utils/')) return 'utility';
  if (route.startsWith('#/blocks/')) return 'block';
  if (route.startsWith('#/core/') || route.startsWith('#/data/')) return 'core';
  return 'general';
}

function symbolFromRoute(route: string): string | undefined {
  const slug = route.split('/').pop();
  if (!slug) return undefined;
  return slug
    .split('-')
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join('');
}

function packageForKind(kind: DocsPageKind): string | undefined {
  return kind === 'foundation' || kind === 'component' || kind === 'chart' || kind === 'effect' || kind === 'utility'
    ? 'spruce-react'
    : undefined;
}

function leafForRoute(route: string): { item?: NavLeaf; section: string } {
  const match = flattenNavSections(NAV_SECTIONS).find(({ item }) => item.route === route);
  return { item: match?.item, section: match?.section ?? 'Documentation' };
}

/**
 * Resolve the metadata used by page headers, search, and catalog surfaces.
 * Hash routes may include a second hash for a section deep link.
 */
export function getDocsPageMetadata(route: string): DocsPageMetadata {
  const normalizedRoute = getRouteHash(route || '#/');
  const { item, section } = leafForRoute(normalizedRoute);
  const kind = kindForRoute(normalizedRoute);
  const title = item?.label ?? (normalizedRoute === '#/' ? 'Home' : 'Documentation');
  const description = item?.description ?? `${title} documentation and examples.`;
  const packageName = packageForKind(kind);
  const symbols = SYMBOLS[normalizedRoute] ?? (packageName && kind !== 'foundation' ? [symbolFromRoute(normalizedRoute) ?? title] : undefined);

  return {
    route: normalizedRoute,
    title,
    description,
    section,
    keywords: Array.from(new Set([...(item?.keywords ?? []), ...description.toLowerCase().split(/\W+/)])),
    kind,
    ...(packageName ? { packageName } : {}),
    ...(symbols ? { symbols } : {}),
  };
}

export function getSearchMetadata(): readonly DocsPageMetadata[] {
  return flattenNavSections(NAV_SECTIONS)
    .filter(({ item }) => !item.soon && !item.route.endsWith('/'))
    .map(({ item, section }) => ({
      ...getDocsPageMetadata(item.route),
      section,
    }));
}
