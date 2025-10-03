"use client"

import { toolsData } from "@/lib/tools-config"
import { ToolCard } from "@/components/tool-card"
import { useState, lazy, Suspense } from "react"
import type { Tool } from "@/lib/tools-config"
import { Wrench } from "lucide-react"

interface ToolsSectionProps {
  locale: "en" | "bn"
}

const LazyToolModal = lazy(() => import("@/components/tool-modal").then((mod) => ({ default: mod.ToolModal })))

export function ToolsSection({ locale }: ToolsSectionProps) {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const content = {
    en: {
      badge: "Our Tools",
      title: "Everything you need to",
      titleHighlight: "build faster",
      description: "Powerful tools designed to help you work smarter and ship faster.",
    },
    bn: {
      badge: "আমাদের টুল",
      title: "দ্রুত তৈরি করতে",
      titleHighlight: "যা কিছু প্রয়োজন",
      description: "শক্তিশালী টুল যা আপনাকে স্মার্টভাবে কাজ করতে এবং দ্রুত শিপ করতে সাহায্য করে।",
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
    <section id="tools" className="relative py-24">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2">
            <Wrench className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold text-sm">{t.badge}</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-balance">
            {t.title} <span className="text-primary">{t.titleHighlight}</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">{t.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {toolsData.map((tool) => (
            <ToolCard key={tool.id} tool={tool} locale={locale} onClick={() => handleToolClick(tool)} />
          ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <LazyToolModal tool={selectedTool} isOpen={isModalOpen} onClose={handleCloseModal} locale={locale} />
      </Suspense>
    </section>
  )
}
