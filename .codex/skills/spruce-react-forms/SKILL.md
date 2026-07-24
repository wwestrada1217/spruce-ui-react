---
name: spruce-react-forms
description: Use when creating or changing forms in Spruce React UI — admin consoles, settings pages, create/edit workflows, filter forms, and any UI that needs labels, helper text, validation messages, or accessible form layout with Spruce form controls.
---

# Spruce React Forms

Build forms from Spruce controls (`Input`, `Textarea`, `Select`, `Combobox`, `Checkbox`, `RadioGroup`/`Radio`, `Switch`, `DatePicker`, `Slider`, `Rating`, `MaskedInput`, `OtpInput`, `PasswordInput`, `SegmentedControl`) so validation state, focus behavior, and theming come from the design system. Do not assemble bespoke `label + input + error` markup from native elements when a Spruce control expresses the same UI.

## The onChange Contract (most important React-specific rule)

Spruce form controls are controlled components whose `onChange` receives the **value**, not the DOM event:

```tsx
const [name, setName] = useState('');
<Input value={name} onChange={setName} placeholder="e.g. Ada Lovelace" />
```

Never write `onChange={(e) => setName(e.target.value)}` for Spruce controls — the argument is already the value. Check the control's `Props` interface in `src/components/<name>/` when unsure of the value type.

## Validation, Hints, Required

- Put field-level validation on the control itself: `Input` takes `error` (message string, renders with `role="alert"`) and `hint` (helper text). An empty/undefined `error` means valid.
- Mark required fields with the control's `required` prop, not ad-hoc asterisks in labels.
- Form-level failures (submit rejected, cross-field rules) go in an `Alert` above the actions row — see the spruce-react-alerts skill for spacing.
- Use placeholders for examples only. Never rely on placeholder text as the sole label.

## Layout

- Group related fields in restrained sections with clear headings, not nested cards.
- Use responsive grids for dense forms — commonly two columns on desktop, one on narrow screens — with `gap: var(--sp-space-4)`.
- Keep labels short and stable; put instructions in `hint`, not placeholders.
- Icon affordances via the control's `iconLeft`/`iconRight` (icon names); `clearable` adds a clear button to `Input`.
- Submit buttons: `<Button type="submit">` (Spruce buttons default to `type="button"`, so the submitter must opt in explicitly).
