# Changelog

All notable changes to `spruce-react` are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-05

### Added

- Completed the React design-system foundation: typed color, typography, spacing, density, borders, shadows, z-index, motion, icon, motif, and illustration collections.
- Added Angular-parity theme infrastructure with light, dark, and system modes, 34 built-in theme presets, accent presets, custom accents, color harmony, persistence, and runtime token updates.
- Expanded the library with the remaining navigation, action, feedback, data-display, workspace, editor, chart, effect, and utility components, plus core data adapters and Datagrid support.
- Added comprehensive documentation coverage with live examples, CodePreview updates, application blocks, foundation pages, and Angular-aligned navigation, sidebar groups, and appearance controls.

### Changed

- Aligned React components and documentation behavior with the Angular design system, including responsive overlays, RTL and internationalization support, theme-aware surfaces, and shared token contracts.
- Completed the built-in icon registry and collection exports, and added full SVG illustration and motif registries with searchable documentation galleries.
- Updated form controls and date/time pickers to use the shared border foundation; corrected slider layout, sidebar groups, documentation shells, and theme-switcher presentation.

### Fixed

- Fixed theme preset token precedence so dark presets correctly apply their own primary colors, while base Spruce themes retain their evergreen accent.
- Fixed duplicate Spruce theme entries in the docs appearance switcher and prevented explicit pink/custom accents from leaking into base Spruce light and dark selections.
- Fixed adjacent-month date rendering, viewport-aware picker positioning, empty combobox clearing, tab and color-token behavior, and other Angular parity gaps.

## [0.1.4] - 2026-07-27

### Added

- 12 new native SVG chart components: `GaugeChart` (with needle option), `SunburstChart`, `OrgChart`, `SankeyChart`, `PolarLineChart`, `WaterfallChart`, `FunnelChart`, `CandlestickChart`, `TreemapChart`, `BarRaceChart`, `HistogramChart`, `CalendarHeatmapChart`, and `ComboChart`.
- 8 Effects & Animations components: `Sparkles`, `Confetti`, `Shimmer`, `Rainbow`, `Shine`, `Glow`, `Marquee`, and `Fade`.
- New UI utilities: `FocusTrap`, `AutoFocus`, and `Highlight`.
- New layout & editor components: `DiffEditor` and `SignaturePad`.
- 3 new application block pages: `Feeds & Lists`, `Project Workspace`, and `Support Desk`.
- `codeOnly` mode support in `<CodePreview>` to render syntax-highlighted code blocks without preview panels.

### Changed

- Made `GaugeChart`, `SunburstChart`, and `OrgChart` fully theme-aware with dynamic CSS variables for text, backgrounds, and node borders across light and dark modes.
- `SidebarHeader` and `SidebarFooter` now support render functions (`({ collapsed }) => ReactNode`) to conditionally render brand and profile text in collapsed state.
- `AppShellHamburger` now toggles desktop sidebar collapse as well as mobile drawer slide-out.

### Removed

- Removed obsolete `Map Chart` and `Diagram Editor` sidebar entries.

## [0.1.3] - 2026-07-24

### Added

- Copyright and Apache license attribution headers on all component source files in `src/components/`.

### Changed

- Docs: replaced the default Vite favicon with a spruce-tree site icon on the brand evergreen-teal tile, legible in light and dark browser tabs.

## [0.1.2] - 2026-07-24

### Added

- Community health files: Code of Conduct, security policy, GitHub issue templates (bug report and feature request forms), and a pull request template.
- Docs: GitHub link pill in the home page hero, and a home footer with repository, issue reporting, and license links.
- Docs: License section on the Development page; issue reporting now links to the GitHub issue template chooser.

### Changed

- Docs: sidebar and home page navigation icons that were missing from the icon registry now use registered icons (Textarea, Tabs, FAB, Toolbar, Panel, Carousel, Lightbox, and several upcoming components).
- Community and security contact email is now <support@sprucestack.com>.

### Removed

- Docs: Playground section in the sidebar navigation.

### Fixed

- Docs: home page footer stated "MIT License" — the project is licensed under Apache-2.0.

## [0.1.1] - 2026-07-24

### Added

- Docs: global search with a command palette — press `Ctrl+K` (`⌘K` on Mac) or use the search box in the sidebar to jump to any page.
- Docs: Changelog page rendering this file as a version timeline.
- Docs: Development page covering installation, app setup with `SpruceProvider`, theming, and the design-system development workflow.

### Changed

- `Select`, `Combobox`, `DatePicker`, `TimePicker`, and `DateTimePicker` now use smart viewport-aware positioning: panels flip above the trigger when there is no room below, clamp into the viewport as a last resort, and reposition on scroll and resize — matching the behavior of `Popover`, `Dropdown`, `GridCombobox`, and `DateRangePicker`.

### Fixed

- README quick-start example used a non-existent `title` prop on `CardHeader` — it takes children.

## [0.1.0] - 2026-07-24

### Added

- Initial public release of the Spruce React design system with 62+ components across data display, forms and inputs, actions and navigation, and layout and overlays.
- Design tokens exposed as CSS custom properties (`--sp-*`) covering color, spacing, radius, shadows, typography, and motion.
- Theming via `SpruceProvider` / `ThemeProvider` with light, dark, and system modes plus bundled color presets.
- Built-in SVG icon registry with 180+ icons rendered through the `Icon` component.
- Data layer primitives: `DataSource` and `DataContext`.
- Documentation site with live examples for every component.
- Dual publishing to npm and GitHub Packages.
