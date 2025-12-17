"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Shield, Globe } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "OCR Technology",
    description: "Extract text from images and PDFs with 95%+ accuracy in 12 languages",
    color: "text-purple-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Convert files in under 25 seconds with optimized processing",
    color: "text-yellow-500",
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "All processing happens in your browser. Files never leave your device",
    color: "text-green-500",
  },
  {
    icon: Globe,
    title: "Multiple Formats",
    description: "Support for DOCX, PDF, PPTX, JPG, PNG with bidirectional conversion",
    color: "text-blue-500",
  },
];

export function Hero() {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="container mx-auto max-w-5xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Free Forever • No Registration Required</span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          Professional File Conversion
          <br />
          with OCR Support
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Convert DOCX, PDF, PPTX, and images instantly. Extract text with advanced OCR.
          All processing happens in your browser for maximum privacy.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#converter"
            className="inline-block gradient-purple text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Start Converting Now →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
