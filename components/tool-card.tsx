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
        "group relative overflow-hidden cursor-pointer transition-all duration-500 border-2 border-border/50 rounded-3xl",
        "hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/20",
        "bg-gradient-to-br from-background via-background to-blue-500/5",
        isHovered && "scale-[1.03] -translate-y-2",
      )}
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5", tool.color)} />
      </div>

      {/* Sparkle Effect */}
      <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-pulse" />
      </div>

      <div className="relative p-8 space-y-5">
        {/* Icon Container with Advanced Styling */}
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "inline-flex p-4 rounded-2xl transition-all duration-500",
              "bg-gradient-to-br from-blue-500/10 via-emerald-500/5 to-transparent",
              "border-2 border-blue-500/10 shadow-lg",
              "group-hover:border-blue-500/30 group-hover:shadow-blue-500/20",
              isHovered && "rotate-12 scale-110",
            )}
          >
            <tool.icon className={cn(
              "h-9 w-9 transition-all duration-300",
              "text-blue-600 dark:text-blue-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
            )} />
          </div>

          {/* Badge */}
          <div className={cn(
            "px-4 py-2 rounded-full text-xs font-bold transition-all duration-300",
            "bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20",
            "opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
          )}>
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Popular
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-emerald-600 transition-all duration-300">
            {tool.name.en}
          </h3>
          <p className="text-muted-foreground/80 text-base leading-relaxed line-clamp-2">
            {tool.description.en}
          </p>
        </div>

        {/* CTA Button */}
        <div
          className={cn(
            "flex items-center gap-2 text-base font-bold transition-all duration-500",
            "text-blue-600 dark:text-blue-400",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
          )}
        >
          <span>Try it now</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      {/* Animated Border Effect */}
      <div className={cn(
        "absolute inset-0 rounded-3xl transition-opacity duration-500",
        "bg-gradient-to-r from-blue-500/30 via-emerald-500/30 to-cyan-500/30",
        "opacity-0 group-hover:opacity-100",
        "animate-pulse"
      )} style={{
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
        padding: "2px"
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
