import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@components/Button';
import { ButtonVariant } from '@components/Button/styles';
import { cn } from '@lib/utils';
import type { BaseModalAccessResolver, BaseModalProps } from './types';

const canAccess = (
  requirements: string[],
  resolveAccess: BaseModalAccessResolver | undefined,
  mode: 'view' | 'action',
) => {
  if (!requirements.length || !resolveAccess) {
    return true;
  }

  return requirements.every((requirement) => resolveAccess(requirement, mode));
};

const resolveModalAccessState = (
  requirements: string[] | undefined,
  resolveAccess: BaseModalAccessResolver | undefined,
) => {
  const normalizedRequirements = requirements ?? [];

  return {
    canView: canAccess(normalizedRequirements, resolveAccess, 'view'),
  };
};

export function BaseModal(props: Readonly<BaseModalProps>) {
  const {
    isOpen,
    onClose,
    onSave,
    onCancel,
    title,
    description,
    children,
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
    showSave = true,
    showCancel = true,
    saveVariant = ButtonVariant.Primary,
    cancelVariant = ButtonVariant.Outlined,
    saveDisabled = false,
    isLoading = false,
    maxWidth = 'max-w-lg',
    className,
    customButtons = [],
    accessRequirements,
    saveAccessRequirements,
    resolveAccess,
    preventOutsideClose = false,
  } = props;

  const { canView } = resolveModalAccessState(
    accessRequirements,
    resolveAccess,
  );

  if (!canView) {
    return null;
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    onClose();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      return;
    }

    if (preventOutsideClose) {
      return;
    }

    onClose();
  };

  const preventDefaultWhenOutsideCloseDisabled = (event: Event) => {
    if (!preventOutsideClose) {
      return;
    }

    event.preventDefault();
  };

  const shouldShowFooter = showSave || showCancel || customButtons.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        onInteractOutside={preventDefaultWhenOutsideCloseDisabled}
        onPointerDownOutside={preventDefaultWhenOutsideCloseDisabled}
        onEscapeKeyDown={preventDefaultWhenOutsideCloseDisabled}
        className={cn('flex max-h-[90vh] w-full flex-col', maxWidth, className)}
      >
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </div>
            <Button
              variant={ButtonVariant.Icon}
              leftIcon={X}
              onClick={onClose}
              aria-label="Close modal"
              className="h-8 w-8"
            />
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden py-4">
          {children}
        </div>

        {shouldShowFooter ? (
          <DialogFooter className="flex flex-shrink-0 flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            {showCancel && (
              <Button
                variant={cancelVariant}
                onClick={handleCancel}
                disabled={isLoading}
                label={cancelLabel}
                className="h-[var(--rk-control-height)] min-w-[80px] py-[var(--rk-button-padding-y)]"
              />
            )}
            {customButtons.map((button) => (
              <Button
                key={`custom-button-${button.label}-${button.variant ?? ButtonVariant.Default}`}
                variant={button.variant ?? ButtonVariant.Default}
                onClick={button.onClick}
                disabled={button.disabled || button.loading || isLoading}
                loading={button.loading}
                label={button.label}
                className="h-[var(--rk-control-height)] min-w-[80px] py-[var(--rk-button-padding-y)]"
                accessRequirements={button.accessRequirements}
                resolveAccess={resolveAccess}
              />
            ))}
            {showSave && (
              <Button
                variant={saveVariant}
                onClick={onSave}
                disabled={saveDisabled || !onSave}
                loading={isLoading}
                label={saveLabel}
                className="h-[var(--rk-control-height)] min-w-[80px] py-[var(--rk-button-padding-y)]"
                accessRequirements={saveAccessRequirements}
                resolveAccess={resolveAccess}
              />
            )}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
