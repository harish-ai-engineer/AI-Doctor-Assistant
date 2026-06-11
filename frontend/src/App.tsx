import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { AppShell } from "@/components/AppShell";

const Dashboard = lazy(() => import("@/pages/Dashboard").then((m) => ({ default: m.Dashboard })));
const Chat = lazy(() => import("@/pages/Chat").then((m) => ({ default: m.Chat })));
const Prompts = lazy(() => import("@/pages/Prompts").then((m) => ({ default: m.Prompts })));
const Traces = lazy(() => import("@/pages/Traces").then((m) => ({ default: m.Traces })));
const Evaluations = lazy(() => import("@/pages/Evaluations").then((m) => ({ default: m.Evaluations })));
const Experiments = lazy(() => import("@/pages/Experiments").then((m) => ({ default: m.Experiments })));
const Knowledge = lazy(() => import("@/pages/Knowledge").then((m) => ({ default: m.Knowledge })));
const Observability = lazy(() => import("@/pages/Observability").then((m) => ({ default: m.Observability })));

function LoadingScreen() {
  return <div className="flex min-h-[60vh] items-center justify-center"><LoaderCircle className="size-7 animate-spin text-primary" /></div>;
}

export function App() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="prompts" element={<Prompts />} />
          <Route path="traces" element={<Traces />} />
          <Route path="evaluations" element={<Evaluations />} />
          <Route path="experiments" element={<Experiments />} />
          <Route path="knowledge" element={<Knowledge />} />
          <Route path="observability" element={<Observability />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
