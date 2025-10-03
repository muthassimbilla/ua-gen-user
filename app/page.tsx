"use client"

import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { ToolsSection } from "@/components/tools-section"
import { Navigation } from "@/components/navigation"
import { useState } from "react"

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation locale={locale} onLocaleChange={setLocale} />
      <HeroSection locale={locale} />
      <ToolsSection locale={locale} />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  )
}
