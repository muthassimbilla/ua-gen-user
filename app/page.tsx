import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { Navigation } from "@/components/navigation"

// Lazy load sections that are below the fold
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
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <Footer />
    </div>
  )
}
