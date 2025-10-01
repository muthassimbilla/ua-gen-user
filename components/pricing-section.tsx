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
      <section id="pricing" className="relative py-10 overflow-hidden">
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground">Loading pricing plans...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="relative py-10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />

      {/* Decorative elements */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold">Flexible Pricing</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-balance">
            Simple,{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              transparent pricing
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon ? iconMap[plan.icon] || Zap : Zap

            return (
              <div
                key={plan.id}
                className={`group relative rounded-2xl border transition-all duration-500 hover:-translate-y-2 ${
                  plan.is_popular
                    ? "border-primary/50 shadow-2xl shadow-primary/20 md:scale-105"
                    : "border-border/50 hover:border-primary/30 hover:shadow-xl"
                } bg-card/50 backdrop-blur-sm p-8`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 px-5 py-1.5 text-sm font-bold text-white shadow-lg">
                      <Crown className="h-4 w-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${plan.gradient} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent
                    className={`h-7 w-7 bg-gradient-to-br ${plan.gradient} bg-clip-text text-transparent`}
                  />
                </div>

                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>
                  <div className="flex items-baseline">
                    <span
                      className={`text-6xl font-bold bg-gradient-to-br ${plan.gradient} bg-clip-text text-transparent`}
                    >
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground ml-3 text-lg">/{plan.duration || "month"}</span>
                  </div>
                </div>

                <Link href="/signup" className="block">
                  <Button
                    className={`w-full mb-8 py-6 text-base font-semibold transition-all duration-300 ${
                      plan.is_popular
                        ? `bg-gradient-to-r ${plan.gradient} hover:shadow-2xl hover:shadow-primary/50 hover:scale-105`
                        : "hover:bg-primary/10 hover:scale-105"
                    }`}
                    variant={plan.is_popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Link>

                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-0.5 bg-gradient-to-br ${plan.gradient}`}>
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">Need a custom plan for your organization?</p>
          <Button
            variant="outline"
            size="lg"
            className="hover:bg-primary/5 hover:border-primary transition-all duration-300 bg-transparent"
          >
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  )
}
