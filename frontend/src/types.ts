export type SectionId =
  | "overview"
  | "stock"
  | "acts"
  | "audits"
  | "schedule"
  | "reports"
  | "preferences"
  | "team"
  | "security";

export type AssistantTopic =
  | "stock"
  | "acts"
  | "audits"
  | "schedule"
  | "reports";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  pending?: boolean;
}

export interface Session {
  id: string;
  index: number;
  messages: ChatMessage[];
}

export type KnowledgeStatus = "done" | "active" | "todo";

export interface KnowledgeItem {
  id: string;
  titleKey: string;
  kind: "doc" | "video";
  duration: string;
  status: KnowledgeStatus;
}

export interface KnowledgeModule {
  id: string;
  titleKey: string;
  index: number;
  items: KnowledgeItem[];
}

export type UploadStatus = "uploading" | "completed";

export interface UploadFile {
  id: string;
  name: string;
  totalMb: number;
  progress: number;
  status: UploadStatus;
  exiting?: boolean;
}

export interface UploadPreset {
  id: string;
  labelKey: string;
  name: string;
  totalMb: number;
}

export interface ChatRequest {
  message: string;
  history: { role: ChatRole; content: string }[];
}

export interface ChatResponse {
  id: string;
  reply: string;
}
