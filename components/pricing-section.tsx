"use client"

import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Check } from "lucide-react"
import { PricingCards } from "@/components/pricing-cards"
import { useRouter } from "next/navigation"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

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
    <section 
      id="pricing" 
      ref={sectionRef}
      className="relative py-12 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-emerald-500/5 to-background" />
        <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div 
          className={`text-center space-y-4 mb-10 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-cyan-500/10 border border-emerald-500/20 px-6 py-3 backdrop-blur-sm shadow-lg">
            <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Flexible Pricing
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-balance leading-tight">
            Simple,{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              transparent pricing
            </span>
          </h2>

        </div>

        {/* Pricing Cards */}
        <div 
          className={`transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <PricingCards onSelectPlan={handleSelectPlan} buttonText="Get Started" />
        </div>

        {/* Custom Plan CTA */}
        <div 
          className={`mt-10 text-center space-y-3 transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-cyan-500/10 border border-emerald-500/20 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
            <p className="text-xl font-bold mb-2">Need a custom plan for your organization?</p>
            <p className="text-base text-muted-foreground/80 mb-6">
              Contact our sales team for enterprise pricing and custom features
            </p>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-emerald-500/30 hover:bg-emerald-500/10 bg-transparent hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 group rounded-xl font-semibold"
              onClick={() => {
                if (typeof window !== "undefined" && (window as any).gtag) {
                  ;(window as any).gtag("event", "contact_sales_click", {
                    event_category: "pricing",
                    event_label: "contact_sales",
                  })
                }
                window.location.href = "mailto:sales@ugenpro.com"
              }}
            >
              Contact Sales
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
