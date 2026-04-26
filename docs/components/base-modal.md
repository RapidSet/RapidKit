# BaseModal

## Purpose

Composable modal shell for reusable dialogs with optional Save/Cancel actions, custom footer actions, and access-aware visibility.

## Import

```tsx
import { BaseModal, ButtonVariant } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="base-modal" />

## Required Props

- `isOpen: boolean`
- `onClose: () => void`
- `children: ReactNode`

## Common Optional Props

- `title?: string`
- `description?: string`
- `onSave?: () => void`
- `onCancel?: () => void`
- `saveLabel?: string` (default: `"Save"`)
- `cancelLabel?: string` (default: `"Cancel"`)
- `showSave?: boolean` (default: `true`)
- `showCancel?: boolean` (default: `true`)
- `saveVariant?: ButtonVariant` (default: `ButtonVariant.Primary`)
- `cancelVariant?: ButtonVariant` (default: `ButtonVariant.Outlined`)
- `saveDisabled?: boolean`
- `isLoading?: boolean`
- `preventOutsideClose?: boolean`
- `customButtons?: CustomButtonProps[]`
- `access?: BaseModalAccessConfig`
- `saveAccess?: BaseModalAccessConfig`
- `canAccess?: BaseModalAccessResolver`

## Accessibility

- Uses dialog primitives that provide semantic modal roles and focus handling.
- Header content is announced through `DialogTitle` and `DialogDescription` when provided.

## Access Behavior

- If `access` and `canAccess` deny `view`, the modal renders `null`.
- Save and custom actions delegate to the shared `Button` action access behavior.
- For provider inheritance and CASL adapter examples, see [Access Control](../ACCESS_CONTROL.md).
