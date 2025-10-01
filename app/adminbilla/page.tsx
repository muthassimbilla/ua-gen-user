"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminAuth } from "@/lib/admin-auth-context"
import {
  Users,
  Activity,
  Clock,
  CheckCircle,
  Smartphone,
  RefreshCw,
  LogIn,
  Globe,
  UserPlus,
  Shield,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { AdminUserService, type AdminUser } from "@/lib/admin-user-service"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboard() {
  const { admin, isLoading } = useAdminAuth()
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(true)

  useEffect(() => {
    if (!isLoading && !admin) {
      router.replace("/404")
    }
  }, [admin, isLoading, router])

  const loadRecentActivities = async () => {
    try {
      setIsLoadingActivities(true)
      const response = await fetch("/api/admin/recent-activity", {
        headers: {
          Authorization: `Bearer ${admin?.id || "admin-token"}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRecentActivities(data.data || [])
      } else {
        console.error("Failed to load recent activities:", response.status)
      }
    } catch (error) {
      console.error("Error loading recent activities:", error)
    } finally {
      setIsLoadingActivities(false)
    }
  }

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const userData = await AdminUserService.getAllUsers()
        setUsers(userData)
        setLastUpdated(new Date())
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setIsLoadingData(false)
      }
    }

    if (admin) {
      loadDashboardData()
      loadRecentActivities()
    }
  }, [admin])

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || !admin) return

    const interval = setInterval(() => {
      const loadDashboardData = async () => {
        try {
          const userData = await AdminUserService.getAllUsers()
          setUsers(userData)
          setLastUpdated(new Date())
        } catch (error) {
          console.error("Error loading dashboard data:", error)
        }
      }
      loadDashboardData()
      loadRecentActivities()
    }, 15000) // Refresh every 15 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, admin])

  if (!isLoading && !admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <h1 className="text-9xl font-bold text-muted-foreground/20">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-muted-foreground">The page you are looking for does not exist.</p>
          <Button onClick={() => router.push("/")} variant="default" className="mt-4">
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  if (isLoading || !admin) {
    return null
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

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case "Users":
        return <Users className="w-4 h-4 lg:w-5 lg:h-5" />
      case "CheckCircle":
        return <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
      case "LogIn":
        return <LogIn className="w-4 h-4 lg:w-5 lg:h-5" />
      case "Shield":
        return <Shield className="w-4 h-4 lg:w-5 lg:h-5" />
      case "Settings":
        return <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
      case "Globe":
        return <Globe className="w-4 h-4 lg:w-5 lg:h-5" />
      case "UserPlus":
        return <UserPlus className="w-4 h-4 lg:w-5 lg:h-5" />
      default:
        return <Activity className="w-4 h-4 lg:w-5 lg:h-5" />
    }
  }

  const getActivityColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400"
      case "green":
        return "bg-green-500/10 text-green-600 dark:text-green-400"
      case "purple":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400"
      case "orange":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400"
      case "red":
        return "bg-red-500/10 text-red-600 dark:text-red-400"
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="glass-card p-3 lg:p-4 rounded-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm lg:text-base">Welcome, {admin?.full_name}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              {autoRefresh && (
                <Badge variant="secondary" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} id="auto-refresh-dashboard" />
              <label htmlFor="auto-refresh-dashboard" className="text-sm text-muted-foreground">
                Auto Refresh
              </label>
            </div>
            <Button
              onClick={() => {
                const loadDashboardData = async () => {
                  try {
                    setIsLoadingData(true)
                    const userData = await AdminUserService.getAllUsers()
                    setUsers(userData)
                    setLastUpdated(new Date())
                  } catch (error) {
                    console.error("Error loading dashboard data:", error)
                  } finally {
                    setIsLoadingData(false)
                  }
                }
                loadDashboardData()
              }}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {isLoadingData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-4 lg:p-6 rounded-2xl animate-pulse">
              <div className="h-20 bg-muted/50 rounded"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
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
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-semibold text-foreground">Recent Activity</h2>
          <Button
            onClick={loadRecentActivities}
            variant="outline"
            size="sm"
            disabled={isLoadingActivities}
            className="text-xs bg-transparent"
          >
            <RefreshCw className={`w-3 h-3 mr-2 ${isLoadingActivities ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {isLoadingActivities ? (
          <div className="space-y-3 lg:space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3 lg:space-x-4 p-2 lg:p-3">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-muted/50"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                    <div className="h-3 bg-muted/50 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="flex items-center space-x-3 lg:space-x-4 p-3 lg:p-4 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border/50"
                >
                  <div
                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${getActivityColor(activity.color)}`}
                  >
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-sm font-semibold text-foreground truncate">{activity.action}</div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getActivityColor(activity.color).replace("bg-", "bg-").replace("text-", "text-")}`}
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground truncate mb-1">
                      {activity.user} {activity.username && `(@${activity.username})`}
                    </div>
                    {activity.details && (
                      <div className="text-xs text-muted-foreground/80 truncate">{activity.details}</div>
                    )}
                    <div className="text-xs text-muted-foreground/60 mt-1">{getTimeAgo(activity.time)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Recent Activity</h3>
                <p className="text-muted-foreground text-sm">
                  Activity will appear here as users interact with the system
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
