---
name: spruce-react-design-system
description: Use when building React apps, features, or pages on top of the Spruce React design system, or when working inside this repo (component library in `src/`, docs site in `docs/`). Covers imports, SpruceProvider setup, theming, icons, and design tokens.
---

# Spruce React Design System

Spruce React is a library of 80+ React 19 + TypeScript components. Reach for it first when building any UI that consumes `spruce-react`. Use native HTML or custom controls only when no Spruce primitive fits. Do not introduce third-party UI kits for primitives Spruce already provides.

## Repo Layout

- `src/` — the component library (`spruce-react` package): `components/`, `tokens/`, `icons/`, `theme/`, `data/`, exported through `src/index.ts`.
- `docs/` — the documentation site (a Vite app) with a live demo page per component. It imports the library straight from `src/` via the `spruce-react` alias.

## Setup In A Consuming App

Everything is a named export from the single `spruce-react` package. Import the stylesheet once and wrap the app in `SpruceProvider`:

```tsx
import 'spruce-react/style.css';
import { SpruceProvider } from 'spruce-react';

<SpruceProvider defaultTheme="system">
  <App />
</SpruceProvider>
```

`SpruceProvider` props: `icons` (icon registry, defaults to `DEFAULT_ICONS`), `defaultTheme` (`'light' | 'dark' | 'system'` or a custom theme name).

## Component Inventory

All named exports from `spruce-react` (types are exported alongside, e.g. `ButtonProps`, `AlertVariant`):

- **Actions**: `Button`, `ButtonGroup`, `SplitButton`, `Fab`, `Dropdown`, `CommandPalette`
- **Forms**: `Input`, `Textarea`, `Checkbox`, `RadioGroup`/`Radio`, `Select`, `Combobox`, `GridCombobox`, `Switch`, `Slider`, `Range`, `Rating`, `MaskedInput`, `OtpInput`, `PasswordInput`, `PasswordProgress`, `SegmentedControl`, `InplaceEditor`, `FilterExpression`
- **Dates**: `Calendar`, `RangeCalendar`, `DatePicker`, `DateRangePicker`, `DatetimePicker`, `TimePicker`, `Scheduler`
- **Feedback**: `Alert`, `MessageBar`, `Toast`, `Snackbar`, `ProgressBar`, `Spinner`, `Empty`, `Coachmark`
- **Overlays**: `Modal`, `Drawer`, `Window`, `Lightbox`, `Popover`, `Tooltip`
- **Navigation**: `Tabs`, `Breadcrumb`, `NavMenu`, `Stepper`, `Pager`, `Accordion`, `Sidebar` (+ `SidebarContent`, `SidebarGroup`, ...), `AppHeader`, `Toolbar`
- **Data display**: `Datagrid`, `List`, `Tree`, `Timeline`, `Card` (+ `CardHeader`, `CardMedia`, `CardFooter`), `Panel`, `StatCard`, `Kanban`, `Terminal`, `GitGraph`, `GanttChart`, `Carousel`, `ImageCompare`, `CreditCard`, `Barcode`, `Avatar`, `AvatarGroup`, `Badge`, `Kbd`, `Mention`, `Overflow`
- **Layout/utility**: `Grid`, `AspectRatio`, `Splitter`, `Scrollbar`, `CodeEditor`
- **Foundation**: `SpruceProvider`, `Icon`, `useTheme`

If unsure about a component's exact props, read `src/components/<kebab-name>/<PascalName>.tsx` — every component exports a typed `<Name>Props` interface.

## Theming

`useTheme()` (inside `SpruceProvider`) returns `{ preference, resolved, setTheme, toggle, registerTheme, getRegisteredThemes, activeTheme }`. `resolved` is always `'light' | 'dark'`. Custom themes are registered with `registerTheme(theme)` then activated with `setTheme(name)`.

## Icons

Use `<Icon name="..." size={16} ariaLabel="..." />`. Icon names must exist in the registry supplied to `SpruceProvider` (defaults to `DEFAULT_ICONS`). Components take icon *names* as string props (e.g. `iconLeft="plus"`) — never pass JSX icons where a string name is expected.

## Design Tokens

Style with the CSS custom properties from `src/tokens/tokens.css`, never hard-coded values:

- Spacing: `var(--sp-space-1)` ... `var(--sp-space-14)` (4px scale; `--sp-space-4` = 16px)
- Radius: `var(--sp-radius-sm|md|lg|xl|2xl|full)`
- Semantic colors: `var(--sp-info)`, `var(--sp-success)`, `var(--sp-warning)`, `var(--sp-danger)`, plus text/surface/border tokens

Tokens respond to the active theme automatically — using them is what makes custom UI theme-correct.
