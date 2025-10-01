"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Clock, AlertTriangle, Home, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function AccountBlockedPage() {
  const router = useRouter()
  const [statusType, setStatusType] = useState<"suspended" | "expired" | "unknown">("unknown")
  const [message, setMessage] = useState("আপনার একাউন্টে সমস্যা রয়েছে।")

  useEffect(() => {
    // Read status type from URL parameters
    const params = new URLSearchParams(window.location.search)
    const type = params.get("type") as "suspended" | "expired" | null
    const msg = params.get("message")

    if (type) {
      setStatusType(type)
    }
    if (msg) {
      setMessage(decodeURIComponent(msg))
    }
  }, [])

  const getStatusConfig = () => {
    switch (statusType) {
      case "suspended":
        return {
          icon: Shield,
          bgGradient: "from-red-500 to-red-600",
          bgLight: "bg-red-50",
          borderColor: "border-red-200",
          iconColor: "text-red-500",
          titleColor: "text-red-800",
          textColor: "text-red-700",
          badgeVariant: "destructive" as const,
          title: "একাউন্ট স্থগিত",
          subtitle: "আপনার একাউন্ট সাময়িকভাবে নিষ্ক্রিয় করা হয়েছে",
          actionText: "অ্যাডমিনের সাথে যোগাযোগ করুন",
        }
      case "expired":
        return {
          icon: Clock,
          bgGradient: "from-orange-500 to-orange-600",
          bgLight: "bg-orange-50",
          borderColor: "border-orange-200",
          iconColor: "text-orange-500",
          titleColor: "text-orange-800",
          textColor: "text-orange-700",
          badgeVariant: "secondary" as const,
          title: "একাউন্টের মেয়াদ শেষ",
          subtitle: "আপনার একাউন্টের মেয়াদ শেষ হয়ে গেছে",
          actionText: "মেয়াদ বৃদ্ধির জন্য যোগাযোগ করুন",
        }
      default:
        return {
          icon: AlertTriangle,
          bgGradient: "from-gray-500 to-gray-600",
          bgLight: "bg-gray-50",
          borderColor: "border-gray-200",
          iconColor: "text-gray-500",
          titleColor: "text-gray-800",
          textColor: "text-gray-700",
          badgeVariant: "outline" as const,
          title: "একাউন্টে সমস্যা",
          subtitle: "আপনার একাউন্টে সমস্যা রয়েছে",
          actionText: "সহায়তার জন্য যোগাযোগ করুন",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const handleGoHome = () => {
    router.push("/")
  }

  const handleContactAdmin = () => {
    // Here you can open admin contact information or email client
    window.location.href = "mailto:admin@example.com?subject=একাউন্ট সমস্যা&body=আমার একাউন্টে সমস্যা রয়েছে। দয়া করে সাহায্য করুন।"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Card */}
        <div className={`${config.bgLight} ${config.borderColor} border rounded-2xl p-8 shadow-lg`}>
          {/* Icon */}
          <div
            className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r ${config.bgGradient} flex items-center justify-center`}
          >
            <Icon className="w-8 h-8 text-white" />
          </div>

          {/* Title and Badge */}
          <div className="text-center mb-4">
            <h1 className={`text-xl font-bold ${config.titleColor} mb-2`}>{config.title}</h1>
            <Badge variant={config.badgeVariant} className="mb-3">
              {statusType === "suspended" ? "স্থগিত" : statusType === "expired" ? "মেয়াদোত্তীর্ণ" : "সমস্যা"}
            </Badge>
            <p className={`text-sm ${config.textColor}`}>{config.subtitle}</p>
          </div>

          {/* Message */}
          <div className={`p-4 rounded-lg bg-white border ${config.borderColor} mb-6`}>
            <p className={`text-sm ${config.textColor} text-center`}>{message}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleContactAdmin}
              className={`w-full bg-gradient-to-r ${config.bgGradient} hover:opacity-90`}
            >
              <Mail className="w-4 h-4 mr-2" />
              {config.actionText}
            </Button>

            <Button variant="outline" onClick={handleGoHome} className="w-full bg-transparent">
              <Home className="w-4 h-4 mr-2" />
              হোম পেজে ফিরে যান
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">সমস্যা সমাধানের জন্য অ্যাডমিনের সাথে যোগাযোগ করুন</p>
              <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                <span>সহায়তা: admin@example.com</span>
                <span>•</span>
                <span>ফোন: +8801700000000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">এই বার্তাটি আপনার একাউন্টের নিরাপত্তার জন্য প্রদর্শিত হচ্ছে</p>
        </div>
      </div>
    </div>
  )
}
