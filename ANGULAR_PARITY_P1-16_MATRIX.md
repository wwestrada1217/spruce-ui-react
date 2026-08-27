# P1.0-16 Angular parity matrix

This matrix records the Angular baseline reviewed for P1.0-16 and the React contract implemented in this repository. Angular-only dependency injection, signals, directives, and content projection are represented with controlled props, callbacks, context, `children`, or framework-neutral utilities.

## Reviewed baseline

Angular source packages:

- `../spruce-ng/projects/spruce-ui/core/src/lib/fab.ts`
- `../spruce-ng/projects/spruce-ui/core/src/lib/mention.ts`
- `../spruce-ng/projects/spruce-ui/core/src/lib/scrollbar.ts`
- `../spruce-ng/projects/spruce-ui/composites/src/lib/filter-expression.ts`
- `../spruce-ng/projects/spruce-ui/splitter/src/lib/splitter.ts`
- `../spruce-ng/projects/spruce-ui/splitter/src/lib/splitter.scss`
- `../spruce-ng/projects/spruce-ui/sidebar/src/lib/app-header.ts`
- `../spruce-ng/projects/spruce-ui/sidebar/src/lib/sidebar.ts`
- `../spruce-ng/projects/docs/src/app/pages/blocks/app-shell-block.ts`

Angular documentation pages:

- `../spruce-ng/projects/docs/src/app/pages/components/fab-page.ts`
- `../spruce-ng/projects/docs/src/app/pages/components/filter-expression-page.ts`
- `../spruce-ng/projects/docs/src/app/pages/components/mention-page.ts`
- `../spruce-ng/projects/docs/src/app/pages/components/mention-directive-page.ts`
- `../spruce-ng/projects/docs/src/app/pages/components/scrollbar-page.ts`
- `../spruce-ng/projects/docs/src/app/pages/components/splitter-page.ts`
- `../spruce-ng/projects/docs/src/app/pages/blocks/app-shell-block.ts`

React counterparts inspected:

- `src/components/app-shell/AppShell.tsx`, `AppShell.css`
- `src/components/fab/Fab.tsx`, `Fab.css`
- `src/components/filter-expression/FilterExpression.tsx`, `FilterExpression.css`
- `src/components/mention/Mention.tsx`, `Mention.css`; `src/components/editor/Editor.tsx` for the rich-text directive equivalent
- `src/components/scrollbar/Scrollbar.tsx`, `Scrollbar.css`
- `src/components/splitter/Splitter.tsx`, `Splitter.css`
- `docs/src/pages/blocks/AppShellBlockPage.tsx`
- `docs/src/pages/components/FabPage.tsx`, `FilterExpressionPage.tsx`, `MentionPage.tsx`, `ScrollbarPage.tsx`, `SplitterPage.tsx`
- `docs/src/App.tsx`, `docs/src/components/nav.ts`

## Property and behavior matrix

| React surface | Angular properties and behavior | Angular events | React API and implementation | Accessibility, i18n, RTL, and theme contract |
| --- | --- | --- | --- | --- |
| `AppShell` | Sidebar/header/content composition; shared sidebar service; collapsible desktop rail; responsive mobile drawer; fixed header/sidebar with independently scrolling content; header height alignment | Sidebar context events and child callbacks | `sidebar`, `header`, `children`, `sidebarCollapsible`, `sidebarResponsive`, `padded`, `breakpoint`, and `headerHeight`; `SidebarProvider` is shared by the slots and `AppShellHamburger` | Main landmark and keyboard hamburger; sidebar primitives retain their localized labels, responsive dismissal, logical RTL layout, and light/dark token styling. Shell height is container-friendly (`height: 100%`, `min-height: 0`) to match the Angular block demo contract. |
| `Fab` | Variants primary/secondary/danger/success; sm/md/lg sizes; fixed positions or inline mode; optional label; optional close icon or rotated plus; disabled state | `fabClick` only for a plain FAB; `openChange`; `actionClick` followed by close | `onFabClick`, `open`, `onOpenChange`, `actions`, `onActionClick`, `closeIcon`, `actionsAbove`, plus existing variant/size/position props. Main click does not emit `onFabClick` when a speed dial exists; action selection closes the dial. | Main button has localized fallback accessible name and `aria-haspopup`/`aria-expanded`; action container is a `menu`, action buttons are `menuitem`s, closed items are removed from tab order, and disabled actions are inert. Sizes follow Angular icon metrics; colors, z-index, spacing, and focus states use tokens. |
| `FilterExpression` | Recursive `FilterGroup`/`FilterRule`; AND/OR logic; add rule/group; remove rules and nested groups; `maxDepth`; custom field operators; no-value and between operators; typed date/time/boolean values; chrome/radius/border | Controlled model changes for field, operator, value, logic, add, and remove actions | Controlled `expression` plus `onChange`; exported `FilterExpression`, `FilterExpressionType` alias, `FilterField`, `FilterOperatorOption`, typed operator sets, and `DEFAULT_FILTER_OPERATORS`. Values use Spruce `Input`, `Select`, `DatePicker`, `TimePicker`, and `DateTimePicker` with value-based callbacks. | Rule/group landmarks, labelled controls, native keyboard buttons, localized operator/boolean/empty labels, recursive accessible groups, logical border direction for RTL, and chrome tokens for light/dark themes. |
| `Mention` | Controlled textarea model; `@/#/+/` triggers; trigger only at start/after whitespace; label/description filtering; caret insertion; custom template; async search; portal panel; boundary clamping and scroll reposition; ArrowUp/Down, Enter/Tab, Escape, outside/blur dismissal | `mentioned` with `{ item, start, end }`; `search` with query; model change | `value`, `onValueChange`, `items`, `trigger`, `insertTemplate`, `onInsert`, and `onSearch`; items add optional `icon`; panel uses `modalBoundary`, scroll parents, resize handling, and localized default placeholder. | Multiline textbox/listbox/option semantics, active descendant, selected option state, localized names and no-results text, `dir` on input/panel, focus restoration after insertion, tokenized dark/light popup, and logical option alignment. |
| Angular mention directive | Attaches the same mention behavior to input, textarea, or contenteditable through Angular directive lifecycle and host injection | Directive-host model and mention/search outputs | No direct directive clone. `Mention` covers textarea use; `Editor` maps the rich-text case with controlled `value`/`content`, `mentionItems`, `mentionTrigger`, `mentionInsertTemplate`, `onMention`, and `onMentionSearch`. | Keeps React ownership explicit and avoids Angular host/directive DI. Both surfaces preserve keyboard selection, localized suggestion labels, focus behavior, direction, and theme tokens. |
| `Scrollbar` | `[spScrollbar]` styling; `autoHide`; `thin`/`medium`/`thick`; vertical, horizontal, and both-axis overflow; themed track/thumb/hover/corner | Native scroll/focus/hover behavior | `Scrollbar` keeps its wrapper API and now forwards native `HTMLDivElement` attributes/events. `style={{ overflowX: 'auto' }}` enables horizontal mode and `overflow: 'auto'` enables both axes. | CSS covers both scrollbar axes and the corner, auto-hide is revealed by hover/focus-within/active, dimensions remain 8/12/16px, and colors/motion use semantic tokens for light/dark themes. |
| `Splitter` | Horizontal/vertical panes; gutter size; initial percentages; pane min/max constraints; drag and touch lifecycle; double-click reset; separator keyboard Arrow/Home/End; key increment; thin hairline mode; localized split-view label | `sizeChange`, `dragStart`, `dragEnd` | `initialSizes`, controlled `sizes`, `onSizeChange`, `onDragStart`, `onDragEnd`, `keyIncrement`, `thin`, `ariaLabel`, `gutterSize`, and `SplitterPane` min/max. RTL horizontal keyboard and drag deltas follow logical pane growth. | Root/group and separator semantics include orientation, value now/min/max, labels, tab stops, focus-visible state, and keyboard resizing. Touch listeners allow `preventDefault`; thin mode preserves hit area and uses tokenized 1px visuals with reduced-motion support. |

## Event and interaction matrix

| Interaction | React callback/payload | Keyboard and platform behavior |
| --- | --- | --- |
| Plain FAB activation | `onFabClick()` | Native button activation; speed-dial FABs toggle only `onOpenChange`. |
| Speed-dial toggle/action | `onOpenChange(open)` and `onActionClick(action)` | Main button exposes menu state; action items are menuitems, disabled actions do not emit, and selecting an action requests close. Escape/outside dismissal requests close. |
| Filter editing | `onChange(nextExpression)` | Field/operator/value controls remain controlled; typed values select the appropriate Spruce form control; no-value operators remove value inputs; nested group buttons are keyboard-operable. |
| Mention search/insert | `onSearch(query)`, `onValueChange(value)`, `onInsert({ item, start, end })` | Trigger detection is caret-aware and whitespace-bound; arrows cycle; Enter/Tab insert; Escape closes; outside/blur closes; panel is clamped to the modal/viewport boundary. |
| Scroll behavior | Native div scroll events may be supplied through forwarded HTML attributes | Consumers choose vertical, horizontal, or both-axis overflow through native styles; auto-hide also responds to keyboard focus. |
| Splitter resize | `onSizeChange(sizes)`, `onDragStart()`, `onDragEnd()` | Mouse/touch drag uses min/max constraints, touch scrolling is prevented during an active resize, double-click resets, and Arrow/Home/End update the controlled/uncontrolled size model. |

## Existing docs and exports

- All six React surfaces already had registered routes and sidebar entries; their pages were inspected and expanded where P1.0-16 behavior was missing.
- `src/index.ts` exports the parity types, splitter lifecycle props, mention types, and filter operator sets.
- Focused coverage is in `tests/react/p1-16-parity.test.tsx`.

## Verification targets

```text
npm run build
npm run docs:build
npm run lint
npm run test:type
npm run test:unit -- tests/react/p1-16-parity.test.tsx
```
