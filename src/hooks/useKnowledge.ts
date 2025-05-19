// src/hooks/useKnowledge.ts
import { useState, useCallback } from "react";
import { API_BASE_URL } from "../config/api";

interface UseKnowledgeReturn {
  isLoading: boolean;
  response: {
    message?: string;
    error?: string;
    articles?: { title: string; link: string }[];
  } | null;
  addKnowledge: (source: string) => Promise<void>;
  clearResponse: () => void;
}

export const useKnowledge = (): UseKnowledgeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{
    message?: string;
    articles?: { title: string; link: string }[];
    error?: string;
  } | null>(null);

  const addKnowledge = useCallback(
    async (source: string) => {
      if (!source || isLoading) return;

      setIsLoading(true);
      setResponse(null);

      try {
        const apiResponse = await fetch(`${API_BASE_URL}/knowledge/rss`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ source }),
        });

        const data = await apiResponse.json();

        if (apiResponse.ok) {
          setResponse({ message: data.message, articles: data.articles });
        } else {
          setResponse({ error: data.message || "Failed to add knowledge" });
        }
      } catch (error) {
        console.error("Error adding knowledge:", error);
        setResponse({ error: "Failed to connect to server" });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  const clearResponse = useCallback(() => {
    setResponse(null);
  }, []);

  return {
    isLoading,
    response,
    addKnowledge,
    clearResponse,
  };
};
