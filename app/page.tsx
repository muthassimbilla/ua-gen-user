"use client"

import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { Navigation } from "@/components/navigation"
import { useState, useEffect } from "react"

// Lazy load heavy components
const ToolsSection = dynamic(() => import("@/components/tools-section").then(mod => ({ default: mod.ToolsSection })), {
  loading: () => <div className="h-96 animate-pulse bg-muted/10" />,
})

const PricingSection = dynamic(
  () => import("@/components/pricing-section").then((mod) => ({ default: mod.PricingSection })),
  {
    loading: () => <div className="h-96 animate-pulse bg-muted/20" />,
  },
)

const ContactSection = dynamic(
  () => import("@/components/contact-section").then((mod) => ({ default: mod.ContactSection })),
  {
    loading: () => <div className="h-96 animate-pulse bg-muted/20" />,
  },
)

const Footer = dynamic(() => import("@/components/footer").then((mod) => ({ default: mod.Footer })), {
  loading: () => <div className="h-64 animate-pulse bg-muted/20" />,
})

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("hero")

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  // Track active section for navigation highlighting - Optimized
  useEffect(() => {
    const sections = ["hero", "tools", "pricing", "contact"]
    let timeoutId: NodeJS.Timeout
    
    const observer = new IntersectionObserver(
      (entries) => {
        // Debounce multiple intersection events
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sectionId = entry.target.id
              if (sections.includes(sectionId)) {
                setActiveSection(sectionId)
              }
            }
          })
        }, 100)
      },
      {
        threshold: 0.3,
        rootMargin: "-100px 0px -50% 0px",
      }
    )

    // Observe all sections with single observer
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId)
      if (element) observer.observe(element)
    })

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="min-h-screen marble-bg">
      <Navigation activeSection={activeSection} />
      <main className="relative">
        <HeroSection />
        <div>
          <ToolsSection />
          <PricingSection />
          <ContactSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}
