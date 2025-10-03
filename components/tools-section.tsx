"use client"

import { toolsData } from "@/lib/tools-config"
import { ToolCard } from "@/components/tool-card"
import { useState, lazy, Suspense } from "react"
import type { Tool } from "@/lib/tools-config"
import { Wrench, Sparkles } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface ToolsSectionProps {
  locale: "en" | "bn"
}

const LazyToolModal = lazy(() => import("@/components/tool-modal").then((mod) => ({ default: mod.ToolModal })))

export function ToolsSection({ locale }: ToolsSectionProps) {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 })

  const content = {
    en: {
      badge: "Our Tools",
      title: "Everything you need to",
      titleHighlight: "build faster",
      description: "Powerful tools designed to help you work smarter and ship faster. Explore our suite of AI-powered generators.",
    },
    bn: {
      badge: "আমাদের টুল",
      title: "দ্রুত তৈরি করতে",
      titleHighlight: "যা কিছু প্রয়োজন",
      description: "শক্তিশালী টুল যা আপনাকে স্মার্টভাবে কাজ করতে এবং দ্রুত শিপ করতে সাহায্য করে। আমাদের এআই-চালিত জেনারেটরগুলি ব্যবহার করুন।",
    },
  }

  const t = content[locale]

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedTool(null), 300)
  }

  return (
    <section 
      id="tools" 
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-purple-500/5 to-background" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div 
          className={`text-center space-y-4 mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 px-5 py-2.5 backdrop-blur-sm shadow-lg">
            <Wrench className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t.badge}
            </span>
            <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400 animate-pulse" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
            {t.title}{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t.titleHighlight}
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {toolsData.map((tool, index) => (
            <div
              key={tool.id}
              className={`transition-all duration-700 ${
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <ToolCard tool={tool} locale={locale} onClick={() => handleToolClick(tool)} />
            </div>
          ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <LazyToolModal tool={selectedTool} isOpen={isModalOpen} onClose={handleCloseModal} locale={locale} />
      </Suspense>
    </section>
  )
}
