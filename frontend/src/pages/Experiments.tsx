import { useState } from "react";
import { Beaker, Check, Coins, Gauge, GitBranch, Trophy } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import { Badge, Button, Card, PageHeader, Progress } from "@/components/ui";

export function Experiments() {
  const [split, setSplit] = useState(50);
  return (
    <div>
      <PageHeader eyebrow="A/B testing" title="Prompt experiment" description="Route live traffic across prompt variants, compare quality and cost, then promote the winner with evidence." action={<Button><Beaker className="size-4" />New experiment</Button>} />
      <Card className="mb-5 p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center"><div><div className="flex items-center gap-2"><h2 className="font-bold">Triage tone optimization</h2><Badge tone="success">Running</Badge></div><p className="mt-1 text-xs text-muted-foreground">Started May 30 · 2,842 participants · 95% confidence</p></div><div className="flex items-center gap-3 text-xs"><span>Prompt A <b>{split}%</b></span><input aria-label="Traffic split" type="range" min="10" max="90" value={split} onChange={(event) => setSplit(Number(event.target.value))} className="w-44 accent-emerald-500" /><span>Prompt B <b>{100 - split}%</b></span></div></div>
      </Card>
      <div className="grid gap-5 lg:grid-cols-2">
        <VariantCard name="Prompt A" version="v11 · staging" description="Concise, direct triage with a structured list of possible causes." success={86.4} cost="$0.0108" latency="1.56s" samples="1,421" />
        <VariantCard winner name="Prompt B" version="v12 · production" description="Empathetic triage with progressive questions and concise safety guidance." success={92.1} cost="$0.0094" latency="1.39s" samples="1,421" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <Card className="p-6"><h2 className="font-bold">Win probability</h2><div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={[{ value: 87 }, { value: 13 }]} innerRadius={70} outerRadius={88} startAngle={90} endAngle={-270} dataKey="value"><Cell fill="#10b981" /><Cell fill="hsl(var(--muted))" /></Pie></PieChart></ResponsiveContainer><div className="pointer-events-none relative -mt-[136px] text-center"><p className="text-3xl font-extrabold">87%</p><p className="text-xs text-muted-foreground">Prompt B wins</p></div></div></Card>
        <Card className="p-6"><div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/12 text-amber-500"><Trophy className="size-6" /></span><div><h2 className="font-bold">Experiment recommendation</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Prompt B produces a 6.6% higher success rate, responds 170ms faster, and costs 13% less per generation. The sample has reached statistical significance.</p><Button className="mt-5"><Check className="size-4" />Promote Prompt B</Button></div></div></Card>
      </div>
    </div>
  );
}

function VariantCard({ name, version, description, success, cost, latency, samples, winner }: { name: string; version: string; description: string; success: number; cost: string; latency: string; samples: string; winner?: boolean }) {
  return <Card className={`relative overflow-hidden p-6 ${winner ? "border-primary/50" : ""}`}>{winner && <span className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground">LEADING</span>}<div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><GitBranch className="size-5" /></span><div><h2 className="font-bold">{name}</h2><p className="text-xs text-muted-foreground">{version}</p></div></div><p className="my-5 text-sm leading-6 text-muted-foreground">{description}</p><div className="mb-2 flex justify-between text-sm"><span>Success rate</span><b>{success}%</b></div><Progress value={success} /><div className="mt-6 grid grid-cols-3 gap-3">{[[Coins, "Avg. cost", cost], [Gauge, "Latency", latency], [Beaker, "Samples", samples]].map(([Icon, label, value]) => { const IconComponent = Icon as typeof Coins; return <div key={String(label)} className="rounded-xl bg-muted/60 p-3"><IconComponent className="mb-2 size-4 text-primary" /><p className="text-[10px] text-muted-foreground">{String(label)}</p><p className="mt-1 text-sm font-bold">{String(value)}</p></div>; })}</div></Card>;
}
