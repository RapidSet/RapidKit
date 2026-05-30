# Toast

## Purpose

Theme-aware toast notification system. Mount a single `Toaster` at the app root and dispatch toasts from anywhere with `toast()` and its variant methods (`success`, `error`, `warning`, `info`, `loading`, `promise`).

## Import

```tsx
import { Toaster, toast } from '@rapidset/rapidkit';
```

<ComponentExampleTabs component="toast" />

## Common Props (`<Toaster />`)

- `position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'` (default `'bottom-right'`)
- `theme?: 'light' | 'dark' | 'system'` (default `'system'`)
- `richColors?: boolean` (default `false`)
- `closeButton?: boolean` (default `true`)
- `toastOptions?: ToastOptions` — merged on top of package defaults
- `className?: string`

## `toast()` API

- `toast(message, options?)` — neutral toast.
- `toast.success(message, options?)` — success variant (green).
- `toast.error(message, options?)` — destructive variant.
- `toast.warning(message, options?)` — warning variant (amber).
- `toast.info(message, options?)` — info variant (sky blue).
- `toast.loading(message, options?)` — loading variant with neutral styling.
- `toast.message(message, options?)` — alias for the neutral toast with explicit title/description support.
- `toast.promise(promise, { loading, success, error })` — lifecycle-aware dispatcher that swaps the toast as the promise resolves or rejects.
- `toast.dismiss(id?)` — dismiss a single toast by id, or all toasts when no id is provided.

Variant methods return a numeric or string id that can be passed back into `toast.dismiss()`.

## Accessibility

- The Toaster mounts a `region` landmark for assistive technology.
- Toasts announce via the underlying sonner `aria-live` semantics (polite by default).
- Each toast renders a focusable close button when `closeButton` is enabled (default).

## Access Control

Toasts are ephemeral feedback for actions the user has already initiated, so the Toast component does not expose `access` / `canAccess` props. Gate the action itself (for example, on the originating `Button`) and dispatch the toast only when the action runs.
