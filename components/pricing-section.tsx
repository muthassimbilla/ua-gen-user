"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { PricingCards } from "@/components/pricing-cards"
import { useRouter } from "next/navigation"

export function PricingSection() {
  const router = useRouter()

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
    <section id="pricing" className="relative py-20 bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-semibold text-sm">Flexible Pricing</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-balance leading-tight">
            Simple, <span className="text-green-600 dark:text-green-400">transparent pricing</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>
        </div>

        <PricingCards onSelectPlan={handleSelectPlan} buttonText="Get Started" />

        <div className="mt-16 text-center space-y-4">
          <p className="text-lg text-muted-foreground">Need a custom plan for your organization?</p>
          <Button
            variant="outline"
            size="lg"
            className="border-green-500/20 hover:bg-green-500/10 bg-transparent hover:border-green-500/40 transition-all duration-300"
            onClick={() => {
              if (typeof window !== "undefined" && (window as any).gtag) {
                ;(window as any).gtag("event", "contact_sales_click", {
                  event_category: "pricing",
                  event_label: "contact_sales",
                })
              }
            }}
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
