import { Text } from '@rapidset/rapidkit';
import { ROLE_OPTIONS } from './consts';
import type { RoleSwitcherProps } from './types';

export function RoleSwitcher({ role, onChange }: RoleSwitcherProps) {
  return (
    <div
      role="group"
      aria-label="Preview role"
      className="inline-flex items-center gap-1 rounded-md border border-border bg-card p-1 shadow-sm"
    >
      <Text
        as="span"
        tone="muted"
        className="px-1.5 text-[0.65rem] font-medium uppercase tracking-wider"
      >
        Role
      </Text>
      {ROLE_OPTIONS.map((option) => {
        const isActive = option.role === role;
        const Icon = option.icon;
        return (
          <button
            key={option.role}
            type="button"
            onClick={() => onChange(option.role)}
            aria-pressed={isActive}
            className={
              'inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium transition-colors ' +
              (isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground')
            }
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
