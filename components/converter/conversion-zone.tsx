"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles, Download, Trash2 } from "lucide-react";
import { DragZone } from "./drag-zone";
import { FileCard } from "./file-card";
import { ConversionSelector } from "./conversion-selector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import { downloadZip, triggerConfetti } from "@/lib/utils";
import { useConversion } from "@/hooks/use-conversion";

export function ConversionZone() {
  const { files, clearAll, isProcessing } = useStore();
  const [targetFormat, setTargetFormat] = useState<string>("pdf");
  const [enableOCR, setEnableOCR] = useState(false);
  const [ocrLanguage, setOcrLanguage] = useState("eng");
  const { convertFiles } = useConversion();

  const handleConvert = async () => {
    if (files.length === 0) {
      toast({
        variant: "destructive",
        title: "No files",
        description: "Please add files to convert",
      });
      return;
    }

    await convertFiles({
      targetFormat: targetFormat as any,
      enableOCR,
      ocrLanguage,
    });
  };

  const handleDownloadAll = () => {
    const completedFiles = files
      .filter((f) => f.status === "completed" && f.result)
      .map((f) => ({
        blob: f.result!.blob,
        filename: f.result!.filename,
      }));

    if (completedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "No files ready",
        description: "No completed conversions to download",
      });
      return;
    }

    if (completedFiles.length === 1) {
      const file = completedFiles[0];
      const url = URL.createObjectURL(file.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.filename;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      downloadZip(completedFiles);
    }

    triggerConfetti();
    toast({
      variant: "success",
      title: "Download started",
      description: `${completedFiles.length} file(s) downloaded`,
    });
  };

  const completedCount = files.filter((f) => f.status === "completed").length;
  const hasCompleted = completedCount > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold mb-2">Convert Your Files</h2>
        <p className="text-muted-foreground">
          Upload files, choose format, and convert instantly
        </p>
      </motion.div>

      {/* Drag Zone */}
      <DragZone />

      {/* Conversion Options */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-6 glass glass-dark">
            <ConversionSelector
              targetFormat={targetFormat}
              setTargetFormat={setTargetFormat}
              enableOCR={enableOCR}
              setEnableOCR={setEnableOCR}
              ocrLanguage={ocrLanguage}
              setOcrLanguage={setOcrLanguage}
            />

            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                variant="gradient"
                onClick={handleConvert}
                disabled={isProcessing || files.length === 0}
                className="min-w-[200px]"
              >
                {isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-5 w-5" />
                    </motion.div>
                    Converting...
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-5 w-5" />
                    Convert {files.length} {files.length === 1 ? "File" : "Files"}
                  </>
                )}
              </Button>

              {hasCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleDownloadAll}
                    className="min-w-[200px]"
                  >
                    <Download className="h-5 w-5" />
                    Download {completedCount === 1 ? "File" : `All (${completedCount})`}
                  </Button>
                </motion.div>
              )}

              <Button
                size="lg"
                variant="ghost"
                onClick={clearAll}
                disabled={isProcessing}
              >
                <Trash2 className="h-5 w-5" />
                Clear All
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <h3 className="text-lg font-semibold">
            Files ({files.length})
            {hasCompleted && (
              <span className="ml-2 text-sm font-normal text-green-500">
                • {completedCount} completed
              </span>
            )}
          </h3>

          <AnimatePresence mode="popLayout">
            {files.map((file, index) => (
              <FileCard key={file.id} file={file} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
