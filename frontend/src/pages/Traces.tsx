import { useState } from "react";
import { ChevronRight, Filter, Search, X } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { traces } from "@/data/demo";

export function Traces() {
  const [selected, setSelected] = useState<(typeof traces)[number]>();
  return (
    <div>
      <PageHeader eyebrow="Tracing" title="Generation traces" description="Inspect every step from retrieval and prompt compilation to model generation, usage, cost, and evaluation." action={<Button variant="outline"><Filter className="size-4" />Filters</Button>} />
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input placeholder="Search by trace ID, user, or query..." className="h-10 w-full rounded-xl border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary" /></div><select aria-label="Trace status" className="rounded-xl border bg-card px-3 text-sm"><option>All statuses</option><option>Success</option><option>Flagged</option></select><select aria-label="Trace period" className="rounded-xl border bg-card px-3 text-sm"><option>Last 24 hours</option><option>Last 7 days</option></select></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-muted/60 text-[11px] uppercase tracking-wider text-muted-foreground"><tr>{["Trace ID", "User query", "Prompt", "Model", "Latency", "Tokens", "Cost", "Status", ""].map((heading) => <th key={heading} className="px-5 py-3">{heading}</th>)}</tr></thead><tbody>{traces.map((trace) => <tr key={trace.id} onClick={() => setSelected(trace)} className="cursor-pointer border-t transition-colors hover:bg-muted/40"><td className="px-5 py-4 font-mono text-xs text-primary">{trace.id}</td><td className="max-w-[270px] truncate px-5">{trace.query}</td><td className="px-5"><Badge tone="blue">{trace.prompt}</Badge></td><td className="px-5">{trace.model}</td><td className="px-5">{trace.latency}</td><td className="px-5">{trace.tokens.toLocaleString()}</td><td className="px-5 font-mono text-xs">{trace.cost}</td><td className="px-5"><Badge tone={trace.status === "Success" ? "success" : "warning"}>{trace.status}</Badge></td><td className="px-5"><ChevronRight className="size-4" /></td></tr>)}</tbody></table></div>
      </Card>
      {selected && <div className="fixed inset-0 z-50 flex justify-end bg-black/35" onClick={() => setSelected(undefined)}><aside className="h-full w-full max-w-xl overflow-y-auto bg-background p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="mb-7 flex items-start justify-between"><div><p className="font-mono text-xs text-primary">{selected.id}</p><h2 className="mt-2 text-xl font-bold">Trace details</h2></div><Button variant="ghost" size="icon" onClick={() => setSelected(undefined)}><X className="size-5" /></Button></div><div className="grid grid-cols-2 gap-3">{[["Latency", selected.latency], ["Tokens", String(selected.tokens)], ["Cost", selected.cost], ["Model", selected.model]].map(([key, value]) => <Card key={key} className="p-4"><p className="text-xs text-muted-foreground">{key}</p><p className="mt-1 font-bold">{value}</p></Card>)}</div><div className="mt-6 space-y-4"><TraceStep name="RAG retrieval" detail="3 chunks · 184ms" /><TraceStep name="Prompt compilation" detail={`${selected.prompt} · 12ms`} /><TraceStep name="OpenAI generation" detail={`${selected.model} · ${selected.latency}`} /><TraceStep name="Evaluation" detail="Safety 1.0 · Relevance 0.94" /></div><Card className="mt-6 p-5"><p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Input</p><p className="text-sm">{selected.query}</p></Card></aside></div>}
    </div>
  );
}

function TraceStep({ name, detail }: { name: string; detail: string }) {
  return <div className="relative flex gap-4 before:absolute before:left-[11px] before:top-6 before:h-8 before:w-px before:bg-border last:before:hidden"><span className="mt-1.5 size-6 shrink-0 rounded-full border-4 border-background bg-primary" /><div><p className="text-sm font-bold">{name}</p><p className="text-xs text-muted-foreground">{detail}</p></div></div>;
}
