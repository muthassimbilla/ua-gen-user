"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles, Zap } from "lucide-react"
import { pricingPlans } from "@/lib/pricing-data"

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

export function PricingCards({
  onSelectPlan,
  buttonText = "Get Started",
  showContactAdmin = false,
}: PricingCardsProps) {
  const handleContactAdmin = () => {
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
      {pricingPlans.map((plan, index) => {
        const IconComponent = plan.icon ? iconMap[plan.icon] || Zap : Zap

        return (
          <div key={plan.id} className={`group ${plan.is_popular ? "md:-translate-y-4" : ""}`}>
            <Card
              className={`h-full bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border-white/50 dark:border-slate-700/40 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/40 overflow-hidden relative hover:-translate-y-2 rounded-2xl ${
                plan.is_popular ? "border-2 border-purple-500 dark:border-purple-400" : ""
              }`}
            >
              {plan.is_popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-center py-2 text-sm font-bold">
                  <div className="flex items-center justify-center gap-2">
                    <Crown className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
              />

              <CardHeader className={`pb-4 relative p-6 ${plan.is_popular ? "pt-14" : ""}`}>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>

                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{plan.description}</p>
                  )}
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-slate-600 dark:text-slate-400">/ {plan.duration}</span>
                  </div>
                  {plan.original_price && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                        {plan.original_price}
                      </span>
                      <Badge className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700">
                        {plan.discount}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0 relative p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleButtonClick(plan.id)}
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
      })}
    </div>
  )
}
