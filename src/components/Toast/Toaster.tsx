import { cn } from '@lib/utils';
import { Toaster as UIToaster } from '@ui/sonner';
import { TOAST_TOASTER_DEFAULT_CLASS_NAMES } from './styles';
import type { ToasterProps } from './types';

export const Toaster = (props: ToasterProps) => {
  const {
    theme = 'system',
    position = 'bottom-right',
    richColors = false,
    closeButton = true,
    toastOptions,
    className,
    ...rest
  } = props;

  const consumerClassNames = toastOptions?.classNames ?? {};

  return (
    <UIToaster
      theme={theme}
      position={position}
      richColors={richColors}
      closeButton={closeButton}
      className={cn('toaster group', className)}
      toastOptions={{
        ...toastOptions,
        classNames: {
          ...consumerClassNames,
          toast: cn(
            TOAST_TOASTER_DEFAULT_CLASS_NAMES.toast,
            consumerClassNames.toast,
          ),
          description: cn(
            TOAST_TOASTER_DEFAULT_CLASS_NAMES.description,
            consumerClassNames.description,
          ),
          actionButton: cn(
            TOAST_TOASTER_DEFAULT_CLASS_NAMES.actionButton,
            consumerClassNames.actionButton,
          ),
          cancelButton: cn(
            TOAST_TOASTER_DEFAULT_CLASS_NAMES.cancelButton,
            consumerClassNames.cancelButton,
          ),
        },
      }}
      {...rest}
    />
  );
};

Toaster.displayName = 'Toaster';
