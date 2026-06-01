import { useMemo, useState } from 'react';
import {
  Activity,
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Download,
  FolderOpen,
  MousePointerClick,
  Plus,
  Target,
  TrendingUp,
  UserPlus,
  Zap,
} from 'lucide-react';
import {
  Avatar,
  Button,
  ButtonVariant,
  Chart,
  ChartVariant,
  Chip,
  DropDown,
  Image,
  Page,
  RapidKitAccessProvider,
  Search,
  SideBarTrigger,
  Text,
  resolveViewAccessState,
  useAccessResolver,
} from '@rapidset/rapidkit';
import { ActivityTable } from './components/ActivityTable';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { KpiTiles } from './components/KpiTiles';
import { PerformanceChart } from './components/PerformanceChart';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Sidebar } from './components/Sidebar';
import { DASHBOARD_NAV } from './components/Sidebar/consts';
import { DASHBOARD_DATE_RANGE_OPTIONS } from './consts/dateRange';
import { DASHBOARD_CHANNELS, DASHBOARD_CHANNELS_CONFIG } from './data/channels';
import { DASHBOARD_GOALS } from './data/goals';
import { DASHBOARD_MEDIA } from './data/media';
import { DASHBOARD_PERFORMERS } from './data/performers';
import { formatCurrency } from './helpers/formatCurrency';
import { buildCanAccess, type Role } from './services/access';
import type { DashboardContentProps } from './types';

export function DashboardPage() {
  const [role, setRole] = useState<Role>('admin');
  const canAccess = useMemo(() => buildCanAccess(role), [role]);

  return (
    <RapidKitAccessProvider canAccess={canAccess}>
      <DashboardContent role={role} onRoleChange={setRole} />
    </RapidKitAccessProvider>
  );
}

function DashboardContent({ role, onRoleChange }: DashboardContentProps) {
  const [activeNav, setActiveNav] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [focusedKpi, setFocusedKpi] = useState<string | null>('users');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );
  const [searchInput, setSearchInput] = useState('');
  const [notificationsRead, setNotificationsRead] = useState(false);

  const canAccess = useAccessResolver();
  const { canView: canViewFinance } = resolveViewAccessState(
    { rules: [{ action: 'read', subject: 'finance' }] },
    canAccess,
  );

  const dateRangeLabel = useMemo(
    () =>
      DASHBOARD_DATE_RANGE_OPTIONS.find((option) => option.value === dateRange)
        ?.label ?? 'Custom range',
    [dateRange],
  );

  const activeNavLabel = useMemo(() => {
    for (const item of DASHBOARD_NAV) {
      if (item.key === activeNav) {
        return item.label;
      }
      const subMatch = item.items?.find((sub) => sub.key === activeNav);
      if (subMatch) {
        return `${item.label} · ${subMatch.label}`;
      }
    }
    return activeNav;
  }, [activeNav]);

  return (
    <Sidebar
      activeNav={activeNav}
      onSelectNav={setActiveNav}
      mainContent={
        <main className="flex min-w-0 flex-1 flex-col bg-background">
          <header className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/75 md:px-6">
            <SideBarTrigger className="shrink-0" />
            <div className="flex-1 min-w-[12rem] max-w-md">
              <Search
                placeholder="Search activity, owners, campaigns..."
                value={searchInput}
                onChange={setSearchInput}
                ariaLabel="Search dashboard"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <RoleSwitcher role={role} onChange={onRoleChange} />
              <Button
                type="button"
                variant={ButtonVariant.Outlined}
                leftIcon={Plus}
                label="New report"
                access={{
                  rules: [{ action: 'create', subject: 'report' }],
                }}
                accessDeniedBehavior="hide"
              />
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => setNotificationsRead(true)}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {notificationsRead ? null : (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                )}
              </button>
              <Avatar
                src="https://i.pravatar.cc/120?u=header-avery"
                alt="Avery Quinn"
                size="sm"
              />
            </div>
          </header>

          <Page
            enableSearch={false}
            className="min-h-[44rem] w-full rounded-none bg-background p-0 max-h-none"
          >
            <div className="h-full w-full overflow-y-auto px-4 py-6 md:px-8 md:py-8">
              <section className="flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Chip
                      label="Live"
                      icon={Zap}
                      variant="outline"
                      size="sm"
                      pulse
                      className="border-primary/40 bg-primary/10 text-primary"
                    />
                    <Chip
                      label={dateRangeLabel}
                      icon={Clock}
                      variant="outline"
                      size="sm"
                      className="border-border bg-card text-muted-foreground"
                    />
                  </div>
                  <Text
                    as="p"
                    className="text-3xl font-semibold tracking-tight text-foreground"
                  >
                    Workspace overview
                  </Text>
                  <Text as="p" tone="muted" className="max-w-2xl text-sm">
                    Viewing {activeNavLabel}. Use the collapse button to toggle
                    the rail, expand a section to jump into a sub-area, then
                    drill into a KPI or a row to refocus the page.
                  </Text>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-44">
                    <DropDown
                      value={dateRange}
                      onChange={setDateRange}
                      options={DASHBOARD_DATE_RANGE_OPTIONS}
                    />
                  </div>
                  <Button
                    type="button"
                    variant={ButtonVariant.Outlined}
                    leftIcon={Download}
                    label="Export"
                    access={{
                      rules: [{ action: 'export', subject: 'report' }],
                    }}
                  />
                </div>
              </section>

              <KpiTiles focusedKpi={focusedKpi} onFocusKpi={setFocusedKpi} />

              <section className="mt-6 grid gap-3 lg:grid-cols-3">
                <PerformanceChart
                  dateRange={dateRange}
                  dateRangeLabel={dateRangeLabel}
                />
                <CategoryBreakdown />
              </section>

              <section className="mt-6 grid gap-3 lg:grid-cols-3">
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <MousePointerClick
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Text
                      as="p"
                      className="text-sm font-medium text-foreground"
                    >
                      Top channels
                    </Text>
                  </div>
                  <Chart
                    type={ChartVariant.Bar}
                    data={DASHBOARD_CHANNELS}
                    config={DASHBOARD_CHANNELS_CONFIG}
                    series={[{ dataKey: 'conversions' }]}
                    xAxisKey="channel"
                    layout="vertical"
                    showLegend={false}
                    height={240}
                    barRadius={6}
                  />
                </div>

                {canViewFinance ? (
                  <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <Text
                          as="p"
                          className="text-sm font-medium text-foreground"
                        >
                          Quarter goals
                        </Text>
                      </div>
                      <Chip
                        label="Q3"
                        icon={CalendarCheck}
                        variant="outline"
                        size="sm"
                        className="border-border bg-muted text-muted-foreground"
                      />
                    </div>
                    <ul className="space-y-4">
                      {DASHBOARD_GOALS.map((goal) => {
                        const pct = Math.min(
                          100,
                          Math.round((goal.current / goal.target) * 100),
                        );
                        const onTrack = pct >= 80;
                        return (
                          <li key={goal.key}>
                            <div className="flex items-center justify-between gap-2">
                              <Text
                                as="p"
                                className="text-sm font-medium text-foreground"
                              >
                                {goal.label}
                              </Text>
                              <Text as="p" tone="muted" className="text-xs">
                                {formatCurrency(goal.current, goal.unit)} /{' '}
                                {formatCurrency(goal.target, goal.unit)}
                              </Text>
                            </div>
                            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className={
                                  onTrack
                                    ? 'h-full rounded-full bg-primary transition-all'
                                    : 'h-full rounded-full bg-amber-500 transition-all'
                                }
                                style={{ width: pct + '%' }}
                                role="progressbar"
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={pct}
                                aria-label={goal.label + ' progress'}
                              />
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                              {onTrack ? (
                                <CheckCircle2
                                  className="h-3.5 w-3.5 text-emerald-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <Clock
                                  className="h-3.5 w-3.5 text-amber-500"
                                  aria-hidden="true"
                                />
                              )}
                              <span>
                                {pct}% · {onTrack ? 'On track' : 'Needs push'}
                              </span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserPlus
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <Text
                        as="p"
                        className="text-sm font-medium text-foreground"
                      >
                        Top performers
                      </Text>
                    </div>
                    <Button
                      type="button"
                      variant={ButtonVariant.Text}
                      label="View team"
                      access={{
                        rules: [{ action: 'read', subject: 'team' }],
                      }}
                      accessDeniedBehavior="hide"
                    />
                  </div>
                  <ul className="space-y-3">
                    {DASHBOARD_PERFORMERS.map((person) => (
                      <li
                        key={person.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={person.avatarUrl}
                            alt={person.name}
                            size="sm"
                          />
                          <div>
                            <Text
                              as="p"
                              className="text-sm font-medium text-foreground"
                            >
                              {person.name}
                            </Text>
                            <Text as="p" tone="muted" className="text-xs">
                              {person.role}
                            </Text>
                          </div>
                        </div>
                        <Chip
                          label={person.score}
                          variant="outline"
                          size="sm"
                          icon={person.trend === 'up' ? TrendingUp : Activity}
                          className={
                            person.trend === 'up'
                              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                              : 'border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <section className="mt-6 rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen
                      className="h-4 w-4 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <Text
                      as="p"
                      className="text-sm font-medium text-foreground"
                    >
                      Recent media
                    </Text>
                  </div>
                  <Chip
                    label={`${DASHBOARD_MEDIA.length} assets`}
                    variant="outline"
                    size="sm"
                    className="border-border bg-muted text-muted-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {DASHBOARD_MEDIA.map((asset) => (
                    <figure key={asset.id} className="flex flex-col gap-1.5">
                      <Image
                        src={asset.src}
                        alt={asset.caption}
                        size="md"
                        className="h-20 w-full rounded-md object-cover"
                        loading="lazy"
                      />
                      <figcaption className="truncate text-xs text-muted-foreground">
                        {asset.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>

              <ActivityTable
                searchInput={searchInput}
                selectedActivityId={selectedActivityId}
                onSelectActivity={setSelectedActivityId}
              />
            </div>
          </Page>
        </main>
      }
    />
  );
}
