import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import type { ConversionOptions, ConversionResult } from "@/types";
import {
  convertDocxToPdf,
  convertPdfToDocx,
  convertPptxToDocx,
  convertDocxToPptx,
  convertImageToPdf,
} from "@/lib/converters";
import {
  convertImageToTextWithOCR,
  convertImageToDocxWithOCR,
} from "@/lib/ocr/tesseract-worker";
import { getFileExtension } from "@/lib/utils";

export function useConversion() {
  const { files, updateFileStatus, setConversionResult, setError, setProcessing } = useStore();

  const convertFile = async (
    fileData: any,
    options: ConversionOptions
  ): Promise<ConversionResult | null> => {
    const file = fileData.file;
    const sourceType = getFileExtension(file.name);
    const { targetFormat, enableOCR, ocrLanguage = "eng" } = options;

    try {
      // Image conversions
      if (["jpg", "jpeg", "png"].includes(sourceType)) {
        if (targetFormat === "txt" || enableOCR) {
          return await convertImageToTextWithOCR(file, ocrLanguage, (progress) => {
            updateFileStatus(fileData.id, "processing", progress * 100);
          });
        } else if (targetFormat === "docx") {
          return await convertImageToDocxWithOCR(file, ocrLanguage, (progress) => {
            updateFileStatus(fileData.id, "processing", progress * 100);
          });
        } else if (targetFormat === "pdf") {
          return await convertImageToPdf(file);
        }
      }

      // PDF conversions
      if (sourceType === "pdf") {
        if (targetFormat === "docx") {
          return await convertPdfToDocx(file);
        }
      }

      // DOCX conversions
      if (sourceType === "docx") {
        if (targetFormat === "pdf") {
          return await convertDocxToPdf(file);
        } else if (targetFormat === "pptx") {
          return await convertDocxToPptx(file);
        }
      }

      // PPTX conversions
      if (sourceType === "pptx") {
        if (targetFormat === "docx") {
          return await convertPptxToDocx(file);
        }
      }

      throw new Error(`Conversion from ${sourceType} to ${targetFormat} not supported`);
    } catch (error: any) {
      throw error;
    }
  };

  const convertFiles = async (options: ConversionOptions) => {
    setProcessing(true);

    const pendingFiles = files.filter((f) => f.status === "pending");

    for (const file of pendingFiles) {
      try {
        updateFileStatus(file.id, "processing", 0);

        const result = await convertFile(file, options);

        if (result) {
          setConversionResult(file.id, result);
          toast({
            variant: "success",
            title: "Conversion complete",
            description: `${file.name} converted successfully`,
          });
        }
      } catch (error: any) {
        console.error("Conversion error:", error);
        setError(file.id, error.message || "Conversion failed");
        toast({
          variant: "destructive",
          title: "Conversion failed",
          description: `Failed to convert ${file.name}: ${error.message}`,
        });
      }
    }

    setProcessing(false);
  };

  return { convertFile, convertFiles };
}
