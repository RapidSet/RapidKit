export { DashboardPage as default } from './DashboardPage';
export { DashboardPage } from './DashboardPage';
export { ActivityTable } from './components/ActivityTable';
export { CategoryBreakdown } from './components/CategoryBreakdown';
export { KpiTiles } from './components/KpiTiles';
export { PerformanceChart } from './components/PerformanceChart';
export { RoleSwitcher } from './components/RoleSwitcher';
export { Sidebar } from './components/Sidebar';
export { buildCanAccess, ROLE_PERMISSIONS, type Role } from './services/access';
export type { DashboardActivity } from './components/ActivityTable/types';
export type { DashboardKpi } from './components/KpiTiles/types';
export type { DashboardNavItem } from './components/Sidebar/types';
export type {
  DashboardGoal,
  DashboardMediaAsset,
  DashboardPerformer,
} from './types';
