export const optionItemBaseClassName =
  'h-[var(--rk-control-height)] border-b border-border px-0 py-0 text-[length:var(--rk-control-font-size)] text-foreground last:border-b-0';

export const optionItemInteractiveClassName =
  'relative cursor-pointer rounded-none px-[var(--rk-control-padding-x)] py-0 transition-colors';

export const optionItemDropdownStateClassName =
  'data-[highlighted]:bg-muted data-[highlighted]:text-foreground focus:bg-muted focus:text-foreground data-[state=checked]:bg-muted data-[state=checked]:text-foreground';

export const optionItemMenuStateClassName =
  'data-[highlighted]:bg-muted data-[highlighted]:text-foreground focus:bg-muted focus:text-foreground';

export const optionItemMenuDisabledClassName =
  'data-[disabled]:pointer-events-none data-[disabled]:opacity-50';

export const optionItemMenuClassName =
  'relative flex w-full cursor-default select-none items-center rounded-none py-0 text-[length:var(--rk-control-font-size)] outline-none transition-colors';

export const optionItemMenuCheckableClassName =
  'relative flex h-[var(--rk-control-height)] w-full cursor-default select-none items-center rounded-none py-0 pl-[var(--rk-control-padding-x)] pr-[calc(var(--rk-control-padding-x)+1.5rem)] text-[length:var(--rk-control-font-size)] outline-none transition-colors';

export const optionItemMenuSubTriggerClassName =
  'data-[state=open]:bg-muted data-[state=open]:text-foreground flex h-[var(--rk-control-height)] w-full cursor-default select-none items-center rounded-none px-[var(--rk-control-padding-x)] py-0 text-[length:var(--rk-control-font-size)] outline-none transition-colors';

export const optionItemButtonContentClassName =
  'flex h-full w-full items-center px-[var(--rk-control-padding-x)] py-0 text-left text-[length:var(--rk-control-font-size)] text-foreground';

export const optionItemSelectedClassName = 'bg-muted text-foreground';

export const optionItemDefaultClassName =
  'bg-background text-foreground hover:bg-muted focus-within:bg-muted';

export const optionListEmptyStateClassName =
  'flex h-[var(--rk-control-height)] items-center justify-center px-0 py-0 text-[length:var(--rk-control-font-size)] text-muted-foreground';
