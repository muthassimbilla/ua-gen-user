"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { createClient } from "@/lib/supabase/client"
import { Download, TrendingUp, TrendingDown, Minus, Users, DollarSign, Target, Activity } from "lucide-react"

interface AdvancedMetrics {
  totalUsers: number
  activeUsers: number
  conversionRate: number
  averageRevenue: number
  churnRate: number
  growthRate: number
  retentionRate: number
  lifetimeValue: number
}

interface TopUser {
  email: string
  full_name: string
  total_spent: number
  packages_bought: number
  last_purchase: string
}

interface RevenueBreakdown {
  package_name: string
  total_revenue: number
  percentage: number
  sales_count: number
}

export function AdvancedAnalytics() {
  const [metrics, setMetrics] = useState<AdvancedMetrics | null>(null)
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  const [revenueBreakdown, setRevenueBreakdown] = useState<RevenueBreakdown[]>([])
  const [timeRange, setTimeRange] = useState("30")
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchAdvancedMetrics()
  }, [timeRange])

  const fetchAdvancedMetrics = async () => {
    try {
      setLoading(true)
      const daysAgo = Number.parseInt(timeRange)
      const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
      const previousStartDate = new Date(Date.now() - daysAgo * 2 * 24 * 60 * 60 * 1000).toISOString()

      const { data: allUsers } = await supabase.from("user_profiles").select("status, created_at")

      const { data: allTransactions } = await supabase
        .from("transactions")
        .select("amount, created_at, status, user_id")
        .eq("status", "completed")

      const totalUsers = allUsers?.length || 0
      const approvedUsers = allUsers?.filter((u) => u.status === "approved").length || 0
      const totalRevenue = allTransactions?.reduce((sum, t) => sum + Number.parseFloat(t.amount), 0) || 0
      const completedTransactions = allTransactions?.length || 0

      // Calculate period-specific metrics
      const currentPeriodUsers = allUsers?.filter((u) => new Date(u.created_at) >= new Date(startDate)).length || 0
      const previousPeriodUsers =
        allUsers?.filter(
          (u) => new Date(u.created_at) >= new Date(previousStartDate) && new Date(u.created_at) < new Date(startDate),
        ).length || 0

      const currentPeriodRevenue =
        allTransactions
          ?.filter((t) => new Date(t.created_at) >= new Date(startDate))
          .reduce((sum, t) => sum + Number.parseFloat(t.amount), 0) || 0

      const conversionRate = totalUsers > 0 ? (approvedUsers / totalUsers) * 100 : 0
      const averageRevenue = completedTransactions > 0 ? totalRevenue / completedTransactions : 0
      const growthRate =
        previousPeriodUsers > 0 ? ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100 : 0

      // Calculate retention and lifetime value
      const uniqueCustomers = new Set(allTransactions?.map((t) => t.user_id)).size
      const retentionRate = totalUsers > 0 ? (uniqueCustomers / totalUsers) * 100 : 0
      const lifetimeValue = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0

      setMetrics({
        totalUsers,
        activeUsers: approvedUsers,
        conversionRate,
        averageRevenue,
        churnRate: Math.max(0, 100 - retentionRate), // Simplified churn calculation
        growthRate,
        retentionRate,
        lifetimeValue,
      })

      const { data: topUsersData } = await supabase
        .from("transactions")
        .select(`
          user_id,
          amount,
          created_at,
          user_profiles!inner(email, full_name)
        `)
        .eq("status", "completed")
        .order("created_at", { ascending: false })

      const userSpending: Record<string, any> = {}
      topUsersData?.forEach((transaction) => {
        const userId = transaction.user_id
        if (!userSpending[userId]) {
          userSpending[userId] = {
            email: transaction.user_profiles.email,
            full_name: transaction.user_profiles.full_name,
            total_spent: 0,
            packages_bought: 0,
            last_purchase: transaction.created_at,
          }
        }
        userSpending[userId].total_spent += Number.parseFloat(transaction.amount)
        userSpending[userId].packages_bought += 1
        if (new Date(transaction.created_at) > new Date(userSpending[userId].last_purchase)) {
          userSpending[userId].last_purchase = transaction.created_at
        }
      })

      const topUsersArray = Object.values(userSpending)
        .sort((a: any, b: any) => b.total_spent - a.total_spent)
        .slice(0, 10) as TopUser[]

      setTopUsers(topUsersArray)

      const { data: packageRevenue } = await supabase
        .from("transactions")
        .select(`
          amount,
          pricing_packages!inner(name)
        `)
        .eq("status", "completed")
        .gte("created_at", startDate)

      const packageStats: Record<string, { revenue: number; count: number }> = {}
      let totalPeriodRevenue = 0

      packageRevenue?.forEach((transaction) => {
        const packageName = transaction.pricing_packages.name
        const amount = Number.parseFloat(transaction.amount)
        if (!packageStats[packageName]) {
          packageStats[packageName] = { revenue: 0, count: 0 }
        }
        packageStats[packageName].revenue += amount
        packageStats[packageName].count += 1
        totalPeriodRevenue += amount
      })

      const revenueBreakdownData = Object.entries(packageStats)
        .map(([name, stats]) => ({
          package_name: name,
          total_revenue: stats.revenue,
          percentage: totalPeriodRevenue > 0 ? (stats.revenue / totalPeriodRevenue) * 100 : 0,
          sales_count: stats.count,
        }))
        .sort((a, b) => b.total_revenue - a.total_revenue)

      setRevenueBreakdown(revenueBreakdownData)
    } catch (error) {
      console.error("Error fetching advanced metrics:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = async () => {
    try {
      const csvData = [
        "Email,Name,Total Spent,Packages Bought,Last Purchase",
        ...topUsers.map(
          (user) =>
            `${user.email},${user.full_name || "N/A"},${user.total_spent},${user.packages_bought},${user.last_purchase}`,
        ),
      ].join("\n")

      const blob = new Blob([csvData], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `analytics-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  const getTrendIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (value < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  const getMetricColor = (value: number, type: "percentage" | "currency" | "number") => {
    if (type === "percentage") {
      if (value >= 70) return "text-green-600"
      if (value >= 40) return "text-yellow-600"
      return "text-red-600"
    }
    return "text-primary"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-8 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            উন্নত বিশ্লেষণ
          </h3>
          <p className="text-sm text-muted-foreground">বিস্তারিত পারফরমেন্স মেট্রিক্স এবং ইনসাইট</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">গত ৭ দিন</SelectItem>
              <SelectItem value="30">গত ৩০ দিন</SelectItem>
              <SelectItem value="90">গত ৯০ দিন</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Advanced Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">রূপান্তর হার</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics?.conversionRate || 0, "percentage")}`}>
              {metrics?.conversionRate.toFixed(1)}%
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(metrics?.conversionRate || 0)}
              <span>অনুমোদিত / মোট ইউজার</span>
            </div>
            <Progress value={metrics?.conversionRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">গড় আয়</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳{metrics?.averageRevenue.toFixed(2)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(metrics?.averageRevenue || 0)}
              <span>প্রতি লেনদেন</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">বৃদ্ধির হার</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${metrics?.growthRate && metrics.growthRate > 0 ? "text-green-600" : "text-red-600"}`}
            >
              {metrics?.growthRate > 0 ? "+" : ""}
              {metrics?.growthRate.toFixed(1)}%
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(metrics?.growthRate || 0)}
              <span>গত {timeRange} দিনে</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">রিটেনশন রেট</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMetricColor(metrics?.retentionRate || 0, "percentage")}`}>
              {metrics?.retentionRate.toFixed(1)}%
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(metrics?.retentionRate || 0)}
              <span>ক্রয়কারী ইউজার</span>
            </div>
            <Progress value={metrics?.retentionRate || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">লাইফটাইম ভ্যালু</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">৳{metrics?.lifetimeValue.toFixed(2)}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(metrics?.lifetimeValue || 0)}
              <span>গড় কাস্টমার ভ্যালু</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">চার্ন রেট</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{metrics?.churnRate.toFixed(1)}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(-(metrics?.churnRate || 0))}
              <span>অ-ক্রয়কারী ইউজার</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">সক্রিয় ইউজার</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics?.activeUsers}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(metrics?.activeUsers || 0)}
              <span>অনুমোদিত ইউজার</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">মোট ইউজার</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.totalUsers}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              {getTrendIcon(metrics?.totalUsers || 0)}
              <span>সব সময়ের</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>প্যাকেজ অনুযায়ী আয় (গত {timeRange} দিন)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBreakdown.map((item, index) => (
                <div key={item.package_name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      <span className="font-medium">{item.package_name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">৳{item.total_revenue.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{item.sales_count} বিক্রয়</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Progress value={item.percentage} className="flex-1" />
                    <span className="text-xs text-muted-foreground w-12">{item.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
              {revenueBreakdown.length === 0 && (
                <p className="text-center text-muted-foreground py-4">এই সময়ে কোন বিক্রয় নেই</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Users */}
        <Card>
          <CardHeader>
            <CardTitle>শীর্ষ গ্রাহকগণ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topUsers.slice(0, 8).map((user, index) => (
                <div key={user.email} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{user.full_name || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        শেষ ক্রয়: {new Date(user.last_purchase).toLocaleDateString("bn-BD")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">৳{user.total_spent.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{user.packages_bought} প্যাকেজ</p>
                  </div>
                </div>
              ))}
              {topUsers.length === 0 && <p className="text-center text-muted-foreground py-4">কোন গ্রাহক ডেটা পাওয়া যায়নি</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
