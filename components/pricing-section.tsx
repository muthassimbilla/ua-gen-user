"use client"

import { Button } from "@/components/ui/button"
import { Check, Crown, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface PricingPlan {
  id: string
  name: string
  price: string
  duration?: string
  description?: string
  features: string[]
  is_popular: boolean
  icon?: string
  gradient: string
}

const iconMap: Record<string, any> = {
  Zap,
  Sparkles,
  Crown,
}

export function PricingSection() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("/api/pricing-plans?type=landing")
        const data = await response.json()

        if (data.plans) {
          setPlans(data.plans)
        }
      } catch (error) {
        console.error("[v0] Error fetching pricing plans:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [])

  if (loading) {
    return (
      <section id="pricing" className="relative py-16">
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading pricing plans...</p>
          </div>
        </div>
      </section>
    )
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon ? iconMap[plan.icon] || Zap : Zap

            return (
              <div
                key={plan.id}
                className={`rounded-lg border p-6 ${plan.is_popular ? "border-primary shadow-lg" : "bg-card"}`}
              >
                {plan.is_popular && (
                  <div className="mb-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-sm font-bold text-primary-foreground">
                      <Crown className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/{plan.duration || "month"}</span>
                  </div>
                </div>

                <Link href="/signup" className="block">
                  <Button className="w-full mb-6" variant={plan.is_popular ? "default" : "outline"}>
                    Get Started
                  </Button>
                </Link>

                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

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
