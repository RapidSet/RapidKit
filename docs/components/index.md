# Components

This section documents the package's public UI components and their integration contracts.

Use the left navigation to browse individual components.

## What You Will Find Here

- Installation and import-ready usage examples for package consumers.
- Public prop contracts and behavior notes for controlled and uncontrolled patterns.
- Accessibility guarantees, including keyboard and focus behavior where applicable.
- Test-backed interaction expectations and state handling guidance.

## How To Read Component Docs

- Start with the overview and basic usage example.
- Review prop definitions to understand optional and required behavior.
- Check accessibility and interaction notes before integrating into production flows.
- Use access-control sections only when a component supports gated visibility or actions.

## Component Links

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
- [NavMenu](./nav-menu.md)
- [Page](./page.md)
- [Search](./search.md)
- [SideBar](./side-bar.md)
- [Text](./text.md)
- [TextArea](./text-area.md)
- [Toggle](./toggle.md)

## Design Intent

All components are designed to be:

- Presentational and domain-neutral.
- Composable through props, callbacks, and wrappers.
- Safe for reuse across host applications without product coupling.
- Predictable to style with package-owned tokens and class composition patterns.

## Shared Access-Control Contract

Where supported, components use:

- `access?: AccessConfig<...>`
- `canAccess?: (rule, mode) => boolean`

Behavior:

- No resolver or no rules: component remains visible.
- Resolver mode is component-specific (for example, `'view' | 'edit'` for Input/Checkbox and `'action'` for Button).
- If visibility access is denied for that component, it returns `null`.
- If interaction access is denied for that component, interactive behavior is disabled where applicable.
