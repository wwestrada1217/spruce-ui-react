---
name: spruce-react-alerts
description: Use whenever you place, review, or edit a Spruce React `Alert` anywhere in a UI — page banners, form-level messages, section notices, inline warnings, stacked alerts. The alert has internal padding but NO outer margin, so it sits flush against neighbors unless you give it room. Covers the spacing rules that keep alerts from looking cramped.
---

# Spruce React Alerts

`Alert` has internal padding but **no outer margin** (see `src/components/alert/Alert.css`). Dropped into a layout as-is, it sits flush against the element above and below it and crams against inputs, headings, and focus rings. The component is intentionally margin-free — **the parent owns outer spacing**. Always give an alert room.

## API

```tsx
<Alert variant="warning" title="Heads up" dismissible onClose={handleClose}>
  Body content goes here.
</Alert>
```

- `variant`: `info` (default) | `success` | `warning` | `danger` — the icon is chosen automatically per variant
- `title`: optional bold heading line
- `dismissible`: shows a close button; the alert removes itself, `onClose` is the notification hook

## Spacing Rules

- **Always separate an alert from its neighbors** by at least `var(--sp-space-4)` (16px). Never let an alert render flush against a heading, paragraph, input, button row, card edge, or another block.
- **Prefer the container's `gap`.** If the alert lives in a flex/grid column, set `gap: var(--sp-space-4)` on the container so spacing stays consistent — don't hand-tune margins per alert. Use a `margin` only when the alert is a one-off inside a layout you don't control.
- **Space stacked alerts from each other** by `var(--sp-space-3)` (12px) — slightly tighter than the gap to neighbors, so a group of alerts reads as one cluster.
- **Page / section banners**: give the alert breathing room from the page header and from the content below.

## Choosing The Right Component

- `Alert` — persistent, in-flow message tied to the content it sits next to.
- `MessageBar` — full-width application-level bar.
- `Toast` / `Snackbar` — transient notifications; never use `Alert` for fire-and-forget feedback.
- Field-level validation belongs on the control itself (e.g. `Input`'s `error` prop), not in an `Alert`.
