"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

interface ExportPdfButtonProps {
  assignment: any;
  paper: any;
}

export function ExportPdfButton({ assignment }: ExportPdfButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    setIsExporting(true);
    
    try {
      // @ts-ignore - html2pdf.js doesn't have types by default
      const html2pdf = (await import("html2pdf.js")).default;
      
      const element = document.getElementById("question-paper");
      if (!element) throw new Error("Paper element not found");
      
      const paperTitle = assignment?.title?.replace(/\s+/g, "_") || "Assessment";
      
      const opt = {
        margin: 0.5,
        filename: `${paperTitle}.pdf`,
        image: { type: 'jpeg' as const, quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
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
