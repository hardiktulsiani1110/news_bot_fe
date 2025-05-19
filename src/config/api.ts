// src/config/api.ts
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/v1/api";

// News sources from your backend
export const NEWS_SOURCES = [
  { value: "NBC Tech", label: "NBC Tech" },
  { value: "The New Yorker", label: "The New Yorker" },
  { value: "Wired Business", label: "Wired Business" },
  { value: "The Guardian Science", label: "The Guardian Science" },
];
