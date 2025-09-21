"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Star, Sparkles } from "lucide-react"
import { PurchaseModal } from "./purchase-modal"

interface PricingPackage {
  id: string
  name: string
  description: string
  price: number
  duration_days: number
  user_agent_limit: number
  features: string[]
  is_active: boolean
}

interface PricingCardProps {
  package: PricingPackage
  isPopular?: boolean
  userEmail?: string
}

export function PricingCard({ package: pkg, isPopular = false, userEmail }: PricingCardProps) {
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const getIcon = () => {
    if (pkg.name.toLowerCase().includes("enterprise")) return Crown
    if (pkg.name.toLowerCase().includes("pro")) return Star
    if (pkg.name.toLowerCase().includes("premium")) return Sparkles
    return Zap
  }

  const Icon = getIcon()

  const formatDuration = (days: number) => {
    if (days === 365) return "১ বছর"
    if (days === 30) return "৩০ দিন"
    if (days === 7) return "৭ দিন"
    return `${days} দিন`
  }

  const formatLimit = (limit: number) => {
    if (limit === -1) return "আনলিমিটেড"
    if (limit >= 1000) return `${Math.floor(limit / 1000)}K+ প্রতিদিন`
    return `${limit} প্রতিদিন`
  }

  const getDiscountPercentage = () => {
    if (pkg.duration_days === 365) return 40 // 1 year gets 40% discount
    if (pkg.duration_days === 30) return 20 // 1 month gets 20% discount
    return 0
  }

  const discountPercentage = getDiscountPercentage()

  return (
    <>
      <Card
        className={`relative h-full transition-all duration-300 hover:shadow-xl ${isPopular ? "border-primary shadow-lg scale-105 bg-gradient-to-br from-primary/5 to-primary/10" : "hover:scale-102"}`}
      >
        {isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-1 shadow-lg">
              🔥 সবচেয়ে জনপ্রিয়
            </Badge>
          </div>
        )}

        {discountPercentage > 0 && (
          <div className="absolute -top-2 -right-2">
            <Badge
              variant="destructive"
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 text-xs"
            >
              {discountPercentage}% ছাড়
            </Badge>
          </div>
        )}

        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-full transition-all duration-300 ${isPopular ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg" : "bg-muted hover:bg-muted/80"}`}
            >
              <Icon className="h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {pkg.name}
          </CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed">{pkg.description}</p>
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                ৳{pkg.price}
              </span>
              <div className="text-left">
                <div className="text-sm text-muted-foreground">/{formatDuration(pkg.duration_days)}</div>
                {discountPercentage > 0 && (
                  <div className="text-xs text-red-500 line-through">
                    ৳{Math.round(pkg.price / (1 - discountPercentage / 100))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {formatLimit(pkg.user_agent_limit)} User Agent
              </span>
            </div>

            <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {formatDuration(pkg.duration_days)} সম্পূর্ণ অ্যাক্সেস
              </span>
            </div>

            {pkg.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <div className="w-6 h-6 bg-primary/80 rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <Button
            className={`w-full h-12 text-base font-semibold transition-all duration-300 ${
              isPopular
                ? "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl"
                : "hover:shadow-lg"
            }`}
            variant={isPopular ? "default" : "outline"}
            onClick={() => setShowPurchaseModal(true)}
            disabled={!pkg.is_active}
          >
            {pkg.is_active ? <>{isPopular ? "🚀 " : ""}এখনই কিনুন</> : "বর্তমানে অনুপলব্ধ"}
          </Button>

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 text-xs text-green-600 dark:text-green-400">
              <Check className="h-3 w-3" />
              <span>৭ দিনের মানি-ব্যাক গ্যারান্টি</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-xs text-blue-600 dark:text-blue-400">
              <Check className="h-3 w-3" />
              <span>২৪/৭ কাস্টমার সাপোর্ট</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <PurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        package={pkg}
        userEmail={userEmail}
      />
    </>
  )
}
