"use client";

import React, { useState } from "react";
import { Share2, Download, Calendar, Users, MapPin, IndianRupee, CheckCircle2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate, generateWhatsAppLink } from "@/lib/utils";
import { exportPlanToPdf } from "@/lib/pdf/export";
import { Plan } from "@/lib/schemas/plan";

interface PlanHeaderProps {
  plan: Plan;
  shareToken?: string;
  isUpdating?: boolean;
}

export function PlanHeader({ plan, shareToken, isUpdating }: PlanHeaderProps) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Calculate task completion progress
  const totalTasks = plan.timeline.length;
  const completedTasks = plan.timeline.filter((t) => t.done).length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const shareUrl = typeof window !== "undefined" && shareToken
    ? `${window.location.origin}/share/${shareToken}`
    : "";

  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    await exportPlanToPdf("plan-content-area", `${plan.title || "PlanPal_Plan"}.pdf`);
    setIsExporting(false);
  };

  const whatsappMessage = `🎉 Here is our celebration plan for ${plan.title || "our event"} on PlanPal!\nCheck out the budget, timeline, and vendors: ${shareUrl}`;
  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  return (
    <div className="bg-white dark:bg-[#1B142F] border-b border-[#E6DEFA] dark:border-[#2E234B] px-6 py-4 shadow-2xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title and metadata */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-heading font-bold text-[#1C1530] dark:text-[#FBF9FF]">
              {plan.title || "Celebration Plan"}
            </h1>
            {plan.eventType && (
              <Badge variant="magenta" className="capitalize">
                {plan.eventType}
              </Badge>
            )}
            {isUpdating && (
              <Badge variant="marigold" className="animate-pulse">
                Updating live...
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 mt-2 text-xs text-[#4A3E68] dark:text-[#C9C1D4] flex-wrap">
            {plan.date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C2185B]" />
                <span>{formatDate(plan.date)}</span>
              </div>
            )}
            {plan.guests && (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#F2A900]" />
                <span>{plan.guests} Guests</span>
              </div>
            )}
            {plan.city && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{plan.city}</span>
              </div>
            )}
            {plan.budget && (
              <div className="flex items-center gap-1 font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
                <IndianRupee className="w-3.5 h-3.5 text-[#C2185B]" />
                <span>{formatCurrency(plan.budget)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons & Progress */}
        <div className="flex items-center gap-3">
          {/* Progress bar pill */}
          <div className="hidden sm:flex flex-col gap-1 w-28 bg-[#FBF9FF] dark:bg-[#110D1E] p-2 rounded-xl border border-[#E6DEFA] dark:border-[#2E234B]">
            <div className="flex justify-between text-[10px] font-semibold text-[#4A3E68] dark:text-[#C9C1D4]">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#E00000] via-[#FFA97B] to-[#9FED72] h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            leftIcon={<Share2 className="w-3.5 h-3.5 text-[#C2185B]" />}
          >
            Share
          </Button>

          {/* Export PDF Button */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleExport}
            isLoading={isExporting}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export PDF
          </Button>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Celebration Plan"
        description="Share a read-only live link with family, friends, or co-hosts."
      >
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl || "https://planpal.vercel.app/share/sample-token"}
              className="flex-1 rounded-xl border border-[#E6DEFA] dark:border-[#2E234B] bg-[#FBF9FF] dark:bg-[#110D1E] px-3.5 py-2.5 text-xs text-gray-600 dark:text-gray-300 select-all"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              leftIcon={copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            >
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-xs"
            >
              <span>Share on WhatsApp</span>
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
