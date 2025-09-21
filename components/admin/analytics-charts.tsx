"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { RefreshCw, Calendar, TrendingUp } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  ComposedChart,
} from "recharts"

interface ChartData {
  name: string
  value: number
  users?: number
  revenue?: number
  date?: string
  growth?: number
}

export function AnalyticsCharts() {
  const [userGrowthData, setUserGrowthData] = useState<ChartData[]>([])
  const [revenueData, setRevenueData] = useState<ChartData[]>([])
  const [statusDistribution, setStatusDistribution] = useState<ChartData[]>([])
  const [packagePopularity, setPackagePopularity] = useState<ChartData[]>([])
  const [timeRange, setTimeRange] = useState("7")
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const supabase = createClient()

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      const daysAgo = Number.parseInt(timeRange)
      const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString()

      const { data: userGrowth } = await supabase
        .from("user_profiles")
        .select("created_at")
        .gte("created_at", startDate)
        .order("created_at", { ascending: true })

      // Process user growth data with cumulative count
      const growthByDay: Record<string, number> = {}
      let cumulativeCount = 0

      // Get all users before the start date for baseline
      const { data: baselineUsers } = await supabase.from("user_profiles").select("id").lt("created_at", startDate)

      cumulativeCount = baselineUsers?.length || 0

      // Generate date range
      const dateRange = []
      for (let i = daysAgo - 1; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const dateStr = date.toLocaleDateString("en-CA") // YYYY-MM-DD format
        dateRange.push(dateStr)
        growthByDay[dateStr] = 0
      }

      // Count users by day
      userGrowth?.forEach((user) => {
        const date = new Date(user.created_at).toLocaleDateString("en-CA")
        if (growthByDay.hasOwnProperty(date)) {
          growthByDay[date]++
        }
      })

      // Create cumulative growth data
      const growthData = dateRange.map((date) => {
        cumulativeCount += growthByDay[date]
        return {
          name: new Date(date).toLocaleDateString("bn-BD", { month: "short", day: "numeric" }),
          value: growthByDay[date],
          users: cumulativeCount,
          growth: growthByDay[date],
        }
      })

      setUserGrowthData(growthData)

      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount, created_at, status")
        .eq("status", "completed")
        .gte("created_at", startDate)
        .order("created_at", { ascending: true })

      // Process revenue data with cumulative revenue
      const revenueByDay: Record<string, number> = {}
      dateRange.forEach((date) => {
        revenueByDay[date] = 0
      })

      transactions?.forEach((transaction) => {
        const date = new Date(transaction.created_at).toLocaleDateString("en-CA")
        if (revenueByDay.hasOwnProperty(date)) {
          revenueByDay[date] += Number.parseFloat(transaction.amount) || 0
        }
      })

      let cumulativeRevenue = 0
      const revenueChartData = dateRange.map((date) => {
        const dailyRevenue = revenueByDay[date]
        cumulativeRevenue += dailyRevenue
        return {
          name: new Date(date).toLocaleDateString("bn-BD", { month: "short", day: "numeric" }),
          value: cumulativeRevenue,
          revenue: dailyRevenue,
        }
      })

      setRevenueData(revenueChartData)

      const { data: statusData } = await supabase.from("user_profiles").select("status")

      const statusCount: Record<string, number> = {
        pending: 0,
        approved: 0,
        rejected: 0,
        suspended: 0,
      }

      statusData?.forEach((user) => {
        if (statusCount.hasOwnProperty(user.status)) {
          statusCount[user.status]++
        }
      })

      const statusLabels = {
        pending: "অপেক্ষমান",
        approved: "অনুমোদিত",
        rejected: "প্রত্যাখ্যাত",
        suspended: "স্থগিত",
      }

      const statusDistData = Object.entries(statusCount)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => ({
          name: statusLabels[status as keyof typeof statusLabels] || status,
          value: count,
        }))

      setStatusDistribution(statusDistData)

      const { data: packageTransactions } = await supabase
        .from("transactions")
        .select(`
          package_id,
          amount,
          status,
          pricing_packages!inner(name)
        `)
        .eq("status", "completed")
        .gte("created_at", startDate)

      const packageStats: Record<string, { count: number; revenue: number }> = {}

      packageTransactions?.forEach((transaction) => {
        const packageName = transaction.pricing_packages.name
        if (!packageStats[packageName]) {
          packageStats[packageName] = { count: 0, revenue: 0 }
        }
        packageStats[packageName].count++
        packageStats[packageName].revenue += Number.parseFloat(transaction.amount) || 0
      })

      const packageChartData = Object.entries(packageStats)
        .map(([name, stats]) => ({
          name,
          value: stats.count,
          revenue: stats.revenue,
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)

      setPackagePopularity(packageChartData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-muted rounded w-48 animate-pulse" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-80">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-4" />
                  <div className="h-64 bg-muted rounded" />
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            বিশ্লেষণ চার্ট
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            শেষ আপডেট: {lastUpdated.toLocaleTimeString("bn-BD")}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">৭ দিন</SelectItem>
              <SelectItem value="30">৩০ দিন</SelectItem>
              <SelectItem value="90">৯০ দিন</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAnalyticsData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            রিফ্রেশ
          </Button>
        </div>
      </div>

      {/* User Growth and Revenue Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>ইউজার বৃদ্ধি (গত {timeRange} দিন)</span>
              <span className="text-sm font-normal text-muted-foreground">
                মোট: {userGrowthData[userGrowthData.length - 1]?.users || 0}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis yAxisId="left" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === "users" ? "মোট ইউজার" : name === "growth" ? "নতুন ইউজার" : name,
                  ]}
                  labelFormatter={(label) => `তারিখ: ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="users"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.1}
                />
                <Bar yAxisId="right" dataKey="growth" fill="#10b981" radius={[2, 2, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>আয় (গত {timeRange} দিন)</span>
              <span className="text-sm font-normal text-muted-foreground">
                মোট: ৳{revenueData[revenueData.length - 1]?.value?.toFixed(2) || "0.00"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis yAxisId="left" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "value" ? `৳${Number(value).toFixed(2)}` : `৳${value}`,
                    name === "value" ? "মোট আয়" : "দৈনিক আয়",
                  ]}
                  labelFormatter={(label) => `তারিখ: ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.1}
                />
                <Bar yAxisId="right" dataKey="revenue" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution and Package Popularity */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>ইউজার স্ট্যাটাস বিতরণ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, "ইউজার"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>জনপ্রিয় প্যাকেজসমূহ</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={packagePopularity} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" fontSize={12} />
                <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "value" ? `${value} ক্রয়` : `৳${Number(value).toFixed(2)} আয়`,
                    name === "value" ? "ক্রয়" : "আয়",
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {userGrowthData.reduce((sum, item) => sum + (item.growth || 0), 0)}
              </div>
              <div className="text-sm text-muted-foreground">নতুন ইউজার</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                ৳{revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0).toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">মোট আয়</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {packagePopularity.reduce((sum, item) => sum + item.value, 0)}
              </div>
              <div className="text-sm text-muted-foreground">প্যাকেজ বিক্রয়</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {statusDistribution.find((s) => s.name === "অনুমোদিত")?.value || 0}
              </div>
              <div className="text-sm text-muted-foreground">সক্রিয় ইউজার</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
