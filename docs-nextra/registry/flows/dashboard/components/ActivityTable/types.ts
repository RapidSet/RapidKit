export type DashboardActivity = {
  id: string;
  actor: string;
  avatarUrl: string;
  action: string;
  channel: 'Sales' | 'Marketing' | 'Engineering' | 'Product';
  region: 'NA' | 'EMEA' | 'APAC';
  priority: 'high' | 'medium' | 'low';
  impact: string;
  status: 'completed' | 'pending' | 'in_review';
  timestamp: string;
};

export type ActivityTableProps = Readonly<{
  searchInput: string;
  selectedActivityId: string | null;
  onSelectActivity: (id: string) => void;
}>;
