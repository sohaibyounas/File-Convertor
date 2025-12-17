import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppState, UploadedFile, ConversionResult } from "@/types";

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      files: [],
      isProcessing: false,
      conversionType: null,
      isDarkMode: false,

      addFiles: (newFiles: File[]) => {
        const uploadedFiles: UploadedFile[] = newFiles.map((file) => ({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          name: file.name,
          size: file.size,
          type: file.name.split(".").pop()?.toLowerCase() as any,
          status: "pending",
          progress: 0,
        }));

        set((state) => ({
          files: [...state.files, ...uploadedFiles],
        }));
      },

      removeFile: (id: string) =>
        set((state) => ({
          files: state.files.filter((f) => f.id !== id),
        })),

      updateFileStatus: (id: string, status: UploadedFile["status"], progress = 0) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id ? { ...f, status, progress } : f
          ),
        })),

      setConversionResult: (id: string, result: ConversionResult) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id
              ? { ...f, status: "completed" as const, progress: 100, result }
              : f
          ),
        })),

      setError: (id: string, errorMessage: string) =>
        set((state) => ({
          files: state.files.map((f) =>
            f.id === id
              ? { ...f, status: "error" as const, errorMessage }
              : f
          ),
        })),

      clearAll: () => set({ files: [], isProcessing: false, conversionType: null }),

      setProcessing: (isProcessing: boolean) => set({ isProcessing }),

      setConversionType: (conversionType) => set({ conversionType }),

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "fileconvert-storage",
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);
