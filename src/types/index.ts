// src/types/index.ts
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  type: "session" | "chunk" | "complete" | "error";
  sessionId?: string;
  content?: string;
  partial?: string;
  fullResponse?: string;
  error?: string;
  chunkNumber?: number;
  totalChunks?: number;
}

export interface NewsSource {
  value: string;
  label: string;
}

export type TabType = "chat" | "knowledge";
