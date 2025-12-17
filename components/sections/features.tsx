"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Shield,
  Globe,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "Advanced OCR",
    description:
      "Extract text from images and PDFs with 95%+ accuracy. Supports 12 languages including English, French, German, Spanish, and more.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Lightning Speed",
    description:
      "Convert files in under 25 seconds. Optimized processing with Web Workers for seamless performance.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "100% Private",
    description:
      "All conversions happen in your browser. Your files never leave your device. No cloud uploads, no data collection.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Globe,
    title: "Universal Formats",
    description:
      "Support for DOCX ↔ PDF, PPTX ↔ DOCX, PDF ↔ PPTX, and Image → PDF/DOCX/TXT conversions.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Batch Processing",
    description:
      "Convert up to 10 files at once with a combined size limit of 100MB. Download all as a ZIP file.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: ImageIcon,
    title: "Image Recognition",
    description:
      "Convert JPG, PNG images to searchable PDFs or editable documents with confidence scoring.",
    gradient: "from-pink-500 to-rose-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Powerful Features
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for professional file conversion, all in your
            browser
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
