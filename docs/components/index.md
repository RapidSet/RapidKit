# Components

Consumer-facing component documentation lives here.

## Available Components

- [Input](./input.md)
- [Checkbox](./checkbox.md)
- [Icon](./icon.md)
- [Image](./image.md)
- [BaseTable](./base-table.md)
- [Chip](./chip.md)
- [Button](./button.md)

## Shared Access-Control Contract

Where supported, components use:

- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'edit') => boolean`

Behavior:

- No resolver or no requirements: component remains visible.
- View denied: component returns `null`.
- Edit denied: interactive behavior is disabled where applicable.
