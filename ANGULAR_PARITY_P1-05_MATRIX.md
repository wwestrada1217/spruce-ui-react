# P1.0-05 overlay parity matrix

Baseline read from Angular `projects/spruce-ui/core` (`positioning.ts`, `focus-trap.ts`, `popover.ts`, `tooltip.ts`, `dropdown.ts`), `projects/spruce-ui/overlays` (`modal.ts`, `drawer.ts`, `window.ts`, `command-palette.ts`), and the matching Angular component documentation pages. React uses controlled props/callbacks and DOM hooks instead of Angular signals, directives, dependency injection, or template projection.

| React counterpart | Angular properties mapped | Behaviors implemented | React events/callbacks | Accessibility and theming |
| --- | --- | --- | --- | --- |
| `Popover` | placement, click/hover trigger, offset, arrow, panel class/padding, modal constraint, anchor rect, outside/scroll dismissal | viewport/modal flipping and clamping, logical RTL start/end, body portal, nested-popover-safe outside click, capture Escape, hover/focus delays, arrow alignment | `open`, `onOpenChange` | dialog semantics, expanded trigger state, keyboard Escape, semantic/token CSS, dark/light and RTL-safe positioning |
| `Tooltip` + `TooltipGroup` | text, placement, offset, arrow, delay, disabled suppression, warm-up/grace group | delayed hover/focus display, group warm-up and one-visible-tooltip behavior, scroll reposition, unique IDs | group context is callback-driven internally | `role=tooltip`, trigger `aria-describedby`, removal on hide, disabled/aria-disabled handling, token CSS |
| `Dropdown` | items, nested children, icons/separators/disabled/shortcuts, placement, min width, anchor rect, modal constraint, outside/scroll dismissal | controlled visibility, nested flyouts, collision positioning, focus restore, arrow/Home/End/Tab/Escape navigation, icon slot reservation | `onOpenChange`, `onOpened`, `onClosed`, `onItemClick` | `role=menu`, native menu buttons, disabled semantics, logical text alignment and RTL placement, token CSS |
| `Modal` | size/title/description, backdrop and Escape policy, focus trap, footer | body portal, pointer-accurate backdrop dismissal, body scroll lock, focus auto-entry/trap/restore | `onClose` | `role=dialog`, `aria-modal`, labelled/described dialog, localized close label, token CSS |
| `Drawer` | position/size/title/footer, backdrop/Escape policy, focus trap | responsive edge sizing, body portal, pointer-accurate backdrop dismissal, body scroll lock, focus auto-entry/trap/restore | `onClose` | `role=dialog`, `aria-modal`, localized close label, logical/token CSS |
| `Window` | size, title, resizable bounds, backdrop, maximize/restore, drag/resize, z-order, focus trap | shared topmost-window z-order, topmost focus trap, Escape policy, min dimensions, saved maximize bounds, drag/resize lifecycle | `onClose`, `onMaximizeChange` | dialog semantics, localized maximize/restore/close labels, token CSS, RTL-neutral drag geometry |
| `CommandPalette` | items, category/keywords, placeholder/ARIA/empty labels, shortcut key, fuzzy/highlight, item shortcuts, footer, open/close/select methods | controlled open state plus shortcut request, fuzzy ranking, grouped results, active-item scrolling, Enter/arrow/Escape, shortcut KBDs, footer legend, focus restore | `onClose`, `onOpenChange`, `onSelect` | modal dialog/listbox/option semantics, active descendant, localized defaults, RTL-safe text, token CSS |

## Angular-only mechanisms intentionally not copied

- Angular `input`, `output`, signals, `effect`, `viewChild`, directives, and services are represented by React props, callbacks, refs, effects, and hooks.
- Content projection slots map to `children` and `footer` React nodes.
- Angular body-portaling is represented by React portals; the shared positioning utility owns collision math and scroll-parent discovery.
