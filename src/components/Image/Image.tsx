import { forwardRef, useState } from 'react';
import { ImageIcon } from 'lucide-react';
import { cn } from '@lib/utils';
import { ImageProps } from './types';
import { imageSizeClasses, resolveImageAccessState } from './helpers';

export const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const {
    size = 'md',
    className,
    src,
    alt,
    accessRequirements,
    resolveAccess,
    ...imgProps
  } = props;

  const [hasError, setHasError] = useState(false);
  const { canView } = resolveImageAccessState(
    accessRequirements,
    resolveAccess,
  );

  const handleError = () => {
    setHasError(true);
  };

  if (!canView) {
    return null;
  }

  if (!src || hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-md bg-muted',
          'border border-border',
          imageSizeClasses[size],
          className,
        )}
      >
        <ImageIcon className="h-1/3 w-1/3 text-muted-foreground" />
      </div>
    );
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={cn(
        'rounded-md object-cover',
        imageSizeClasses[size],
        className,
      )}
      onError={handleError}
      {...imgProps}
    />
  );
});

Image.displayName = 'Image';
