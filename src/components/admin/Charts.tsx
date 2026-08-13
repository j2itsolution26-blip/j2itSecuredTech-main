'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { humanizeEnum } from '@/lib/utils';

const AXIS_STYLE = { fill: '#64748b', fontSize: 12 };
const GRID_COLOR = '#1e293b';

const TOOLTIP_STYLE = {
  backgroundColor: '#0f172a',
  border: '1px solid #1e293b',
  borderRadius: '0.75rem',
  color: '#f8fafc',
  fontSize: '0.8125rem',
};

/** Sequential brand palette — distinguishable in both value and hue. */
const SERIES_COLORS = ['#0057ff', '#00c2ff', '#22d3ee', '#10b981', '#f59e0b', '#ef4444'];

export function LeadTrendChart({
  data,
}: {
  data: { month: string; quotes: number; messages: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="quotesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0057ff" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#0057ff" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="messagesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis dataKey="month" tick={AXIS_STYLE} tickLine={false} axisLine={{ stroke: GRID_COLOR }} />
        <YAxis tick={AXIS_STYLE} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: GRID_COLOR }} />
        <Legend wrapperStyle={{ fontSize: '0.8125rem', color: '#94a3b8' }} />

        <Area
          type="monotone"
          dataKey="quotes"
          name="Quote requests"
          stroke="#0057ff"
          strokeWidth={2}
          fill="url(#quotesFill)"
        />
        <Area
          type="monotone"
          dataKey="messages"
          name="Contact messages"
          stroke="#22d3ee"
          strokeWidth={2}
          fill="url(#messagesFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ServiceDemandChart({ data }: { data: { service: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(240, data.length * 44)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
        <XAxis type="number" tick={AXIS_STYLE} tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="service"
          tick={AXIS_STYLE}
          tickLine={false}
          axisLine={false}
          width={170}
        />
        <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(148,163,184,0.08)' }} />
        <Bar dataKey="count" name="Requests" radius={[0, 6, 6, 0]}>
          {data.map((entry, index) => (
            <Cell key={entry.service} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function QuoteStatusChart({ data }: { data: { status: string; count: number }[] }) {
  const populated = data.filter((entry) => entry.count > 0);

  if (populated.length === 0) {
    return <p className="py-16 text-center text-sm text-subtle">No quote requests recorded yet.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={populated.map((entry) => ({ ...entry, label: humanizeEnum(entry.status) }))}
          dataKey="count"
          nameKey="label"
          innerRadius={62}
          outerRadius={100}
          paddingAngle={3}
          stroke="none"
        >
          {populated.map((entry, index) => (
            <Cell key={entry.status} fill={SERIES_COLORS[index % SERIES_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: '0.8125rem', color: '#94a3b8' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
