import { Avatar, CellType, type Column } from '@rapidset/rapidkit';
import type { DashboardActivity } from './types';
import {
  dashboardChannelStyler,
  dashboardPriorityStyler,
  dashboardStatusStyler,
} from './styles';

export const DASHBOARD_ACTIVITY_COLUMNS: Column<DashboardActivity>[] = [
  {
    id: 'actor',
    header: 'Owner',
    accessorKey: 'actor',
    type: CellType.TEXT,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar
          src={row.original.avatarUrl}
          alt={row.original.actor}
          size="sm"
        />
        <span className="text-sm text-foreground">{row.original.actor}</span>
      </div>
    ),
  },
  {
    id: 'action',
    header: 'Activity',
    accessorKey: 'action',
    type: CellType.TEXT,
  },
  {
    id: 'channel',
    header: 'Channel',
    accessorKey: 'channel',
    type: CellType.CHIP,
    styler: dashboardChannelStyler,
    showFrom: 'md',
  },
  {
    id: 'region',
    header: 'Region',
    accessorKey: 'region',
    type: CellType.TEXT,
    showFrom: 'lg',
  },
  {
    id: 'priority',
    header: 'Priority',
    accessorKey: 'priority',
    type: CellType.STATUS,
    styler: dashboardPriorityStyler,
    showFrom: 'md',
  },
  {
    id: 'impact',
    header: 'Impact',
    accessorKey: 'impact',
    type: CellType.TEXT,
    showFrom: 'lg',
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    type: CellType.STATUS,
    styler: dashboardStatusStyler,
  },
  {
    id: 'timestamp',
    header: 'When',
    accessorKey: 'timestamp',
    type: CellType.DATE,
  },
];
