"use client"

import type { Tool } from "@/lib/tools-config"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface ToolCardProps {
  tool: Tool
  onClick: () => void
  featured?: boolean
}

export function ToolCard({ tool, onClick, featured = false }: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "tool_card_click", {
        tool_id: tool.id,
        tool_name: tool.name,
      })
    }
    onClick()
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-500",
        "border-2 border-border rounded-2xl bg-card hover:border-primary/50",
        "hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1",
        featured ? "md:row-span-1" : "",
        "h-full",
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        )}
      />

      <div className={cn("p-8 space-y-6 h-full flex flex-col relative z-10", featured && "md:p-10")}>
        {/* Icon with enhanced styling */}
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "p-4 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-all duration-300",
              featured && "p-5",
            )}
          >
            <tool.icon className={cn("text-primary", featured ? "h-8 w-8" : "h-6 w-6")} />
          </div>
          <ArrowRight
            className={cn(
              "h-6 w-6 text-primary transition-all duration-300",
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2",
            )}
          />
        </div>

        {/* Content */}
        <div className="space-y-4 flex-1">
          <h3 className={cn("font-bold", featured ? "text-3xl" : "text-2xl")}>{tool.name}</h3>
          <p className={cn("text-muted-foreground leading-relaxed", featured ? "text-lg" : "text-base")}>
            {tool.description}
          </p>
          
          {/* Features List */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-primary">Key Features:</h4>
            <ul className="space-y-1">
              {tool.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
              {tool.features.length > 3 && (
                <li className="text-xs text-primary font-medium">
                  +{tool.features.length - 3} more features
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <span>Deno</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="px-3 py-1.5 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg text-xs font-bold text-primary hover:from-primary/20 hover:to-accent/20 transition-all duration-300 cursor-pointer">
            Try Now
          </div>
        </div>
      </div>
    </Card>
  )
}
