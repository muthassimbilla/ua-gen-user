"use client"

import { PricingCards } from "@/components/pricing-cards"
import { useRouter } from "next/navigation"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { motion } from "framer-motion"

export function PricingSection() {
  const router = useRouter()
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 })

  const handleSelectPlan = (planId: string) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "select_plan", {
        event_category: "pricing",
        event_label: planId,
      })
    }
    router.push("/signup")
  }

  return (
    <section id="pricing" ref={sectionRef} className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent -z-10" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass shadow-glow border border-primary/20 text-sm font-bold mb-6">
            <span className="gradient-text">Pricing Plans</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-balance">
            Simple, transparent pricing
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-balance max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Premium tools for professional results.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PricingCards onSelectPlan={handleSelectPlan} buttonText="Get Started" />
        </motion.div>

      </div>
    </section>
  )
}

export default PricingSection
