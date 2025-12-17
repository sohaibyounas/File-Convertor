"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { ConversionZone } from "@/components/converter/conversion-zone";
import { Features } from "@/components/sections/features";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      <Header />

      <main className="relative">
        {/* Hero Section */}
        <Hero />

        {/* Main Conversion Zone */}
        <section id="converter" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ConversionZone />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <Features />

        {/* Background Gradient Orbs */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-pink-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
