# Angular parity matrix — P1.0-09 Chrome and motifs

This matrix records the Angular source and documentation reviewed for P1-09, the
React mapping, and the user-visible contract. Angular-only DI, signals, and
directives are intentionally represented as controlled React props, context,
and composition.

## Reviewed source and documentation

- Angular core: `projects/spruce-ui/core/src/lib/chrome.ts`,
  `alert.ts`, `card.ts`, `panel.ts`, `motif/motif.ts`,
  `motif/motif-definitions.ts`, and all seven motif collection files.
- Angular editor/data/workspace source: `editor.ts`, `diff-editor.ts`,
  `markdown-editor.ts`, `filter-expression.ts`, `toolbar.ts`,
  `git-graph.ts`, `kanban.ts`, `terminal.ts`, `tree.ts`,
  `gantt-chart.ts`, and `scheduler.ts`.
- Angular docs: Motifs, Alert, Card, Panel, Editor, Diff Editor, Markdown
  Editor, Filter Expression, Toolbar, Git Graph, Kanban, Terminal, Tree,
  Gantt, and Scheduler pages.
- React counterparts inspected: `src/components/{alert,card,panel,motif,
  editor,diff-editor,markdown-editor,filter-expression,toolbar,git-graph,
  kanban,terminal,tree,gantt-chart,scheduler}`.

## Property / behavior / event / accessibility matrix

| React counterpart | Angular property contract | Behavior and visual contract | Events / controlled mapping | Accessibility, i18n, RTL, theme | React implementation |
| --- | --- | --- | --- | --- | --- |
| Shared chrome | `SpChrome`: default, outlined, filled, elevated, ghost, flush; `SpRadius`: none/sm/md/lg/xl/full; `SpBorder`: default/none/subtle/strong; `SpElevation`: none/xs/sm/md/lg/xl/inner | Token-backed background, border, radius, and shadow; explicit chrome is preferred over legacy variants | No Angular output; ordinary React props/callbacks remain available | CSS variables resolve in light/dark themes; physical layout is unchanged in RTL | `src/chrome/chrome.ts`, `chrome.css`, public aliases `Chrome`, `Radius`, `Border`, `Elevation`, `Sp*` |
| Motif | `backgroundMotif`, icon/SVG sources, position, size, opacity, rotation, offsets, appearance, color, decorative object; custom registry | Source priority raw SVG > icon > named motif; clipped absolute layer; no layout impact; 117 built-ins in seven families | No output; custom definitions are supplied through controlled `MotifProvider motifs` | `aria-hidden`, pointer-events none, forced-colors hidden, dark-mode opacity token; positions are physical and not mirrored in RTL | `Motif`, `MotifProvider`, `useMotifRegistry`, typed collection definitions and names |
| Alert | Variant, size, title, dismissible, all motif inputs | Alert role, localized close label, motif behind content and clipped | `onClose` callback; dismiss state is local as in Angular | Alert semantics and i18n use `useI18n`; motif is decorative; theme colors use alert semantic tokens | Existing Alert motif API now accepts `SpMotifName`; Alert CSS isolates motif host |
| Card | Variant, chrome, radius, border, elevation, padding, interactive, motif inputs; header/media/body/footer slots | `chrome ?? variant`; ghost/flush added; explicit radius/border/elevation override token defaults; motif host is isolated and clipped | Native `onClick` plus Enter/Space keyboard activation for `interactive`; slot content is ReactNode | Interactive card is a button-like keyboard target; motif is hidden from AT; token colors work in both themes | Card owns the shared surface API and `Motif` layer |
| Panel | Variant, chrome, radius, border, padding, height limits, motif inputs; header/body/footer | `chrome ?? variant`; ghost/flush added; body remains scrollable; motif host is isolated and clipped | No Angular output; parent controls content and dimensions | Surface has no extra role; content semantics remain projected children; token and RTL-safe layout | Panel owns shared surface API and `Motif` layer |
| Editor | Chrome default, radius, border default plus controlled HTML value, disabled/readOnly, labels/errors | Shared chrome is applied to the framed editor container; toolbar and content behavior stay controlled | `onChange(value)` emits HTML string | Existing localized toolbar labels, textbox semantics, keyboard formatting, and theme tokens retained | Editor adds `chrome/radius/border` while preserving value-not-event callback |
| DiffEditor | Chrome default, radius, border default plus old/new code and readOnly | Shared surface applies to diff shell without changing line semantics | No Angular output; inputs are React props | Diff remains readable in both themes; code is not made interactive accidentally | DiffEditor adds shared frame props |
| MarkdownEditor | Chrome default, radius, border default plus controlled Markdown value/mode | Shared chrome applies to editor frame; write/preview/split remains controlled | `onChange(value)`, `onModeChange(mode)` | Localized toolbar labels, textarea semantics, keyboard controls, theme tokens | MarkdownEditor adds shared frame props |
| FilterExpression | Chrome default, radius, border default, controlled expression, max depth | Shared surface wrapper owns the visual frame around recursive groups | `onChange(expression)` remains controlled | Existing input keyboard semantics/i18n retained; wrapper adds no competing role | Adds typed chrome props and token-backed wrapper |
| Toolbar | Chrome, radius, border, size, overflow and item settings | Shared chrome maps legacy subtle/none to filled/ghost; overflow remains responsive | `onItemClick`, `onOverflowChange`; item callbacks stay controlled | Toolbar role, button labels, pressed state, localized overflow label, keyboard buttons retained | `ToolbarChrome` remains backwards-compatible while accepting shared values; border accepts token or legacy boolean |
| GitGraph | Chrome default, radius, border default plus commit data | Shared frame wraps graph and rows; row selection remains internal/controlled callback | `onCommitClick(commit)` | Log/row keyboard activation and labels retained; physical layout and theme tokens retained | Adds shared frame props |
| Kanban | Chrome default, radius, border default plus draggable columns/cards | Shared frame surrounds drag surface; card and column drag behavior unchanged | `onCardMoved`, `onColumnMoved`, `onCardClicked` | Region/list semantics, Enter/Space card activation, i18n labels, RTL-safe flex layout retained | Adds shared frame props |
| Terminal | Chrome default, radius, border default plus legacy bordered, log options | Chrome and token border coexist with legacy `bordered`; terminal dark surface remains tokenized | `onClear` callback | Log/live semantics, localized clear/no-output labels, keyboard button behavior retained | Adds shared props with `bordered` compatibility mapping |
| Tree | Chrome default, radius, border default, tree data and row behavior | Shared frame owns border/radius/background; node state and drag behavior unchanged | `onNodeSelect`, `onNodeCheck`, `onNodeDrop`, `onNodeToggle` | Tree/treeitem/checkbox semantics, localized expand/collapse labels, keyboard navigation retained | Adds shared frame props |
| GanttChart | Chrome default, radius, border default plus tasks, dependencies, resources, editing | Shared frame surrounds timeline; drag/resize/keyboard gutter behavior unchanged | Task, milestone, slot, move, resize callbacks remain typed | Toolbar labels use i18n; timeline remains usable in both themes and RTL | Adds shared frame props |
| Scheduler | Chrome default, radius, border default plus views, events, resources, navigation | Shared frame surrounds all calendar views; view/date state and navigation callbacks remain | Event, slot, move, resize, view, date callbacks | Toolbar/tab labels use i18n; physical date grid is direction-safe; theme tokens retained | Adds shared frame props |

### Scope exclusions

- Legacy Angular grid is excluded by the audit; React `Datagrid` is the
  canonical data-grid track.
- Angular `Textarea` and `SignaturePad` already have the shared form
  contract and belong to the form parity batches.
- Angular Code Editor, Block Editor, and Inplace Editor do not expose the
  P1-09 shared chrome fields in their named source; their remaining behavior is
  covered by later editor parity work.
