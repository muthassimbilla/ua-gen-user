"use client"

import { toolsData } from "@/lib/tools-config"
import { ToolCard } from "@/components/tool-card"
import { useState, lazy, Suspense } from "react"
import type { Tool } from "@/lib/tools-config"
import { Wrench, Sparkles } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const LazyToolModal = lazy(() => import("@/components/tool-modal").then((mod) => ({ default: mod.ToolModal })))

export function ToolsSection() {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 })

  const content = {
    badge: "Our Tools",
    title: "Everything you need to",
    titleHighlight: "build faster",
    description: "Powerful tools designed to help you work smarter and ship faster. Explore our suite of AI-powered generators.",
  }

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
      className="relative py-12 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-500/5 to-background" />
        <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div 
          className={`text-center space-y-3 mb-10 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-cyan-500/10 border border-blue-500/20 px-6 py-3 backdrop-blur-sm shadow-lg">
            <Wrench className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              {content.badge}
            </span>
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-balance leading-tight">
            {content.title}{" "}
            <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              {content.titleHighlight}
            </span>
          </h2>

          <p className="text-xl text-muted-foreground/80 max-w-3xl mx-auto text-pretty leading-relaxed">
            {content.description}
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
              <ToolCard tool={tool} onClick={() => handleToolClick(tool)} />
            </div>
          ))}
        </div>
      </div>

      <Suspense fallback={null}>
        <LazyToolModal tool={selectedTool} isOpen={isModalOpen} onClose={handleCloseModal} />
      </Suspense>
    </section>
  )
}
