"use client";

import React from "react";
import { Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const formattedTime = message.created_at
    ? new Date(message.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex w-full gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#C2185B] to-[#F2A900] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 shadow-xs text-sm leading-relaxed",
          isUser
            ? "bg-[#C2185B] text-white rounded-tr-xs"
            : "bg-white text-[#1C1530] border border-[#E4DEF2] dark:bg-[#2A213D] dark:border-[#493D5C] dark:text-[#FBF9FF] rounded-tl-xs"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>

        {formattedTime && (
          <div
            className={cn(
              "mt-1.5 text-[10px] text-right font-medium",
              isUser ? "text-white/70" : "text-gray-400 dark:text-gray-500"
            )}
          >
            {formattedTime}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-[#1C1530] dark:bg-[#493D5C] text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
}
