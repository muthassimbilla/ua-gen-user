"use client"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { PricingCards } from "@/components/pricing-cards"
import { useRouter } from "next/navigation"

export function PricingSection() {
  const router = useRouter()

  const handleSelectPlan = (planId: string) => {
    router.push("/signup")
  }

  return (
    <section id="pricing" className="relative py-10 bg-muted/30">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 border border-green-500/20 px-4 py-2">
            <Sparkles className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-green-600 dark:text-green-400 font-semibold text-sm">Flexible Pricing</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold">
            Simple, <span className="text-green-600 dark:text-green-400">transparent pricing</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>
        </div>

        <PricingCards onSelectPlan={handleSelectPlan} buttonText="Get Started" />

        <div className="mt-6 text-center">
          <p className="text-muted-foreground mb-4">Need a custom plan for your organization?</p>
          <Button variant="outline" size="lg" className="border-green-500/20 hover:bg-green-500/10 bg-transparent">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}
