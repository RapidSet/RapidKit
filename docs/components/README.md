# Components

This section contains consumer-facing documentation for each public component exported from `@tarikukebede/mezmer`.

## How To Use This Section

- Start here for navigation.
- Open each component page for purpose, key props, access-control behavior, accessibility notes, and examples.
- Use this alongside `README.md` for installation and package-level setup.

## Components

- [Input](./input.md)
- [BaseTable](./base-table.md)
- [Button](./button.md)
- [Checkbox](./checkbox.md)
- [Chip](./chip.md)
- [DetailsCard](./details-card.md)
- [DropDown](./drop-down.md)
- [Icon](./icon.md)
- [Image](./image.md)
- [Input](./input.md)
- [Page](./page.md)
- [Search](./search.md)

## Shared Access-Control Pattern

Where supported, components use:

- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: ...) => boolean`

Behavior:

- No resolver or no requirements: component remains visible.
- Resolver mode is component-specific (for example, `'view' | 'edit'` for Input/Checkbox and `'action'` for Button).
- If visibility access is denied for that component, it returns `null`.
- If interaction access is denied for that component, interactive behavior is disabled where applicable.

## Theming Expectations

All components use semantic utility classes mapped to package tokens.

Import order for consumers:

1. `@tarikukebede/mezmer/styles.css`
2. One theme file, for example `@tarikukebede/mezmer/themes/default.css`

For full theming details, see `docs/THEMING.md`.
