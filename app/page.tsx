"use client"

import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { ToolsSection } from "@/components/tools-section"
import { Navigation } from "@/components/navigation"
import { useState, useEffect } from "react"

const PricingSection = dynamic(
  () => import("@/components/pricing-section").then((mod) => ({ default: mod.PricingSection })),
  {
    loading: () => <div className="h-96 animate-pulse bg-muted/20" />,
  },
)

const TestimonialsSection = dynamic(
  () => import("@/components/testimonials-section").then((mod) => ({ default: mod.TestimonialsSection })),
  {
    loading: () => <div className="h-96 animate-pulse bg-muted/20" />,
  },
)

const Footer = dynamic(() => import("@/components/footer").then((mod) => ({ default: mod.Footer })), {
  loading: () => <div className="h-64 animate-pulse bg-muted/20" />,
})

export default function HomePage() {
  const [locale, setLocale] = useState<"en" | "bn">("en")
  const [activeSection, setActiveSection] = useState("hero")

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  // Track active section for navigation highlighting
  useEffect(() => {
    const sections = ["hero", "tools", "pricing", "testimonials"]
    
    const observers = sections.map((sectionId) => {
      const element = document.getElementById(sectionId)
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(sectionId)
          }
        },
        {
          threshold: 0.3,
          rootMargin: "-100px 0px -50% 0px",
        }
      )

      observer.observe(element)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Navigation locale={locale} onLocaleChange={setLocale} activeSection={activeSection} />
      <main>
        <HeroSection locale={locale} />
        <ToolsSection locale={locale} />
        <PricingSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  )
}
