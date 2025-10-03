"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles, Zap } from "lucide-react"
import { pricingPlans } from "@/lib/pricing-data"
import { memo } from "react"

const iconMap: Record<string, any> = {
  Zap,
  Sparkles,
  Crown,
}

interface PricingCardsProps {
  onSelectPlan?: (planId: string) => void
  buttonText?: string
  showContactAdmin?: boolean
}

const PricingCard = memo(
  ({
    plan,
    onButtonClick,
    buttonText,
  }: {
    plan: (typeof pricingPlans)[0]
    onButtonClick: (planId: string) => void
    buttonText: string
  }) => {
    const IconComponent = plan.icon ? iconMap[plan.icon] || Zap : Zap

    return (
      <div className={`group ${plan.is_popular ? "md:-translate-y-4" : ""}`}>
        <Card
          className={`h-full bg-card/80 backdrop-blur-xl border transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 overflow-hidden relative hover:-translate-y-2 rounded-2xl ${
            plan.is_popular
              ? "border-2 border-primary shadow-xl shadow-primary/30"
              : "border-border hover:border-primary/50"
          }`}
        >
          {plan.is_popular && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-center py-2 text-sm font-bold z-10">
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />
                Most Popular
              </div>
            </div>
          )}

          <div
            className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
          />

          <CardHeader className={`pb-4 relative p-6 ${plan.is_popular ? "pt-14" : ""}`}>
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
              <IconComponent className="h-7 w-7 text-primary" />
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              {plan.description && <p className="text-sm text-muted-foreground mb-4 text-pretty">{plan.description}</p>}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {plan.price}
                </span>
                <span className="text-muted-foreground">/ {plan.duration}</span>
              </div>
              {plan.original_price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">{plan.original_price}</span>
                  <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700">
                    {plan.discount}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0 relative p-6">
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-muted-foreground">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).gtag) {
                  ;(window as any).gtag("event", "pricing_card_click", {
                    event_category: "pricing",
                    event_label: plan.id,
                    value: plan.price,
                  })
                }
                onButtonClick(plan.id)
              }}
              className={`w-full py-6 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-gradient-to-r ${plan.gradient} hover:opacity-90 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="flex items-center justify-center gap-2 relative z-10">
                <Zap className="w-5 h-5" />
                {buttonText}
              </span>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  },
)

PricingCard.displayName = "PricingCard"

export function PricingCards({
  onSelectPlan,
  buttonText = "Get Started",
  showContactAdmin = false,
}: PricingCardsProps) {
  const handleContactAdmin = () => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "contact_admin", {
        event_category: "pricing",
        event_label: "email_click",
      })
    }
    window.location.href = "mailto:admin@example.com?subject=Premium Tools Access&body=আমি Premium Tools এক্সেস করতে চাই।"
  }

  const handleButtonClick = (planId: string) => {
    if (showContactAdmin) {
      handleContactAdmin()
    } else if (onSelectPlan) {
      onSelectPlan(planId)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {pricingPlans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} onButtonClick={handleButtonClick} buttonText={buttonText} />
      ))}
    </div>
  )
}
