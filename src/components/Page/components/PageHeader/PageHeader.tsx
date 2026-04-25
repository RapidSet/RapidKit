import { cn } from '@lib/utils';
import { Button } from '@components/Button';
import { Search } from '@components/Search';
import type { PageHeaderProps } from './types';

export function PageHeader(props: Readonly<PageHeaderProps>) {
  const {
    actions = [],
    onSearch,
    className,
    filterSlot,
    searchPlaceholder = 'Search...',
  } = props;

  return (
    <div className={cn('sticky top-0 z-10 bg-background', className)}>
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Search placeholder={searchPlaceholder} onChange={onSearch} />
          {filterSlot}
        </div>
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            <Button
              key={action.name}
              onClick={action.onClick}
              variant={action.variant}
              leftIcon={action.icon}
              label={action.name}
              disabled={action.disabled}
              access={action.access}
              canAccess={action.canAccess}
              accessDeniedBehavior={action.accessDeniedBehavior}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
