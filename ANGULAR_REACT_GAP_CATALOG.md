# Angular to React gap catalog

Audit date: 2026-09-07

Angular baseline: `C:\Users\acasauran\Documents\Spruce\spruce-ng`

React target: `C:\Users\acasauran\Documents\Spruce\spruce-ui-react`

This catalog supersedes the inventory and status conclusions in `ANGULAR_PARITY_AUDIT.md` dated 2026-08-24. Many items in that older audit have since been implemented.

## Status legend

| Flag | Meaning |
| --- | --- |
| **TODO** | A documented/exported Angular surface is absent from React, or the React counterpart is missing material current behavior. |
| **Complete** | The React implementation has the material Angular behavior, allowing idiomatic React names, callbacks, children, render props, hooks, and providers. |
| **Not applicable** | The difference is framework-only, a route alias, deprecated/legacy, or an unexported and unrouted artifact that should not be copied without a product decision. |

## Audit method and headline result

The comparison covered Angular docs navigation and routes, library barrels, component inputs/outputs, package families, tests, and the matching React exports, components, docs pages, routes, providers, hooks, tokens, and focused parity matrices.

- All 15 Angular Foundation topics have React counterparts.
- All 35 Angular chart pages have React counterparts; React also documents its shared chart kernel.
- All 12 currently routed Angular/React block examples are present in React.
- The active Angular docs surfaces that have no React page are three general components, two effects/docs subjects, all 21 Mobile pages, and all 41 AI pages.
- The previously recorded current-API deltas for `Datagrid`, the six date controls, `GridCombobox`, the `StatCard` family, and `Modal` are closed in React.
- React now exports the reusable `ThemeSwitcher`/`ThemeSwitcherPanel` and `HarmonyWheel` surfaces alongside the shared theme runtime.
- React now generates Figma/Tokens Studio/DTCG and Penpot token deliverables from its canonical CSS tokens and theme preset sources, with deterministic check/generate scripts and CI validation.

The prompts linked from each **TODO** row are copy-paste implementation prompts in [Implementation prompts](#implementation-prompts).

## Foundation

| Flag | Angular area | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | Colors, Typography, Spacing, Borders, Density, Shadows | Matching foundation pages and token-backed CSS exist. The strict `SpruceTokenKey` and separate custom-token key avoid the old untyped escape hatch. | No action. |
| **Complete** | Iconography, Background motifs, Illustrations | React contains the icon, flag, motif, and illustration collections plus the corresponding docs. | No action. |
| **Complete** | Theming, Color harmony | Theme runtime, accents, harmony calculations, preset metadata, persistence, and docs exist. Reusable theme UI gaps are tracked under Themes. | No action. |
| **Complete** | Motion, Voice & Tone, Internationalization, Accessibility | React has the foundation docs, reduced-motion support, i18n provider/hooks and locale packs, RTL direction, formatting, and accessibility guidance. | No action. |
| **Complete** | Design-tool token delivery | React generates DTCG and Tokens Studio JSON, Figma plugin assets, Penpot plugin/token files, and a foundations board from the canonical React tokens and all 34 presets. `tokens:check` enforces reproducibility in CI. | No action. |
| **Not applicable** | Angular routes use `/foundations/*` | React deliberately uses `/foundation/*`; this is a routing convention, not a missing feature. | No action. |

## Design systems and core contracts

| Flag | Angular area | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | Design tokens and typed token API | Current CSS token coverage and typed token access are present. Apparent Angular-only `--sp-control-*`, `--sp-frosted-*`, and `--sp-shadow-*` scan hits are family prefixes rather than missing individual tokens. | No action. |
| **Complete** | Core data contracts | `DataContext`, local/remote data sources, detail source/manager, form model/bridge, errors, undo, navigation cursor, node store, adapters, and hooks exist in React. | No action. |
| **Complete** | Positioning, focus, overlays, direction, i18n, chrome, motifs | React has framework-appropriate utilities/providers and the focused parity tests/matrices for these shared contracts. | No action. |
| **Complete** | Canonical data-grid option set | React `Datagrid` remains canonical and now covers the current Angular option matrix while retaining established React aliases and DataGridEx-style presentation. | No action. |
| **Not applicable** | Angular signals, dependency injection, services, content projection, template directives, and route guards | React uses controlled props, callbacks, hooks, context/providers, children/render props, and components for the same user-facing behaviors. Angular syntax should not be ported literally. | No action. |
| **Not applicable** | Angular `signal-forms`, `focus-directives`, `mention-directive`, and template-marker docs | Their behaviors are covered by React's form model/controlled controls, focus utilities, `Mention`/editor APIs, and render props. These are not missing React components. | No action. |
| **Not applicable** | Legacy `Datagridex` | React intentionally keeps `Datagrid` as the canonical implementation. Reintroducing the legacy grid would create two competing grids. | No action. |
| **Not applicable** | Angular multi-package topology | React is a single design-system package. Package boundaries are not a parity requirement when public imports remain stable. | No action. |

## Components

### Actions and navigation

| Flag | Angular surface | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | Button, Button Group, Split Button, Tabs, Breadcrumbs, Stepper, Segmented Control, FAB, Navigation Menu, Toolbar, Pager, Accordion, Overflow | Material APIs, accessibility, tokens, docs, and idiomatic React callbacks are present. | No action. |
| **Complete** | `Anchor`, `AnchorItem`, `AnchorTarget` | React provides data-driven/declarative nesting, target component/hook registration, scrollspy and smooth scrolling, all rail aliases, scrubber behavior, orientation, affix modes, controlled state, keyboard support, and docs/tests. | [C-01](#c-01--anchor-navigation) |

### Data display and productivity

| Flag | Angular surface | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | Badge, Kbd, Progress Bar, Circular Progress, Avatar, Avatar Group, Spinner, Empty, Timeline, Git Graph, Tree, Barcode/QR, Credit Card, Scheduler, Gantt, Kanban, Terminal, PDF Viewer, Rating, Carousel, Lightbox, Image Compare, Image Editor, Aspect Ratio, List, Table, Compose Bar, Comment Thread, Property Panel, Text Diff, entitlement/feature gate | React counterparts and docs exist with the material current behaviors. | No action. |
| **Complete** | `Datagrid` current option set | React's canonical grid now includes current shell, display, selection, resize/reorder, editing, loading, hierarchy, new-row, pinned-control, filter-panel, class-hook, and lifecycle options, with compatibility aliases. | No action. |
| **Complete** | `StatCard`, `StatGroup`, `StatDivider` | React includes flat/icon/trend/inline cards plus typed strip/grid/stack groups, bordered behavior, and accessible dividers. | No action. |
| **Not applicable** | `PlanCards` source file | The Angular file is not exported from the current data-display barrel and has no active docs route; React removed its old copy. Restore only after a product/API decision. | No action. |

### Forms and inputs

| Flag | Angular surface | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | Field, Form Layout, Input Group, Checkbox, Radio, Switch, Input, Property Panel, Select, Combobox, Lookups, Dropdown, Textarea, Mention, Color Picker, Emoji Picker, Password Input/Progress, OTP, Masked Input, Slider/Range, File Upload, Editor, Block Editor, Comment Thread, Markdown Editor, Code Editor, Diff Editor, Text Diff, In-place Editor, Signature Pad, Filter Expression, Form Builder | React counterparts, controlled value callbacks, docs, styling, and the shared form foundation exist. Exceptions are separated below. | No action. |
| **Complete** | Calendar, Range Calendar, Date Picker, Date Range Picker, Time Picker, Datetime Picker | All six controls share readonly/hidden/invalid/error/required/touched semantics and accessible feedback; picker overlays also expose the applicable label, variant, placement, modal, and dismissal controls. | No action. |
| **Complete** | `GridCombobox` | React supports controlled single/multiple values, leading icons, variants, search fields, panel and column resizing, shared field validation, and accessible keyboard/ARIA behavior. | No action. |
| **Complete** | `TreeCombobox` | React provides typed local/remote hierarchy lookup, single/cascade multiple selection, shared field states, tree interaction, virtualization, render props, docs, and tests. | [C-05](#c-05--treecombobox) |
| **Complete** | `TreeGridCombobox` | React provides typed hierarchical grid lookup with Datagridex-informed columns/resizing, local/remote sources, cascade selection, field states, treegrid interaction, docs, and tests. | [C-06](#c-06--treegridcombobox) |

### Layout, overlays, and shell

| Flag | Angular surface | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | Card, Panel, Grid, Masonry, Splitter, Layout Manager, Dock Manager, Compose Bar, Sidebar, App Header, Drawer, Window, Alert, Message Bar, Popover, Tooltip, Notification Center, Toast, Snackbar, Command Palette, Coachmark, App Shell | React counterparts cover the material public behavior and docs. | No action. |
| **Complete** | `Modal` | React exposes token-safe `headerBackground` and `footerBackground` values scoped to their respective regions. | No action. |
| **Not applicable** | `CompanySwitcher` source file | The Angular file is not exported by the current sidebar barrel and has no active nav entry; React intentionally removed its previous copy. Restore only after a product/API decision. | No action. |

### Charts

| Flag | Angular surface | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | Area, Bar, Bar Race, Bubble, Calendar Heatmap, Candlestick, Combo, Cylinder, Diagram Editor, Fishbone, Funnel, Gauge, Graph, Grouped Bar, Heatmap, Histogram, Line, Map, Org, Performance Graph, Pie, Polar Line, Pyramid, Radar, Sankey, Scatter, Sparkline, Stacked Area, Stacked Bar, Sunburst, Tiny Charts, Treemap, Venn, Waterfall, Wheel Diagram | All 35 Angular chart pages have React counterparts. React also documents the shared chart kernel. | No action. |

### Effects and animations

| Flag | Angular surface | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | Sparkles, Confetti, Shimmer, Rainbow, Shine, Glow, Aura, Marquee, Fade, Ripple, Tilt, Shake, Icon Motion, Slide, Number Ticker, Fire, Snowflakes, Fluid Fill, Hourglass, Thermometer, Wheel of Fortune, Fireworks | React components/pages exist with token-aware and reduced-motion behavior. | No action. |
| **Complete** | `ContentTransition`, front/back faces, `FlipCard` | React provides typed front/back nodes and render props, all transitions/triggers, controlled and uncontrolled state, imperative controls, accessible face visibility, reduced motion, RTL, docs, and tests. | [C-08](#c-08--contenttransition-and-flipcard) |

### Mobile family

React has no distinct mobile package or documented responsive equivalents for these 21 Angular surfaces. The implementation prompts deliberately use `Mobile*` public names to avoid collisions with desktop components; a different naming decision should be documented before implementation.

| Flag | Angular surfaces | React result | Prompt |
| --- | --- | --- | --- |
| **TODO** | Page, App Bar, Tab Bar | Missing mobile shell/navigation primitives. | [C-09](#c-09--mobile-shell-and-navigation) |
| **TODO** | Bottom Sheet, Action Sheet | Missing mobile overlay/action primitives. | [C-10](#c-10--mobile-sheets) |
| **TODO** | Button, Icon Button, FAB, Segmented, Switch | Missing mobile action/selection variants. | [C-11](#c-11--mobile-actions-and-selection) |
| **TODO** | Field, Search Bar, Select, Text Field, Textarea | Missing mobile form controls and field composition. | [C-12](#c-12--mobile-forms) |
| **TODO** | Card, Cell, Chip, Empty State, List, Spinner | Missing mobile content/status primitives. | [C-13](#c-13--mobile-content-and-status) |

### AI family

React has no AI component package or `/ai/*` docs. Every Angular AI component route is covered by the groups below.

| Flag | Angular surfaces | React result | Prompt |
| --- | --- | --- | --- |
| **TODO** | Chat, Message, Composer, Actions, Suggestions, Indicator, Tool Call, Approval, Citation/Citation List, Artifact, Context Panel | Missing conversation primitives. | [C-14](#c-14--ai-conversation-primitives) |
| **TODO** | Conversation Sidebar, Template Picker, Model Selector, Agent Selector | Missing conversation shell and selection controls. | [C-15](#c-15--ai-shell-and-selectors) |
| **TODO** | Knowledge Picker, Retrieval Results, AI Command Palette | Missing AI knowledge and command surfaces. | [C-16](#c-16--ai-knowledge-and-commands) |
| **TODO** | Editor Toolbar, Inline Suggestion, Diff Review, Structured Card | Missing AI editing/review surfaces. | [C-17](#c-17--ai-editing-and-review) |
| **TODO** | AI Search, Generation Controls, Gallery | Missing search and generation surfaces. | [C-18](#c-18--ai-search-and-generation) |
| **TODO** | Workflow Timeline, Memory Manager, Settings, Usage Meter, Feedback | Missing agent/governance surfaces. | [C-19](#c-19--ai-agents-and-governance) |
| **TODO** | Error Recovery, Voice Controls, Human Handoff, Notifications service, Onboarding | Missing resilience, voice, and lifecycle surfaces. | [C-20](#c-20--ai-resilience-and-voice) |

## Blocks

| Flag | Angular area | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | App Shell, Dashboard, Authentication, Settings, Email, Feeds, Project Workspace, Support Desk, Charts, Cookie Consent, Operations Grid, Stocks | All 12 active block examples exist in React docs. Operations Grid uses the canonical React `Datagrid`. | No action. |
| **Not applicable** | REST Client Workflow source page | It is not active in the current Angular router/navigation and its prior React page was retired. Treat it as archived content unless it is formally restored in Angular. | No action. |

## Themes

| Flag | Angular area | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | Theme provider/runtime, persistence, light/dark/system modes, density, reduced motion, accent colors, custom accent, harmony schemes/custom offsets, palette revision | React `ThemeProvider`/`useTheme` and docs cover the current runtime behavior. | No action. |
| **Complete** | Theme presets | React contains the same 34 preset set as Angular. | No action. |
| **Complete** | Exported `ThemeSwitcher` and `ThemeSwitcherPanel` | Reusable library surfaces now provide icon/button/menu/custom triggers, controlled panel state, theme/accent/harmony choices, density, reduced motion, callbacks, and responsive accessible styling. | No action. |
| **Complete** | Exported `HarmonyWheel` | The library wheel supports controlled base/selection editing, pointer/touch/keyboard input, disabled state, readout, scheme snapping, high contrast, and reduced motion. | No action. |

## Docs

| Flag | Angular area | React result | Prompt |
| --- | --- | --- | --- |
| **Complete** | Docs shell/platform | Package badges, metadata/search, section scrubber and deep links, mobile preview, docs i18n, CodePreview, property inspector/split pane, focus utilities, highlighting, responsive sidebar, back-to-top, and accessibility guidance exist. | No action. |
| **Complete** | Docs for every component/theme TODO above | All currently exported/routed React surfaces have discoverable routes, sidebar/search metadata, package badges, and coverage tests. Pages for future C/T surfaces remain gated until their public APIs exist. | [D-01](#d-01--documentation-registration-and-coverage) |
| **Complete** | Effects choreography | React now documents cross-effect sequencing, timing, interruption/cancellation, layering, focus safety, and reduced-motion fallbacks with three live compositions. | [D-02](#d-02--effects-choreography-page) |
| **TODO** | Six AI composed patterns: Chat Assistant, In-App Copilot, AI Search, Document Editor, Autonomous Agent, Multimodal Generator | Blocked until the public React AI primitives in C-14–C-20 exist; adding page-local stand-ins would violate the pattern-page contract. | [D-03](#d-03--ai-pattern-pages) |
| **Not applicable** | Angular route aliases/redirects, including illustration aliases and standalone Datagrid full-demo route | React folds these into canonical pages. Separate URLs do not add behavior. | No action. |
| **Not applicable** | Global analytics/privacy consent | Angular docs initializes analytics/consent. React docs does not currently collect analytics, so a global consent mechanism is unnecessary until telemetry is introduced. The Cookie Consent block itself is already complete. | No action. |
| **Not applicable** | Standalone chart/grid performance analysis and solution Markdown files | These Angular files are internal engineering notes and are not routed product documentation. They may be copied as project notes if desired, but they are not a React component/docs parity requirement. | No action. |

## Implementation prompts

Each prompt targets the React repository and treats Angular as behavioral reference, not code to copy literally.

### F-01 — Design-tool token exports

**Status: Complete (2026-09-08).**

```text
Add a reproducible design-tool token export workflow to C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the framework-neutral artifacts under C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\tokens as the reference: Figma plugin files, DTCG JSON, Tokens Studio JSON, Penpot plugin files/foundations board, and their generation scripts/READMEs. Generate from React's canonical token and preset sources rather than maintaining a second hand-edited token set. Preserve semantic token names, modes/presets, aliases, descriptions, deterministic ordering, and validation. Add package scripts for check/generate, ensure generated artifacts are reproducible with no diff, document the workflow and ownership, and add a CI-safe validation test. Do not introduce Angular or SCSS runtime dependencies into the React library. Run the token checks plus npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-01 — Anchor navigation

**Status: Complete (2026-09-08).**

```text
In C:\Users\acasauran\Documents\Spruce\spruce-ui-react, implement React parity for Angular's Anchor family using C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\navigation\src\lib\anchor.ts and its Angular docs/tests as the behavioral reference. Add typed Anchor, AnchorItem, and an idiomatic AnchorTarget component/hook. Cover data-driven and declarative nested items, line/stepped/timeline/scrubber/bracket/curved/magnifier variants, sm/md/lg sizes, vertical/horizontal orientation, affix/affixTop, title/indicator controls, scroll container and offsets, scrollspy, smooth scrolling, active state, scrubber geometry/fisheye behavior, active-change and click callbacks, keyboard support, reduced motion, RTL, and accessible labels. Use Spruce tokens and sp- BEM CSS. Export components/types from src/index.ts, add the docs page/sidebar/route and CodePreview examples, and add focused interaction/accessibility tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-02 — StatCard family delta

**Status: Complete (2026-09-07).**

```text
Update the React StatCard family in C:\Users\acasauran\Documents\Spruce\spruce-ui-react against the current Angular reference at C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\data-display\src\lib\stat-card.ts. Add the inline StatCard variant and typed StatGroup/StatDivider exports. Support StatGroup strip/grid/stack variants and bordered behavior while preserving existing flat/icon/trend APIs. Use token-based CSS, responsive layout, accessible semantics, and idiomatic React children. Update src/index.ts and the StatCard docs with live examples/API tables, and add tests for each variant, group layout, divider, and regression behavior. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-03 — Date control contract

**Status: Complete (2026-09-07).**

```text
Bring Calendar, RangeCalendar, DatePicker, DateRangePicker, TimePicker, and DatetimePicker in C:\Users\acasauran\Documents\Spruce\spruce-ui-react up to the current Angular behavior in C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\dates\src\lib. Preserve controlled React values/onChange and existing showOtherMonths/selectOtherMonths names. Add the shared readonly, hidden, invalid, errors, required, touched/blur semantics and accessible error wiring. Where Angular exposes them, add label, floatingLabel, default/outline/outlined/filled variant, placement, constrainToModal, dismissOnScroll, and dismissOnClickOutside. Keep locale-aware parsing/formatting, RTL, keyboard navigation, focus restoration, portals, adjacent-month selection, and disabled-date rules correct. Factor shared typed helpers rather than duplicating six implementations. Update exports, all six docs pages/API tables/examples, and focused a11y/interaction tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-04 — GridCombobox current API

**Status: Complete (2026-09-07).**

```text
Update React GridCombobox in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\forms\src\lib\grid-combobox.ts and its docs/tests as the behavioral reference. Add controlled single/multiple value support, leading icon, field visual variant, configurable searchFields, and panel resizing while preserving resizableColumns. Reconcile selection, filtering, remote/data-source behavior, placement/dismissal, field validation, keyboard grid/combobox semantics, ARIA relationships, RTL, and render-prop customization. Avoid Angular template/directive APIs. Update public types/exports, docs examples/API tables, and tests for multiple selection, search fields, resizing, keyboard use, and validation. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-05 — TreeCombobox

**Status: Complete (2026-09-08).**

```text
Implement a typed React TreeCombobox in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\forms\src\lib\tree-combobox.ts and its docs/tests as the behavioral reference. Support controlled string/string[] values, local arrays, existing React data-source adapters and URL-backed loading where supported, configurable display/value/children/search fields, icon, auto-open, placeholder, label/floating label, validation states, placement/dismissal, single/multiple selection, cascade selection, expand-all/expand-on-click, tree lines, selected item reporting, option/empty render props, paging/virtual behavior where Angular documents it, and loading/error/empty states. Implement WAI-ARIA combobox/tree keyboard behavior, focus restoration, RTL, i18n, token CSS, and no hard-coded colors. Export components/types, register a complete docs page/sidebar/route, and add interaction/accessibility/data-source tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-06 — TreeGridCombobox

**Status: Complete (2026-09-08).**

```text
Implement a typed React TreeGridCombobox in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\forms\src\lib\tree-grid-combobox.ts and its docs/tests as the behavioral reference. Reuse React TreeCombobox, Table/Datagrid, lookup, data-source, positioning, and form-foundation utilities instead of duplicating them. Support typed columns, column and panel resizing, controlled single/multiple selection, cascade and indeterminate states, hierarchy expansion, searchFields, local/remote sources, field states, placement/dismissal, configurable row/empty renderers, and loading/error/empty states. Implement correct combobox/treegrid ARIA and keyboard navigation, focus restoration, RTL, i18n, and token-based CSS. Export all public types/components, add docs navigation/route with comprehensive examples and API tables, and add interaction/accessibility/data tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-07 — Modal header and footer backgrounds

**Status: Complete (2026-09-07).**

```text
Update React Modal in C:\Users\acasauran\Documents\Spruce\spruce-ui-react against C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\overlays\src\lib\modal.ts. Add typed headerBackground and footerBackground public props with token-safe values consistent with the existing Spruce chrome/background conventions. Apply them only to their regions without breaking padding, sticky layouts, focus trap/restore, portals, themes, or RTL. Document both props with live examples, add regression tests for default/custom backgrounds and absent header/footer regions, and update exports if new public types are introduced. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-08 — ContentTransition and FlipCard

**Status: Complete (2026-09-08).**

```text
Implement React ContentTransition and FlipCard in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\effects\src\lib\content-transition.ts and its Angular tests/docs as the behavioral reference. Model front/back content as typed React children or explicit render props, not directives. Cover all transition types and hover/click/focus/manual triggers, controlled/uncontrolled active state where appropriate, callbacks, perspective and sizing behavior, keyboard/focus activation, pointer coarse-device behavior, reduced-motion fallback, RTL where directional, and accessible front/back visibility. Add token-based sp- BEM CSS, exports, a docs page/sidebar/route with CodePreview examples, and focused tests for triggers, manual control, accessibility, and reduced motion. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-09 — Mobile shell and navigation

```text
Start the React mobile family in C:\Users\acasauran\Documents\Spruce\spruce-ui-react by implementing MobilePage, MobileAppBar, and MobileTabBar from the Angular behavior/docs under C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\mobile. First document the collision-free Mobile* naming/export policy. Preserve safe-area insets, fixed/sticky regions, scrolling ownership, active tab state, badges/icons, keyboard/focus behavior, RTL, reduced motion, responsive boundaries, and accessible landmarks/navigation. Use shared Spruce icons/tokens and sp- BEM CSS. Export typed APIs, add the three /mobile docs routes/sidebar entries with mobile previews, and add layout/interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-10 — Mobile sheets

```text
Implement MobileBottomSheet and MobileActionSheet in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the matching Angular mobile sources/docs/tests in C:\Users\acasauran\Documents\Spruce\spruce-ng as the behavioral reference. Reuse React portal, focus, positioning, and overlay utilities. Cover controlled open state, snap/height behavior, drag dismissal, backdrop/Escape/outside behavior, focus trap/restore, safe areas, action roles including destructive/disabled states, scroll locking, reduced motion, touch and keyboard use, i18n, RTL, and accessible labels/descriptions. Use token CSS, export typed APIs, add /mobile docs routes with mobile previews, and add interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-11 — Mobile actions and selection

```text
Implement collision-free MobileButton, MobileIconButton, MobileFab, MobileSegmented, and MobileSwitch APIs in C:\Users\acasauran\Documents\Spruce\spruce-ui-react from the corresponding Angular mobile sources/docs in C:\Users\acasauran\Documents\Spruce\spruce-ng. Reuse desktop primitives only where behavior and touch geometry remain correct. Match mobile sizes/variants, icons, loading/disabled/active states, FAB placement, controlled selection/checked values, value-not-event callbacks, minimum touch targets, icon-only aria-label requirements, RTL, reduced motion, and token styling. Export typed APIs, add five /mobile docs pages with mobile previews and API tables, and add keyboard/pointer/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-12 — Mobile forms

```text
Implement MobileField, MobileSearchBar, MobileSelect, MobileTextField, and MobileTextarea in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the corresponding Angular mobile sources/docs in C:\Users\acasauran\Documents\Spruce\spruce-ng. Use controlled values with value-not-event onChange callbacks and integrate the existing React form-field validation contract. Match labels, hints/errors, required/readonly/disabled/hidden states, clear/search affordances, native/mobile input behavior, selection overlays, autosizing/count behavior where documented, safe areas, keyboard handling, focus visibility, i18n, RTL, and touch targets. Use Spruce tokens and sp- BEM CSS, export types/components, add five /mobile docs routes with previews, and add validation/interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-13 — Mobile content and status

```text
Implement MobileCard, MobileCell, MobileChip, MobileEmptyState, MobileList, and MobileSpinner in C:\Users\acasauran\Documents\Spruce\spruce-ui-react from the matching Angular mobile sources/docs in C:\Users\acasauran\Documents\Spruce\spruce-ng. Reuse existing primitives when semantics align, while matching mobile composition, dividers/insets, leading/trailing content, selectable/clickable states, chip removal/selection, empty actions, loading labels, touch targets, safe areas, RTL, reduced motion, and token styling. Export collision-free typed APIs, add six /mobile docs pages with mobile previews and API tables, and add semantic/interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-14 — AI conversation primitives

```text
Create the first React AI component batch in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the Angular AI package/docs/tests under C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\ai as behavioral reference: AiChat, AiMessage, AiComposer, AiActions, AiSuggestions, AiIndicator, AiToolCall, AiApproval, AiCitation/AiCitationList, AiArtifact, and AiContextPanel. Define shared typed message/content/status/tool/citation models first; keep transport/model-provider concerns injectable and out of visual components. Cover streaming, pending/error states, markdown/code/content safety, tool and approval states, copy/retry/feedback actions, keyboard/focus behavior, live regions without excessive announcements, i18n, RTL, reduced motion, and token styling. Export all APIs, add each /ai route/sidebar page with examples and API tables, and add interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-15 — AI shell and selectors

```text
Implement AiConversationSidebar, AiTemplatePicker, AiModelSelector, and AiAgentSelector in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the matching Angular AI sources/docs/tests in C:\Users\acasauran\Documents\Spruce\spruce-ng. Build on the React AI shared types and existing Sidebar/Select/Combobox/Popover components. Match controlled selection, search/filter, capabilities and metadata, loading/empty/error states, recent/pinned conversation actions, responsive collapse, keyboard navigation, focus restoration, accessible labels, i18n, RTL, and token styling. Keep provider-specific data behind typed adapters/callbacks. Export APIs, add all four /ai docs pages, and add interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-16 — AI knowledge and commands

```text
Implement AiKnowledgePicker, AiRetrievalResults, and AiCommandPalette in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the corresponding Angular AI sources/docs/tests in C:\Users\acasauran\Documents\Spruce\spruce-ng. Reuse FileUpload, List, CommandPalette, Badge, and data-source utilities. Support controlled selections, source/type metadata, upload/link states, retrieval scores/snippets/citations, grouped/fuzzy commands, shortcuts, async loading/error/empty states, virtualization where documented, keyboard/focus semantics, accessible result counts/live updates, i18n, RTL, and tokens. Keep retrieval backends injectable. Export typed APIs, add three /ai docs pages, and add data/interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-17 — AI editing and review

```text
Implement AiEditorToolbar, AiInlineSuggestion, AiDiffReview, and AiStructuredCard in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the Angular AI package/docs/tests in C:\Users\acasauran\Documents\Spruce\spruce-ng as behavioral reference. Reuse existing Editor, CodeEditor, DiffEditor, TextDiff, Popover, and Card primitives. Match selection/context actions, accept/reject/regenerate flows, streaming/pending/error states, diff navigation and decisions, structured field rendering, controlled callbacks, keyboard/focus behavior, screen-reader announcements, i18n, RTL, reduced motion, and tokens. Do not couple components to a model vendor. Export typed APIs, add four /ai docs pages, and add interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-18 — AI search and generation

```text
Implement AiSearch, AiGenerationControls, and AiGallery in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the corresponding Angular AI sources/docs/tests in C:\Users\acasauran\Documents\Spruce\spruce-ng. Define provider-neutral typed requests/results and controlled filters/settings. Match search suggestions/results/citations, generation parameter controls, progress/cancel/retry states, gallery selection/actions/metadata, empty/loading/error states, keyboard navigation, focus management, live-region restraint, responsive layout, i18n, RTL, reduced motion, and token styling. Export APIs, add three /ai docs pages, and add interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-19 — AI agents and governance

```text
Implement AiWorkflowTimeline, AiMemoryManager, AiSettings, AiUsageMeter, and AiFeedback in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the matching Angular AI sources/docs/tests in C:\Users\acasauran\Documents\Spruce\spruce-ng. Use provider-neutral typed models and controlled callbacks. Match workflow step/tool status, expandable details, memory review/edit/delete controls, model/privacy settings, usage/cost limits, rating/reason capture, loading/error/empty states, confirmation and destructive-action safeguards, keyboard/focus behavior, accessible progress/status announcements, i18n, RTL, and token styling. Export APIs, add five /ai docs pages, and add interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-20 — AI resilience and voice

```text
Implement AiErrorRecovery, AiVoiceControls, AiHandoff, an idiomatic AiNotificationProvider/useAiNotifications service API, and AiOnboarding in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the corresponding Angular AI sources/docs/tests in C:\Users\acasauran\Documents\Spruce\spruce-ng. Keep service integrations injectable. Match recoverable/fatal error actions, retry state, microphone/listening/speaking states and permissions, human handoff status/context, notification queue/severity/actions, onboarding/empty-state progression, controlled callbacks, keyboard and non-pointer alternatives, privacy-aware copy, accessible live announcements, i18n, RTL, reduced motion, and token styling. Do not copy Angular dependency-injection syntax. Export APIs, add five /ai docs pages, and add interaction/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### C-21 — Datagrid current option delta

**Status: Complete (2026-09-07); Angular Datagridex visual baseline synchronized with React Datagrid (2026-09-08).**

```text
Re-audit and close the remaining current Angular Datagrid option gaps in C:\Users\acasauran\Documents\Spruce\spruce-ui-react against C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\datagrid\src\lib\components\datagrid.ts, models\column-def.model.ts, Datagrid.md, performance notes, and tests. Preserve React's existing canonical Datagrid APIs and map Angular names idiomatically. Implement the material missing behavior: outer chrome/radius/border and density; auto row height; header casing and null text; borderless/line/hover controls; skeleton loading; selection control/append/range/hide-column and select-on-navigation options; deferred/live resize and reorder; auto-edit-on-navigation, manual async commit, dirty indicators, undo/redo and fill-down; infinite scroll and server-windowed data-source loading; tree children and nested grids; new-row position/commit timing; pinned control columns; filter-expression panel integration; cell/row class hooks; and row click/double-click/cell click/detail lifecycle callbacks. Reconcile aliases such as rows/rowData, fitColumnsToWidth/autoFit, rowDetail/detailTemplate, and columnMenu/showColumnMenu without duplicating APIs. Update types, imperative handle, docs/API matrix, virtualization constraints, i18n/RTL/a11y behavior, and focused regression/performance tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### T-01 — Library ThemeSwitcher and panel

**Status: Complete (2026-09-08).**

```text
Promote the docs-only theme switcher behavior in C:\Users\acasauran\Documents\Spruce\spruce-ui-react into reusable library components ThemeSwitcher and ThemeSwitcherPanel, using C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\theme-switcher\src\lib\theme-switcher.ts as behavioral reference. Reuse ThemeProvider/useTheme and existing Popover, Button, Icon, Select, Switch, and harmony utilities. Support icon/button/menu/custom triggers; configurable header/footer, dismissibility, heading/description, initial/default view, reset/apply/close callbacks; theme mode/presets, density, reduced motion, accent/custom accent, harmony schemes/custom offsets, and responsive layout. Preserve controlled/uncontrolled idiomatic React APIs, focus/keyboard behavior, accessible labels, RTL, and token CSS. Export types/components, refactor docs to consume the library version, document both surfaces, and add interaction/provider/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### T-02 — Library HarmonyWheel

**Status: Complete (2026-09-08).**

```text
Implement an exported React HarmonyWheel in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\spruce-ui\core\src\lib\harmony-wheel.ts and its tests/docs as behavioral reference. Reuse the existing React harmony/color utilities. Support controlled base and selection values with callbacks, disabled state, optional readout, snapTolerance, pointer/touch/keyboard editing, focus visibility, accessible value text/instructions, RTL where meaningful, and high-contrast/reduced-motion behavior. Use token-based sp- BEM CSS and avoid hard-coded theme colors. Export the component/types, integrate it into the library ThemeSwitcherPanel and Color Harmony docs, and add geometry/input/a11y tests. Run npm run build, npm run docs:build, npm run lint, and npm run test:ci.
```

### D-01 — Documentation registration and coverage

**Status: Complete for the currently exported React surface (2026-09-08).** Future component/theme TODO pages remain dependent on their corresponding C/T implementation prompts.

```text
After implementing the TODO components in C:\Users\acasauran\Documents\Spruce\spruce-ui-react, audit docs/src/App.tsx, docs/src/components/Sidebar.tsx, docs search/navigation metadata, and every affected docs page against the current Angular docs in C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\docs. Ensure every public component/type has a discoverable route, sidebar/search entry, package badge, live CodePreview, API/default table, controlled-state example, keyboard/accessibility guidance, i18n/RTL notes, reduced-motion notes where relevant, and mobile preview where relevant. Do not add Angular-only directive/signal/DI pages or legacy Datagridex. Add docs route/search tests where available, then run npm run docs:build, npm run lint, and npm run test:ci.
```

### D-02 — Effects choreography page

**Status: Complete (2026-09-08).**

```text
Add a React Effects Choreography documentation page in C:\Users\acasauran\Documents\Spruce\spruce-ui-react using the Angular /effects/choreography page in C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\docs as content/behavior reference. Demonstrate sequencing and composing the existing React effects without introducing an unnecessary runtime abstraction. Include trigger coordination, timing tokens, interruption/cancellation, layering, focus/interaction safety, reduced-motion fallbacks, performance guidance, and at least three live CodePreview compositions. Register the route/sidebar/search metadata and add a docs smoke test. Run npm run docs:build, npm run lint, and npm run test:ci.
```

### D-03 — AI pattern pages

**Status: Blocked pending C-14–C-20.** The six pages must be built from public React AI primitives, which do not exist in the current package yet.

```text
Once the React AI primitives exist, add six composed pattern pages to C:\Users\acasauran\Documents\Spruce\spruce-ui-react based on the Angular docs in C:\Users\acasauran\Documents\Spruce\spruce-ng\projects\docs: Chat Assistant, In-App Copilot, AI Search, Document Editor, Autonomous Agent, and Multimodal Generator. Build the examples from public React AI components rather than page-local copies. Each page must show state ownership/data adapters, loading/streaming/error/recovery paths, approvals and human control where relevant, keyboard/focus behavior, accessibility announcements, privacy/safety considerations, responsive/mobile behavior, i18n/RTL, and reduced-motion handling. Register /ai/patterns routes/sidebar/search metadata, add runnable CodePreview examples and smoke tests, then run npm run docs:build, npm run lint, and npm run test:ci.
```

## Completion order

Recommended dependency order:

1. Completed current API deltas: C-02, C-03, C-04, C-07, C-21.
2. **Complete (2026-09-08):** Add missing desktop primitives: C-01, C-05, C-06, C-08.
3. **Complete (2026-09-08):** Add the design-tool token workflow: F-01.
4. **Complete (2026-09-08):** Complete reusable theme UI: T-01 and T-02.
5. Add the Mobile family: C-09 through C-13.
6. Add AI shared types and primitives: C-14 through C-20.
7. **In progress:** Finish cross-cutting docs: D-01 and D-02 are complete; D-03 remains blocked pending C-14 through C-20.

Every implementation task should preserve unrelated work and follow the repository's React/TypeScript, accessibility, CSS/token, export, docs, and testing conventions.
