import { Image } from '@components/Image';
import { cn } from '@lib/utils';
import { LogoProps } from './types';
import { getLogoSizeStyles, logoStyles } from './styles';

export const Logo = ({
  open = true,
  testId = 'logo',
  className = 'logo',
  showIcon = true,
  showText = true,
  size = 'small',
  logoSrc = '/logo.svg',
  iconSrc = '/icon.svg',
  alt = 'Logo',
  text = 'RapidKit',
}: LogoProps) => {
  const sizeClasses = getLogoSizeStyles(size);
  const shouldShowText = open && showText;
  const shouldShowIcon = showIcon;
  const imageSrc = iconSrc || logoSrc;
  const logoTestId = shouldShowText ? `${testId}-logo` : `${testId}-icon`;

  if (!shouldShowIcon && !shouldShowText) {
    return null;
  }

  return (
    <div
      className={cn(logoStyles.containerBase, sizeClasses.containerClass)}
      data-testid={`${testId}-container`}
    >
      {shouldShowIcon ? (
        <Image
          src={imageSrc}
          alt={alt}
          size={sizeClasses.imageSize}
          className={cn(
            sizeClasses.imageClass,
            logoStyles.imageBase,
            className,
          )}
          data-testid={logoTestId}
        />
      ) : null}
      {shouldShowText ? (
        <span
          className={cn(logoStyles.textBase, sizeClasses.textClass)}
          data-testid={`${testId}-text`}
        >
          {text}
        </span>
      ) : null}
    </div>
  );
};
