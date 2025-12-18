import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import type { ConversionOptions, ConversionResult } from "@/types";
import {
  convertDocxToPdf,
  convertPdfToDocx,
  convertPptxToDocx,
  convertDocxToPptx,
  convertImageToPdf,
  convertPdfToTxt,
  convertPdfToPptx,
  convertDocxToTxt,
  convertPptxToTxt,
  convertTxtToPdf,
  convertTxtToDocx,
  convertTxtToPptx,
} from "@/lib/converters";
import {
  convertImageToTextWithOCR,
  convertImageToDocxWithOCR,
  convertPdfToTextWithOCR,
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
        } else if (targetFormat === "txt") {
          // Use OCR if enabled explicitly OR if a non-English language is selected (implying the user expects language-specific processing)
          // The user mentioned selecting "French" defaults to English, implying they expect their choice to matter.
          // Since raw extraction (convertPdfToTxt) doesn't use language, we switch to OCR if language is not 'eng' or OCR is enabled.
          if (enableOCR || ocrLanguage !== "eng") {
             // Note: convertPdfToTextWithOCR in tesseract-worker.ts treats PDF as simple input. 
             // Tesseract.js support for PDF blobs without conversion to image first is limited. 
             // Ideally we convert pages to images. For now we use the existing function but ensure it's called.
             // If this fails for multi-page PDFs, we might need a more robust pipeline.
             return await convertPdfToTextWithOCR(file, ocrLanguage, (progress) => {
               updateFileStatus(fileData.id, "processing", progress * 100);
             });
          }
          return await convertPdfToTxt(file);
        } else if (targetFormat === "pptx") {
          return await convertPdfToPptx(file);
        }
      }

      // DOCX conversions
      if (sourceType === "docx") {
        if (targetFormat === "pdf") {
          return await convertDocxToPdf(file);
        } else if (targetFormat === "pptx") {
          return await convertDocxToPptx(file);
        } else if (targetFormat === "txt") {
          return await convertDocxToTxt(file);
        }
      }

      // PPTX conversions
      if (sourceType === "pptx") {
        if (targetFormat === "docx") {
          return await convertPptxToDocx(file);
        } else if (targetFormat === "txt") {
          return await convertPptxToTxt(file);
        }
      }

      // TXT conversions
      if (sourceType === "txt") {
        if (targetFormat === "pdf") {
          return await convertTxtToPdf(file);
        } else if (targetFormat === "docx") {
          return await convertTxtToDocx(file);
        } else if (targetFormat === "pptx") {
          return await convertTxtToPptx(file);
        }
      }

      throw new Error(`Conversion from ${sourceType} to ${targetFormat} not supported`);
    } catch (error: any) {
      throw error;
    }
  };

  const convertFiles = async (options: ConversionOptions) => {
    setProcessing(true);

    // Process ALL files in the list, allowing re-conversion.
    const filesToConvert = files;

    for (const file of filesToConvert) {
      try {
        // Skip if target format matches source format (naive check)
        const sourceType = getFileExtension(file.name);
        if (sourceType === options.targetFormat) {
          continue;
        }

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
