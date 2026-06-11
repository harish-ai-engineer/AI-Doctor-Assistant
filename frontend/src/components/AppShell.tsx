import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Activity, Beaker, BookOpen, Bot, ChartNoAxesCombined, ChevronLeft,
  CircleGauge, FlaskConical, Menu, Moon, PanelLeftClose, Search,
  Settings, Sparkles, Stethoscope, Sun, X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Overview", icon: CircleGauge },
  { to: "/chat", label: "AI Doctor", icon: Bot },
  { to: "/prompts", label: "Prompt Lab", icon: FlaskConical },
  { to: "/traces", label: "Tracing", icon: Activity },
  { to: "/evaluations", label: "Evaluations", icon: ChartNoAxesCombined },
  { to: "/experiments", label: "A/B Testing", icon: Beaker },
  { to: "/knowledge", label: "Knowledge", icon: BookOpen },
  { to: "/observability", label: "Observability", icon: Sparkles },
] as const;

export function AppShell() {
  const [dark, setDark] = useState(() => localStorage.getItem("theme") !== "light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen">
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/10 bg-[#071b18] text-white transition-all duration-300 lg:translate-x-0",
        collapsed ? "w-[82px]" : "w-[260px]",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-[#06211c] shadow-[0_0_35px_-8px_#34d399]">
            <Stethoscope className="size-6" />
          </div>
          {!collapsed && <div><p className="font-bold tracking-tight">MedTrace AI</p><p className="text-[10px] uppercase tracking-[.18em] text-emerald-300">Clinical intelligence</p></div>}
          <button className="ml-auto lg:hidden" onClick={() => setMobileOpen(false)}><X className="size-5" /></button>
        </div>
        <nav className="soft-scrollbar flex-1 space-y-1 overflow-y-auto p-3">
          <p className={cn("px-3 pb-2 pt-4 text-[10px] font-bold uppercase tracking-[.2em] text-white/35", collapsed && "sr-only")}>Workspace</p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => cn(
                "group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white",
                isActive && "bg-emerald-400/15 text-emerald-300",
                collapsed && "justify-center",
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="m-3 rounded-2xl border border-white/10 bg-white/5 p-3">
          {!collapsed && <><div className="mb-2 flex items-center gap-2 text-xs text-white/70"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />AgentGuard connected</div><p className="text-[10px] text-white/35">EU region · Production</p></>}
          {collapsed && <span className="mx-auto block size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />}
        </div>
        <button className="hidden h-12 items-center justify-center border-t border-white/10 text-white/40 hover:text-white lg:flex" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronLeft className="size-5 rotate-180" /> : <PanelLeftClose className="size-5" />}
        </button>
      </aside>

      <div className={cn("transition-all duration-300", collapsed ? "lg:pl-[82px]" : "lg:pl-[260px]")}>
        <header className="sticky top-0 z-30 flex h-20 items-center gap-3 border-b bg-background/75 px-4 backdrop-blur-xl sm:px-7">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu className="size-5" /></Button>
          <div className="relative hidden max-w-md flex-1 md:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input aria-label="Search workspace" placeholder="Search traces, prompts, conversations..." className="h-10 w-full rounded-xl border bg-card/60 pl-10 pr-4 text-sm outline-none focus:border-primary" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border bg-card/60 px-3 py-2 text-xs font-semibold sm:flex"><span className="size-2 rounded-full bg-emerald-500" />All systems healthy</div>
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setDark(!dark)}>{dark ? <Sun className="size-5" /> : <Moon className="size-5" />}</Button>
            <Button variant="ghost" size="icon" aria-label="Settings"><Settings className="size-5" /></Button>
            <div className="ml-1 flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 text-sm font-bold text-white">MC</div>
          </div>
        </header>
        <main className="min-h-[calc(100vh-5rem)] p-4 sm:p-7 lg:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
