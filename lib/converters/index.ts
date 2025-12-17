import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import type { ConversionResult } from "@/types";

export async function convertDocxToPdf(file: File): Promise<ConversionResult> {
  // Extract text from DOCX
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const margin = 50;
  const lineHeight = fontSize * 1.2;

  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  let y = height - margin;

  const lines = text.split("\n");
  for (const line of lines) {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage();
      y = height - margin;
    }

    const words = line.split(" ");
    let currentLine = "";
    
    for (const word of words) {
      const testLine = currentLine + word + " ";
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (textWidth > width - 2 * margin && currentLine !== "") {
        page.drawText(currentLine.trim(), {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
        currentLine = word + " ";
        
        if (y < margin + lineHeight) {
          page = pdfDoc.addPage();
          y = height - margin;
        }
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine.trim()) {
      page.drawText(currentLine.trim(), {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: "application/pdf" });

  return {
    blob,
    filename: file.name.replace(/\.[^/.]+$/, ".pdf"),
    outputType: "pdf",
    processedAt: Date.now(),
  };
}

export async function convertPdfToDocx(file: File): Promise<ConversionResult> {
  const { Document, Paragraph, TextRun, Packer } = await import("docx");
  const { getDocument } = await import("pdfjs-dist");

  // Load PDF
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const paragraphs: any[] = [];

  // Extract text from each page
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");

    if (pageText.trim()) {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(pageText)],
        })
      );
    }

    if (i < pdf.numPages) {
      paragraphs.push(new Paragraph({ children: [new TextRun("")] }));
    }
  }

  // Create DOCX
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  return {
    blob,
    filename: file.name.replace(/\.[^/.]+$/, ".docx"),
    outputType: "docx",
    processedAt: Date.now(),
  };
}

export async function convertPptxToDocx(file: File): Promise<ConversionResult> {
  const { Document, Paragraph, TextRun, Packer, HeadingLevel } = await import("docx");
  const JSZip = (await import("jszip")).default;

  // Extract PPTX content
  const zip = await JSZip.loadAsync(file);
  const slideFiles = Object.keys(zip.files).filter((name) =>
    name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
  );

  const paragraphs: any[] = [];

  for (let i = 0; i < slideFiles.length; i++) {
    const slideContent = await zip.files[slideFiles[i]].async("string");
    
    // Extract text from XML (simplified)
    const textMatches = slideContent.match(/<a:t>([^<]+)<\/a:t>/g) || [];
    const slideText = textMatches
      .map((match) => match.replace(/<\/?a:t>/g, ""))
      .join(" ");

    if (slideText.trim()) {
      paragraphs.push(
        new Paragraph({
          text: `Slide ${i + 1}`,
          heading: HeadingLevel.HEADING_1,
        })
      );
      paragraphs.push(
        new Paragraph({
          children: [new TextRun(slideText)],
        })
      );
      paragraphs.push(new Paragraph({ children: [new TextRun("")] }));
    }
  }

  const doc = new Document({
    sections: [{ properties: {}, children: paragraphs }],
  });

  const blob = await Packer.toBlob(doc);

  return {
    blob,
    filename: file.name.replace(/\.[^/.]+$/, ".docx"),
    outputType: "docx",
    processedAt: Date.now(),
  };
}

export async function convertDocxToPptx(file: File): Promise<ConversionResult> {
  const PptxGenJS = (await import("pptxgenjs")).default;
  const mammoth = await import("mammoth");

  // Extract text from DOCX
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;

  // Create PPTX
  const pptx = new PptxGenJS();

  // Split text into slides (by paragraphs or lines)
  const sections = text.split("\n\n").filter((s) => s.trim());

  sections.forEach((section, index) => {
    const slide = pptx.addSlide();
    
    // Add title
    slide.addText(`Slide ${index + 1}`, {
      x: 0.5,
      y: 0.5,
      w: "90%",
      h: 0.75,
      fontSize: 24,
      bold: true,
      color: "363636",
    });

    // Add content
    slide.addText(section, {
      x: 0.5,
      y: 1.5,
      w: "90%",
      h: 4,
      fontSize: 14,
      color: "666666",
    });
  });

  const blob = await pptx.write({ outputType: "blob" }) as Blob;

  return {
    blob,
    filename: file.name.replace(/\.[^/.]+$/, ".pptx"),
    outputType: "pptx",
    processedAt: Date.now(),
  };
}

export async function convertImageToPdf(file: File): Promise<ConversionResult> {
  const pdfDoc = await PDFDocument.create();

  // Read image
  const imageBytes = await file.arrayBuffer();
  let image;

  if (file.type === "image/png") {
    image = await pdfDoc.embedPng(imageBytes);
  } else {
    image = await pdfDoc.embedJpg(imageBytes);
  }

  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  // Calculate scaling to fit page
  const imgWidth = image.width;
  const imgHeight = image.height;
  const scale = Math.min(width / imgWidth, height / imgHeight) * 0.9;

  const scaledWidth = imgWidth * scale;
  const scaledHeight = imgHeight * scale;

  page.drawImage(image, {
    x: (width - scaledWidth) / 2,
    y: (height - scaledHeight) / 2,
    width: scaledWidth,
    height: scaledHeight,
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as any], { type: "application/pdf" });

  return {
    blob,
    filename: file.name.replace(/\.[^/.]+$/, ".pdf"),
    outputType: "pdf",
    processedAt: Date.now(),
  };
}
