import { resolveViewAccessState } from '@lib/view-edit-access';
import type { ChartAccessConfig, ChartAccessResolver } from './types';

export const resolveChartAccessState = (
  access: ChartAccessConfig | undefined,
  canAccess: ChartAccessResolver | undefined,
) => resolveViewAccessState(access, canAccess);
