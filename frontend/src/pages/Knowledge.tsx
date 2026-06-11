import { useRef, useState } from "react";
import { CheckCircle2, Database, FileText, Network, Search, UploadCloud, X } from "lucide-react";
import { Badge, Button, Card, PageHeader, Progress } from "@/components/ui";

const chunks = [
  { id: "chunk_184", title: "Migraine symptoms and triggers", text: "Migraine commonly causes severe throbbing pain, often on one side, with nausea and sensitivity to light...", score: 0.94 },
  { id: "chunk_291", title: "When headache needs urgent care", text: "A sudden severe headache, neurological changes, fever with stiff neck, or headache after injury requires urgent evaluation...", score: 0.89 },
  { id: "chunk_077", title: "Managing common headaches", text: "Hydration, regular sleep, stress reduction, and limiting excessive analgesic use may help reduce frequency...", score: 0.81 },
];

export function Knowledge() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploaded, setUploaded] = useState(false);
  return (
    <div>
      <PageHeader eyebrow="RAG knowledge center" title="Medical knowledge base" description="Ingest trusted documents, inspect chunking and embeddings, and see exactly what context is retrieved for each generation." action={<Button onClick={() => inputRef.current?.click()}><UploadCloud className="size-4" />Upload PDF</Button>} />
      <input ref={inputRef} type="file" accept=".pdf" hidden onChange={() => setUploaded(true)} />
      {uploaded && <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-4 text-sm"><CheckCircle2 className="size-5 text-emerald-500" /><span className="flex-1"><b>clinical-guidelines.pdf</b> queued for processing</span><Button variant="ghost" size="icon" className="size-8" onClick={() => setUploaded(false)}><X className="size-4" /></Button></div>}
      <section className="metric-grid">
        {[["Documents", "28", FileText], ["Vector chunks", "4,862", Network], ["Embedding model", "text-embedding-3-small", Database], ["Collection", "medical_knowledge", CheckCircle2]].map(([label, value, Icon]) => { const IconComponent = Icon as typeof FileText; return <Card key={String(label)} className="p-5"><IconComponent className="mb-4 size-5 text-primary" /><p className="text-xs text-muted-foreground">{String(label)}</p><p className="mt-1 truncate font-bold">{String(value)}</p></Card>; })}
      </section>
      <div className="mt-5 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <Card className="p-6"><h2 className="font-bold">Ingestion pipeline</h2><p className="mb-6 text-xs text-muted-foreground">From source file to ChromaDB</p><div className="space-y-5">{[["1", "Parse document", "PDF text and metadata extracted", 100], ["2", "Semantic chunking", "512 tokens · 64 overlap", 100], ["3", "Generate embeddings", "1,536 dimensions", 100], ["4", "Store vectors", "ChromaDB persisted", 100]].map(([step, label, detail, value]) => <div key={String(step)} className="flex gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{step}</span><div className="flex-1"><div className="flex justify-between"><p className="text-sm font-bold">{label}</p><CheckCircle2 className="size-4 text-emerald-500" /></div><p className="mb-2 text-xs text-muted-foreground">{detail}</p><Progress value={Number(value)} /></div></div>)}</div></Card>
        <Card className="overflow-hidden"><div className="border-b p-5"><h2 className="font-bold">Retrieval playground</h2><p className="text-xs text-muted-foreground">Test semantic search before it reaches the prompt</p><div className="relative mt-4"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input defaultValue="What symptoms make a headache an emergency?" className="h-11 w-full rounded-xl border bg-card pl-10 pr-4 text-sm outline-none focus:border-primary" /></div></div><div className="space-y-3 p-5">{chunks.map((chunk, index) => <div key={chunk.id} className="rounded-xl border p-4 transition-colors hover:bg-muted/35"><div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><Badge tone="blue">#{index + 1}</Badge><h3 className="text-sm font-bold">{chunk.title}</h3></div><p className="mt-2 text-xs leading-5 text-muted-foreground">{chunk.text}</p></div><span className="font-mono text-xs font-bold text-primary">{chunk.score}</span></div><div className="mt-3 flex gap-2 text-[10px] text-muted-foreground"><span>{chunk.id}</span><span>·</span><span>Mayo Clinic Guide.pdf</span><span>·</span><span>Page {12 + index * 4}</span></div></div>)}</div></Card>
      </div>
    </div>
  );
}
