import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/toast";
import { SmoothScroll } from "@/components/smooth-scroll";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FileConvert Pro - Professional File Conversion with OCR",
  description: "Convert DOCX, PDF, PPTX files instantly with advanced OCR. Free, fast, and secure file conversion in your browser.",
  keywords: "file converter, pdf to docx, docx to pdf, pptx converter, OCR, image to text, free converter",
  authors: [{ name: "FileConvert Pro" }],
  openGraph: {
    title: "FileConvert Pro - Professional File Conversion",
    description: "Convert files instantly with OCR support. DOCX, PDF, PPTX conversions.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileConvert Pro",
    description: "Professional file conversion with OCR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SmoothScroll />
            {children}
            <Toaster />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
