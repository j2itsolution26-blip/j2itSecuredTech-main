import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { LeadTrendChart, QuoteStatusChart, ServiceDemandChart } from '@/components/admin/Charts';
import { EmptyState } from '@/components/ui/feedback';
import {
  getDashboardMetrics,
  getLeadTrend,
  getQuoteStatusBreakdown,
  getServiceDemand,
} from '@/lib/data/admin';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const [metrics, trend, demand, statusBreakdown] = await Promise.all([
    getDashboardMetrics(),
    getLeadTrend(),
    getServiceDemand(),
    getQuoteStatusBreakdown(),
  ]);

  const conversionRate =
    metrics.totalQuotes > 0 ? Math.round((metrics.wonQuotes / metrics.totalQuotes) * 100) : 0;

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Analytics"
        description="Lead performance and content reach, calculated live from the database."
        breadcrumbs={[{ name: 'Analytics' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total quote requests"
          value={metrics.totalQuotes}
          icon="FileText"
          trend={metrics.quoteGrowth}
          hint="vs previous 30 days"
        />
        <StatCard label="Won" value={metrics.wonQuotes} icon="ChartLine" hint={`${conversionRate}% conversion`} />
        <StatCard
          label="Content published"
          value={metrics.publishedPosts + metrics.activeProjects + metrics.activeServices}
          icon="Layers"
          hint={`${metrics.activeServices} services · ${metrics.activeProjects} projects · ${metrics.publishedPosts} articles`}
        />
        <StatCard label="Article views" value={metrics.totalViews} icon="Newspaper" hint="all-time" />
      </div>

      <section className="rounded-2xl border border-border bg-card/60 p-6" aria-labelledby="trend-heading">
        <h2 id="trend-heading" className="font-heading text-base font-semibold text-foreground">
          Lead volume — last 12 months
        </h2>
        <p className="mt-1 mb-6 text-sm text-muted">
          Quote requests compared with general contact messages.
        </p>
        <LeadTrendChart data={trend} />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card/60 p-6" aria-labelledby="demand-heading">
          <h2 id="demand-heading" className="font-heading text-base font-semibold text-foreground">
            Most requested services
          </h2>
          <p className="mt-1 mb-6 text-sm text-muted">
            Ranked by the service selected on the quote request form.
          </p>

          {demand.length === 0 ? (
            <EmptyState title="No data yet" description="Service demand appears once quote requests arrive." />
          ) : (
            <ServiceDemandChart data={demand} />
          )}
        </section>

        <section className="rounded-2xl border border-border bg-card/60 p-6" aria-labelledby="status-heading">
          <h2 id="status-heading" className="font-heading text-base font-semibold text-foreground">
            Pipeline breakdown
          </h2>
          <p className="mt-1 mb-6 text-sm text-muted">Quote requests by current status.</p>

          <QuoteStatusChart data={statusBreakdown} />
        </section>
      </div>
    </div>
  );
}
