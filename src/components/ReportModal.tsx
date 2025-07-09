// src/components/ReportModal.tsx
"use client";

import React from "react";
import { Card } from "./ui/Card";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportContent: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportContent,
}) => {
  // If the modal is not open, render nothing.
  if (!isOpen) {
    return null;
  }

  return (
    // Main container: fixed position, covers the whole screen, high z-index
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 
        Backdrop: Sits behind the modal content. 
        It has a semi-transparent background, a blur effect, and closes the modal on click.
      */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 
        Modal Content Card: Sits on top of the backdrop.
        It's styled to be a floating card with a max width and height, and internal scrolling.
      */}
      <Card className="relative z-10 flex w-full max-w-4xl flex-col shadow-2xl max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Teacher&#39;s Handover Report</h2>
          <button
            onClick={onClose}
            className="button-icon rounded-full hover:bg-muted"
            aria-label="Close report"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body with Scrolling */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 
            The `article` and `prose` classes from Tailwind Typography
            will automatically style the markdown content beautifully.
          */}
          <article className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <ReactMarkdown>{reportContent}</ReactMarkdown>
          </article>
        </div>
      </Card>
    </div>
  );
};
