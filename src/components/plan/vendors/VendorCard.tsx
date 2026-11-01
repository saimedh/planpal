"use client";

import React, { useState } from "react";
import { Phone, MessageSquare, IndianRupee, Tag, Check, Edit2 } from "lucide-react";
import { Vendor } from "@/lib/schemas/plan";
import { formatCurrency, generateWhatsAppLink } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

interface VendorCardProps {
  vendor: Vendor;
  index: number;
  eventTitle?: string;
  eventDate?: string;
  city?: string;
  onUpdateVendor: (index: number, updated: Vendor) => void;
}

export function VendorCard({
  vendor,
  index,
  eventTitle = "our celebration",
  eventDate = "",
  city = "Hyderabad",
  onUpdateVendor,
}: VendorCardProps) {
  const [isDraftModalOpen, setIsDraftModalOpen] = useState(false);
  const [draftLanguage, setDraftLanguage] = useState<"en" | "hi" | "te">("en");

  const statusVariants: Record<string, "default" | "info" | "warning" | "success"> = {
    to_contact: "info",
    quoted: "warning",
    booked: "success",
    paid: "default",
  };

  const handleStatusChange = (newStatus: "to_contact" | "quoted" | "booked" | "paid") => {
    onUpdateVendor(index, { ...vendor, status: newStatus });
  };

  // Generate WhatsApp inquiry text
  const generateDraftText = () => {
    const vName = vendor.name || vendor.type;
    if (draftLanguage === "hi") {
      return `नमस्ते ${vName}! हम ${city} में ${eventDate ? eventDate + " को " : ""}एक कार्यक्रम (${eventTitle}) आयोजित कर रहे हैं। क्या आप इस तारीख पर उपलब्ध हैं? कृपया अपना सर्विस पैकेज और कोटेशन साझा करें। धन्यवाद!`;
    }
    if (draftLanguage === "te") {
      return `నమస్కారం ${vName}! మేము ${city} లో ${eventDate ? eventDate + " న " : ""}${eventTitle} వేడుక ప్లాన్ చేస్తున్నాము. మీరు ఆ రోజున అందుబాటులో ఉంటారా? దయచేసి మీ సర్వీస్ వివరాలు మరియు కొటేషన్ పంపగలరు. ధన్యవాదాలు!`;
    }
    return `Hello ${vName}! We are planning "${eventTitle}" in ${city} ${eventDate ? "on " + eventDate : ""}. We are looking for ${vendor.type} services. Could you please share your availability and quotation package? Looking forward to hearing from you!`;
  };

  const draftMessage = generateDraftText();
  const waUrl = generateWhatsAppLink(draftMessage, vendor.phone);

  return (
    <div className="p-4 rounded-xl border border-[#E6DEFA] dark:border-[#2E234B] bg-white dark:bg-[#1B142F] space-y-3 hover:border-[#C2185B]/40 transition-shadow shadow-2xs">
      {/* Top Header: Type & Status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#C2185B] dark:text-[#F48DB8]">
            {vendor.type}
          </span>
          <h4 className="text-sm font-semibold text-[#1C1530] dark:text-[#FBF9FF]">
            {vendor.name || "Vendor TBD"}
          </h4>
        </div>

        {/* Status Dropdown */}
        <select
          value={vendor.status}
          onChange={(e) => handleStatusChange(e.target.value as any)}
          className="text-xs font-semibold rounded-lg border border-[#E6DEFA] dark:border-[#2E234B] bg-[#FBF9FF] dark:bg-[#110D1E] px-2 py-1 text-[#1C1530] dark:text-[#FBF9FF] focus:outline-none"
        >
          <option value="to_contact">To Contact</option>
          <option value="quoted">Quoted</option>
          <option value="booked">Booked</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Price Range & Quote */}
      <div className="flex items-center justify-between text-xs py-1 border-y border-[#E6DEFA]/60 dark:border-[#2E234B]/60">
        <div className="text-gray-400 text-[11px]">
          {vendor.priceRange && <span>Est: {vendor.priceRange}</span>}
        </div>
        {vendor.quote !== undefined && vendor.quote !== null ? (
          <div className="font-semibold text-[#C2185B] dark:text-[#F48DB8]">
            Quote: {formatCurrency(vendor.quote)}
          </div>
        ) : (
          <span className="text-gray-400 text-[11px] italic">No quote yet</span>
        )}
      </div>

      {/* Notes */}
      {vendor.notes && (
        <p className="text-[11px] text-[#4A3E68] dark:text-[#C9C1D4] italic line-clamp-2">
          {vendor.notes}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 gap-2">
        {vendor.phone ? (
          <a
            href={`tel:${vendor.phone}`}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#C2185B] transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{vendor.phone}</span>
          </a>
        ) : (
          <span className="text-[10px] text-gray-400">Phone not set</span>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDraftModalOpen(true)}
          className="text-xs py-1 px-2.5 h-8 min-h-0"
          leftIcon={<MessageSquare className="w-3 h-3 text-emerald-600" />}
        >
          WhatsApp
        </Button>
      </div>

      {/* WhatsApp Draft Modal */}
      <Modal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        title={`WhatsApp Enquiry for ${vendor.name || vendor.type}`}
        description="PlanPal drafted a polite enquiry message ready to send directly on WhatsApp."
      >
        <div className="space-y-4 pt-1">
          {/* Language selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setDraftLanguage("en")}
              className={`px-3 py-1 text-xs rounded-lg font-medium ${
                draftLanguage === "en"
                  ? "bg-[#C2185B] text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setDraftLanguage("hi")}
              className={`px-3 py-1 text-xs rounded-lg font-medium font-hindi ${
                draftLanguage === "hi"
                  ? "bg-[#C2185B] text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setDraftLanguage("te")}
              className={`px-3 py-1 text-xs rounded-lg font-medium font-telugu ${
                draftLanguage === "te"
                  ? "bg-[#C2185B] text-white"
                  : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              }`}
            >
              తెలుగు
            </button>
          </div>

          {/* Draft text preview */}
          <div className="p-3.5 rounded-xl bg-[#FBF9FF] dark:bg-[#110D1E] border border-[#E6DEFA] dark:border-[#2E234B] text-xs text-[#1C1530] dark:text-[#FBF9FF] whitespace-pre-wrap leading-relaxed">
            {draftMessage}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(draftMessage);
                alert("Message copied to clipboard!");
              }}
            >
              Copy Text
            </Button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs"
            >
              <span>Send on WhatsApp</span>
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}
