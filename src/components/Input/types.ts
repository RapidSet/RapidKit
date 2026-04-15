import * as React from "react";

export type InputAccessMode = "view" | "edit";

export type InputAccessResolver = (
  requirement: string,
  mode: InputAccessMode,
) => boolean;

export type InputProps = {
  type?: string;
  label?: string;
  name: string;
  value: string | number | undefined;
  required?: boolean;
  className?: string;
  autoComplete?: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  isLoading?: boolean;
  accessRequirements?: string[];
  resolveAccess?: InputAccessResolver;
};
