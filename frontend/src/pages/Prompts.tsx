import { useState } from "react";
import { ArrowLeftRight, CheckCircle2, Clock3, Code2, RotateCcw, Save, Tag } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { promptText, promptVersions } from "@/data/demo";

export function Prompts() {
  const [selected, setSelected] = useState(12);
  const [compare, setCompare] = useState(false);
  return (
    <div>
      <PageHeader eyebrow="Prompt management" title="Doctor assistant prompt" description="Prompts are fetched dynamically from Langfuse. Inspect versions, compare changes, move labels, and roll back without redeploying." action={<div className="flex gap-2"><Button variant="outline" onClick={() => setCompare(!compare)}><ArrowLeftRight className="size-4" />Compare</Button><Button><Save className="size-4" />Create version</Button></div>} />
      <div className="grid gap-5 xl:grid-cols-[330px_1fr]">
        <Card className="overflow-hidden">
          <div className="border-b p-5"><h2 className="font-bold">Version history</h2><p className="text-xs text-muted-foreground">12 versions · 2 active labels</p></div>
          <div className="space-y-1 p-2">{promptVersions.map((version) => <button key={version.version} onClick={() => setSelected(version.version)} className={`w-full rounded-xl p-3 text-left transition-colors ${selected === version.version ? "bg-primary/10" : "hover:bg-muted/60"}`}><div className="flex items-center justify-between"><span className="font-bold">Version {version.version}</span><Badge tone={version.label === "production" ? "success" : version.label === "staging" ? "blue" : "neutral"}>{version.label}</Badge></div><p className="mt-2 text-xs text-muted-foreground">{version.note}</p><div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground"><span>{version.author}</span><span>{version.date}</span></div></button>)}</div>
        </Card>
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5"><div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary"><Code2 className="size-5" /></span><div><h2 className="font-bold">doctor-assistant</h2><div className="mt-1 flex gap-2"><Badge tone="success">production</Badge><span className="text-xs text-muted-foreground">Version {selected}</span></div></div></div><Button variant="outline" size="sm"><RotateCcw className="size-3.5" />Rollback to v{selected}</Button></div>
            <div className={`grid ${compare ? "lg:grid-cols-2" : ""}`}>
              <div className="p-5"><div className="mb-3 flex justify-between text-xs"><b>Prompt template · v{selected}</b><span className="text-muted-foreground">Chat prompt</span></div><pre className="soft-scrollbar min-h-[410px] overflow-auto whitespace-pre-wrap rounded-xl bg-[#061613] p-5 font-mono text-xs leading-6 text-emerald-50">{promptText}</pre></div>
              {compare && <div className="border-t p-5 lg:border-l lg:border-t-0"><div className="mb-3 flex justify-between text-xs"><b>Prompt template · v11</b><Badge tone="warning">3 changes</Badge></div><pre className="soft-scrollbar min-h-[410px] overflow-auto whitespace-pre-wrap rounded-xl bg-[#061613] p-5 font-mono text-xs leading-6 text-emerald-50">{promptText.replace("Ask concise", "Ask relevant").replace("cite every", "cite the most relevant")}</pre></div>}
            </div>
          </Card>
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="p-5"><Tag className="mb-4 size-5 text-primary" /><p className="text-xs text-muted-foreground">Labels</p><p className="mt-1 font-bold">production, latest</p></Card>
            <Card className="p-5"><CheckCircle2 className="mb-4 size-5 text-primary" /><p className="text-xs text-muted-foreground">Evaluation score</p><p className="mt-1 font-bold">94 / 100</p></Card>
            <Card className="p-5"><Clock3 className="mb-4 size-5 text-primary" /><p className="text-xs text-muted-foreground">Last updated</p><p className="mt-1 font-bold">2 hours ago</p></Card>
          </div>
        </div>
      </div>
    </div>
  );
}
