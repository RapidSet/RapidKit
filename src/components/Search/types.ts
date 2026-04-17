import type { KeyboardEventHandler } from 'react';

export interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
  ariaLabel?: string;
}
