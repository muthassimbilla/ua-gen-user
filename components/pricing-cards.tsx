"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { pricingPlans } from "@/lib/pricing-data"
import { memo } from "react"

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
    return (
      <div className="group h-full">
        <Card
          className={`h-full hover-lift border rounded-2xl bg-card transition-all duration-300 overflow-hidden flex flex-col ${
            plan.is_popular ? "ring-2 ring-primary shadow-lg shadow-primary/20" : "border-border"
          }`}
        >
          {plan.is_popular && (
            <div className="bg-gradient-to-r from-primary to-chart-2 text-primary-foreground text-center py-2 text-xs font-medium">
              Most Popular
            </div>
          )}

          <CardHeader className={`p-8 flex-shrink-0 ${plan.is_popular ? "" : "pt-12"}`}>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">{plan.name}</h3>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/ {plan.duration}</span>
              </div>

              {plan.original_price && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground line-through">{plan.original_price}</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {plan.discount}
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-8 pt-0 flex flex-col flex-1">
            <ul className="space-y-3 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm leading-relaxed">
                    {feature.split(' ').map((word, wordIdx) => 
                      word.toLowerCase() === 'unlimited' ? (
                        <span key={wordIdx} className="font-bold text-primary bg-primary/10 px-1 rounded">
                          {word}
                        </span>
                      ) : (
                        <span key={wordIdx}>{word}</span>
                      )
                    ).reduce((prev, curr, idx) => [prev, idx > 0 ? ' ' : '', curr])}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-6 flex-shrink-0">
              <button
                onClick={() => {
                  if (typeof window !== "undefined" && (window as any).gtag) {
                    ;(window as any).gtag("event", "buy_now_click", {
                      event_category: "pricing",
                      event_label: plan.id,
                      value: plan.price,
                    })
                  }
                  // Add buy now functionality here
                  console.log(`Buy Now clicked for plan: ${plan.id}`)
                }}
                className="w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 text-white shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer border-2 border-transparent"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                  border: '2px solid #8b5cf6',
                  color: 'white',
                  minHeight: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                Buy Now
              </button>
            </div>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {pricingPlans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} onButtonClick={handleButtonClick} buttonText={buttonText} />
      ))}
    </div>
  )
}
