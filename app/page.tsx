import { Suspense } from "react"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"
import { LocaleProvider } from "@/components/locale-provider"
import { LoadingSpinner } from "@/components/loading-spinner"

// Lazy load heavy components
const PricingSection = dynamic(() => import("@/components/pricing-section").then(mod => ({ default: mod.PricingSection })), {
  loading: () => <LoadingSpinner />,
  ssr: true
})

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TaskFlow",
  "description": "The complete platform to manage projects and boost team productivity",
  "url": "https://taskflow.com",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free 14-day trial"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250"
  }
}

export const metadata: Metadata = {
  title: "TaskFlow - Modern Project Management Platform",
  description: "The complete platform to manage projects and boost team productivity. Streamline workflows, collaborate seamlessly, and deliver projects faster.",
  keywords: ["project management", "task management", "team collaboration", "productivity"],
  openGraph: {
    title: "TaskFlow - Modern Project Management Platform",
    description: "The complete platform to manage projects and boost team productivity.",
    type: "website",
    url: "https://taskflow.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TaskFlow - Modern Project Management Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow - Modern Project Management Platform",
    description: "The complete platform to manage projects and boost team productivity."
  },
  alternates: {
    canonical: "https://taskflow.com"
  }
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <LocaleProvider>
        <div className="min-h-screen bg-background">
          <Navigation />
          <HeroSection />
          <FeaturesSection />
          <Suspense fallback={<LoadingSpinner />}>
            <PricingSection />
          </Suspense>
          <TestimonialsSection />
          <Footer />
        </div>
      </LocaleProvider>
    </>
  )
}
