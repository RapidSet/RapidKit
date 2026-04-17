import React from 'react';
import { BaseTablePlaceHolderProps } from './types';

const TablePlaceholder: React.FC<BaseTablePlaceHolderProps> = (
  props: BaseTablePlaceHolderProps,
) => {
  const { isLoading, placeholder } = props;
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {isLoading ? (
        <span
          className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-foreground"
          aria-label="Loading"
        />
      ) : (
        <span className="text-xs text-muted-foreground">{placeholder}</span>
      )}
    </div>
  );
};

export default TablePlaceholder;
