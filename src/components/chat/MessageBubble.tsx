// src/components/chat/MessageBubble.tsx
import React from "react";
import { User, Bot, Loader2 } from "lucide-react";
import type { Message } from "../../types";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div
        className={`flex max-w-4xl ${isUser ? "flex-row-reverse" : "flex-row"}`}
      >
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? "ml-3" : "mr-3"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-white" />
            )}
          </div>
        </div>

        {/* Message Content */}
        <div
          className={`px-6 py-4 rounded-2xl shadow-sm ${
            isUser
              ? "bg-blue-600 text-white rounded-br-sm"
              : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
          }`}
        >
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">
              {message.content}
            </p>
          </div>
          <div
            className={`text-xs mt-2 ${isUser ? "text-blue-100" : "text-gray-500"}`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StreamingMessageProps {
  content: string;
}

export const StreamingMessage: React.FC<StreamingMessageProps> = ({
  content,
}) => {
  return (
    <div className="flex justify-start mb-6">
      <div className="flex max-w-4xl">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Message Content */}
        <div className="px-6 py-4 rounded-2xl rounded-bl-sm bg-white border border-gray-200 text-gray-900 shadow-sm">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
          </div>
          <div className="flex items-center text-xs mt-2 text-gray-500">
            <Loader2 className="w-3 h-3 animate-spin mr-1" />
            Assistant is typing...
          </div>
        </div>
      </div>
    </div>
  );
};
