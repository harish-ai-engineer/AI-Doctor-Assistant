export const usageData = [
  { day: "Mon", conversations: 128, tokens: 38, cost: 3.8 },
  { day: "Tue", conversations: 176, tokens: 52, cost: 5.1 },
  { day: "Wed", conversations: 151, tokens: 46, cost: 4.6 },
  { day: "Thu", conversations: 234, tokens: 71, cost: 6.9 },
  { day: "Fri", conversations: 208, tokens: 63, cost: 6.1 },
  { day: "Sat", conversations: 267, tokens: 79, cost: 7.7 },
  { day: "Sun", conversations: 294, tokens: 88, cost: 8.5 },
];

export const traces = [
  { id: "tr_8fd291", query: "Persistent dry cough for 5 days", prompt: "v12", model: "gpt-4o", latency: "1.24s", tokens: 842, cost: "$0.0084", status: "Success" },
  { id: "tr_41bc20", query: "Headache and sensitivity to light", prompt: "v12", model: "gpt-4o", latency: "1.68s", tokens: 1104, cost: "$0.0110", status: "Success" },
  { id: "tr_b39e10", query: "Child has a mild fever", prompt: "v11", model: "gpt-4o", latency: "2.08s", tokens: 972, cost: "$0.0097", status: "Flagged" },
  { id: "tr_003a8c", query: "Knee pain after running", prompt: "v12", model: "gpt-4o", latency: "1.12s", tokens: 684, cost: "$0.0068", status: "Success" },
  { id: "tr_510d2f", query: "Can I combine these medications?", prompt: "v10", model: "gpt-4o", latency: "1.91s", tokens: 1250, cost: "$0.0125", status: "Success" },
];

export const promptVersions = [
  { version: 12, label: "production", author: "Dr. Maya Chen", date: "2 hours ago", score: 94, note: "Improved triage and citation rules" },
  { version: 11, label: "staging", author: "Alex Morgan", date: "Yesterday", score: 89, note: "Added structured differential diagnosis" },
  { version: 10, label: "archived", author: "Dr. Maya Chen", date: "May 28", score: 84, note: "Refined safety guardrails" },
  { version: 9, label: "archived", author: "Sam Lee", date: "May 21", score: 81, note: "Initial RAG context injection" },
];

export const promptText = `You are MedTrace, a careful AI health education assistant.

Use the retrieved medical context to explain possible causes in plain language.
Ask concise follow-up questions before suggesting next steps.
Never provide a definitive diagnosis or replace professional medical care.
Highlight urgent red-flag symptoms and cite every retrieved source.

Patient message: {{patient_message}}
Retrieved context: {{rag_context}}
Conversation history: {{chat_history}}`;
