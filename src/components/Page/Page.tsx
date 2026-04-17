import { cn } from '@lib/utils';
import type { PageProps } from './types';
import { PageHeader } from './components/PageHeader';

export function Page(props: Readonly<PageProps>) {
  const {
    children,
    actions = [],
    className,
    onSearch,
    enableSearch = true,
    filterSlot,
    searchPlaceholder,
  } = props;

  return (
    <div
      className={cn(
        'flex flex-col h-full w-full overflow-hidden px-3 py-1',
        className,
        'max-h-screen',
      )}
    >
      {enableSearch && (
        <PageHeader
          actions={actions}
          onSearch={onSearch}
          filterSlot={filterSlot}
          className="w-full"
          searchPlaceholder={searchPlaceholder}
        />
      )}
      <div className="flex-1 w-full overflow-hidden">{children}</div>
    </div>
  );
}
