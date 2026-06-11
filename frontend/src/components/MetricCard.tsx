import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  change: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  accent?: "green" | "blue" | "violet" | "amber";
}

export function MetricCard({ label, value, change, trend = "up", icon: Icon, accent = "green" }: MetricCardProps) {
  const accents = {
    green: "bg-emerald-500/12 text-emerald-500",
    blue: "bg-sky-500/12 text-sky-500",
    violet: "bg-violet-500/12 text-violet-500",
    amber: "bg-amber-500/12 text-amber-500",
  };
  return (
    <Card className="group animate-fade-up p-5 transition-transform hover:-translate-y-0.5">
      <div className="mb-5 flex items-start justify-between">
        <span className={cn("flex size-10 items-center justify-center rounded-xl", accents[accent])}><Icon className="size-5" /></span>
        <span className={cn("flex items-center text-xs font-bold", trend === "up" ? "text-emerald-500" : "text-red-500")}>
          {trend === "up" ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{change}
        </span>
      </div>
      <p className="text-2xl font-extrabold tracking-tight">{value}</p>
      <p className="mt-1 text-xs font-medium text-muted-foreground">{label}</p>
    </Card>
  );
}
