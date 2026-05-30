import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { StatCardTrend } from './types';

export const STAT_CARD_TREND_ICONS: Record<StatCardTrend, LucideIcon> = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  neutral: ArrowRight,
};

export const STAT_CARD_TREND_CHIP_CLASSES: Record<StatCardTrend, string> = {
  up: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  down: 'border-rose-200 bg-rose-50 text-rose-700',
  neutral: 'border-border bg-muted text-muted-foreground',
};

export const STAT_CARD_BASE_CLASSES =
  'flex flex-col rounded-xl border border-border bg-card p-4 text-left';

export const STAT_CARD_INTERACTIVE_CLASSES =
  'transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background';
