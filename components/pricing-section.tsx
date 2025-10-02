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
    <section id="pricing" className="relative py-16">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold">Flexible Pricing</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold">
            Simple, <span className="text-primary">transparent pricing</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>
        </div>

        <PricingCards onSelectPlan={handleSelectPlan} buttonText="Get Started" />

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Need a custom plan for your organization?</p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}
