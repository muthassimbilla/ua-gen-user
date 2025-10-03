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
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { AdminUserService, type AdminUser } from "@/lib/admin-user-service"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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
    },
    {
      title: "Device Monitoring",
      description: "Track user devices and IP addresses",
      icon: Smartphone,
      href: "/adminbilla/device-monitoring",
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
    },
    {
      title: "Active Users",
      value: activeUsers.toString(),
      change: activeGrowth,
      icon: Activity,
    },
    {
      title: "System Status",
      value: "Active",
      change: "99.9%",
      icon: CheckCircle,
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
        return <Users className="w-4 h-4" />
      case "CheckCircle":
        return <CheckCircle className="w-4 h-4" />
      case "LogIn":
        return <LogIn className="w-4 h-4" />
      case "Shield":
        return <Shield className="w-4 h-4" />
      case "Settings":
        return <Settings className="w-4 h-4" />
      case "Globe":
        return <Globe className="w-4 h-4" />
      case "UserPlus":
        return <UserPlus className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {admin?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
              {autoRefresh && (
                <Badge variant="secondary" className="text-xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} id="auto-refresh-dashboard" />
              <label htmlFor="auto-refresh-dashboard" className="text-sm">
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
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingData ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {isLoadingData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary">{stat.change}</Badge>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Card className="hover:border-primary transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Latest system events and user actions</p>
            </div>
            <Button onClick={loadRecentActivities} variant="outline" size="sm" disabled={isLoadingActivities}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingActivities ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingActivities ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse p-4 rounded-lg bg-muted/50">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {getActivityIcon(activity.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-foreground truncate">{activity.action}</span>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {activity.user}
                        {activity.email && <span className="text-primary"> ({activity.email})</span>}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(activity.time)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-1">No Recent Activity</h3>
                  <p className="text-sm text-muted-foreground">
                    Activity will appear here as users interact with the system
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
