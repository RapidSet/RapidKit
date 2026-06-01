export const dashboardStatusStyler = (value: unknown): string => {
  switch (value) {
    case 'completed':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    case 'pending':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    case 'in_review':
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300';
    default:
      return '';
  }
};

export const dashboardPriorityStyler = (value: unknown): string => {
  switch (value) {
    case 'high':
      return 'bg-rose-500/15 text-rose-700 dark:text-rose-300';
    case 'medium':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    case 'low':
      return 'bg-slate-500/15 text-slate-700 dark:text-slate-300';
    default:
      return '';
  }
};

export const dashboardChannelStyler = (value: unknown): string => {
  switch (value) {
    case 'Sales':
      return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
    case 'Marketing':
      return 'bg-violet-500/15 text-violet-700 dark:text-violet-300';
    case 'Engineering':
      return 'bg-sky-500/15 text-sky-700 dark:text-sky-300';
    case 'Product':
      return 'bg-amber-500/15 text-amber-700 dark:text-amber-300';
    default:
      return '';
  }
};
