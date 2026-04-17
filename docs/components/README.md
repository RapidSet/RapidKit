# Components

This section contains consumer-facing documentation for each public component exported from `@tarikukebede/mezmer`.

## How To Use This Section

- Start here for navigation.
- Open each component page for purpose, key props, access-control behavior, accessibility notes, and examples.
- Use this alongside `README.md` for installation and package-level setup.

## Components

- [Input](./input.md)
- [Checkbox](./checkbox.md)
- [Icon](./icon.md)
- [Image](./image.md)
- [BaseTable](./base-table.md)
- [Chip](./chip.md)

## Shared Access-Control Pattern

Where supported, components use:

- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean`

Behavior:

- No resolver or no requirements: component remains visible.
- View denied: component returns `null`.
- Edit denied: interactive behavior is disabled where applicable.

## Theming Expectations

All components use semantic utility classes mapped to package tokens.

Import order for consumers:

1. `@tarikukebede/mezmer/styles.css`
2. One theme file, for example `@tarikukebede/mezmer/themes/default.css`

For full theming details, see `docs/THEMING.md`.
