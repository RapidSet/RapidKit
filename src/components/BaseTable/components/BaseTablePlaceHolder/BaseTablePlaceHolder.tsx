import React from 'react';
import { BaseTablePlaceHolderProps } from './types';

const TablePlaceholder: React.FC<BaseTablePlaceHolderProps> = (
  props: BaseTablePlaceHolderProps,
) => {
  const { isLoading, placeholder } = props;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-background/70 to-muted/10 px-6 text-center">
      {isLoading ? (
        <div className="inline-flex items-center gap-3 rounded-full border border-border/70 bg-background/95 px-4 py-2 shadow-sm backdrop-blur-sm">
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
            aria-label="Loading"
          />
          <span className="text-xs font-medium text-muted-foreground">
            Loading rows
          </span>
        </div>
      ) : (
        <div className="inline-flex max-w-sm flex-col items-center gap-2 rounded-xl border border-dashed border-border/80 bg-background/95 px-6 py-5 shadow-sm">
          <span className="text-sm font-medium text-foreground">
            Nothing to display
          </span>
          <span className="text-xs leading-5 text-muted-foreground">
            {placeholder}
          </span>
        </div>
      )}
    </div>
  );
};

export default TablePlaceholder;
