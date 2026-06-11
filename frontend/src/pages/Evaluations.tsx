import { AlertTriangle, BrainCircuit, CheckCircle2, ShieldCheck, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, Card, PageHeader, Progress } from "@/components/ui";
import { MetricCard } from "@/components/MetricCard";

const quality = [{ name: "v9", relevance: 76, safety: 91 }, { name: "v10", relevance: 82, safety: 93 }, { name: "v11", relevance: 88, safety: 96 }, { name: "v12", relevance: 94, safety: 98 }];

export function Evaluations() {
  return (
    <div>
      <PageHeader eyebrow="Evaluations" title="Response quality" description="Combine human feedback and automated evaluators to measure helpfulness, safety, grounding, and hallucination risk." />
      <section className="metric-grid">
        <MetricCard label="Satisfaction score" value="92.4%" change="5.4%" icon={Star} />
        <MetricCard label="Positive feedback" value="1,284" change="14.2%" icon={ThumbsUp} accent="blue" />
        <MetricCard label="Hallucination rate" value="1.8%" change="0.7%" trend="down" icon={BrainCircuit} accent="violet" />
        <MetricCard label="Safety pass rate" value="98.7%" change="1.1%" icon={ShieldCheck} accent="amber" />
      </section>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <Card className="p-6"><div className="mb-6"><h2 className="font-bold">Prompt quality comparison</h2><p className="text-xs text-muted-foreground">Automated evaluator scores by prompt version</p></div><div className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={quality}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="hsl(var(--border))" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} domain={[0, 100]} /><Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} /><Bar dataKey="relevance" fill="#10b981" radius={[6, 6, 0, 0]} /><Bar dataKey="safety" fill="#38bdf8" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></Card>
        <Card className="p-6"><div className="mb-6 flex items-center justify-between"><div><h2 className="font-bold">Score distribution</h2><p className="text-xs text-muted-foreground">2,148 scored generations</p></div><Badge tone="success">Healthy</Badge></div><div className="space-y-5">{[["Excellent", 68, "1,460"], ["Good", 23, "494"], ["Needs review", 7, "150"], ["Poor", 2, "44"]].map(([label, value, count]) => <div key={label}><div className="mb-2 flex justify-between text-sm"><span>{label}</span><span className="font-semibold">{count} · {value}%</span></div><Progress value={Number(value)} /></div>)}</div></Card>
      </div>
      <Card className="mt-5 overflow-hidden"><div className="border-b p-5"><h2 className="font-bold">Recent feedback</h2><p className="text-xs text-muted-foreground">Human scores sent to Langfuse</p></div>{[
        { query: "What can cause recurring migraines?", score: "Helpful", icon: ThumbsUp, tone: "success" as const, evaluator: "Grounded · 0.96" },
        { query: "Is a resting heart rate of 110 normal?", score: "Helpful", icon: CheckCircle2, tone: "success" as const, evaluator: "Safety · 1.00" },
        { query: "Can I stop antibiotics when I feel better?", score: "Needs review", icon: AlertTriangle, tone: "warning" as const, evaluator: "Completeness · 0.62" },
        { query: "Interpret this lab result", score: "Not helpful", icon: ThumbsDown, tone: "danger" as const, evaluator: "Relevance · 0.44" },
      ].map(({ query, score, icon: Icon, tone, evaluator }) => <div key={query} className="flex flex-col gap-3 border-t p-5 first:border-t-0 sm:flex-row sm:items-center"><span className="flex size-9 items-center justify-center rounded-xl bg-muted"><Icon className="size-4" /></span><p className="flex-1 text-sm font-medium">{query}</p><span className="text-xs text-muted-foreground">{evaluator}</span><Badge tone={tone}>{score}</Badge></div>)}</Card>
    </div>
  );
}
