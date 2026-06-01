import { useEffect, useMemo } from 'react';
import { Mail } from 'lucide-react';
import {
  BaseTable,
  Chip,
  Text,
  useDebounce,
  useSearchPagination,
} from '@rapidset/rapidkit';
import { DASHBOARD_ACTIVITY } from './data';
import type { DashboardActivity } from './types';
import { DASHBOARD_ACTIVITY_COLUMNS } from './consts';
import type { ActivityTableProps } from './types';

export function ActivityTable({
  searchInput,
  selectedActivityId,
  onSelectActivity,
}: ActivityTableProps) {
  const debouncedQuery = useDebounce(searchInput, 250);
  const { paginationParams, handleSearch } = useSearchPagination();
  const activeQuery = paginationParams.query ?? '';

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  const selectedActivity = useMemo(
    () =>
      DASHBOARD_ACTIVITY.find((row) => row.id === selectedActivityId) ?? null,
    [selectedActivityId],
  );

  const filteredActivity = useMemo(() => {
    const needle = activeQuery.trim().toLowerCase();
    if (!needle) {
      return DASHBOARD_ACTIVITY;
    }
    return DASHBOARD_ACTIVITY.filter(
      (row) =>
        row.actor.toLowerCase().includes(needle) ||
        row.action.toLowerCase().includes(needle),
    );
  }, [activeQuery]);

  return (
    <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <Text as="p" className="text-sm font-medium text-foreground">
            Recent activity
          </Text>
          {selectedActivity ? (
            <Text as="p" tone="muted" className="text-xs">
              Selected · {selectedActivity.actor} — {selectedActivity.action}
            </Text>
          ) : (
            <Text as="p" tone="muted" className="text-xs">
              {activeQuery
                ? `${filteredActivity.length} match${filteredActivity.length === 1 ? '' : 'es'} for "${activeQuery}"`
                : 'Click a row to inspect it'}
            </Text>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Chip
            label="Live feed"
            icon={Mail}
            variant="outline"
            size="sm"
            className="border-border bg-muted text-muted-foreground"
          />
        </div>
      </div>
      <BaseTable<DashboardActivity>
        data={filteredActivity}
        columns={DASHBOARD_ACTIVITY_COLUMNS}
        activeItem={selectedActivity}
        onRowClicked={(row) => onSelectActivity(row.id)}
        responsive={false}
      />
    </section>
  );
}
