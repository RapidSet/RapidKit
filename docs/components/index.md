# Components

Consumer-facing component documentation lives here.

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

## Shared Access-Control Contract

Where supported, components use:

- `accessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: ...) => boolean`

Behavior:

- No resolver or no requirements: component remains visible.
- Resolver mode is component-specific (for example, `'view' | 'edit'` for Input/Checkbox and `'action'` for Button).
- If visibility access is denied for that component, it returns `null`.
- If interaction access is denied for that component, interactive behavior is disabled where applicable.
