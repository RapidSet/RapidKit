import type { ComponentProps } from 'react';
import type { ExternalToast, Toaster as SonnerToaster } from 'sonner';

type SonnerToasterProps = ComponentProps<typeof SonnerToaster>;

export type ToastTheme = 'light' | 'dark' | 'system';

export interface ToasterProps extends Omit<SonnerToasterProps, 'theme'> {
  theme?: ToastTheme;
}

export type ToastOptions = ExternalToast;
