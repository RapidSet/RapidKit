import type { LogoProps } from './types';

type LogoSize = NonNullable<LogoProps['size']>;

const LOGO_SIZE_STYLES: Record<
  LogoSize,
  {
    imageSize: 'sm';
    imageClass: string;
    textClass: string;
    containerClass: string;
  }
> = {
  small: {
    imageSize: 'sm',
    imageClass: 'h-4 w-4',
    textClass: 'text-sm',
    containerClass: 'gap-2 px-1 py-1',
  },
  medium: {
    imageSize: 'sm',
    imageClass: 'h-5 w-5',
    textClass: 'text-base',
    containerClass: 'gap-2 px-1.5 py-1',
  },
  large: {
    imageSize: 'sm',
    imageClass: 'h-6 w-6',
    textClass: 'text-lg',
    containerClass: 'gap-2.5 px-2 py-1.5',
  },
};

export const logoStyles = {
  containerBase: 'inline-flex items-center',
  imageBase: 'transition-opacity duration-300 ease-in-out',
  textBase: 'font-semibold leading-none',
} as const;

export const getLogoSizeStyles = (size: LogoSize) => {
  return LOGO_SIZE_STYLES[size];
};
