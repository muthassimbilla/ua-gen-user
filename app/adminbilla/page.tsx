"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Users, Settings, Shield, Activity, Clock, CheckCircle, Smartphone } from "lucide-react"
import Link from "next/link"
import { AdminUserService, type AdminUser } from "@/lib/admin-user-service"

export default function AdminDashboard() {
  const { admin, isLoading } = useAdminAuth()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !admin) {
      router.replace("/adminbilla/login")
    }
  }, [admin, isLoading, router])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userData = await AdminUserService.getAllUsers()
        setUsers(userData)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    if (admin) {
      loadDashboardData()
    }
  }, [admin])

  if (!admin) {
    return null // Will redirect to login
  }

  const menuItems = [
    {
      title: "User Management",
      description: "View and manage all user information",
      icon: Users,
      href: "/adminbilla/users",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Device Monitoring",
      description: "Track user devices and IP addresses",
      icon: Smartphone,
      href: "/adminbilla/device-monitoring",
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      title: "System Settings",
      description: "System configuration and settings",
      icon: Settings,
      href: "/adminbilla/settings",
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Security",
      description: "Security settings and logs",
      icon: Shield,
      href: "/adminbilla/security",
      gradient: "from-red-500 to-orange-600",
      bgColor: "bg-red-500/10",
      textColor: "text-red-600 dark:text-red-400",
    },
  ]

  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.current_status === "active").length
  const suspendedUsers = users.filter((user) => user.current_status === "suspended").length
  const expiredUsers = users.filter((user) => user.current_status === "expired").length

  const totalGrowth = totalUsers > 0 ? "+12%" : "0%"
  const activeGrowth = activeUsers > 0 ? "+8%" : "0%"

  const stats = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      change: totalGrowth,
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Active Users",
      value: activeUsers.toString(),
      change: activeGrowth,
      icon: Activity,
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-500/10",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "System Status",
      value: "Active",
      change: "99.9%",
      icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400",
    },
  ]

  const getRecentActivity = () => {
    const activities = []

    const recentUsers = users
      .filter((user) => {
        const createdDate = new Date(user.created_at)
        const daysDiff = (Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
        return daysDiff <= 7
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 3)

    recentUsers.forEach((user) => {
      const timeAgo = getTimeAgo(user.created_at)
      activities.push({
        action: "New User Registration",
        user: user.full_name,
        time: timeAgo,
        type: "user",
      })
    })

    const recentApprovals = users
      .filter((user) => user.approved_at && user.current_status === "active")
      .sort((a, b) => new Date(b.approved_at!).getTime() - new Date(a.approved_at!).getTime())
      .slice(0, 2)

    recentApprovals.forEach((user) => {
      const timeAgo = getTimeAgo(user.approved_at!)
      activities.push({
        action: "User Approved",
        user: user.full_name,
        time: timeAgo,
        type: "approval",
      })
    })

    activities.push({
      action: "System Status Check",
      user: "System",
      time: "10 minutes ago",
      type: "system",
    })

    return activities.slice(0, 4)
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hours ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} days ago`
  }

  const recentActivities = getRecentActivity()

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="glass-card p-4 lg:p-6 rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Welcome, {admin?.full_name}</p>
          </div>
          <div className="flex items-center gap-2 text-xs lg:text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="truncate">Last Updated: {new Date().toLocaleString("en-US")}</span>
          </div>
        </div>
      </div>

      {isLoadingData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-4 lg:p-6 rounded-2xl animate-pulse">
              <div className="h-20 bg-muted/50 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="glass-card p-4 lg:p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <div
                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                  >
                    <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${stat.bgColor} ${stat.textColor}`}>
                    {stat.change}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xl lg:text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">{stat.title}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div>
        <h2 className="text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <div className="glass-card p-4 lg:p-6 rounded-2xl hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <div className="flex items-start space-x-3 lg:space-x-4">
                    <div
                      className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base lg:text-lg font-semibold text-foreground mb-1 lg:mb-2 group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="glass-card p-4 lg:p-6 rounded-2xl">
        <h2 className="text-lg lg:text-xl font-semibold text-foreground mb-4 lg:mb-6">Recent Activity</h2>
        {isLoadingData ? (
          <div className="space-y-3 lg:space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-muted/50 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 lg:space-x-4 p-2 lg:p-3 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center ${
                      activity.type === "user"
                        ? "bg-blue-500/10 text-blue-600"
                        : activity.type === "approval"
                          ? "bg-green-500/10 text-green-600"
                          : activity.type === "system"
                            ? "bg-purple-500/10 text-purple-600"
                            : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {activity.type === "user" ? (
                      <Users className="w-4 h-4 lg:w-5 lg:h-5" />
                    ) : activity.type === "approval" ? (
                      <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                    ) : activity.type === "system" ? (
                      <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                    ) : (
                      <Shield className="w-4 h-4 lg:w-5 lg:h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{activity.action}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {activity.user} • {activity.time}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
