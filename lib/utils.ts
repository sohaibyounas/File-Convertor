import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();
}

export function getFileName(filename: string): string {
  return filename.substring(0, filename.lastIndexOf(".")) || filename;
}

export function getMimeType(extension: string): string {
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ppt: "application/vnd.ms-powerpoint",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    txt: "text/plain",
  };
  return mimeTypes[extension.toLowerCase()] || "application/octet-stream";
}

export async function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadZip(files: { blob: Blob; filename: string }[]) {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  files.forEach(({ blob, filename }) => {
    zip.file(filename, blob);
  });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  downloadFile(zipBlob, `converted-files-${Date.now()}.zip`);
}

export function triggerConfetti() {
  if (typeof window === "undefined") return;
  
  import("canvas-confetti").then((confetti) => {
    confetti.default({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#9333ea", "#ec4899", "#3b82f6"],
    });
  });
}

export function vibrate(pattern: number | number[] = 10) {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
