# BaseModal

## Purpose

Composable modal shell for reusable dialogs with optional Save/Cancel actions, custom footer actions, and access-aware visibility.

## Import

```tsx
import { BaseModal, ButtonVariant } from '@tarikukebede/mezmer';
```

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
- `accessRequirements?: string[]`
- `saveAccessRequirements?: string[]`
- `resolveAccess?: (requirement: string, mode: 'view' | 'action') => boolean`

## Accessibility

- Uses dialog primitives that provide semantic modal roles and focus handling.
- Header content is announced through `DialogTitle` and `DialogDescription` when provided.

## Access Behavior

- If `accessRequirements` and `resolveAccess` deny `view`, the modal renders `null`.
- Save and custom actions delegate to the shared `Button` action access behavior.

## Example

```tsx
import { BaseModal, ButtonVariant } from '@tarikukebede/mezmer';

<BaseModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Edit Profile"
  description="Update profile settings"
  onSave={() => console.log('save')}
  saveAccessRequirements={['profile.update']}
  resolveAccess={(requirement, mode) => {
    if (mode === 'view') return requirement !== 'profile.hidden';
    return requirement === 'profile.update';
  }}
  customButtons={[
    {
      label: 'Preview',
      onClick: () => console.log('preview'),
      variant: ButtonVariant.Outlined,
      accessRequirements: ['profile.preview'],
    },
  ]}
>
  <div className="text-sm text-foreground">Modal content goes here</div>
</BaseModal>;
```
