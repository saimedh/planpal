"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const maxWidthStyles = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Framer Motion Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Framer Motion Modal Dialog */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={cn(
              "relative w-full rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-[#241710] border border-[#F2DFBC] dark:border-[#4D3220] z-10",
              maxWidthStyles[maxWidth]
            )}
          >
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-[#FFECCB]/50 hover:text-[#2B1810] dark:hover:bg-[#422818] dark:hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {title && (
              <h3 id="modal-title" className="text-xl font-heading font-semibold text-[#2B1810] dark:text-[#FFF9F0] mb-1">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-[#6B4226] dark:text-[#E6CA99] mb-4">
                {description}
              </p>
            )}

            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
