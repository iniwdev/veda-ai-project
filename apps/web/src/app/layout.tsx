import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "AI Assessment Creator",
    template: "%s | AI Assessment Creator",
  },
  description:
    "Production-grade AI-powered assessment generation platform for educators and instructors.",
  keywords: ["AI", "assessment", "quiz", "education", "generator"],
  authors: [{ name: "AI Assessment Creator" }],
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
