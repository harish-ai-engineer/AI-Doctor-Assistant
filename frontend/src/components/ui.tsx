import type { ButtonHTMLAttributes, HTMLAttributes, PropsWithChildren } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("glass rounded-2xl", className)} {...props} />;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger";
  size?: "default" | "sm" | "icon";
  loading?: boolean;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  loading,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-primary text-primary-foreground shadow-glow hover:brightness-105",
        variant === "outline" && "border bg-card/70 hover:bg-secondary",
        variant === "ghost" && "hover:bg-secondary",
        variant === "danger" && "bg-destructive text-white hover:brightness-105",
        size === "default" && "h-11 px-4",
        size === "sm" && "h-8 px-3 text-xs",
        size === "icon" && "size-10",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <LoaderCircle className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: PropsWithChildren<{ tone?: "success" | "warning" | "danger" | "neutral" | "blue" }>) {
  const tones = {
    success: "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
    warning: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
    danger: "bg-red-500/12 text-red-600 dark:text-red-400",
    neutral: "bg-muted text-muted-foreground",
    blue: "bg-sky-500/12 text-sky-600 dark:text-sky-400",
  };
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold", tones[tone])}>{children}</span>;
}

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}>
      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-primary">{eyebrow}</p>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </header>
  );
}
