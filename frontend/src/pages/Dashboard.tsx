import { Activity, Bot, Clock3, Coins, MessageSquareText, Star, Tag, Workflow } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Button, Card, PageHeader, Progress } from "@/components/ui";
import { MetricCard } from "@/components/MetricCard";
import { traces, usageData } from "@/data/demo";

const metrics = [
  { label: "AI conversations", value: "1,458", change: "12.8%", icon: MessageSquareText, accent: "green" as const },
  { label: "Average response time", value: "1.42s", change: "8.3%", trend: "down" as const, icon: Clock3, accent: "blue" as const },
  { label: "Tokens this month", value: "2.84M", change: "18.1%", icon: Bot, accent: "violet" as const },
  { label: "Total AI cost", value: "$84.29", change: "6.2%", icon: Coins, accent: "amber" as const },
];

export function Dashboard() {
  return (
    <div>
      <PageHeader eyebrow="System overview" title="Good morning, Dr. Chen" description="Your AI clinical assistant is healthy. Here is how prompts, traces, and patient conversations are performing." action={<Button><Activity className="size-4" />Open AgentGuard</Button>} />
      <section className="metric-grid">{metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div><h2 className="font-bold">Conversation volume</h2><p className="text-xs text-muted-foreground">Requests and token usage over 7 days</p></div>
            <select aria-label="Chart range" className="rounded-lg border bg-card px-3 py-2 text-xs"><option>Last 7 days</option><option>Last 30 days</option></select>
          </div>
          <div className="h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData}>
                <defs><linearGradient id="usage" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.38} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="conversations" stroke="#10b981" strokeWidth={3} fill="url(#usage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <div className="mb-6 flex items-center justify-between"><div><h2 className="font-bold">AgentGuard health</h2><p className="text-xs text-muted-foreground">Quality signals this month</p></div><Badge tone="success">Live</Badge></div>
          <div className="space-y-5">
            {[
              { label: "User satisfaction", value: 92, meta: "4.6 / 5", icon: Star },
              { label: "Trace coverage", value: 99.8, meta: "99.8%", icon: Workflow },
              { label: "Prompt quality", value: 94, meta: "94 / 100", icon: Tag },
              { label: "Successful generations", value: 98.7, meta: "98.7%", icon: Activity },
            ].map(({ label, value, meta, icon: Icon }) => <div key={label}><div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-medium"><Icon className="size-4 text-primary" />{label}</span><b>{meta}</b></div><Progress value={value} /></div>)}
          </div>
          <div className="mt-7 rounded-xl bg-secondary/70 p-4"><p className="text-xs font-bold text-primary">Learning insight</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Prompt v12 improved satisfaction by 5.4% while reducing average completion tokens by 11%.</p></div>
        </Card>
      </section>

      <Card className="mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b p-5"><div><h2 className="font-bold">Recent traces</h2><p className="text-xs text-muted-foreground">Latest generations captured by AgentGuard</p></div><Button variant="outline" size="sm">View all traces</Button></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-muted/60 text-[11px] uppercase tracking-wider text-muted-foreground"><tr>{["Trace", "User query", "Prompt", "Latency", "Tokens", "Cost", "Status"].map((h) => <th key={h} className="px-5 py-3 font-bold">{h}</th>)}</tr></thead>
          <tbody>{traces.slice(0, 4).map((trace) => <tr key={trace.id} className="border-t hover:bg-muted/35"><td className="px-5 py-4 font-mono text-xs text-primary">{trace.id}</td><td className="max-w-[260px] truncate px-5">{trace.query}</td><td className="px-5"><Badge tone="blue">{trace.prompt}</Badge></td><td className="px-5">{trace.latency}</td><td className="px-5">{trace.tokens}</td><td className="px-5 font-mono text-xs">{trace.cost}</td><td className="px-5"><Badge tone={trace.status === "Success" ? "success" : "warning"}>{trace.status}</Badge></td></tr>)}</tbody></table>
        </div>
      </Card>
    </div>
  );
}
