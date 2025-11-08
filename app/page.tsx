"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { heroImageUrls } from "./lib/data";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-gray-800 text-white flex flex-col items-center">
      <section className="w-full flex flex-col items-center text-center pt-24 pb-16 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-extrabold mb-4"
        >
          Welcome to <span className="text-indigo-400">CanvasCraft</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="max-w-2xl text-gray-300 mb-8"
        >
          A React-based drawing app that lets you sketch, design, and collaborate in real-time.
          Create shapes, draw freely, and share sessions with others for creative teamwork.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Button
            onClick={() => router.push("/draw")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg shadow-lg"
          >
            Start Drawing 🎨
          </Button>
        </motion.div>
      </section>

      {/* Hero Images */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 pb-24 max-w-6xl">
        {heroImageUrls.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.2 }}
            className="rounded-2xl overflow-hidden shadow-lg border border-gray-700"
          >
            <Image
              src={src}
              alt={`Canvas preview ${i + 1}`}
              width={600}
              height={400}
              className="object-cover w-full h-64"
            />
          </motion.div>
        ))}
      </section>

      <footer className="py-6 text-gray-500 text-sm border-t border-gray-700 w-full text-center">
        © {new Date().getFullYear()} CanvasCraft — Built for creativity ✨
      </footer>
    </div>
  );
}
