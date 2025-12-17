"use client";

import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, X, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useStore } from "@/lib/store";
import { formatBytes, downloadFile } from "@/lib/utils";
import type { UploadedFile } from "@/types";

const getFileIcon = (type: string) => {
  if (type.includes("image")) return ImageIcon;
  return FileText;
};

interface FileCardProps {
  file: UploadedFile;
  index: number;
}

export function FileCard({ file, index }: FileCardProps) {
  const { removeFile } = useStore();
  const Icon = getFileIcon(file.file.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      layout
    >
      <Card className="group relative overflow-hidden p-4 hover:shadow-xl transition-all duration-300">
        {/* Background gradient based on status */}
        <div
          className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
            file.status === "completed"
              ? "bg-gradient-to-br from-green-500/5 to-green-600/5"
              : file.status === "error"
              ? "bg-gradient-to-br from-red-500/5 to-red-600/5"
              : file.status === "processing"
              ? "bg-gradient-to-br from-blue-500/5 to-purple-600/5 shimmer"
              : "bg-gradient-to-br from-primary/5 to-primary/10"
          }`}
        />

        <div className="relative flex items-start gap-4">
          {/* File Icon */}
          <motion.div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${
              file.status === "processing" ? "bg-primary/20 animate-pulse" : "bg-primary/10"
            }`}
            animate={file.status === "processing" ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Icon className="h-6 w-6 text-primary" />
          </motion.div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{file.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {formatBytes(file.size)}
                  {file.type && (
                    <span className="ml-2 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs uppercase">
                      {file.type}
                    </span>
                  )}
                </p>
              </div>

              {/* Status Icon */}
              <div className="flex items-center gap-2">
                {file.status === "completed" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </motion.div>
                )}
                {file.status === "error" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  </motion.div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            {file.status === "processing" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3"
              >
                <Progress value={file.progress} liquid showLabel />
              </motion.div>
            )}

            {/* Error Message */}
            {file.status === "error" && file.errorMessage && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2 text-sm text-destructive"
              >
                {file.errorMessage}
              </motion.p>
            )}

            {/* Download Button */}
            {file.status === "completed" && file.result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-3"
              >
                <Button
                  size="sm"
                  variant="gradient"
                  className="w-full"
                  onClick={() => downloadFile(file.result!.blob, file.result!.filename)}
                >
                  <Download className="h-4 w-4" />
                  Download {file.result.outputType.toUpperCase()}
                </Button>

                {/* OCR Confidence */}
                {file.result.ocrData && (
                  <p className="mt-2 text-xs text-muted-foreground text-center">
                    OCR Confidence: {Math.round(file.result.ocrData.confidence)}%
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
