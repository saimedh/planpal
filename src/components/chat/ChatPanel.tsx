"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, RefreshCw, AlertCircle, Sparkles } from "lucide-react";
import { MessageBubble, ChatMessage } from "./MessageBubble";
import { QuickReplyChips } from "./QuickReplyChips";
import { VoiceInput } from "./VoiceInput";
import { Plan } from "@/lib/schemas/plan";

interface ChatPanelProps {
  eventId: string;
  initialMessages?: ChatMessage[];
  onPlanUpdated: (newPlan: Plan, changes: string[]) => void;
  isUpdatingPlan: boolean;
  setIsUpdatingPlan: (status: boolean) => void;
}

export function ChatPanel({
  eventId,
  initialMessages = [],
  onPlanUpdated,
  isUpdatingPlan,
  setIsUpdatingPlan,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isUpdatingPlan]);

  // Sync if initialMessages changes
  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      setMessages(initialMessages);
    }
  }, [initialMessages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isUpdatingPlan) return;

    setInputValue("");
    setErrorMessage(null);
    setLastFailedMessage(null);

    const tempUserMsg: ChatMessage = {
      id: "temp-" + Date.now(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsUpdatingPlan(true);

    try {
      // Attempt SSE streaming first
      const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          message: text,
        }),
      });

      if (!response.ok || !response.body) {
        // Fallback to standard chat
        const fallbackRes = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId, message: text }),
        });
        if (!fallbackRes.ok) {
          const errData = await fallbackRes.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with status ${fallbackRes.status}`);
        }
        const data = await fallbackRes.json();
        const assistantMsg: ChatMessage = {
          id: "ai-" + Date.now(),
          role: "assistant",
          content: data.reply,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        if (data.plan) {
          onPlanUpdated(data.plan, data.changes || []);
        }
        return;
      }

      // Read SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const streamingMsgId = "ai-stream-" + Date.now();
      let streamedText = "";
      let hasAddedPlaceholder = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const rawData = line.slice(6).trim();
            if (rawData === "[DONE]") continue;

            try {
              const parsed = JSON.parse(rawData);

              if (parsed.type === "token" && parsed.content) {
                streamedText += parsed.content;

                if (!hasAddedPlaceholder) {
                  hasAddedPlaceholder = true;
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: streamingMsgId,
                      role: "assistant",
                      content: streamedText,
                      created_at: new Date().toISOString(),
                    },
                  ]);
                } else {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === streamingMsgId ? { ...m, content: streamedText } : m
                    )
                  );
                }
              } else if (parsed.type === "complete") {
                const finalReply = parsed.reply || streamedText;
                setMessages((prev) => {
                  const exists = prev.some((m) => m.id === streamingMsgId);
                  if (exists) {
                    return prev.map((m) =>
                      m.id === streamingMsgId ? { ...m, content: finalReply } : m
                    );
                  } else {
                    return [
                      ...prev,
                      {
                        id: streamingMsgId,
                        role: "assistant",
                        content: finalReply,
                        created_at: new Date().toISOString(),
                      },
                    ];
                  }
                });

                if (parsed.plan) {
                  onPlanUpdated(parsed.plan, parsed.changes || []);
                }
              }
            } catch {
              // Ignore incomplete json chunks
            }
          }
        }
      }
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setErrorMessage(
        err.message || "Failed to connect to PlanPal. Please try again or rephrase."
      );
      setLastFailedMessage(text);
    } finally {
      setIsUpdatingPlan(false);
      inputRef.current?.focus();
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSendMessage(lastFailedMessage);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#FBF9FF] dark:bg-[#110D1E] border-r border-[#E6DEFA] dark:border-[#2E234B]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E6DEFA] dark:border-[#2E234B] flex items-center justify-between bg-white/70 dark:bg-[#1B142F]/70 backdrop-blur-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
            PlanPal Assistant
          </h2>
        </div>
        <span className="text-[11px] text-gray-400">Indian Celebrations AI</span>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C2185B] to-[#F2A900] text-white flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="font-heading font-semibold text-base text-[#1C1530] dark:text-[#FBF9FF]">
                Let&apos;s plan your celebration!
              </p>
              <p className="text-xs text-[#4A3E68] dark:text-[#C9C1D4] max-w-xs mt-1">
                Tell me what you&apos;re celebrating: birthday, wedding, housewarming, or festival!
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}

        {/* Loading / Typing indicator */}
        {isUpdatingPlan && (
          <div className="flex items-center gap-2 text-xs text-[#C2185B] dark:text-[#F66DA5] font-medium py-1 px-3 rounded-full bg-[#FDF2F7] dark:bg-[#360418]/60 w-fit animate-pulse border border-[#F9C5DC] dark:border-[#7E0D3A]">
            <Sparkles className="w-3.5 h-3.5 animate-spin text-[#F2A900]" />
            <span>Updating your celebration plan...</span>
          </div>
        )}

        {/* Error notification & Retry */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-800 dark:text-red-300 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
            {lastFailedMessage && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-1 font-semibold underline text-red-700 dark:text-red-200 hover:text-red-900"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      <div className="border-t border-[#E6DEFA] dark:border-[#2E234B] bg-[#FBF9FF] dark:bg-[#110D1E] px-2">
        <QuickReplyChips
          disabled={isUpdatingPlan}
          onSelect={(suggestion) => handleSendMessage(suggestion)}
        />
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-[#E6DEFA] dark:border-[#2E234B] bg-white dark:bg-[#1B142F] flex items-center gap-2"
      >
        <VoiceInput
          onTranscript={(transcript) => {
            setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }}
        />

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask anything, e.g. 'Make menu 100% vegetarian' or 'Cut budget to ₹60k'..."
          disabled={isUpdatingPlan}
          className="flex-1 rounded-xl border border-[#E6DEFA] dark:border-[#2E234B] bg-[#FBF9FF] dark:bg-[#110D1E] px-4 py-2.5 text-sm text-[#1C1530] dark:text-[#FBF9FF] placeholder:text-gray-400 focus:outline-none focus:border-[#C2185B] focus:ring-1 focus:ring-[#C2185B] min-h-[44px]"
        />

        <button
          type="submit"
          disabled={!inputValue.trim() || isUpdatingPlan}
          className="p-3 rounded-2xl bg-[#C2185B] hover:bg-[#A3134C] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
