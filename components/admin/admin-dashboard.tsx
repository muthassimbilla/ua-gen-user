"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { Users, UserCheck, UserX, DollarSign, TrendingUp, Clock, AlertTriangle } from "lucide-react"
import { AnalyticsCharts } from "./analytics-charts"
import { AdvancedAnalytics } from "./advanced-analytics"

interface DashboardStats {
  total_users: number
  pending_users: number
  approved_users: number
  rejected_users: number
  suspended_users: number
  new_today: number
  new_this_week: number
  new_this_month: number
}

interface TransactionStats {
  total_transactions: number
  completed_transactions: number
  pending_transactions: number
  total_revenue: number
  revenue_today: number
  revenue_this_week: number
  revenue_this_month: number
}

interface RecentActivity {
  id: string
  type: "signup" | "approval" | "rejection" | "payment" | "purchase"
  user_email: string
  description: string
  created_at: string
}

export function AdminDashboard() {
  const [userStats, setUserStats] = useState<DashboardStats | null>(null)
  const [transactionStats, setTransactionStats] = useState<TransactionStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchStats()
    fetchRecentActivity()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)

      const { data: users, error: userError } = await supabase.from("user_profiles").select("status, created_at")

      if (userError) {
        console.error("User stats error:", userError)
        setUserStats({
          total_users: 0,
          pending_users: 0,
          approved_users: 0,
          rejected_users: 0,
          suspended_users: 0,
          new_today: 0,
          new_this_week: 0,
          new_this_month: 0,
        })
      } else {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

        const stats = {
          total_users: users.length,
          pending_users: users.filter((u) => u.status === "pending").length,
          approved_users: users.filter((u) => u.status === "approved").length,
          rejected_users: users.filter((u) => u.status === "rejected").length,
          suspended_users: users.filter((u) => u.status === "suspended").length,
          new_today: users.filter((u) => new Date(u.created_at) >= today).length,
          new_this_week: users.filter((u) => new Date(u.created_at) >= weekAgo).length,
          new_this_month: users.filter((u) => new Date(u.created_at) >= monthAgo).length,
        }
        setUserStats(stats)
      }

      const { data: transactions, error: transactionError } = await supabase
        .from("transactions")
        .select("status, amount, created_at")

      if (transactionError) {
        console.error("Transaction stats error:", transactionError)
        setTransactionStats({
          total_transactions: 0,
          completed_transactions: 0,
          pending_transactions: 0,
          total_revenue: 0,
          revenue_today: 0,
          revenue_this_week: 0,
          revenue_this_month: 0,
        })
      } else {
        const now = new Date()
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

        const transactionStats = {
          total_transactions: transactions.length,
          completed_transactions: transactions.filter((t) => t.status === "completed").length,
          pending_transactions: transactions.filter((t) => t.status === "pending").length,
          total_revenue: transactions
            .filter((t) => t.status === "completed")
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          revenue_today: transactions
            .filter((t) => t.status === "completed" && new Date(t.created_at) >= today)
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          revenue_this_week: transactions
            .filter((t) => t.status === "completed" && new Date(t.created_at) >= weekAgo)
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          revenue_this_month: transactions
            .filter((t) => t.status === "completed" && new Date(t.created_at) >= monthAgo)
            .reduce((sum, t) => sum + (t.amount || 0), 0),
        }
        setTransactionStats(transactionStats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActivity = async () => {
    try {
      const { data: recentUsers, error: usersError } = await supabase
        .from("user_profiles")
        .select("id, email, full_name, status, created_at, approved_at")
        .order("created_at", { ascending: false })
        .limit(10)

      const { data: recentTransactions, error: transactionsError } = await supabase
        .from("transactions")
        .select("id, user_email, package_name, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

      if (!usersError && recentUsers) {
        const activities: RecentActivity[] = []

        recentUsers.forEach((user) => {
          activities.push({
            id: `signup-${user.id}`,
            type: "signup",
            user_email: user.email,
            description: `${user.full_name || user.email} নতুন সাইনআপ করেছেন`,
            created_at: user.created_at,
          })

          if (user.status === "approved" && user.approved_at) {
            activities.push({
              id: `approval-${user.id}`,
              type: "approval",
              user_email: user.email,
              description: `${user.full_name || user.email} অনুমোদিত হয়েছেন`,
              created_at: user.approved_at,
            })
          }
        })

        if (!transactionsError && recentTransactions) {
          recentTransactions.forEach((transaction) => {
            activities.push({
              id: `transaction-${transaction.id}`,
              type: transaction.status === "completed" ? "purchase" : "payment",
              user_email: transaction.user_email,
              description: `${transaction.package_name} প্যাকেজের জন্য ${transaction.status === "completed" ? "পেমেন্ট সম্পন্ন" : "পেমেন্ট রিকোয়েস্ট"}`,
              created_at: transaction.created_at,
            })
          })
        }

        activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setRecentActivity(activities.slice(0, 10))
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error)
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
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
    )
  }

  const statCards = [
    {
      title: "মোট ইউজার",
      value: userStats?.total_users || 0,
      icon: Users,
      description: `আজ নতুন: ${userStats?.new_today || 0}`,
      color: "text-blue-600",
    },
    {
      title: "অনুমোদনের অপেক্ষায়",
      value: userStats?.pending_users || 0,
      icon: Clock,
      description: `এই সপ্তাহে: ${userStats?.new_this_week || 0}`,
      color: "text-yellow-600",
    },
    {
      title: "অনুমোদিত ইউজার",
      value: userStats?.approved_users || 0,
      icon: UserCheck,
      description: `এই মাসে: ${userStats?.new_this_month || 0}`,
      color: "text-green-600",
    },
    {
      title: "প্রত্যাখ্যাত ইউজার",
      value: userStats?.rejected_users || 0,
      icon: UserX,
      description: `স্থগিত: ${userStats?.suspended_users || 0}`,
      color: "text-red-600",
    },
  ]

  const revenueCards = [
    {
      title: "মোট আয়",
      value: `৳${transactionStats?.total_revenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      description: `আজকের আয়: ৳${transactionStats?.revenue_today?.toFixed(2) || "0.00"}`,
      color: "text-green-600",
    },
    {
      title: "সম্পন্ন লেনদেন",
      value: transactionStats?.completed_transactions || 0,
      icon: TrendingUp,
      description: `অপেক্ষমান: ${transactionStats?.pending_transactions || 0}`,
      color: "text-blue-600",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "signup":
        return { icon: Users, color: "bg-blue-500" }
      case "approval":
        return { icon: UserCheck, color: "bg-green-500" }
      case "rejection":
        return { icon: UserX, color: "bg-red-500" }
      case "payment":
        return { icon: Clock, color: "bg-yellow-500" }
      case "purchase":
        return { icon: DollarSign, color: "bg-purple-500" }
      default:
        return { icon: AlertTriangle, color: "bg-gray-500" }
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "এখনই"
    if (diffInMinutes < 60) return `${diffInMinutes} মিনিট আগে`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} ঘন্টা আগে`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} দিন আগে`
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">দ্রুত পরিসংখ্যান</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Revenue Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">আর্থিক পরিসংখ্যান</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {revenueCards.map((card, index) => {
            const Icon = card.icon
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">চার্ট ও গ্রাফ</TabsTrigger>
          <TabsTrigger value="advanced">উন্নত বিশ্লেষণ</TabsTrigger>
          <TabsTrigger value="activity">সাম্প্রতিক কার্যকলাপ</TabsTrigger>
        </TabsList>

        <TabsContent value="charts">
          <AnalyticsCharts />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedAnalytics />
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>সাম্প্রতিক কার্যকলাপ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => {
                    const { icon: Icon, color } = getActivityIcon(activity.type)
                    return (
                      <div key={activity.id} className="flex items-center space-x-4">
                        <div className={`w-2 h-2 ${color} rounded-full`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user_email} • {formatTimeAgo(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                    <p>কোন সাম্প্রতিক কার্যকলাপ নেই</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
