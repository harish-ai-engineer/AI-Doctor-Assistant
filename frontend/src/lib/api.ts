const API_URL = import.meta.env.VITE_API_URL ?? "";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json() as Promise<T>;
}

export const api = {
  dashboard: () => request("/analytics/dashboard"),
  feedback: (traceId: string, value: number) =>
    request("/evaluations/feedback", {
      method: "POST",
      body: JSON.stringify({ trace_id: traceId, value }),
    }),
  chat: (message: string, sessionId: string) =>
    fetch(`${API_URL}/api/v1/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId }),
    }),
};
