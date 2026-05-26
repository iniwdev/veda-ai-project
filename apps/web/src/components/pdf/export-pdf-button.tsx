"use client";

import { useState, useEffect } from "react";
import { Printer, Loader2 } from "lucide-react";
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

  if (!isClient) {
    return (
      <button className="flex items-center gap-2 px-4 py-2 bg-[#7B5EA7] text-white text-[12.5px] font-medium rounded-lg opacity-50 cursor-not-allowed shadow-sm">
        <Printer size={14} />
        Print Paper
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<AssessmentPDFDocument assignment={assignment} paper={paper} />}
      fileName={`${assignment.title.replace(/\s+/g, "_")}_Assessment.pdf`}
      className="flex items-center gap-2 px-4 py-2 bg-[#7B5EA7] hover:bg-[#6A4D96] text-white text-[12.5px] font-medium rounded-lg transition-colors shadow-sm"
    >
      {({ loading }) => (
        <>
          {loading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Printer size={14} />
          )}
          {loading ? "Preparing PDF..." : "Print Paper"}
        </>
      )}
    </PDFDownloadLink>
  );
}
