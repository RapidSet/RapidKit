export enum ToastVariant {
  Default = 'default',
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Loading = 'loading',
}

export const TOAST_VARIANT_CLASS_NAMES: Record<ToastVariant, string> = {
  [ToastVariant.Default]: '',
  [ToastVariant.Success]:
    'group-[.toaster]:data-[type=success]:border-emerald-500/40 group-[.toaster]:data-[type=success]:text-emerald-700 dark:group-[.toaster]:data-[type=success]:text-emerald-400',
  [ToastVariant.Error]:
    'group-[.toaster]:data-[type=error]:border-destructive/40 group-[.toaster]:data-[type=error]:text-destructive',
  [ToastVariant.Warning]:
    'group-[.toaster]:data-[type=warning]:border-amber-500/40 group-[.toaster]:data-[type=warning]:text-amber-700 dark:group-[.toaster]:data-[type=warning]:text-amber-400',
  [ToastVariant.Info]:
    'group-[.toaster]:data-[type=info]:border-sky-500/40 group-[.toaster]:data-[type=info]:text-sky-700 dark:group-[.toaster]:data-[type=info]:text-sky-400',
  [ToastVariant.Loading]:
    'group-[.toaster]:data-[type=loading]:border-border group-[.toaster]:data-[type=loading]:text-muted-foreground',
};

const TOAST_BASE_CLASSES =
  'group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-md';

export const TOAST_TOASTER_DEFAULT_CLASS_NAMES = {
  toast: [
    TOAST_BASE_CLASSES,
    TOAST_VARIANT_CLASS_NAMES[ToastVariant.Success],
    TOAST_VARIANT_CLASS_NAMES[ToastVariant.Error],
    TOAST_VARIANT_CLASS_NAMES[ToastVariant.Warning],
    TOAST_VARIANT_CLASS_NAMES[ToastVariant.Info],
    TOAST_VARIANT_CLASS_NAMES[ToastVariant.Loading],
  ].join(' '),
  description: 'group-[.toast]:text-muted-foreground',
  actionButton:
    'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
  cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
} as const;
