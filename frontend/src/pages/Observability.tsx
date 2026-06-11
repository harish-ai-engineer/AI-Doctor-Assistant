import { Activity, AlertTriangle, CircleDollarSign, Clock3, Cpu, Server, TriangleAlert, Zap } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, PageHeader, Progress } from "@/components/ui";
import { MetricCard } from "@/components/MetricCard";
import { usageData } from "@/data/demo";

export function Observability() {
  return (
    <div>
      <PageHeader eyebrow="Observability" title="Production health" description="Monitor request reliability, latency, token consumption, model cost, and prompt performance from a single operational view." action={<div className="flex items-center gap-2 rounded-full border bg-card px-3 py-2 text-xs font-bold"><span className="size-2 animate-pulse rounded-full bg-emerald-500" />Live · 30s</div>} />
      <section className="metric-grid">
        <MetricCard label="Requests / minute" value="42.8" change="8.1%" icon={Zap} />
        <MetricCard label="P95 latency" value="2.14s" change="4.2%" trend="down" icon={Clock3} accent="blue" />
        <MetricCard label="Error rate" value="0.38%" change="0.1%" trend="down" icon={AlertTriangle} accent="violet" />
        <MetricCard label="Cost / 1K requests" value="$9.42" change="11.5%" trend="down" icon={CircleDollarSign} accent="amber" />
      </section>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <ChartCard title="Latency by percentile" description="Generation response time in seconds"><LineChart data={usageData}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" /><XAxis dataKey="day" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} /><Line type="monotone" dataKey="cost" name="P95" stroke="#f59e0b" strokeWidth={2.5} dot={false} /><Line type="monotone" dataKey="tokens" name="P50" stroke="#10b981" strokeWidth={2.5} dot={false} /></LineChart></ChartCard>
        <ChartCard title="Daily model cost" description="OpenAI spend attributed by AgentGuard"><AreaChart data={usageData}><defs><linearGradient id="cost" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#38bdf8" stopOpacity={.4} /><stop offset="1" stopColor="#38bdf8" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" /><XAxis dataKey="day" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} /><Area type="monotone" dataKey="cost" stroke="#38bdf8" strokeWidth={2.5} fill="url(#cost)" /></AreaChart></ChartCard>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <Card className="overflow-hidden"><div className="flex items-center justify-between border-b p-5"><div><h2 className="font-bold">Recent incidents</h2><p className="text-xs text-muted-foreground">Errors and quality regressions</p></div><Badge tone="warning">2 open</Badge></div>{[
          { title: "OpenAI rate limit retry", meta: "3 requests · 18 minutes ago", tone: "warning" as const },
          { title: "Low groundedness score", meta: "Prompt v11 · 1 hour ago", tone: "danger" as const },
          { title: "ChromaDB retrieval timeout", meta: "Recovered · 4 hours ago", tone: "neutral" as const },
        ].map(({ title, meta, tone }) => <div key={title} className="flex items-center gap-4 border-t p-5 first:border-t-0"><span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500"><TriangleAlert className="size-4" /></span><div className="flex-1"><p className="text-sm font-bold">{title}</p><p className="text-xs text-muted-foreground">{meta}</p></div><Badge tone={tone}>{tone === "neutral" ? "Resolved" : "Investigate"}</Badge></div>)}</Card>
        <Card className="p-6"><h2 className="font-bold">Service health</h2><p className="mb-6 text-xs text-muted-foreground">Application dependencies</p><div className="space-y-5">{[["FastAPI", "99.99%", Server, 99.99], ["OpenAI GPT-4o", "99.92%", Cpu, 99.92], ["AgentGuard", "100%", Activity, 100], ["ChromaDB", "99.97%", Server, 99.97]].map(([name, value, Icon, health]) => { const IconComponent = Icon as typeof Server; return <div key={String(name)}><div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-2"><IconComponent className="size-4 text-primary" />{String(name)}</span><b>{String(value)}</b></div><Progress value={Number(health)} /></div>; })}</div></Card>
      </div>
    </div>
  );
}

function ChartCard({ title, description, children }: { title: string; description: string; children: React.ReactElement }) {
  return <Card className="p-6"><h2 className="font-bold">{title}</h2><p className="mb-5 text-xs text-muted-foreground">{description}</p><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div></Card>;
}
