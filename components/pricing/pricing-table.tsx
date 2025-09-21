"use client"

import { useState, useEffect } from "react"
import { PricingCard } from "./pricing-card"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Shield, Star } from "lucide-react"

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

export function PricingTable() {
  const [packages, setPackages] = useState<PricingPackage[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from("pricing_packages")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true })

      if (error) {
        console.error("Error fetching packages:", error)
        return
      }

      // Parse features JSON
      const packagesWithFeatures = data.map((pkg) => ({
        ...pkg,
        features: Array.isArray(pkg.features) ? pkg.features : JSON.parse(pkg.features || "[]"),
      }))

      setPackages(packagesWithFeatures)
    } catch (error) {
      console.error("Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="h-8 bg-muted rounded w-64 mx-auto animate-pulse" />
          <div className="h-4 bg-muted rounded w-96 mx-auto animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-[500px]">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-16 w-16 bg-muted rounded-full mx-auto" />
                  <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-3 bg-muted rounded" />
                    ))}
                  </div>
                  <div className="h-12 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (packages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <XCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <Alert className="max-w-md mx-auto">
          <AlertDescription>বর্তমানে কোন প্যাকেজ উপলব্ধ নেই। শীঘ্রই নতুন প্যাকেজ যোগ করা হবে।</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            💎 প্রিমিয়াম প্যাকেজসমূহ
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
            আপনার জন্য সেরা প্যাকেজ বেছে নিন
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            আপনার প্রয়োজন অনুযায়ী সেরা প্যাকেজ বেছে নিন। সব প্যাকেজেই উচ্চমানের User Agent, দ্রুত সাপোর্ট এবং নিরাপদ সেবা রয়েছে।
          </p>
        </div>

        <Alert className="max-w-2xl mx-auto border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            প্যাকেজ কিনতে প্রথমে <strong>সাইনআপ</strong> করুন। Gmail দিয়ে সহজেই রেজিস্ট্রেশন করুন।
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {packages.map((pkg, index) => (
          <PricingCard
            key={pkg.id}
            package={pkg}
            isPopular={index === Math.floor(packages.length / 2)} // Make middle package popular
            userEmail={undefined} // Removed user email to avoid auth issues
          />
        ))}
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">৭ দিনের গ্যারান্টি</h3>
            <p className="text-sm text-green-600 dark:text-green-400">সন্তুষ্ট না হলে সম্পূর্ণ টাকা ফেরত</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">নিরাপদ পেমেন্ট</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400">bKash, Nagad এবং ব্যাংক ট্রান্সফার</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">২৪/৭ সাপোর্ট</h3>
            <p className="text-sm text-purple-600 dark:text-purple-400">যেকোনো সমস্যায় তাৎক্ষণিক সহায়তা</p>
          </div>
        </div>

        <div className="text-center space-y-2 text-sm text-muted-foreground">
          <p>🔒 সব লেনদেন সম্পূর্ণ নিরাপদ এবং এনক্রিপ্টেড</p>
          <p>📞 সাপোর্ট: +8801XXXXXXXXX | 💬 Telegram: @support</p>
        </div>
      </div>
    </div>
  )
}
