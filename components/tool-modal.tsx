"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Tool } from "@/lib/tools-config"
import { X, ArrowRight, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ToolModalProps {
  tool: Tool | null
  isOpen: boolean
  onClose: () => void
}

export function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const [videoError, setVideoError] = useState(false)
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
        tool_name: tool.name.en,
      })
    }
    // Reset video error state when modal opens
    if (isOpen) {
      setVideoError(false)
    }
  }, [isOpen, tool])

  if (!tool) return null

  const handleCtaClick = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "cta_click", {
        tool_id: tool.id,
        tool_name: tool.name.en,
        cta_text: tool.ctaText.en,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <tool.icon className="h-8 w-8" />
            {tool.name.en}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">{tool.description.en}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {tool.demoVideo && !videoError && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-muted">
              <iframe
                src={tool.demoVideo}
                title={tool.name.en}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                loading="lazy"
                onError={() => {
                  console.log("Video failed to load, showing fallback");
                  setVideoError(true);
                }}
              />
              {/* Always visible YouTube link */}
              <div className="absolute bottom-2 right-2">
                <a 
                  href={tool.demoVideo.replace('/embed/', '/watch?v=')} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded transition-colors"
                >
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  YouTube
                </a>
              </div>
            </div>
          )}
          {(videoError || !tool.demoVideo) && tool.demoImage && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-muted">
              <Image
                src={tool.demoImage}
                alt={tool.name.en}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              {videoError && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-sm mb-2">Video not available</p>
                    <a 
                      href={tool.demoVideo?.replace('/embed/', '/watch?v=')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <h3 className="text-xl font-semibold mb-4">Key Features</h3>
            <ul className="space-y-3">
              {tool.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{feature.en}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Link href={tool.ctaLink} className="flex-1" onClick={handleCtaClick}>
              <Button size="lg" className="w-full text-base">
                {tool.ctaText.en}
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
