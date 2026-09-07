# Angular-to-React feature parity audit

> **Superseded:** This 2026-08-24 snapshot is retained for implementation history. Use [`ANGULAR_REACT_GAP_CATALOG.md`](./ANGULAR_REACT_GAP_CATALOG.md) for the current 2026-09-07 status, grouped catalog, and copy-paste prompts.

Audit date: 2026-08-24

Angular baseline:

- `../spruce-ng/projects/docs`
- `../spruce-ng/projects/spruce-ui`
- `../spruce-ng/projects/core-data`

React target:

- `docs`
- `src`

## Status rules

- **Complete**: no material feature, public-API, or documentation gap was found in the inspected Angular/React counterpart. Angular outputs may map to idiomatic React callbacks and Angular content projection may map to React children/render props.
- **To-Do**: a component is missing, still uses the legacy implementation, or lacks material Angular behavior, styling/token integration, accessibility, localization, or documentation.
- **Not directly applicable**: the Angular mechanism itself should not be copied (for example, directives, dependency injection, or signal forms). Its user-visible behavior still needs an idiomatic React equivalent.

The legacy Angular grid is intentionally excluded as a target. React `Datagrid` is the canonical grid baseline.

## Executive result

- React has 87 component folders, 25 chart components, and 8 effects.
- Angular documents 113 general component pages. React is missing a direct or idiomatic equivalent for the major surfaces listed below, and many same-name React components expose an older/smaller API.
- React exposes 12 theme presets; Angular exposes 34. The 22 missing presets are: `agents`, `agents-dark`, `bumblebee`, `bumblebee-dark`, `comic`, `comic-dark`, `liquid-glass`, `liquid-glass-dark`, `material`, `material-dark`, `modern`, `modern-dark`, `monokai`, `monokai-light`, `spruce`, `spruce-charcoal`, `spruce-charcoal-dark`, `spruce-dark`, `spruce-slate`, `spruce-slate-dark`, `visual-studio`, and `visual-studio-dark`.
- React's CSS contains much of the newer density/border/frosted work, but its typed token API and foundation docs lag Angular. A token-name scan found 158 Angular token references without React counterparts, especially companion accents, status tints, control chrome, expanded typography aliases, and chart harmony series.
- Angular has a full i18n service and 14 locale packs. React has no library-level locale/direction/label provider.
- Angular's library has 155 test files; React's `src` currently has no `*.test.*` or `*.spec.*` files. “Complete” below means inspected feature/API/docs parity, not equivalent regression-test coverage.

## Priority-ordered update list

### P0 — system contracts and migration blockers

| Status | Area | Required update | Prompt |
| --- | --- | --- | --- |
| **To-Do** | Foundation tokens and typed design system | Make React's CSS and `SpruceTokenKey` match Angular's tokens: companion secondary/tertiary accents, status tint/on-tint roles, control chrome, full typography aliases, exact density aliases, chart harmony ramp, liquid-glass/frosted roles, component token keys, static/programmatic token exports, and docs for Colors, Typography, Spacing, Borders, Density, Shadows, Iconography, Motifs, Motion, and Accessibility. Remove the `(string & {})` escape hatch from the strict token union or provide a separate custom-token API. | **P0-01** |
| **To-Do** | Theme runtime, accents, harmony, and presets | Extend `ThemeProvider`/`useTheme` with persisted preference, `data-theme-preset`, accent selection, custom accent color, harmony schemes/custom offsets, harmony palette/revision, and the Angular theme-switcher behavior. Port all 22 missing presets and add Color Harmony and complete Theming docs. | **P0-02** |
| **To-Do** | Internationalization and RTL | Add an idiomatic React `SpruceI18nProvider`/hook with typed labels, locale packs, interpolation, date/number formatting hooks, direction, runtime overrides, and localized defaults for every component that consumes Angular's `SpruceI18nService`. Add Internationalization docs and RTL tests. | **P0-03** |
| **To-Do** | Canonical React `Datagrid` | Complete the canonical React `Datagrid` implementation against Angular's typed rows/columns/groups, intrinsic/fitted sizing, pinning, menu, multi-sort, filtering, templates/editors, validation, details/detail pane, leading actions, new row, client/manual/virtual paging, selection/group selection, grouping, row reorder, row numbers, toolbar/statusbar/footer, data-context adapter, public methods, events, keyboard/ARIA behavior, and docs. Remove any legacy grid route/export according to release policy. | **P0-04** |
| **To-Do** | Core data and adapters | React has the basic data context/data sources but lacks Angular's detail data source/context manager, form model/bridge, undo manager, navigation cursor, NodeStore, errors, and richer adapters. Port framework-neutral behavior and provide hooks/adapters for Datagrid and FormBuilder. | **P0-05** |
| **To-Do** | Test and accessibility baseline | Add a React component test harness, DOM/interaction tests, keyboard/focus tests, axe checks, and theme/RTL coverage. Start with tokens/providers/Datagrid, then require tests for every parity task. | **P0-06** |

### P1 — shared primitives and high-use components

| Status | Area/components | Required update | Prompt |
| --- | --- | --- | --- |
| **To-Do** | Form foundation: `Field`, `FormLayout`, `InputGroup`, validation contract | Add the missing form-layout primitives and a shared accessible field contract. Propagate Angular-equivalent `readonly`, `hidden`, `invalid`, `errors`, `required`, label/floating-label, hint, ARIA, chrome, and direction behavior. Angular signal forms are **not directly applicable**; use controlled React values/callbacks and hooks. | **P1-01** |
| **To-Do** | Forms and lookups: `Input`, `Textarea`, `Checkbox`, `Radio`, `Switch`, `Slider`, `Range`, `Select`, `Combobox`, `GridCombobox`, `MaskedInput`, `OtpInput`, `PasswordInput`, `FileUpload`, `SignaturePad`, `SegmentedControl` | Update every existing form control to the shared field contract. Add lookup paging/virtual paging, templates/renderers, placement/constrain/dismiss behavior, multiple selection where present, orientation/marker behavior, icons, mask guide, validation, and equivalent callbacks. | **P1-02** |
| **To-Do** | Missing form components: `ColorPicker`, `EmojiPicker`, `FormBuilder`; lookup patterns | Port the missing Angular components, including public types, controlled React APIs, keyboard/accessibility behavior, docs, and data-context/form-model adapters. Document Angular lookup patterns as idiomatic React examples rather than copying directives. | **P1-03** |
| **To-Do** | Dates: `Calendar`, `RangeCalendar`, `DatePicker`, `DateRangePicker`, `DatetimePicker`, `TimePicker` | Add the shared field states plus labels/floating labels, placement, modal constraint, dismiss-on-scroll/outside-click, localized parsing/formatting, and Angular-equivalent change callbacks. | **P1-04** |
| **To-Do** | Overlay/positioning foundation: `Popover`, `Tooltip`, `Dropdown`, `Modal`, `Drawer`, `Window`, `CommandPalette` | Align focus trap/restore, escape and backdrop behavior, arrow/panel class, anchor rect, placement, modal constraints, scroll/outside-click dismissal, logical positioning, localized accessible labels, and CommandPalette fuzzy search/highlighting/shortcuts/footer/programmatic controls. Add equivalent React portal/positioning utilities with tests. | **P1-05** |
| **To-Do** | Notifications/feedback: `Alert`, `ProgressBar`, `Spinner`, `Toast`, `Snackbar`, plus missing `CircularProgress` and `NotificationCenter` | Add Alert size and decorative motif support; segmented progress; Spinner variants/custom colors/localized label; Toast stacking; complete Snackbar services/queues; and port CircularProgress and NotificationCenter. | **P1-06** |
| **To-Do** | Navigation/actions: `Accordion`, `Breadcrumbs`, `ButtonGroup`, `SplitButton`, `Tabs`, `Stepper`, `NavMenu`, `Toolbar`, `Overflow` | Add Angular's controlled item/value APIs, collapsible/variant/size/lazy/findable accordion behavior, breadcrumb truncation menu, accessible group labels, split-button priority/placement/icon-only labels, tab lazy/close/reorder/context/route-fragment/toolbar placement, step metadata, nav item detail, toolbar toggle/presentation/priority/tooltip grouping, and overflow priority/change behavior. | **P1-07** |
| **To-Do** | Shell/sidebar: `AppHeader`, `Sidebar`, `AppShell`, plus missing `CompanySwitcher`, account/workspace switchers, newsletter form, popover item | Match borders/toggle behavior, active accent, auto-hide scrollbar aliases, resizable width bounds/persistence, collapsed callbacks, responsive shell behavior, and all Angular sidebar subcomponents. | **P1-08** |
| **To-Do** | Chrome and motifs: `Card`, `Panel`, `Alert`, editors, data/workspace surfaces | Port Angular's shared `chrome`, `radius`, `border`, `elevation`, and decorative background/motif inputs. Add a React `Motif` component and motif docs; use the shared API consistently rather than one-off props. | **P1-09** |
| **To-Do** | Editors: `CodeEditor`, `DiffEditor`, `Editor`, `MarkdownEditor`, `BlockEditor`, `InplaceEditor` | Align CodeEditor indentation/stretch/theme/minimap/markers/diagnostics/completion/hover/signature/inline suggestion/actions/decorations/view zones/gutters/folding/status events; DiffEditor modes/layout/editability/navigation/collapse; editor chrome/mentions; Markdown validation/count/accessibility; BlockEditor decorations/virtualization/undo/selection; and InplaceEditor's full editor-type matrix. | **P1-10** |
| **To-Do** | Data display: `Badge`, `Barcode`/`QrCode`, `Carousel`, `CreditCard`, `GitGraph`, `ImageCompare`, `Kanban`, `StatCard`, `Terminal`, `Tree` | Add Angular's clickable/icon badge API; QR high-capacity mode and aligned naming; carousel change semantics; card-holder naming; chrome and event callbacks; Kanban move guards; StatCard chart fit/report examples; Terminal theme/timestamps/virtualization; and Tree density/virtualization/drag lifecycle/row actions/badge alignment. | **P1-11** |
| **To-Do** | Missing data/productivity components: `Table`, `ComposeBar`, `CommentThread`, `PropertyPanel`, `PdfViewer`, `TextDiff`, entitlement gate, `PlanCards` | Port each component or hook/component equivalent, public types, keyboard/ARIA behavior, tokens, docs, and tests. Map Angular's `spHasFeature` directive to an idiomatic React entitlement component/hook. | **P1-12** |
| **To-Do** | Workspace/layout utilities: `Grid`, `DockManager`, `LayoutManager`, `Masonry`, drag/drop, fullscreen, hide-on-scroll | Complete Grid's container/common-layout/custom-column documentation and verify the exact responsive API; port layout state, docking/auto-hide panels, resizing, serialization if exposed, responsive masonry, and idiomatic hooks/components for directive behaviors. | **P1-13** |
| **Complete** | Rich media: `ImageEditor` | Port the Angular image editor's actual public feature set and docs, using React state/callback conventions and the existing token/icon/provider infrastructure. | **P1-14** |
| **Complete** | Scheduling: `Scheduler`, `GanttChart` | Implemented in the React scheduler/Gantt counterparts with controlled calendar/event/task APIs, callbacks, glyphs, restrictions, scales, conflict/critical-path utilities, undo/virtual-scroll behavior, localized/RTL/token-aware chrome, docs, and focused tests. See `ANGULAR_PARITY_P1-15_MATRIX.md`. | **P1-15** |
| **To-Do** | Remaining same-name components: `AppShell`, `Fab`, `FilterExpression`, `Mention`, `Scrollbar`, `Splitter` | Verify AppShell against the Angular block; align Fab events, FilterExpression nesting/removal/chrome, Mention localized placeholder/search/insert behavior, Scrollbar's horizontal/both-axis docs, and Splitter key increment/thin mode/drag lifecycle. | **P1-16** |

### P2 — visualization, effects, docs blocks, and docs platform

| Status | Area/components | Required update | Prompt |
| --- | --- | --- | --- |
| **To-Do** | Shared chart framework and all 25 existing React charts | Port Angular's base chart config: responsive measurement, theme/accent revision, harmony palettes, interactive legend, zoom/pan/reset, tooltip/config contracts, localized labels, accessibility, animation, common axes, and interaction callbacks. Reconcile every existing chart's props and docs after the shared kernel is in place. | **P2-01** |
| **To-Do** | Missing charts | Add `CylinderChart`, `DiagramEditor`, `FishboneChart`, `GraphChart`, `MapChart`, `PerformanceGraph`, `PyramidChart`, tiny charts (`TinyBar`, `TinyLine`, `TinyPie`, `TinyDonut`, `TinyStacked`), `VennChart`, and `WheelDiagram`. | **P2-02** |
| **To-Do** | Existing effects: `Sparkles`, `Confetti`, `Shimmer`, `Rainbow`, `Shine`, `Glow`, `Marquee`, `Fade` | Align Angular controls for colors, size/count/interval, direction, speed/duration/delay, trigger/threshold/once, skeleton mode, variants/intensity, angle/width, gaps, ARIA, click triggering, and reduced-motion behavior. | **P2-03** |
| **To-Do** | Missing effects | Add `Aura`, `Fire`, `Fireworks`, `FluidFill`, `Hourglass`, `Snowflakes`, `Thermometer`, and `WheelOfFortune` with docs, reduced-motion handling, exports, and tests. | **P2-04** |
| **To-Do** | Blocks | React has App Shell, Dashboard, Authentication, Settings, Feeds, Project Workspace, Support Desk, and Email. Add Angular's Charts, Cookie Consent, Operations Grid (using `Datagrid`), REST Client Workflow, and Stocks blocks; then reconcile existing block examples. | **P2-05** |
| **To-Do** | Documentation platform | Align package/symbol badges, nav/search metadata, per-page API coverage, section scrubber/deep links, mobile previews, docs i18n, and accessibility guidance. CodePreview, focus utilities, and Highlight already exist in React, but their docs should be rechecked when the shared docs shell is updated. Analytics/privacy-consent behavior is optional unless the React docs site will collect analytics. | **P2-06** |

### P3 — distinct product families

| Status | Area/components | Required update | Prompt |
| --- | --- | --- | --- |
| **To-Do** | Mobile family | Add all 21 Angular mobile surfaces: `ActionSheet`, `AppBar`, `BottomSheet`, mobile `Button`, `Card`, `Cell`, `Chip`, `EmptyState`, `Fab`, `Field`, `IconButton`, `List`, `Page`, `SearchBar`, `Segmented`, `Select`, `Spinner`, `Switch`, `TabBar`, `TextField`, and `Textarea`. Decide whether they are distinct `Mobile*` exports or a documented responsive mode without colliding with desktop names. | **P3-01** |
| **To-Do** | AI component family | Add Angular's AI Actions, Agent Selector, Approval, Artifact, Chat, Citation, Command Palette, Composer, Context Panel, Conversation Sidebar, Diff Review, Editor Toolbar, Error Recovery, Feedback, Gallery, Generation Controls, Handoff, Indicator, Inline Suggestion, Knowledge Picker, Memory Manager, Message, Model Selector, Notifications, Onboarding, Retrieval Results, Search, Settings, Structured Card, Suggestions, Template Picker, Tool Call, Usage Meter, Voice Controls, and Workflow Timeline. | **P3-02** |
| **To-Do** | AI patterns | Port the documented Agent, Chat, Copilot, Editor, Generator, Search, and general AI patterns as composed React examples after the AI primitives exist. | **P3-03** |

### P4 — inspected items with no material update found

| Status | Foundation/component | Notes |
| --- | --- | --- |
| **Complete** | Voice & Tone | Angular and React guidance cover the same principles, voice traits, tone spectrum, writing guidelines, component copy, formatting, and inclusive language. |
| **Complete** | `AspectRatio` | Ratios, image/video/embed use, numeric ratio, docs, and API align. |
| **Complete** | `Avatar` | Image/fallback, shape, status, sizes, docs, and API align. |
| **Complete** | `AvatarGroup` | Max visible, size, overflow, spacing, border, stack order, docs, and API align. |
| **Complete** | `Button` | Variants, sizes, icons, icon-only accessibility via native `aria-label`, states, active state, native type/disabled/value, and click callback align idiomatically. |
| **Complete** | `Coachmark` | Tour flow, placement, arrow/backdrop options, events/callbacks, methods, keyboard support, and docs align. |
| **Complete** | `Empty` | Sizes, border, icon/actions, standard use cases, docs, and API align. |
| **Complete** | `Kbd` | Keys/chords, sizes, contextual use, docs, and API align. |
| **Complete** | `Lightbox` | Captions, thumbnails, single image, zoom, index/close callbacks, keyboard behavior, docs, and API align. |
| **Complete** | `List` | Basic/team/inbox/notification examples, variants/sizes, trailing actions, item line structure, and callbacks align. |
| **Complete** | `MessageBar` | Variants, title, actions, dismissibility, callbacks, docs, and API align. |
| **Complete** | `Pager` | Total/page size, variants, sizes, compact mode, sibling count, callbacks, docs, and API align. |
| **Complete** | `PasswordProgress` | Interactive scoring, strength levels, optional label, docs, and API align. |
| **Complete** | `Rating` | Sizes, colors, half values, shapes, read-only/disabled states, keyboard behavior, docs, and API align. |
| **Complete** | `Timeline` | Basic items, dot colors, icons, docs, and API align. |

## Existing React component status inventory

This inventory prevents an existing folder from being mistaken for parity.

### Complete

`aspect-ratio`, `avatar`, `avatar-group`, `button`, `coachmark`, `empty`, `kbd`, `lightbox`, `list`, `message-bar`, `pager`, `password-progress`, `rating`, `timeline`.

### To-Do

`accordion`, `alert`, `app-header`, `app-shell`, `badge`, `barcode`, `block-editor`, `breadcrumb`, `button-group`, `calendar`, `card`, `carousel`, `checkbox`, `code-editor`, `combobox`, `command-palette`, `credit-card`, `datagrid`, `date-picker`, `date-range-picker`, `datetime-picker`, `diff-editor`, `drawer`, `dropdown`, `editor`, `fab`, `file-upload`, `filter-expression`, `gantt-chart`, `git-graph`, `grid`, `grid-combobox`, `image-compare`, `inplace-editor`, `input`, `kanban`, `markdown-editor`, `masked-input`, `mention`, `modal`, `nav-menu`, `otp-input`, `overflow`, `panel`, `password-input`, `popover`, `progress-bar`, `radio`, `range`, `range-calendar`, `scheduler`, `scrollbar`, `segmented-control`, `select`, `sidebar`, `signature-pad`, `slider`, `snackbar`, `spinner`, `split-button`, `splitter`, `stat-card`, `stepper`, `switch`, `tabs`, `terminal`, `textarea`, `time-picker`, `toast`, `toolbar`, `tooltip`, `tree`, `window`.

All 25 existing React chart components and all 8 existing React effects are **To-Do** because the Angular shared chart/effect contracts have advanced beyond the React implementations.

## Copy/paste implementation prompts

Use one prompt at a time, in priority order. Replace `<PROMPT_ID>` with the requested row.

### P0-01 — foundation tokens

> Audit and implement P0-01 from `ANGULAR_PARITY_AUDIT.md`. Treat `../spruce-ng/projects/spruce-ui/tokens` and the Angular foundation docs as the source of truth. Bring React CSS tokens, typed constants, exact `SpruceTokenKey`/component-token unions, static/programmatic exports, and foundation docs to parity. Preserve React conventions and do not copy Angular framework mechanics. Add tests for token presence, theme switching, density selectors, and type safety; update exports/routes/sidebar; run `npm run build`, `npm run docs:build`, and `npm run lint`.

### P0-02 — themes, accents, harmony, presets

> Audit and implement P0-02 from `ANGULAR_PARITY_AUDIT.md`. Compare Angular `theme.service.ts`, accent presets/harmony, theme provider/switcher, all presets, and theming/color-harmony docs with React `src/theme`, `SpruceProvider`, and docs. Implement idiomatic React provider/hooks with persistence, `data-theme-preset`, accents, custom color, harmony, revision/palette state, all missing presets, and the full switcher/docs experience. Add light/dark/system/custom/accent/harmony tests and verify both themes.

### P0-03 — i18n and RTL

> Audit and implement P0-03 from `ANGULAR_PARITY_AUDIT.md`. Use Angular core i18n labels, service, locales, and internationalization docs as the behavioral baseline. Build a typed React provider/hook with locale packs, label overrides, interpolation, formatting, direction/RTL, and component-consumable defaults. Wire every applicable component without breaking controlled props. Add Internationalization docs and locale/RTL/accessibility tests; run all React verification commands.

### P0-04 — Datagrid

> Implement P0-04 from `ANGULAR_PARITY_AUDIT.md`. Use only Angular `projects/spruce-ui/datagrid` and its Datagrid docs as the grid baseline; do not port or extend the old Angular/React Datagrid API. Create a generic typed React `Datagrid` with idiomatic render props/components for cell templates, editors, details, detail pane, and leading actions; port every applicable input/output/public method, data-context adapter, keyboard/ARIA behavior, CSS/token behavior, docs example, and test. Export all public types. Replace the React docs navigation route with Datagrid and document the legacy Datagrid migration/deprecation. Run build, docs build, lint, interaction tests, and light/dark visual checks.

### P0-05 — core data

> Implement P0-05 from `ANGULAR_PARITY_AUDIT.md`. Compare `../spruce-ng/projects/core-data` with React `src/data`. Port all framework-neutral missing behavior: detail sources/context manager, form model/bridge, undo, cursor, NodeStore, errors, types, and adapters. Expose idiomatic React hooks while preserving non-React data classes. Add unit tests matching Angular scenarios, update docs/exports, and verify Datagrid/FormBuilder integration boundaries.

### P0-06 — tests and accessibility baseline

> Implement P0-06 from `ANGULAR_PARITY_AUDIT.md`. Add the minimal React test stack consistent with this Vite/React 19 repository, shared render helpers with `SpruceProvider`, user interaction utilities, axe checks, keyboard/focus assertions, theme/RTL helpers, and CI scripts. Seed tests for providers, Button, overlays, form validation, and Datagrid. Do not rewrite components except for defects exposed by the tests.

### P1-01 through P1-16 — component batches

> Implement <PROMPT_ID> from `ANGULAR_PARITY_AUDIT.md`. Read the named Angular source package(s) and documentation pages first, then inspect every listed React counterpart. Produce a property/behavior/event/accessibility matrix, implement every applicable Angular feature using idiomatic controlled React props and callbacks, add missing components/types/CSS/exports/docs routes/sidebar entries, and add focused tests. Treat design tokens, i18n, RTL, keyboard behavior, and light/dark themes as required. Do not copy Angular-only dependency injection, signals, or directives literally. Run `npm run build`, `npm run docs:build`, `npm run lint`, and the relevant tests before reporting completion.

### P2-01 — chart kernel and existing charts

> Implement P2-01 from `ANGULAR_PARITY_AUDIT.md`. Compare Angular chart core/base/config/colors/axes/interactions and every existing matching chart with React `src/charts`. Build the shared React chart kernel first, including responsiveness, token/harmony theme refresh, interactive legend, zoom/pan/reset, tooltip/config, localization, animation, accessibility, and callbacks. Migrate all 25 React charts onto it, reconcile their individual APIs/docs, and add interaction/visual tests. Avoid one-off duplication across charts.

### P2-02 through P2-06 — missing charts, effects, blocks, docs

> Implement <PROMPT_ID> from `ANGULAR_PARITY_AUDIT.md`. Use the listed Angular source and docs as the behavioral baseline. Port every applicable feature into idiomatic React, reuse the shared design-system infrastructure, add public types/exports and complete CodePreview docs, register routes/sidebar entries, add accessibility/reduced-motion/interaction tests, and run the full React verification suite.

### P3-01 — mobile family

> Implement P3-01 from `ANGULAR_PARITY_AUDIT.md`. First write an ADR choosing distinct `Mobile*` exports versus responsive modes for existing components, avoiding public-name collisions. Then port all 21 Angular mobile surfaces, shared mobile tokens/layout behaviors, touch/keyboard/accessibility behavior, mobile preview docs, exports, and tests. Reuse desktop primitives when behavior is truly shared, but preserve documented mobile-specific interactions.

### P3-02 and P3-03 — AI family and patterns

> Implement <PROMPT_ID> from `ANGULAR_PARITY_AUDIT.md`. Read the complete Angular AI package and AI docs section first. Port the listed primitives with typed model/tool/citation/approval/status contracts, streaming and resilient states where documented, keyboard/accessibility behavior, i18n, tokens, docs, and tests. Build composed AI patterns only after their primitive dependencies exist; do not bake application-specific network clients into the design-system components.

## Verification gate for every To-Do

1. Public React props/types and callbacks cover every applicable Angular input/output/public method.
2. Visual states, tokens, themes, density, RTL, and reduced motion match.
3. Keyboard, focus, roles, labels, and WCAG AA behavior match.
4. `src/index.ts` exports the component and types.
5. Docs include live examples and a complete API table, route, sidebar entry, and both light/dark verification.
6. Focused tests exist for new behavior.
7. `npm run build`, `npm run docs:build`, `npm run lint`, and relevant tests pass.
