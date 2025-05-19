// src/pages/ChatScreen.tsx
import React, { useEffect, useRef } from "react";
import { MessageCircle, RotateCcw, Sparkles, Loader2 } from "lucide-react";
import { useChat } from "../hooks/useChat";
import {
  MessageBubble,
  StreamingMessage,
} from "../components/chat/MessageBubble";
import { ChatInput } from "../components/chat/ChatInput";
import { Button } from "../components/ui/Button";

export const ChatScreen: React.FC = () => {
  const {
    messages,
    sessionId,
    isLoading,
    streamingContent,
    sendMessage,
    resetSession,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debug logging
  console.log("🔍 ChatScreen render:", {
    isLoading,
    hasStreamingContent: !!streamingContent,
    messageCount: messages.length,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-lg md:text-xl font-semibold text-gray-900">
                Chat Assistant
              </p>
              <p className="text-xs lg:text-sm text-gray-500">
                Ask me anything about the latest news
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center space-x-4">
            {sessionId && (
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 rounded-lg max-w-48 md:max-w-96">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0"></div>
                <span className="text-sm text-blue-700 font-medium truncate">
                  Session: {sessionId}
                </span>
              </div>
            )}
            <Button
              onClick={resetSession}
              variant={!sessionId ? "primary" : "danger"}
              disabled={!sessionId}
              size="sm"
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6">
          {messages.length === 0 && !streamingContent && !isLoading && (
            <div className="text-center mt-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Welcome to your AI News Assistant
              </h2>
              <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">
                Start a conversation by asking me about recent news, technology
                trends, or any topic you're curious about. I'll provide insights
                based on the latest articles.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Loading state - when waiting for backend to respond */}
          {isLoading && !streamingContent && (
            <div className="flex justify-start mb-6">
              <div className="flex max-w-4xl">
                <div className="flex-shrink-0 mr-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                </div>
                <div className="px-6 py-4 rounded-2xl rounded-bl-sm bg-white border border-gray-200 text-gray-900 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Streaming content - when assistant is responding */}
          {streamingContent && <StreamingMessage content={streamingContent} />}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={sendMessage}
        disabled={isLoading}
        isLoading={isLoading}
      />
    </div>
  );
};
