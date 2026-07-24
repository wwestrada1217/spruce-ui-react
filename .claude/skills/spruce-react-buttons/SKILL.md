---
name: spruce-react-buttons
description: Use when creating, editing, or reviewing buttons in Spruce React UI — command buttons, icon buttons, disabled/loading buttons, toolbar actions, modal footer actions, and any button with an icon.
---

# Spruce React Buttons

Use the Spruce `Button` so disabled state, focus behavior, icons, loading, and theming all come from the design system.

## API

`Button` extends the native `ButtonHTMLAttributes` — `onClick`, `disabled`, `type`, `aria-*` all work directly. `type` defaults to `"button"` (native buttons default to `"submit"` — Spruce already guards against accidental form submits).

- `variant`: `primary` (default) | `secondary` | `outline` | `ghost` | `danger` | `danger-outline` | `success` | `success-outline`
- `size`: `sm` | `md` (default) | `lg`
- `loading`, `fullWidth`, `iconOnly`, `active`: booleans
- `iconLeft` / `iconRight`: icon **names** (strings from the icon registry), not JSX

## Rules

- Use `<Button>` for command actions; use native `<button>` only for low-level custom composites that aren't command buttons.
- Icons go through `iconLeft` / `iconRight` — never place a manual `<Icon>` inside the button children.
- Icon-only buttons: set `iconOnly`, provide `iconLeft`, and ALWAYS add `aria-label`:

```tsx
<Button iconOnly iconLeft="trash" variant="ghost" aria-label="Delete row" />
```

- Async / destructive actions: drive `loading` from state and keep a guard in the handler — `loading` shows a spinner but the handler must still be idempotent.
- Use text buttons (with labels) for destructive, confirm, cancel, and form-submit actions unless space is genuinely constrained.
- One `primary` button per view section; secondary actions use `secondary`, `outline`, or `ghost`. Destructive actions use `danger` (solid for the final commit action, `danger-outline` for less prominent placements).
- Inside a form, pass `type="submit"` explicitly for the submitting button.
- Group related buttons with `ButtonGroup`; use `SplitButton` for a primary action with variants.

## Example

```tsx
<Button variant="primary" size="sm" iconLeft="plus" onClick={handleCreate}>
  New item
</Button>
```
