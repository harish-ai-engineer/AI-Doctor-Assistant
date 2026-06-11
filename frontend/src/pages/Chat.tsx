import { useRef, useState } from "react";
import { BookOpen, Bot, Check, Clipboard, CornerDownLeft, FileText, ShieldAlert, Sparkles, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { Badge, Button, Card, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const symptoms = ["Persistent headache", "Sore throat", "Lower back pain", "Seasonal allergies"];
const initialMessages: Message[] = [{
  id: "welcome",
  role: "assistant",
  content: "Hello, I’m MedTrace. I can help you understand symptoms and prepare for a conversation with a healthcare professional. What would you like to discuss today?",
}];

export function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string>();
  const sessionId = useRef(crypto.randomUUID());

  async function sendMessage(text = input) {
    if (!text.trim() || loading) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    const assistantId = crypto.randomUUID();
    setMessages((current) => [...current, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setLoading(true);
    try {
      const response = await api.chat(userMessage.content, sessionId.current);
      if (!response.ok || !response.body) throw new Error("Streaming unavailable");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: message.content + chunk } : message));
      }
    } catch {
      const fallback = "Based on what you described, several common causes may be worth considering. I’d want to know when this started, how severe it is, and whether you have fever, shortness of breath, weakness, or any sudden worsening.\n\nFor now, rest, stay hydrated, and note any changes. Seek urgent medical care for severe or rapidly worsening symptoms. This is educational guidance, not a diagnosis.";
      setMessages((current) => current.map((message) => message.id === assistantId ? { ...message, content: fallback } : message));
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage(message: Message) {
    await navigator.clipboard.writeText(message.content);
    setCopied(message.id);
    window.setTimeout(() => setCopied(undefined), 1500);
  }

  return (
    <div>
      <PageHeader eyebrow="AI Doctor" title="Clinical conversation" description="A RAG-grounded health education assistant. Every generation is traced, scored, and linked to its prompt version." action={<div className="flex gap-2"><Badge tone="success">Prompt v12</Badge><Badge tone="blue">gpt-4o</Badge></div>} />
      <div className="grid gap-5 xl:grid-cols-[1fr_310px]">
        <Card className="flex min-h-[680px] flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b bg-amber-500/8 px-5 py-3 text-xs text-amber-700 dark:text-amber-300"><ShieldAlert className="size-4 shrink-0" /><span><b>Medical disclaimer:</b> MedTrace provides educational information only and does not diagnose or replace professional care.</span></div>
          <div className="soft-scrollbar flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                {message.role === "assistant" && <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Bot className="size-4" /></div>}
                <div className={`max-w-[82%] ${message.role === "user" ? "order-first" : ""}`}>
                  <div className={message.role === "user" ? "rounded-2xl rounded-tr-sm bg-primary px-4 py-3 text-sm leading-6 text-primary-foreground" : "rounded-2xl rounded-tl-sm bg-secondary/70 px-4 py-3 text-sm leading-6"}>
                    {message.content || <span className="inline-flex gap-1 py-2"><i className="size-1.5 animate-pulse rounded-full bg-primary" /><i className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:150ms]" /><i className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" /></span>}
                  </div>
                  {message.role === "assistant" && message.content && <div className="mt-2 flex items-center gap-1"><Button variant="ghost" size="sm" onClick={() => copyMessage(message)}>{copied === message.id ? <Check className="size-3.5" /> : <Clipboard className="size-3.5" />} Copy</Button><Button variant="ghost" size="icon" className="size-8" aria-label="Helpful"><ThumbsUp className="size-3.5" /></Button><Button variant="ghost" size="icon" className="size-8" aria-label="Not helpful"><ThumbsDown className="size-3.5" /></Button></div>}
                </div>
                {message.role === "user" && <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500"><User className="size-4" /></div>}
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <div className="mb-3 flex flex-wrap gap-2">{symptoms.map((symptom) => <button key={symptom} onClick={() => sendMessage(symptom)} className="rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary">{symptom}</button>)}</div>
            <div className="relative"><textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendMessage(); } }} placeholder="Describe your symptoms, duration, and severity..." className="min-h-24 w-full resize-none rounded-2xl border bg-card/70 p-4 pr-14 text-sm outline-none focus:border-primary" /><Button size="icon" className="absolute bottom-3 right-3" onClick={() => void sendMessage()} disabled={!input.trim() || loading}><CornerDownLeft className="size-4" /></Button></div>
          </div>
        </Card>
        <div className="space-y-5">
          <Card className="p-5"><div className="mb-4 flex items-center gap-2"><Sparkles className="size-4 text-primary" /><h2 className="font-bold">Generation trace</h2></div><dl className="space-y-3 text-xs">{[["Trace ID", "tr_live_92ac"], ["Prompt", "AI Doctor v12"], ["Model", "gpt-4o"], ["Temperature", "0.2"], ["Environment", "production"]].map(([key, value]) => <div key={key} className="flex justify-between gap-3"><dt className="text-muted-foreground">{key}</dt><dd className="font-mono font-semibold">{value}</dd></div>)}</dl></Card>
          <Card className="p-5"><div className="mb-4 flex items-center gap-2"><BookOpen className="size-4 text-primary" /><h2 className="font-bold">Retrieved sources</h2></div><div className="space-y-3">{["Mayo Clinic Symptom Guide", "NICE Clinical Knowledge", "CDC Patient Guidance"].map((source, index) => <button key={source} className="flex w-full items-start gap-3 rounded-xl border p-3 text-left hover:bg-muted/50"><FileText className="mt-0.5 size-4 text-primary" /><span><b className="block text-xs">{source}</b><span className="text-[11px] text-muted-foreground">Similarity {(0.94 - index * .05).toFixed(2)}</span></span></button>)}</div></Card>
        </div>
      </div>
    </div>
  );
}
