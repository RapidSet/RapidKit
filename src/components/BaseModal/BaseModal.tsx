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
import { useAccessResolver } from '@lib/use-access-resolver';
import { cn } from '@lib/utils';
import type {
  ButtonAccessConfig,
  ButtonAccessResolver,
  ButtonAccessRule,
} from '@components/Button';
import type {
  BaseModalAccessConfig,
  BaseModalAccessResolver,
  BaseModalAccessRule,
  BaseModalProps,
} from './types';

const toButtonAccessRule = (rule: BaseModalAccessRule): ButtonAccessRule => ({
  subject: rule.subject,
  action: rule.action,
  mode: 'action',
});

const toButtonAccessConfig = (
  access: BaseModalAccessConfig | undefined,
): ButtonAccessConfig | undefined => {
  if (!access?.rules.length) {
    return undefined;
  }

  return {
    rules: access.rules.map(toButtonAccessRule),
    match: access.match,
  };
};

const toButtonAccessResolver = (
  canAccess: BaseModalAccessResolver | undefined,
): ButtonAccessResolver | undefined => {
  if (!canAccess) {
    return undefined;
  }

  return (rule) => canAccess(toButtonAccessRule(rule), 'action');
};

const matchesModalAccess = (
  rules: BaseModalAccessRule[],
  access: BaseModalAccessConfig | undefined,
  canAccess: BaseModalAccessResolver | undefined,
  mode: 'view' | 'action',
) => {
  if (!rules.length || !canAccess) {
    return true;
  }

  const match = access?.match ?? 'any';
  if (match === 'all') {
    return rules.every((rule) => canAccess(rule, mode));
  }

  return rules.some((rule) => canAccess(rule, mode));
};

const resolveModalAccessState = (
  access: BaseModalAccessConfig | undefined,
  canAccess: BaseModalAccessResolver | undefined,
) => {
  const rules = access?.rules ?? [];
  const viewRules = rules.filter(
    (rule) => rule.mode === 'view' || rule.action === 'read',
  );

  return {
    canView: matchesModalAccess(viewRules, access, canAccess, 'view'),
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
    access,
    saveAccess,
    canAccess,
    preventOutsideClose = false,
  } = props;

  const resolvedCanAccess = useAccessResolver(canAccess);

  const { canView } = resolveModalAccessState(access, resolvedCanAccess);
  const buttonCanAccess = toButtonAccessResolver(resolvedCanAccess);

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
                access={toButtonAccessConfig(button.access)}
                canAccess={buttonCanAccess}
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
                access={toButtonAccessConfig(saveAccess)}
                canAccess={buttonCanAccess}
              />
            )}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
