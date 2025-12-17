"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, FileText, Image, FileCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "@/components/ui/toast";
import { cn, vibrate } from "@/lib/utils";

const MAX_FILES = 10;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const ACCEPTED_FORMATS = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  "application/msword": [".doc"],
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"],
  "application/vnd.ms-powerpoint": [".ppt"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export function DragZone() {
  const { addFiles, files } = useStore();

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach((rejected) => {
          if (rejected.file.size > MAX_FILE_SIZE) {
            toast({
              variant: "destructive",
              title: "File too large",
              description: `${rejected.file.name} exceeds 100MB limit`,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Invalid file type",
              description: `${rejected.file.name} is not supported`,
            });
          }
        });
      }

      if (files.length + acceptedFiles.length > MAX_FILES) {
        toast({
          variant: "destructive",
          title: "Too many files",
          description: `Maximum ${MAX_FILES} files allowed`,
        });
        return;
      }

      if (acceptedFiles.length > 0) {
        addFiles(acceptedFiles);
        vibrate([10, 20, 10]);
        toast({
          variant: "success",
          title: "Files added",
          description: `${acceptedFiles.length} file(s) ready for conversion`,
        });
      }
    },
    [addFiles, files.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    multiple: true,
  });

  return (
    <motion.div
      {...(getRootProps() as any)}
      className={cn(
        "relative cursor-pointer rounded-2xl border-2 border-dashed border-border p-12 text-center transition-all duration-300",
        isDragActive && "drag-active",
        !isDragActive && "hover:border-primary/50 hover:bg-accent/5"
      )}
      whileHover={{ scale: isDragActive ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <input {...getInputProps()} />

      <motion.div
        className="flex flex-col items-center gap-6"
        animate={{
          y: isDragActive ? -10 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Icon Animation */}
        <motion.div
          className="relative"
          animate={{
            scale: isDragActive ? 1.2 : 1,
            rotate: isDragActive ? 5 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className={cn(
            "rounded-full p-6 transition-all duration-300",
            isDragActive ? "bg-primary/20 glow" : "bg-primary/10"
          )}>
            <Upload className={cn(
              "h-12 w-12 transition-all duration-300",
              isDragActive ? "text-primary animate-float" : "text-primary/70"
            )} />
          </div>

          {/* Floating icons */}
          <motion.div
            className="absolute -right-2 -top-2"
            animate={{
              y: [0, -10, 0],
              opacity: isDragActive ? 1 : 0.5,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FileText className="h-6 w-6 text-blue-500" />
          </motion.div>

          <motion.div
            className="absolute -left-2 top-0"
            animate={{
              y: [0, 10, 0],
              opacity: isDragActive ? 1 : 0.5,
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image className="h-6 w-6 text-green-500" />
          </motion.div>

          <motion.div
            className="absolute -bottom-2 right-2"
            animate={{
              y: [0, -5, 0],
              opacity: isDragActive ? 1 : 0.5,
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FileCheck className="h-6 w-6 text-purple-500" />
          </motion.div>
        </motion.div>

        {/* Text */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">
            {isDragActive ? "Drop your files here" : "Drag & drop files"}
          </h3>
          <p className="text-muted-foreground">
            or click to browse your computer
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-3 py-1">PDF</span>
            <span className="rounded-full bg-blue-500/10 px-3 py-1">DOCX</span>
            <span className="rounded-full bg-orange-500/10 px-3 py-1">PPTX</span>
            <span className="rounded-full bg-green-500/10 px-3 py-1">JPG/PNG</span>
          </div>
        </div>

        {/* Limits */}
        <p className="text-xs text-muted-foreground">
          Max {MAX_FILES} files • 100MB per file
        </p>
      </motion.div>

      {/* Animated border gradient */}
      {isDragActive && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(147, 51, 234, 0.5), transparent)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
