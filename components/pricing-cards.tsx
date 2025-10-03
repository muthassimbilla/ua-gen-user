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
      <div className={`group ${plan.is_popular ? "md:-translate-y-6" : ""}`}>
        <Card
          className={`h-full bg-gradient-to-br from-card via-card to-background backdrop-blur-xl border-2 transition-all duration-500 hover:shadow-2xl overflow-hidden relative hover:-translate-y-3 rounded-3xl ${
            plan.is_popular
              ? "border-blue-500/50 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40"
              : "border-border/50 hover:border-blue-500/30 hover:shadow-blue-500/20"
          }`}
        >
          {plan.is_popular && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 text-white text-center py-2 text-xs font-extrabold z-10 shadow-lg">
              <div className="flex items-center justify-center gap-1.5">
                <Crown className="w-4 h-4 animate-pulse" />
                MOST POPULAR
              </div>
            </div>
          )}

          <div
            className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
          />

          <CardHeader className={`pb-4 relative p-6 ${plan.is_popular ? "pt-14" : ""}`}>
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all group-hover:scale-110 duration-300">
              <IconComponent className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="mb-4">
              <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">{plan.name}</h3>
              {plan.description && <p className="text-sm text-muted-foreground/80 mb-4 text-pretty leading-relaxed">{plan.description}</p>}
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-extrabold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {plan.price}
                </span>
                <span className="text-base text-muted-foreground font-semibold">/ {plan.duration}</span>
              </div>
              {plan.original_price ? (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground line-through">{plan.original_price}</span>
                    <Badge className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 font-bold px-3 py-1">
                      {plan.discount}
                    </Badge>
                  </div>
                  {plan.savings && (
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                      💰 {plan.savings}
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-[40px]"></div>
              )}
            </div>
          </CardHeader>

          <CardContent className="pt-0 relative p-6">
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => {
                const parts = feature.split(/(Unlimited)/g)

                return (
                  <li key={idx} className="flex items-start gap-3 text-foreground/90">
                    <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 font-bold" />
                    </div>
                    <span className="text-sm leading-relaxed font-medium">
                      {parts.map((part, partIdx) =>
                        part === "Unlimited" ? (
                          <span
                            key={partIdx}
                            className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-700 dark:text-green-400 font-bold text-xs mx-1"
                          >
                            {part}
                          </span>
                        ) : (
                          <span key={partIdx}>{part}</span>
                        )
                      )}
                    </span>
                  </li>
                )
              })}
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
              className={`w-full py-6 rounded-xl font-bold text-white shadow-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="flex items-center justify-center gap-2 relative z-10">
                <Zap className="w-5 h-5 group-hover:animate-pulse" />
                <span className="text-base">{buttonText}</span>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {pricingPlans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} onButtonClick={handleButtonClick} buttonText={buttonText} />
      ))}
    </div>
  )
}
