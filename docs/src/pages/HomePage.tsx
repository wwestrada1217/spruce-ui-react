import { Icon, Button } from 'spruce-react';
import { SPRUCE_VERSION } from '../version';
import { REPO_URL, ISSUES_URL, LICENSE_URL, LICENSE_NAME } from '../repo';

interface NavCard {
  icon: string;
  label: string;
  route: string;
  description?: string;
}

interface NavSection {
  label: string;
  icon?: string;
  description?: string;
  items: NavCard[];
  gridVariant?: 'foundations' | 'blocks';
}

const FOUNDATIONS: NavCard[] = [
  { icon: 'palette',        label: 'Colors',       route: '#/foundation/colors',         description: 'Palette, semantic tokens, and surface scales' },
  { icon: 'align-left',     label: 'Typography',   route: '#/foundation/typography',     description: 'Font families, sizes, weights, and line heights' },
  { icon: 'ruler',          label: 'Spacing',      route: '#/foundation/spacing',        description: 'Consistent spacing scale and layout rhythm' },
  { icon: 'minus',          label: 'Borders',      route: '#/foundation/borders',        description: 'Border widths and divider colors for tables, panels, and chrome' },
  { icon: 'sliders-horizontal', label: 'Density',   route: '#/foundation/density',       description: 'Compact, default, and comfortable sizing tokens' },
  { icon: 'layers',         label: 'Shadows',      route: '#/foundation/shadows',        description: 'Elevation levels for depth and hierarchy' },
  { icon: 'sparkles',       label: 'Iconography',  route: '#/foundation/iconography',    description: 'SVG icon library with inline rendering' },
  { icon: 'shapes',         label: 'Background motifs', route: '#/foundation/motifs',    description: 'Decorative SVG ornaments for containers and banners' },
  { icon: 'image',          label: 'Illustrations', route: '#/foundation/illustrations', description: 'Visual guidance for status and empty states' },
  { icon: 'brush',          label: 'Theming',      route: '#/foundation/theming',        description: 'Customize themes, color presets, and design tokens' },
  { icon: 'palette',        label: 'Color Harmony', route: '#/foundation/color-harmony', description: 'Generate accessible companion and chart colors' },
  { icon: 'play',           label: 'Motion',       route: '#/foundation/motion',         description: 'Duration, easing, and animation tokens with accessibility fallbacks' },
  { icon: 'message-circle', label: 'Voice & Tone', route: '#/foundation/voice-and-tone', description: 'Writing guidelines for clear, consistent, and human interface copy' },
  { icon: 'globe',          label: 'Internationalization', route: '#/foundation/internationalization', description: 'Locale packs, formatting, labels, and right-to-left layout guidance' },
  { icon: 'shield',         label: 'Accessibility', route: '#/foundation/accessibility',  description: 'Keyboard, semantics, contrast, motion, and testing guidance' },
];

const CORE: NavCard[] = [
  { icon: 'database', label: 'Data Source',  route: '#/core/data-source',  description: 'Pluggable data fetching with filtering, sorting, and pagination' },
  { icon: 'layers',   label: 'Data Context', route: '#/core/data-context', description: 'Change tracking, dirty state, and batch operations for record sets' },
];

const COMPONENT_SECTIONS: NavSection[] = [
  {
    label: 'Data Display',
    items: [
      { icon: 'tag',                label: 'Badge',             route: '#/components/badge',          description: 'Status labels and counters' },
      { icon: 'keyboard',           label: 'Kbd',               route: '#/components/kbd',            description: 'Keyboard shortcut indicators' },
      { icon: 'activity',           label: 'Progress Bar',      route: '#/components/progress-bar',   description: 'Determinate and indeterminate progress' },
      { icon: 'trending-up',        label: 'Stat Card',         route: '#/components/stat-card',      description: 'KPI cards with trend indicators' },
      { icon: 'user',               label: 'Avatar',            route: '#/components/avatar',         description: 'User avatars with image, initials, and status' },
      { icon: 'users',              label: 'Avatar Group',      route: '#/components/avatar-group',   description: 'Stacked avatar groups with overflow count' },
      { icon: 'loader',             label: 'Spinner',           route: '#/components/spinner',        description: 'Loading spinners in multiple sizes' },
      { icon: 'package',            label: 'Empty',             route: '#/components/empty',          description: 'Empty state illustrations with actions' },
      { icon: 'clock',              label: 'Timeline',          route: '#/components/timeline',       description: 'Vertical timelines with colors and icons' },
      { icon: 'git-fork',           label: 'Treeview',          route: '#/components/tree',           description: 'Hierarchical tree with checkboxes and drag-drop' },
      { icon: 'table',              label: 'Datagridex',        route: '#/components/datagridex',     description: 'Canonical typed grid with sorting, filtering, editing, and DataContext integration' },
      { icon: 'calendar',           label: 'Scheduler',         route: '#/components/scheduler',      description: 'Calendar scheduler with day, week, month, and timeline views' },
      { icon: 'bar-chart',          label: 'Gantt Chart',       route: '#/components/gantt',          description: 'Project timeline with tasks, dependencies, and milestones' },
      { icon: 'columns',            label: 'Kanban',            route: '#/components/kanban',         description: 'Drag-and-drop Kanban board with column reordering' },
    ],
  },
  {
    label: 'Forms & Inputs',
    items: [
      { icon: 'square-check',       label: 'Checkbox',          route: '#/components/checkbox',          description: 'Boolean selection with indeterminate state' },
      { icon: 'circle-dot',         label: 'Radio',             route: '#/components/radio',             description: 'Single-selection radio groups' },
      { icon: 'toggle-left',        label: 'Switch',            route: '#/components/switch',            description: 'Toggle switches for boolean settings' },
      { icon: 'text-cursor-input',  label: 'Input',             route: '#/components/input',             description: 'Text input with icons, sizes, and states' },
      { icon: 'chevron-down',       label: 'Select',            route: '#/components/select',            description: 'Dropdown select with search and multi-select' },
      { icon: 'search',             label: 'Combobox',          route: '#/components/combobox',          description: 'Autocomplete combobox with filtering' },
      { icon: 'layout-grid',        label: 'Grid Combobox',     route: '#/components/grid-combobox',     description: 'Multi-column dropdown with grid layout' },
      { icon: 'menu',               label: 'Dropdown Menu',     route: '#/components/dropdown',          description: 'Action menus with icons and nested items' },
      { icon: 'align-left',         label: 'Textarea',          route: '#/components/textarea',          description: 'Multi-line text input with auto-grow' },
      { icon: 'lock',               label: 'Password Input',    route: '#/components/password-input',    description: 'Password field with show/hide toggle' },
      { icon: 'shield',             label: 'Password Progress', route: '#/components/password-progress', description: 'Password strength meter' },
      { icon: 'hash',               label: 'OTP Input',         route: '#/components/otp-input',         description: 'One-time password input fields' },
      { icon: 'code',               label: 'Masked Input',      route: '#/components/masked-input',      description: 'Formatted input with pattern masks' },
      { icon: 'calendar',           label: 'Datepicker',        route: '#/components/datepicker',        description: 'Date selection with calendar popup' },
      { icon: 'calendar-range',     label: 'Date Range Picker', route: '#/components/daterange-picker',  description: 'Start and end date selection' },
      { icon: 'clock',              label: 'Time Picker',       route: '#/components/time-picker',       description: 'Time selection with hour/minute/AM-PM' },
      { icon: 'calendar-clock',     label: 'Datetime Picker',   route: '#/components/datetime-picker',   description: 'Combined date and time selection' },
      { icon: 'sliders-horizontal', label: 'Slider & Range',    route: '#/components/slider-range',      description: 'Single and dual-handle range sliders' },
      { icon: 'braces',             label: 'Code Editor',       route: '#/components/code-editor',       description: 'Syntax-highlighted code editor' },
      { icon: 'map-pin',            label: 'In-place Editor',   route: '#/components/inplace-editor',    description: 'Click-to-edit inline text values' },
    ],
  },
  {
    label: 'Actions & Navigation',
    items: [
      { icon: 'zap',               label: 'Button',            route: '#/components/button',          description: 'Primary actions with variants, sizes, and icons' },
      { icon: 'columns',           label: 'Button Group',      route: '#/components/button-group',    description: 'Grouped action buttons' },
      { icon: 'columns',           label: 'Split Button',      route: '#/components/split-button',    description: 'Button with dropdown actions' },
      { icon: 'folder-dt',       label: 'Tabs',              route: '#/components/tabs',            description: 'Tabbed content with lazy rendering' },
      { icon: 'chevrons-right',    label: 'Breadcrumbs',       route: '#/components/breadcrumbs',     description: 'Navigation trail with separators' },
      { icon: 'list',              label: 'Stepper',           route: '#/components/stepper',         description: 'Multi-step process indicator' },
      { icon: 'toggle-left',       label: 'Segmented Control', route: '#/components/segmented',       description: 'Inline option switcher' },
      { icon: 'plus',         label: 'FAB',               route: '#/components/fab',             description: 'Floating action button with speed-dial' },
      { icon: 'menu',              label: 'Navigation Menu',   route: '#/components/nav-menu',        description: 'Horizontal nav bar with dropdown panels' },
      { icon: 'panel-top-dashed',  label: 'Toolbar',           route: '#/components/toolbar',         description: 'Configurable action toolbar' },
      { icon: 'chevrons-right',    label: 'Pager',             route: '#/components/pager',           description: 'Pagination with page size selector' },
    ],
  },
  {
    label: 'Layout & Overlays',
    items: [
      { icon: 'square',            label: 'Card',              route: '#/components/card',             description: 'Container with header, media, and footer' },
      { icon: 'layout-panel-left', label: 'Panel',             route: '#/components/panel',            description: 'Flexible panel with header/body/footer' },
      { icon: 'layout-grid',       label: 'Grid',              route: '#/components/grid',             description: 'Responsive 12-column grid system' },
      { icon: 'grip-vertical',     label: 'Splitter',          route: '#/components/splitter',         description: 'Resizable split panes' },
      { icon: 'sidebar-left',      label: 'Sidebar',           route: '#/components/sidebar',          description: 'Collapsible navigation sidebar' },
      { icon: 'credit-card',       label: 'App Header',        route: '#/components/app-header',       description: 'Application header bar with logo and actions' },
      { icon: 'panel-right',       label: 'Drawer',            route: '#/components/drawer',           description: 'Slide-in side panel' },
      { icon: 'maximize',          label: 'Modal',             route: '#/components/modal',            description: 'Dialog windows with backdrop' },
      { icon: 'minimize',          label: 'Window',            route: '#/components/window',           description: 'Draggable, resizable floating window' },
      { icon: 'chevron-down',      label: 'Accordion',         route: '#/components/accordion',        description: 'Collapsible content sections' },
      { icon: 'alert-circle',      label: 'Alert',             route: '#/components/alert',            description: 'Inline dismissible status messages' },
      { icon: 'alert-triangle',    label: 'Message Bar',       route: '#/components/message-bar',      description: 'Full-width status banner' },
      { icon: 'message-square',    label: 'Popover & Tooltip', route: '#/components/popover-tooltip',  description: 'Contextual overlays and hints' },
      { icon: 'bell',              label: 'Toast',             route: '#/components/toast',            description: 'Temporary notification messages' },
      { icon: 'message-circle',    label: 'Snackbar',          route: '#/components/snackbar',         description: 'Bottom-anchored action messages' },
      { icon: 'command',           label: 'Command Palette',   route: '#/components/command-palette',  description: 'Keyboard-driven command launcher' },
      { icon: 'compass',           label: 'Coachmark',         route: '#/components/coachmark',        description: 'Guided tour with spotlight overlay' },
    ],
  },
];

const CHARTS: NavCard[] = [
  { icon: 'bar-chart',      label: 'Bar Chart',         route: '#/charts/bar-chart',         description: 'Vertical and horizontal bar charts' },
  { icon: 'pie-chart',      label: 'Pie Chart',         route: '#/charts/pie-chart',         description: 'Pie and donut charts' },
  { icon: 'trending-up',    label: 'Line Chart',        route: '#/charts/line-chart',        description: 'Line and multi-series line charts' },
  { icon: 'activity',       label: 'Area Chart',        route: '#/charts/area-chart',        description: 'Filled area charts' },
  { icon: 'bar-chart',      label: 'Stacked Bar',       route: '#/charts/stacked-bar-chart',  description: 'Stacked bar visualization' },
  { icon: 'layers',         label: 'Stacked Area',      route: '#/charts/stacked-area-chart', description: 'Stacked area visualization' },
  { icon: 'circle-dot',     label: 'Bubble Chart',      route: '#/charts/bubble-chart',      description: 'Bubble chart with 3D value sizing' },
  { icon: 'gauge',          label: 'Gauge Chart',       route: '#/charts/gauge-chart',       description: 'Radial gauge indicators with optional needle' },
  { icon: 'chart-scatter',  label: 'Scatter Chart',     route: '#/charts/scatter-chart',     description: 'Scatter plots with multi-series data' },
  { icon: 'layout-grid',    label: 'Heatmap',           route: '#/charts/heatmap-chart',     description: 'Color-encoded matrix grid' },
  { icon: 'bar-chart',      label: 'Grouped Bar',       route: '#/charts/grouped-bar-chart',  description: 'Grouped bar comparison' },
  { icon: 'bar-chart-2',    label: 'Candlestick',       route: '#/charts/candlestick-chart',  description: 'Financial candlestick chart' },
  { icon: 'layout-grid',    label: 'Treemap',           route: '#/charts/treemap-chart',      description: 'Hierarchical rectangle treemap' },
  { icon: 'play',           label: 'Bar Race',          route: '#/charts/bar-race-chart',     description: 'Animated bar race timeline' },
  { icon: 'activity',       label: 'Sparkline',         route: '#/charts/sparkline-chart',   description: 'Inline mini trend lines' },
  { icon: 'filter',         label: 'Funnel',            route: '#/charts/funnel-chart',       description: 'Sales & conversion funnel chart' },
  { icon: 'bar-chart-2',    label: 'Histogram',         route: '#/charts/histogram-chart',    description: 'Distribution histogram' },
  { icon: 'calendar',       label: 'Calendar Heatmap',  route: '#/charts/calendar-heatmap-chart', description: 'GitHub-style activity calendar' },
  { icon: 'bar-chart-2',    label: 'Combo Chart',       route: '#/charts/combo-chart',      description: 'Combined bar & line chart' },
  { icon: 'hexagon',        label: 'Radar Chart',       route: '#/charts/radar-chart',       description: 'Multi-axis radar/spider charts' },
  { icon: 'git-merge',      label: 'Sankey Chart',      route: '#/charts/sankey-chart',      description: 'Flow & node connectivity diagram' },
  { icon: 'sun',            label: 'Sunburst Chart',    route: '#/charts/sunburst-chart',    description: 'Concentric multi-level sunburst' },
  { icon: 'compass',        label: 'Polar Line Chart',  route: '#/charts/polar-line-chart',  description: 'Polar coordinate line chart' },
  { icon: 'bar-chart-2',    label: 'Waterfall Chart',   route: '#/charts/waterfall-chart',   description: 'Sequential financial delta waterfall' },
  { icon: 'users',          label: 'Org Chart',         route: '#/charts/org-chart',         description: 'Interactive hierarchy tree' },
];

const EFFECTS: NavCard[] = [
  { icon: 'sparkles',        label: 'Sparkles', route: '#/effects/sparkles', description: 'Animated sparkle particles' },
  { icon: 'zap',             label: 'Confetti', route: '#/effects/confetti', description: 'Celebration confetti burst' },
  { icon: 'scan-line',       label: 'Shimmer',  route: '#/effects/shimmer',  description: 'Loading shimmer placeholder' },
  { icon: 'sparkles',        label: 'Rainbow',  route: '#/effects/rainbow',  description: 'Dynamic rainbow border' },
  { icon: 'sun',             label: 'Shine',    route: '#/effects/shine',    description: 'Light reflection pass effect' },
  { icon: 'lightbulb',       label: 'Glow',     route: '#/effects/glow',     description: 'Ambient neon glow backlight' },
  { icon: 'move-horizontal', label: 'Marquee',  route: '#/effects/marquee',  description: 'Continuous smooth scrolling marquee' },
  { icon: 'eye',             label: 'Fade',     route: '#/effects/fade',     description: 'Smooth opacity & scale transition' },
];

const UTILITIES: NavCard[] = [
  { icon: 'focus',        label: 'Focus Utilities', route: '#/utils/focus-utilities', description: 'Focus trap and autofocus directives' },
  { icon: 'highlighter',  label: 'Highlight',       route: '#/utils/highlight',        description: 'Query substring text highlight' },
  { icon: 'panel-right',  label: 'Scrollbar',       route: '#/utils/scrollbar',        description: 'Custom scrollbar styling' },
  { icon: 'more-vertical',label: 'Overflow',        route: '#/utils/overflow',         description: 'Overflow menu for truncated items' },
  { icon: 'app-window',   label: 'Code Preview',    route: '#/utils/code-preview',    description: 'Live interactive code snippet viewer' },
];

const BLOCKS: NavCard[] = [
  { icon: 'layout',          label: 'App Shell',         route: '#/blocks/app-shell',          description: 'Full application shell with header and sidebar' },
  { icon: 'layout-dashboard',label: 'Dashboard',         route: '#/blocks/dashboard',          description: 'Analytics dashboard layout' },
  { icon: 'lock',            label: 'Authentication',    route: '#/blocks/authentication',     description: 'Login, register, and reset forms' },
  { icon: 'settings',        label: 'Settings',          route: '#/blocks/settings',           description: 'Settings page templates' },
  { icon: 'list',            label: 'Feeds & Lists',     route: '#/blocks/feeds',              description: 'Activity feeds and list views' },
  { icon: 'clipboard-check', label: 'Project Workspace', route: '#/blocks/project-workspace', description: 'Project management views' },
  { icon: 'help-circle',     label: 'Support Desk',      route: '#/blocks/support-desk',      description: 'Help desk and ticketing' },
  { icon: 'mail',            label: 'Email App',         route: '#/blocks/email',              description: 'Email client layout' },
  { icon: 'bar-chart',       label: 'Charts',             route: '#/blocks/charts',             description: 'Analytics dashboards and chart compositions' },
  { icon: 'shield',          label: 'Privacy & Cookie Consent', route: '#/blocks/cookie-consent', description: 'GDPR/CCPA privacy consent banner' },
  { icon: 'table',           label: 'Operations Grid',    route: '#/blocks/operations-grid',   description: 'Queue triage and bulk review workspace' },
  { icon: 'trending-up',     label: 'Stocks App',         route: '#/blocks/stocks',             description: 'Ticker, candlestick, and watchlist dashboard' },
];

const COMPONENT_COUNT = COMPONENT_SECTIONS.reduce((sum, s) => sum + s.items.length, 0) + CHARTS.length + EFFECTS.length + UTILITIES.length;
const FOUNDATION_COUNT = FOUNDATIONS.length;
const BLOCK_COUNT = BLOCKS.length;

function navigate(route: string) {
  window.location.hash = route.replace(/^#/, '');
}

export function HomePage() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="home__hero-badge">Open-Source Design System</div>

        <h1 className="home__hero-title">
          <Icon name="logo" size={52} />
          {' '}Spruce{' '}
          <span className="home__hero-accent">Design System</span>
        </h1>

        <p className="home__hero-desc">
          A comprehensive React component library built for enterprise applications.{' '}
          {COMPONENT_COUNT}+ components, design tokens, and pre-built blocks &mdash; all with
          zero external dependencies.
        </p>

        <div className="home__hero-pills" aria-label="Key features">
          <a
            className="home__hero-pill home__hero-pill--accent home__hero-pill--link"
            href="#/changelog"
            title="View the changelog"
          >
            v{SPRUCE_VERSION}
          </a>
          <span className="home__hero-pill">TypeScript</span>
          <span className="home__hero-pill">React 19+</span>
          <span className="home__hero-pill home__hero-pill--accent">WCAG AA</span>
          <span className="home__hero-pill">Zero deps</span>
          <a
            className="home__hero-pill home__hero-pill--link"
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            title="View the source on GitHub (opens in a new tab)"
          >
            GitHub <Icon name="external-link" size={11} aria-hidden="true" />
          </a>
        </div>

        <div className="home__hero-stats" role="list" aria-label="Library statistics">
          <div className="home__stat" role="listitem">
            <span className="home__stat-value">{COMPONENT_COUNT}+</span>
            <span className="home__stat-label">Components</span>
          </div>
          <div className="home__stat-divider" aria-hidden="true" />
          <div className="home__stat" role="listitem">
            <span className="home__stat-value">{FOUNDATION_COUNT}</span>
            <span className="home__stat-label">Foundations</span>
          </div>
          <div className="home__stat-divider" aria-hidden="true" />
          <div className="home__stat" role="listitem">
            <span className="home__stat-value">{BLOCK_COUNT}</span>
            <span className="home__stat-label">Blocks</span>
          </div>
          <div className="home__stat-divider" aria-hidden="true" />
          <div className="home__stat" role="listitem">
            <span className="home__stat-value">0</span>
            <span className="home__stat-label">Dependencies</span>
          </div>
        </div>

        <div className="home__hero-actions">
          <Button variant="primary" iconLeft="package" size="lg" onClick={() => navigate('#/foundation/colors')}>
            Browse Foundations
          </Button>
          <Button variant="outline" iconLeft="zap" size="lg" onClick={() => navigate('#/components/button')}>
            Explore Components
          </Button>
        </div>
      </section>

      {/* Foundations */}
      <section className="home__section" aria-labelledby="foundations-heading">
        <div className="home__section-header">
          <h2 className="home__section-title" id="foundations-heading">
            <Icon name="layout-grid" size={20} />
            Foundations
          </h2>
          <p className="home__section-desc">
            Design tokens that power the visual language across every component.
          </p>
        </div>
        <div className="home__card-grid home__card-grid--foundations">
          {FOUNDATIONS.map((card) => (
            <button key={card.route} className="home__card home__card--foundation" onClick={() => navigate(card.route)}>
              <div className="home__card-icon">
                <Icon name={card.icon} size={20} />
              </div>
              <div className="home__card-body">
                <h3 className="home__card-title">{card.label}</h3>
                <p className="home__card-desc">{card.description}</p>
              </div>
              <Icon name="arrow-right" size={14} className="home__card-arrow" />
            </button>
          ))}
        </div>
      </section>

      {/* Core */}
      <section className="home__section" aria-labelledby="core-heading">
        <div className="home__section-header">
          <h2 className="home__section-title" id="core-heading">
            <Icon name="package" size={20} />
            Core
          </h2>
          <p className="home__section-desc">
            Framework-level primitives for data access, change tracking, and server synchronization.
          </p>
        </div>
        <div className="home__card-grid home__card-grid--foundations">
          {CORE.map((card) => (
            <button key={card.route} className="home__card home__card--foundation" onClick={() => navigate(card.route)}>
              <div className="home__card-icon">
                <Icon name={card.icon} size={20} />
              </div>
              <div className="home__card-body">
                <h3 className="home__card-title">{card.label}</h3>
                <p className="home__card-desc">{card.description}</p>
              </div>
              <Icon name="arrow-right" size={14} className="home__card-arrow" />
            </button>
          ))}
        </div>
      </section>

      {/* Component sections */}
      {COMPONENT_SECTIONS.map((section) => (
        <section key={section.label} className="home__section" aria-labelledby={`section-${section.label.replace(/\s+/g, '-')}`}>
          <div className="home__section-header">
            <h2 className="home__section-title" id={`section-${section.label.replace(/\s+/g, '-')}`}>
              {section.label}
            </h2>
          </div>
          <div className="home__card-grid">
            {section.items.map((card) => (
              <button key={card.route} className="home__card" onClick={() => navigate(card.route)}>
                <div className="home__card-icon home__card-icon--sm">
                  <Icon name={card.icon} size={16} />
                </div>
                <div className="home__card-body">
                  <h3 className="home__card-title">{card.label}</h3>
                  <p className="home__card-desc">{card.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* Charts */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">
            <Icon name="bar-chart" size={20} />
            Charts
          </h2>
          <p className="home__section-desc">
            Charting components and diagram tools for data visualization, KPI dashboards, and interactive diagrams.
          </p>
        </div>
        <div className="home__card-grid">
          {CHARTS.map((card) => (
            <button key={card.route} className="home__card" onClick={() => navigate(card.route)}>
              <div className="home__card-icon home__card-icon--sm">
                <Icon name={card.icon} size={16} />
              </div>
              <div className="home__card-body">
                <h3 className="home__card-title">{card.label}</h3>
                <p className="home__card-desc">{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Effects & Animations */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">
            <Icon name="sparkles" size={20} />
            Effects & Animations
          </h2>
          <p className="home__section-desc">
            Visual effects and motion directives for sparkle, shimmer, glow, and entrance animations.
          </p>
        </div>
        <div className="home__card-grid">
          {EFFECTS.map((card) => (
            <button key={card.route} className="home__card" onClick={() => navigate(card.route)}>
              <div className="home__card-icon home__card-icon--sm">
                <Icon name={card.icon} size={16} />
              </div>
              <div className="home__card-body">
                <h3 className="home__card-title">{card.label}</h3>
                <p className="home__card-desc">{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Utilities */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">
            <Icon name="settings" size={20} />
            Utilities
          </h2>
          <p className="home__section-desc">
            Directives and helpers that enhance existing elements and form patterns.
          </p>
        </div>
        <div className="home__card-grid">
          {UTILITIES.map((card) => (
            <button key={card.route} className="home__card" onClick={() => navigate(card.route)}>
              <div className="home__card-icon home__card-icon--sm">
                <Icon name={card.icon} size={16} />
              </div>
              <div className="home__card-body">
                <h3 className="home__card-title">{card.label}</h3>
                <p className="home__card-desc">{card.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Blocks */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">
            <Icon name="layout-dashboard" size={20} />
            Blocks
          </h2>
          <p className="home__section-desc">
            Pre-built page templates ready to drop into your application.
          </p>
        </div>
        <div className="home__card-grid home__card-grid--blocks">
          {BLOCKS.map((card) => (
            <button key={card.route} className="home__card home__card--block" onClick={() => navigate(card.route)}>
              <div className="home__card-icon home__card-icon--lg">
                <Icon name={card.icon} size={24} />
              </div>
              <h3 className="home__card-title">{card.label}</h3>
              <p className="home__card-desc">{card.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="home__footer">
        <p>
          Built with React &middot; Zero external dependencies &middot; Fully accessible &middot;{' '}
          <a href={LICENSE_URL} target="_blank" rel="noreferrer">{LICENSE_NAME} License</a>
        </p>
        <p className="home__footer-links">
          <a href={REPO_URL} target="_blank" rel="noreferrer">GitHub</a>
          <span aria-hidden="true">&middot;</span>
          <a href={ISSUES_URL} target="_blank" rel="noreferrer">Report an issue</a>
          <span aria-hidden="true">&middot;</span>
          <a href="#/development">Development guide</a>
        </p>
      </footer>
    </div>
  );
}
