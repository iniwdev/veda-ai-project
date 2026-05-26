"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface ExportPdfButtonProps {
  assignment: any;
}

export function ExportPdfButton({ assignment }: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    setIsExporting(true);

    // Suppress html2canvas oklab/oklch warnings that crash Next.js dev overlay
    const originalConsoleError = console.error;
    console.error = (...args) => {
      if (typeof args[0] === "string" && args[0].includes("oklab")) return;
      if (typeof args[0] === "string" && args[0].includes("oklch")) return;
      originalConsoleError(...args);
    };

    try {
      const module = await import("html2pdf.js");
      const html2pdf: any = module.default ? module.default : module;

      const element = document.getElementById("question-paper");
      if (!element) throw new Error("Paper element not found");

      // Temporarily swap out Tailwind color classes for inline hex styles directly on the DOM
      // This prevents the blank page issue caused by cloning off-screen, while still fixing the oklch crash
      const allEls = element.querySelectorAll("*");
      const originalStyles = new Map();

      allEls.forEach((el: any) => {
        const className = el.className;
        if (typeof className === "string") {
          originalStyles.set(el, {
            className,
            color: el.style.color,
            bg: el.style.backgroundColor,
            border: el.style.borderColor,
          });

          // Add safe hex styles
          if (className.includes("text-gray-900") || className.includes("text-black"))
            el.style.color = "#111827";
          if (className.includes("text-gray-700")) el.style.color = "#374151";
          if (className.includes("text-gray-500")) el.style.color = "#6b7280";
          if (className.includes("bg-gray-50/30") || className.includes("bg-gray-50"))
            el.style.backgroundColor = "#f9fafb";
          if (className.includes("bg-white")) el.style.backgroundColor = "#ffffff";
          if (className.includes("border-gray-900") || className.includes("border-black"))
            el.style.borderColor = "#111827";
          if (className.includes("border-gray-300")) el.style.borderColor = "#d1d5db";
          if (className.includes("border-gray-200")) el.style.borderColor = "#e5e7eb";

          // Strip the offending tailwind classes
          el.className = className
            .replace(/text-gray-\d+/g, "")
            .replace(/bg-gray-\d+(\/\d+)?/g, "")
            .replace(/border-gray-\d+/g, "")
            .replace(/text-black/g, "")
            .replace(/border-black/g, "")
            .replace(/bg-white/g, "");
        }
      });

      const paperTitle = assignment?.title?.replace(/\s+/g, "_") || "Assessment";

      const opt = {
        margin: 0.3,
        filename: `${paperTitle}.pdf`,
        image: { type: "jpeg" as const, quality: 1 },
        html2canvas: {
          scale: 3,
          useCORS: true,
          logging: false,
        },
        jsPDF: { unit: "in" as const, format: "a4" as const, orientation: "portrait" as const },
      };

      await html2pdf().set(opt).from(element).save();

      // Restore original DOM state exactly as it was
      allEls.forEach((el: any) => {
        if (originalStyles.has(el)) {
          const original = originalStyles.get(el);
          el.className = original.className;
          el.style.color = original.color;
          el.style.backgroundColor = original.bg;
          el.style.borderColor = original.border;
        }
      });
    } catch (error) {
      originalConsoleError("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      console.error = originalConsoleError;
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isExporting}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#171717] hover:bg-black text-white text-[13px] font-semibold rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isExporting ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Download size={16} strokeWidth={2.5} />
      )}
      <span>{isExporting ? "Generating PDF..." : "Download PDF"}</span>
    </button>
  );
}
