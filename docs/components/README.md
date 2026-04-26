# Components

<p align="center">
	<img src="https://raw.githubusercontent.com/RapidSet/RapidKit/main/public/rapidkit.svg" alt="RapidKit" width="140" />
</p>

This section contains consumer-facing documentation for each public component exported from `@rapidset/rapidkit`.

## How To Use This Section

- Start here for navigation.
- Open each component page for purpose, key props, access-control behavior, accessibility notes, and examples.
- Use this alongside `README.md` for installation and package-level setup.

## Components

- [Autocomplete](./autocomplete.md)
- [Avatar](./avatar.md)
- [BaseModal](./base-modal.md)
- [BaseTable](./base-table.md)
- [Button](./button.md)
- [Checkbox](./checkbox.md)
- [Chip](./chip.md)
- [DatePicker](./date-picker.md)
- [DetailsCard](./details-card.md)
- [DropDown](./drop-down.md)
- [Icon](./icon.md)
- [Image](./image.md)
- [Input](./input.md)
- [Logo](./logo.md)
- [Page](./page.md)
- [Search](./search.md)
- [SideBar](./side-bar.md)
- [Text](./text.md)
- [TextArea](./text-area.md)
- [Toggle](./toggle.md)

## Canonical Imports (AI-Friendly)

Use one import style everywhere to reduce AI-generated import errors:

1. Import components from `@rapidset/rapidkit` root.
2. Import base styles from `@rapidset/rapidkit/styles.css`.
3. Import exactly one theme from `@rapidset/rapidkit/themes/*`.

```tsx
import { Button, Input } from '@rapidset/rapidkit';
import '@rapidset/rapidkit/styles.css';
import '@rapidset/rapidkit/themes/default.css';
```

## Shared Access-Control Pattern

Where supported, components use:

- `access?: AccessConfig<...>`
- `canAccess?: (rule, mode) => boolean`

For provider inheritance, CASL integration, and `match: 'any' | 'all'` examples, see [Access Control](../ACCESS_CONTROL.md).

Behavior:

- No resolver or no rules: component remains visible.
- Resolver mode is component-specific (for example, `'view' | 'edit'` for Input/Checkbox and `'action'` for Button).
- If visibility access is denied for that component, it returns `null`.
- If interaction access is denied for that component, interactive behavior is disabled where applicable.

## Theming Expectations

All components use semantic utility classes mapped to package tokens.

Import order for consumers:

1. `@rapidset/rapidkit/styles.css`
2. One theme file, for example `@rapidset/rapidkit/themes/default.css`

For full theming details, see `docs/THEMING.md`.
