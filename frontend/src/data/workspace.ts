import type { AssistantTopic } from "@/types";

export const assistantTopics: { id: AssistantTopic; labelKey: string }[] = [
  { id: "stock", labelKey: "assistant.topics.stock" },
  { id: "acts", labelKey: "assistant.topics.acts" },
  { id: "audits", labelKey: "assistant.topics.audits" },
  { id: "schedule", labelKey: "assistant.topics.schedule" },
  { id: "reports", labelKey: "assistant.topics.reports" },
];

export const assistantSuggestions = [
  "assistant.suggestions.writeoff",
  "assistant.suggestions.audit",
  "assistant.suggestions.shortage",
] as const;
