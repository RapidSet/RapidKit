import { forwardRef, type ChangeEvent, type KeyboardEvent } from "react";
import { cn } from "@lib/utils";
import { Label } from "@ui/label";
import { Input as ShadcnInput } from "@ui/input";
import { InputProps } from "./types";

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    className,
    label,
    error,
    helperText,
    name,
    value = "",
    onChange,
    required,
    accessRequirements,
    resolveAccess,
    disabled,
    ...rest
  } = props;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
  };

  const hasViewPermission =
    !accessRequirements || accessRequirements.length === 0 || !resolveAccess
      ? true
      : accessRequirements.some((requirement) =>
          resolveAccess(requirement, "view"),
        );

  if (!hasViewPermission) {
    return null;
  }

  const hasEditPermission =
    !accessRequirements || accessRequirements.length === 0 || !resolveAccess
      ? true
      : accessRequirements.some((requirement) =>
          resolveAccess(requirement, "edit"),
        );

  const isReadOnly = hasViewPermission && !hasEditPermission;

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-xs text-muted-foreground" htmlFor={name}>
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <ShadcnInput
        {...rest}
        id={name}
        name={name}
        required={required}
        type={rest.type ?? "text"}
        className={cn(
          error && "border-destructive",
          "text-xs placeholder:text-muted-foreground/60 placeholder:text-xs",
          className,
        )}
        ref={ref}
        onChange={handleInputChange}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.stopPropagation()}
        value={value}
        disabled={isReadOnly || disabled}
        placeholder={rest.placeholder}
        aria-invalid={error ? "true" : undefined}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {helperText && (
        <p className="text-xs text-muted-foreground opacity-60">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";
