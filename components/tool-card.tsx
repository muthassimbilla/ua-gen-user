"use client"

import type { Tool } from "@/lib/tools-config"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ToolCardProps {
  tool: Tool
  locale: "en" | "bn"
  onClick: () => void
}

export function ToolCard({ tool, locale, onClick }: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "tool_card_click", {
        tool_id: tool.id,
        tool_name: tool.name[locale],
      })
    }
    onClick()
  }

  const handleHover = (hovered: boolean) => {
    setIsHovered(hovered)
    if (hovered && typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "tool_card_hover", {
        tool_id: tool.id,
        tool_name: tool.name[locale],
      })
    }
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300 border-2",
        "hover:scale-105 hover:shadow-2xl",
        `bg-gradient-to-br ${tool.color}`,
        isHovered && "scale-105 shadow-2xl",
      )}
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      <div className="p-8 space-y-4">
        <div
          className={cn(
            "inline-flex p-4 rounded-2xl bg-background/50 backdrop-blur-sm transition-transform duration-300",
            isHovered && "rotate-6 scale-110",
          )}
        >
          <tool.icon className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{tool.name[locale]}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{tool.description[locale]}</p>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-all duration-300",
            isHovered ? "opacity-100 translate-x-2" : "opacity-0 translate-x-0",
          )}
        >
          <span>{locale === "en" ? "Learn more" : "আরও জানুন"}</span>
          <span>→</span>
        </div>
      </div>

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-white/0 to-white/5 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      />
    </Card>
  )
}
