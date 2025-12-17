export type FileType = "pdf" | "docx" | "pptx" | "jpg" | "jpeg" | "png" | "txt";

export type ConversionType =
  | "pdf-to-docx"
  | "docx-to-pdf"
  | "pptx-to-docx"
  | "docx-to-pptx"
  | "pdf-to-pptx"
  | "pptx-to-pdf"
  | "image-to-pdf"
  | "image-to-docx"
  | "image-to-txt";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: FileType;
  preview?: string;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  errorMessage?: string;
  result?: ConversionResult;
}

export interface ConversionResult {
  blob: Blob;
  filename: string;
  outputType: FileType;
  processedAt: number;
  ocrData?: OCRResult;
}

export interface OCRResult {
  text: string;
  confidence: number;
  language: string;
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
}

export interface ConversionOptions {
  targetFormat: FileType;
  enableOCR?: boolean;
  ocrLanguage?: string;
  quality?: number;
  compress?: boolean;
}

export interface AppState {
  files: UploadedFile[];
  isProcessing: boolean;
  conversionType: ConversionType | null;
  isDarkMode: boolean;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  updateFileStatus: (id: string, status: UploadedFile["status"], progress?: number) => void;
  setConversionResult: (id: string, result: ConversionResult) => void;
  setError: (id: string, error: string) => void;
  clearAll: () => void;
  setProcessing: (processing: boolean) => void;
  setConversionType: (type: ConversionType | null) => void;
  toggleDarkMode: () => void;
}
