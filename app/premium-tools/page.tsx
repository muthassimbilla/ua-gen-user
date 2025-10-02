"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Crown,
  Zap,
} from "lucide-react"
import LoadingSpinner from "@/components/loading-spinner"
import SimpleHeader from "@/components/simple-header"


interface PricingPlan {
  id: string
  name: string
  price: string
  duration?: string
  original_price?: string
  discount?: string
  features: string[]
  is_popular: boolean
  gradient: string
}

export default function PremiumToolsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userStatus, setUserStatus] = useState<"pending" | "expired" | "unknown">("unknown")
  const [isLoaded, setIsLoaded] = useState(false)
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([])
  const [plansLoading, setPlansLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("/api/pricing-plans?type=premium")
        const data = await response.json()

        if (data.plans) {
          setPricingPlans(data.plans)
        }
      } catch (error) {
        console.error("[v0] Error fetching pricing plans:", error)
      } finally {
        setPlansLoading(false)
      }
    }

    fetchPlans()
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      const isPending = !user.is_approved
      const isExpired = user.expiration_date && new Date(user.expiration_date) < new Date()
      const isSuspended = user.status === "suspended"

      // If user is approved and not expired/suspended, redirect to tools page
      if (user.is_approved && !isExpired && !isSuspended) {
        router.push("/tool")
        return
      }

      // Determine user status for display
      if (isPending) {
        setUserStatus("pending")
      } else if (isExpired) {
        setUserStatus("expired")
      } else {
        setUserStatus("unknown")
      }
    }

    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [user, loading, router])

  useEffect(() => {
    if (userStatus === "pending" || userStatus === "expired") {
      // Block browser back button
      const handlePopState = (e: PopStateEvent) => {
        e.preventDefault()
        window.history.pushState(null, "", window.location.href)
      }

      window.history.pushState(null, "", window.location.href)
      window.addEventListener("popstate", handlePopState)

      return () => {
        window.removeEventListener("popstate", handlePopState)
      }
    }
  }, [userStatus])

  if (loading || !user) {
    return <LoadingSpinner />
  }

  const getStatusConfig = () => {
    if (userStatus === "pending") {
      return {
        icon: Crown,
        bgColor: "from-purple-500 to-pink-600",
        textColor: "text-purple-700 dark:text-purple-300",
        badgeVariant: "secondary" as const,
        title: "Premium Subscription প্রয়োজন",
        message: "সকল Premium Tools এক্সেস করতে আপনার একটি subscription প্রয়োজন। নিচের প্ল্যান থেকে আপনার পছন্দের একটি বেছে নিন এবং এখনই শুরু করুন!",
      }
    } else if (userStatus === "expired") {
      return {
        icon: AlertTriangle,
        bgColor: "from-red-500 to-rose-600",
        textColor: "text-red-700 dark:text-red-300",
        badgeVariant: "destructive" as const,
        title: "Subscription মেয়াদ শেষ",
        message: "আপনার subscription এর মেয়াদ শেষ হয়ে গেছে। নিচের প্ল্যান থেকে একটি কিনে আবার এক্সেস পান।",
      }
    }
    return {
      icon: CheckCircle2,
      bgColor: "from-green-500 to-emerald-600",
      textColor: "text-green-700 dark:text-green-300",
      badgeVariant: "default" as const,
      title: "Subscription Active",
      message: "আপনার subscription সক্রিয় আছে।",
    }
  }

  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon

  const handleContactAdmin = () => {
    window.location.href = "mailto:admin@example.com?subject=Premium Tools Access&body=আমি Premium Tools এক্সেস করতে চাই।"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <SimpleHeader />

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 dark:hidden" />
        <div className="hidden dark:block absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/25 via-purple-900/15 to-indigo-900/25" />
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-pink-900/10" />
        </div>
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-64 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Added pt-24 to account for fixed header */}
      <div className="relative z-10 px-6 py-12 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Status Banner */}
          <div
            className={`mb-8 p-6 rounded-2xl bg-gradient-to-r ${statusConfig.bgColor} shadow-xl transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <StatusIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-white">{statusConfig.title}</h2>
                  <Badge variant={statusConfig.badgeVariant} className="bg-white/20 text-white border-white/30">
                    {userStatus === "pending" ? "Subscription Needed" : userStatus === "expired" ? "Expired" : "Active"}
                  </Badge>
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">{statusConfig.message}</p>
                {userStatus === "pending" && (
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => {
                        const pricingSection = document.getElementById('pricing-section');
                        if (pricingSection) {
                          pricingSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/50 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Subscription কিনুন
                    </Button>
                    <div className="text-white/70 text-xs">
                      💎 Premium Tools এক্সেস করুন
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Pricing Section */}
          <div
            id="pricing-section"
            className={`transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 mb-4">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Pricing Plans</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">Choose Your Plan</h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                আপনার প্রয়োজন অনুযায়ী একটি প্ল্যান বেছে নিন এবং সকল Premium Tools এক্সেস করুন
              </p>
            </div>

            {plansLoading ? (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400">Loading pricing plans...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {pricingPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    className={`group animate-fade-in-up ${plan.is_popular ? "md:-translate-y-4" : ""}`}
                    style={{
                      animationDelay: `${index * 100 + 600}ms`,
                      animationFillMode: "both",
                    }}
                  >
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
                        <div className="text-center mb-4">
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                          <div className="flex items-baseline justify-center gap-2 mb-2">
                            <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                            <span className="text-slate-600 dark:text-slate-400">/ {plan.duration}</span>
                          </div>
                          {plan.original_price && (
                            <div className="flex items-center justify-center gap-2">
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
                              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm leading-relaxed">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          onClick={handleContactAdmin}
                          className={`w-full py-6 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] bg-gradient-to-r ${plan.gradient} hover:opacity-90 relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="flex items-center justify-center gap-2 relative z-10">
                            <Zap className="w-5 h-5" />
                            Buy Now
                          </span>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Admin Section */}
          <div
            className={`mt-12 text-center transition-all duration-1000 delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border-white/50 dark:border-slate-700/40 p-8 rounded-2xl">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Need Help?</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">কোনো সমস্যা বা প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    onClick={handleContactAdmin}
                    variant="outline"
                    className="bg-white/50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700"
                  >
                    Contact Admin
                  </Button>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Email: admin@example.com | Phone: +8801700000000
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
