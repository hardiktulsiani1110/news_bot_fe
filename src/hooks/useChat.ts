// src/hooks/useChat.ts
import { useState, useCallback } from "react";
import type { Message, ChatResponse } from "../types";
import { API_BASE_URL } from "../config/api";

interface UseChatReturn {
  messages: Message[];
  sessionId: string;
  isLoading: boolean;
  streamingContent: string;
  sendMessage: (message: string) => Promise<void>;
  resetSession: () => void;
}

export const useChat = (): UseChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");

  const resetSession = useCallback(() => {
    setMessages([]);
    setSessionId("");
    setStreamingContent("");
  }, []);

  const sendMessage = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setStreamingContent("");

      try {
        const response = await fetch(`${API_BASE_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: messageText,
            sessionId: sessionId || undefined,
          }),
        });

        if (!response.body) throw new Error("No response body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data: ChatResponse = JSON.parse(line.slice(6));

                console.log("data", data);

                if (data.type === "session") {
                  setSessionId(data.sessionId || "");
                  setIsLoading(false); // Stop loading when we get the session
                } else if (data.type === "chunk") {
                  assistantMessage += data.content || "";
                  setStreamingContent(assistantMessage);
                } else if (data.type === "complete") {
                  // Clear streaming content and add final message
                  setStreamingContent("");

                  const finalContent = data.fullResponse || assistantMessage;

                  const finalMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: finalContent,
                    timestamp: new Date(),
                  };

                  console.log("finalMessage", finalMessage);

                  setMessages((prev) => [...prev, finalMessage]);
                  break; // Exit the loop after processing complete
                } else if (data.type === "error") {
                  setStreamingContent("");

                  console.error("Chat error:", data.error);
                  const errorMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: `Error: ${data.error}`,
                    timestamp: new Date(),
                  };
                  setMessages((prev) => [...prev, errorMessage]);
                  break; // Exit the loop after processing error
                }
              } catch (e) {
                // Ignore JSON parse errors for non-JSON lines
              }
            }
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setStreamingContent("");

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, there was an error processing your message.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, isLoading],
  );

  return {
    messages,
    sessionId,
    isLoading,
    streamingContent,
    sendMessage,
    resetSession,
  };
};
