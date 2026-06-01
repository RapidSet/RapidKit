import type { StatCardTrend } from '@rapidset/rapidkit';
import type { Role } from './services/access';

export type DashboardGoal = {
  key: string;
  label: string;
  current: number;
  target: number;
  unit: string;
};

export type DashboardPerformer = {
  id: string;
  name: string;
  role: string;
  score: string;
  trend: StatCardTrend;
  avatarUrl: string;
};

export type DashboardMediaAsset = {
  id: string;
  src: string;
  caption: string;
};

export type DashboardContentProps = Readonly<{
  role: Role;
  onRoleChange: (role: Role) => void;
}>;
