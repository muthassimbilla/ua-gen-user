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
        tool_name: tool.name,
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
        tool_name: tool.name,
        cta_text: tool.ctaText,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[800px] h-[56.25vw] max-h-[450px] p-0 border-0 bg-transparent shadow-none [&>button]:hidden">
        <DialogTitle className="sr-only">{tool.name} Demo Video</DialogTitle>
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
          {/* Video Section */}
          {tool.demoVideo && !videoError && (
            <iframe
              src={tool.demoVideo}
              title={tool.name}
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
          )}
          
          {/* Fallback Image */}
          {(videoError || !tool.demoVideo) && tool.demoImage && (
            <div className="relative w-full h-full">
              <Image
                src={tool.demoImage}
                alt={tool.name}
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 800px"
              />
              {videoError && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-xl mb-4 font-semibold">Demo Video Not Available</p>
                    <a 
                      href={tool.demoVideo?.replace('/embed/', '/watch?v=')} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ToolModal
