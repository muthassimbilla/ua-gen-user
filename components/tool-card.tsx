"use client"

import type { Tool } from "@/lib/tools-config"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, Sparkles } from "lucide-react"

interface ToolCardProps {
  tool: Tool
  onClick: () => void
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "tool_card_click", {
        tool_id: tool.id,
        tool_name: tool.name.en,
      })
    }
    onClick()
  }

  const handleHover = (hovered: boolean) => {
    setIsHovered(hovered)
    if (hovered && typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "tool_card_hover", {
        tool_id: tool.id,
        tool_name: tool.name.en,
      })
    }
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300 border-2 border-border/50",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        "bg-gradient-to-br from-background via-background to-muted/30",
        isHovered && "scale-[1.01] -translate-y-0.5",
      )}
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {/* Simplified Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-3", tool.color)} />
      </div>

      <div className="relative p-6 space-y-4">
        {/* Icon Container with Advanced Styling */}
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "inline-flex p-4 rounded-2xl transition-all duration-300",
              "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
              "border-2 border-primary/10 shadow-md",
              "group-hover:border-primary/30 group-hover:shadow-primary/10",
              isHovered && "rotate-6 scale-105",
            )}
          >
            <tool.icon className={cn(
              "h-8 w-8 transition-all duration-300",
              "text-primary/80 group-hover:text-primary"
            )} />
          </div>

          {/* Badge */}
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300",
            "bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20",
            "opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
          )}>
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Popular
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-300">
            {tool.name.en}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {tool.description.en}
          </p>
        </div>

        {/* CTA Button */}
        <div
          className={cn(
            "flex items-center gap-2 text-sm font-semibold transition-all duration-500",
            "text-primary",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
          )}
        >
          <span>Try it now</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Animated Border Effect */}
      <div className={cn(
        "absolute inset-0 rounded-xl transition-opacity duration-500",
        "bg-gradient-to-r from-primary/20 via-transparent to-primary/20",
        "opacity-0 group-hover:opacity-100",
        "animate-pulse"
      )} style={{ 
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
        padding: "1px"
      }} />

      {/* Shimmer Effect */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent",
          "translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000",
          "skew-x-12"
        )}
      />
    </Card>
  )
}
