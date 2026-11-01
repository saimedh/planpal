"use client";

import React, { useState } from "react";
import { ExternalLink, Maximize2, Sparkles, RefreshCw } from "lucide-react";

interface FramerEmbedProps {
  projectUrl?: string;
  title?: string;
  className?: string;
}

export function FramerEmbed({
  projectUrl = "https://enchanting-millions-849878.framer.app/",
  title = "PlanPal — Framer Published Prototype",
  className = "",
}: FramerEmbedProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  return (
    <div
      className={`rounded-3xl border border-[#E4DEF2] dark:border-[#493D5C] bg-white dark:bg-[#2A213D] shadow-xl overflow-hidden transition-all ${
        isFullscreen ? "fixed inset-4 z-50 flex flex-col bg-white dark:bg-[#1C1530]" : ""
      } ${className}`}
    >
      {/* Top Framer Bar */}
      <div className="px-6 py-4 border-b border-[#E4DEF2] dark:border-[#493D5C] flex flex-wrap items-center justify-between gap-3 bg-[#FBF9FF] dark:bg-[#1C1530]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs">
            {/* Framer Logo Icon */}
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-heading font-bold text-[#1C1530] dark:text-[#FBF9FF]">
                {title}
              </h3>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200">
                Live Framer App
              </span>
            </div>
            <p className="text-[11px] text-[#62596F] dark:text-[#C9BEDB]">
              Published Site: <span className="font-mono text-[10px]">enchanting-millions-849878.framer.app</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIframeKey((k) => k + 1)}
            title="Reload Framer Canvas"
            className="p-2 rounded-xl border border-[#E4DEF2] dark:border-[#493D5C] text-gray-500 hover:text-[#C2185B] hover:bg-[#F3EEFF] transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            className="p-2 rounded-xl border border-[#E4DEF2] dark:border-[#493D5C] text-gray-500 hover:text-[#C2185B] hover:bg-[#F3EEFF] transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <a
            href={projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C2185B] hover:bg-[#A3134C] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>Open Live Framer Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Framer Iframe Preview Area */}
      <div className={`relative w-full ${isFullscreen ? "flex-1" : "h-[650px]"} bg-[#FBF9FF]`}>
        <iframe
          key={iframeKey}
          src={projectUrl}
          title="Framer Live Site"
          className="w-full h-full border-0"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        />

        {/* Bottom Pill */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/85 backdrop-blur-md text-white text-xs border border-white/20 pointer-events-none shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#F2A900]" />
          <span>Framer Site: enchanting-millions-849878.framer.app</span>
        </div>
      </div>
    </div>
  );
}
