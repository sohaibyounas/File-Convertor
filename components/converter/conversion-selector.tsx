"use client";

import { FileText, Image, FileType } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

interface ConversionSelectorProps {
  targetFormat: string;
  setTargetFormat: (format: string) => void;
  enableOCR: boolean;
  setEnableOCR: (enable: boolean) => void;
  ocrLanguage: string;
  setOcrLanguage: (lang: string) => void;
}

const formats = [
  { value: "pdf", label: "PDF", icon: FileText, color: "text-red-500" },
  { value: "docx", label: "DOCX", icon: FileText, color: "text-blue-500" },
  { value: "pptx", label: "PPTX", icon: FileType, color: "text-orange-500" },
  { value: "txt", label: "TXT (OCR)", icon: FileText, color: "text-green-500" },
];

const languages = [
  { code: "eng", name: "English" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "spa", name: "Spanish" },
  { code: "ita", name: "Italian" },
  { code: "por", name: "Portuguese" },
];

export function ConversionSelector({
  targetFormat,
  setTargetFormat,
  enableOCR,
  setEnableOCR,
  ocrLanguage,
  setOcrLanguage,
}: ConversionSelectorProps) {
  const isOCRFormat = targetFormat === "txt";

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Convert to:</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {formats.map((format) => {
            const Icon = format.icon;
            const isSelected = targetFormat === format.value;

            return (
              <motion.button
                key={format.value}
                onClick={() => {
                  setTargetFormat(format.value);
                  if (format.value === "txt") {
                    setEnableOCR(true);
                  }
                }}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-lg"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : format.color}`} />
                  <span className="text-sm font-medium">{format.label}</span>
                </div>
                {isSelected && (
                  <motion.div
                    layoutId="format-indicator"
                    className="absolute inset-0 rounded-lg border-2 border-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* OCR Options */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: isOCRFormat ? 1 : 0, height: isOCRFormat ? "auto" : 0 }}
        className="space-y-3 overflow-hidden"
      >
        <Label className="text-base font-semibold">OCR Language:</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setOcrLanguage(lang.code)}
              className={`p-3 rounded-lg border text-sm transition-all ${
                ocrLanguage === lang.code
                  ? "border-primary bg-primary/10 font-medium"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}


