import { createWorker, type Worker } from "tesseract.js";
import type { OCRResult, ConversionResult } from "@/types";
import { Document, Paragraph, TextRun, Packer } from "docx";

let worker: Worker | null = null;
let currentLanguage: string | null = null;

export async function initOCRWorker(language = "eng"): Promise<Worker> {
  if (worker && currentLanguage === language) return worker;

  if (worker) {
    await worker.terminate();
  }

  worker = await createWorker(language, 1, {
    logger: (m: any) => {
      if (m.status === "recognizing text") {
        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  currentLanguage = language;
  return worker;
}

export async function performOCR(
  file: File,
  language = "eng",
  onProgress?: (progress: number) => void
): Promise<OCRResult> {
  const worker = await initOCRWorker(language);

  const imageUrl = URL.createObjectURL(file);

  const result = await worker.recognize(imageUrl);
  const { text, confidence, words } = result.data as any;

  URL.revokeObjectURL(imageUrl);

  return {
    text,
    confidence,
    language,
    words: words.map((word: any) => ({
      text: word.text,
      confidence: word.confidence,
      bbox: word.bbox,
    })),
  };
}

export async function convertImageToTextWithOCR(
  file: File,
  language = "eng",
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  const ocrResult = await performOCR(file, language, onProgress);

  const blob = new Blob([ocrResult.text], { type: "text/plain" });

  return {
    blob,
    filename: file.name.replace(/\.[^/.]+$/, ".txt"),
    outputType: "txt",
    processedAt: Date.now(),
    ocrData: ocrResult,
  };
}

export async function convertImageToDocxWithOCR(
  file: File,
  language = "eng",
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  const ocrResult = await performOCR(file, language, onProgress);

  // Create DOCX with OCR text
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `OCR Extracted Text (Confidence: ${Math.round(ocrResult.confidence)}%)`,
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({ children: [new TextRun("")] }),
          ...ocrResult.text.split("\n").map(
            (line) =>
              new Paragraph({
                children: [new TextRun(line)],
              })
          ),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  return {
    blob,
    filename: file.name.replace(/\.[^/.]+$/, ".docx"),
    outputType: "docx",
    processedAt: Date.now(),
    ocrData: ocrResult,
  };
}

export async function convertPdfToTextWithOCR(
  file: File,
  language = "eng",
  onProgress?: (progress: number) => void
): Promise<ConversionResult> {
  // For PDF OCR, we'd need to convert PDF pages to images first
  // This is a simplified version that treats the PDF as an image
  const ocrResult = await performOCR(file, language, onProgress);

  const blob = new Blob([ocrResult.text], { type: "text/plain" });

  return {
    blob,
    filename: file.name.replace(/\.[^/.]+$/, ".txt"),
    outputType: "txt",
    processedAt: Date.now(),
    ocrData: ocrResult,
  };
}

export async function terminateOCRWorker() {
  if (worker) {
    await worker.terminate();
    worker = null;
  }
}

export const SUPPORTED_OCR_LANGUAGES = [
  { code: "eng", name: "English" },
  { code: "fra", name: "French" },
  { code: "deu", name: "German" },
  { code: "spa", name: "Spanish" },
  { code: "ita", name: "Italian" },
  { code: "por", name: "Portuguese" },
  { code: "rus", name: "Russian" },
  { code: "jpn", name: "Japanese" },
  { code: "chi_sim", name: "Chinese (Simplified)" },
  { code: "chi_tra", name: "Chinese (Traditional)" },
  { code: "ara", name: "Arabic" },
  { code: "hin", name: "Hindi" },
];
