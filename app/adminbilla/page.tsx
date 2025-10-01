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
    <div className="space-y-6 lg:space-y-8 pb-8">
      {/* Modern Header with Gradient */}
      <div className="relative glass-card p-6 lg:p-8 rounded-3xl overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-pink-500/10 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground text-sm lg:text-base">Welcome back, {admin?.full_name}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/50 backdrop-blur-sm">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              {autoRefresh && (
                <Badge variant="secondary" className="text-xs px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                  <Activity className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                  Live
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} id="auto-refresh-dashboard" />
              <label htmlFor="auto-refresh-dashboard" className="text-sm font-medium text-foreground cursor-pointer">
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
              className="px-4 py-2 h-auto bg-background/50 hover:bg-background transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingData ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoadingData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 lg:p-8 rounded-3xl animate-pulse">
              <div className="h-24 bg-muted/50 rounded-2xl"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="relative group glass-card p-6 lg:p-8 rounded-3xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4 lg:mb-6">
                    <div
                      className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${stat.bgColor} ${stat.textColor} border border-current/20`}>
                      {stat.change}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl lg:text-4xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm lg:text-base text-muted-foreground font-medium">{stat.title}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 lg:mb-8">Quick Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <div className="relative group glass-card p-6 lg:p-8 rounded-3xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer overflow-hidden">
                  {/* Hover Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative z-10 flex items-start space-x-4 lg:space-x-5">
                    <div
                      className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                    >
                      <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    <div className="flex-1 min-w-0 pt-2">
                      <h3 className="text-lg lg:text-xl font-bold text-foreground mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">{item.description}</p>
                      <div className="mt-3 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                        View Details
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card p-6 lg:p-8 rounded-3xl">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">Recent Activity</h2>
            <p className="text-sm text-muted-foreground">Latest system events and user actions</p>
          </div>
          <Button
            onClick={loadRecentActivities}
            variant="outline"
            size="sm"
            disabled={isLoadingActivities}
            className="text-sm bg-background/50 hover:bg-background transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingActivities ? "animate-spin spinner" : ""}`} />
            Refresh
          </Button>
        </div>

        {isLoadingActivities ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse p-4 rounded-2xl bg-muted/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted/50"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-muted/50 rounded w-3/4"></div>
                    <div className="h-3 bg-muted/50 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div
                  key={activity.id || index}
                  className="group flex items-center space-x-4 p-4 lg:p-5 rounded-2xl hover:bg-muted/30 transition-all duration-300 border border-border/50 hover:border-primary/30 hover:shadow-lg"
                >
                  <div
                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center ${getActivityColor(activity.color)} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {getActivityIcon(activity.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-sm lg:text-base font-bold text-foreground truncate">{activity.action}</div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getActivityColor(activity.color).replace("bg-", "bg-").replace("text-", "text-")} border-current/30`}
                      >
                        {activity.type}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground truncate mb-1 font-medium">
                      {activity.user} 
                      {activity.email && <span className="text-primary">({activity.email})</span>}
                      {!activity.email && activity.username && <span className="text-primary">(@{activity.username})</span>}
                    </div>
                    {activity.details && (
                      <div className="text-xs text-muted-foreground/80 truncate mb-2">{activity.details}</div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground/60" />
                      <div className="text-xs text-muted-foreground/60 font-medium">{getTimeAgo(activity.time)}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center mx-auto mb-6">
                  <Activity className="w-10 h-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Recent Activity</h3>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
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
