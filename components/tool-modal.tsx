"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Tool } from "@/lib/tools-config"
import { X, ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect } from "react"

interface ToolModalProps {
  tool: Tool | null
  isOpen: boolean
  onClose: () => void
  locale: "en" | "bn"
}

export function ToolModal({ tool, isOpen, onClose, locale }: ToolModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
        if (typeof window !== "undefined" && (window as any).gtag) {
          ;(window as any).gtag("event", "modal_close", {
            method: "keyboard",
            tool_id: tool?.id,
          })
        }
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose, tool?.id])

  useEffect(() => {
    if (isOpen && tool && typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "modal_open", {
        tool_id: tool.id,
        tool_name: tool.name[locale],
      })
    }
  }, [isOpen, tool, locale])

  if (!tool) return null

  const handleCtaClick = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "cta_click", {
        tool_id: tool.id,
        tool_name: tool.name[locale],
        cta_text: tool.ctaText[locale],
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <tool.icon className="h-8 w-8" />
            {tool.name[locale]}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">{tool.description[locale]}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {tool.demoImage && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-muted">
              <Image
                src={tool.demoImage || "/placeholder.svg"}
                alt={tool.name[locale]}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-4">{locale === "en" ? "Key Features" : "মূল বৈশিষ্ট্য"}</h3>
            <ul className="space-y-3">
              {tool.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature[locale]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={tool.ctaLink} className="flex-1" onClick={handleCtaClick}>
              <Button size="lg" className="w-full text-base">
                {tool.ctaText[locale]}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ToolModal
