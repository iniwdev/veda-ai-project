"use client";

import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { AssessmentPDFDocument } from "./assessment-pdf-document";

interface ExportPdfButtonProps {
  assignment: any;
  paper: any;
}

export function ExportPdfButton({ assignment, paper }: ExportPdfButtonProps) {
  const [isClient, setIsClient] = useState(false);

  // Avoid SSR hydration issues with PDFDownloadLink
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || !assignment || !paper) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-5 py-2.5 bg-[#171717] text-white text-[13px] font-semibold rounded-full opacity-70 cursor-not-allowed shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
      >
        <Download size={16} strokeWidth={2.5} />
        <span>Download PDF</span>
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<AssessmentPDFDocument assignment={assignment} paper={paper} />}
      fileName={`${assignment.title?.replace(/\s+/g, "_") || "Assessment"}.pdf`}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#171717] hover:bg-black text-white text-[13px] font-semibold rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 transition-all duration-300"
    >
      {({ loading }) => (
        <>
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Download size={16} strokeWidth={2.5} />
          )}
          <span>{loading ? "Generating PDF..." : "Download PDF"}</span>
        </>
      )}
    </PDFDownloadLink>
  );
}
