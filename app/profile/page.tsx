"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Calendar, 
  Shield,
  LogOut, 
  Clock, 
  AlertTriangle, 
  Settings, 
  Eye, 
  Key, 
  Database, 
  Activity,
  Globe,
  CheckCircle,
  XCircle,
  Crown,
  Zap,
  Heart
} from "lucide-react"
import { UserIPDisplay } from "@/components/user-ip-display"
import { useState, useEffect } from "react"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [deviceCount, setDeviceCount] = useState<number>(0)
  const [isLoadingDevices, setIsLoadingDevices] = useState(true)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // Load device count
  useEffect(() => {
    const loadDeviceCount = async () => {
      try {
        setIsLoadingDevices(true)
        const response = await fetch("/api/user/device-count")
        if (response.ok) {
          const data = await response.json()
          setDeviceCount(data.data.device_count || 0)
        }
      } catch (error) {
        console.error("Error loading device count:", error)
      } finally {
        setIsLoadingDevices(false)
      }
    }

    if (user) {
      loadDeviceCount()
    }
  }, [user])

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Unknown"
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Unknown"
      
      return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Unknown"
    }
  }

  const getExpirationInfo = () => {
    if (!user?.expiration_date) {
      return {
        hasExpiration: false,
        daysRemaining: null,
        isExpired: false,
        expirationDate: null
      }
    }

    try {
      const expirationDate = new Date(user.expiration_date)
      const now = new Date()
      const timeDiff = expirationDate.getTime() - now.getTime()
      const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))
      const isExpired = daysRemaining <= 0

      return {
        hasExpiration: true,
        daysRemaining: daysRemaining,
        isExpired: isExpired,
        expirationDate: expirationDate
      }
    } catch (error) {
      console.error("Expiration date parsing error:", error)
      return {
        hasExpiration: false,
        daysRemaining: null,
        isExpired: false,
        expirationDate: null
      }
    }
  }

  const expirationInfo = getExpirationInfo()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl" />
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl" />
              
              <div className="relative glass-card p-8 rounded-3xl">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                        {user?.full_name?.charAt(0) || "U"}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-900">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
            <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {user?.full_name || "User"}
                      </h1>
                      <p className="text-xl text-muted-foreground mt-1">
                        @{user?.telegram_username || "username"}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                          <Shield className="w-3 h-3 mr-1" />
                          Active Account
                        </Badge>
                        <Badge variant="outline" className="border-blue-200 text-blue-700">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium User
                        </Badge>
                      </div>
                    </div>
            </div>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="bg-white/50 backdrop-blur-sm border-white/20 hover:bg-white/70 transition-all duration-300"
                  >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass-card border-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Status</p>
                      <p className="text-2xl font-bold text-green-600">Active</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {formatDate(user?.created_at).split(' ')[1]}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card border-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                      <p className="text-2xl font-bold text-orange-600">Premium</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

          </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information */}
              <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  Personal Information
                </CardTitle>
                <CardDescription>Your account's main information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-sm font-medium text-muted-foreground">Full Name</span>
                      <span className="font-semibold">{user?.full_name || "Not provided"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-sm font-medium text-muted-foreground">Telegram Username</span>
                      <span className="font-semibold">@{user?.telegram_username || "Not provided"}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-sm font-medium text-muted-foreground">Account Created</span>
                      <span className="font-semibold">{formatDate(user?.created_at)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
                      <span className="font-semibold">{formatDate(user?.updated_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Expiration */}
              <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    Account Expiration
                  </CardTitle>
                  <CardDescription>Your account validity information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expirationInfo.hasExpiration ? (
                    <div className="space-y-4">
                      <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                        <div className="text-4xl font-bold text-orange-600 mb-2">
                          {expirationInfo.daysRemaining}
                        </div>
                        <div className="text-sm text-muted-foreground">Days Remaining</div>
                  </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <span className="text-sm font-medium text-muted-foreground">Expiration Date</span>
                          <span className="font-semibold">
                            {expirationInfo.expirationDate?.toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                  </div>

                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                          <span className="text-sm font-medium text-muted-foreground">Status</span>
                          <Badge 
                            variant={expirationInfo.isExpired ? "destructive" : expirationInfo.daysRemaining! <= 7 ? "secondary" : "default"}
                          >
                            {expirationInfo.isExpired ? "Expired" : expirationInfo.daysRemaining! <= 7 ? "Expiring Soon" : "Active"}
                        </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-lg font-semibold text-green-600 mb-2">No Expiration</div>
                      <div className="text-sm text-muted-foreground">Your account has no expiration date</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Access System */}
              <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                      <Key className="w-5 h-5 text-white" />
                    </div>
                    Access System
                  </CardTitle>
                  <CardDescription>Your account access and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                      <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">Account Status</div>
                      <div className="text-sm font-semibold text-green-600">Active</div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                        <Crown className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">Account Type</div>
                      <div className="text-sm font-semibold text-blue-600">Premium</div>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-center">
                      <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="text-xs font-medium text-muted-foreground">Account Duration</div>
                      <div className="text-sm font-semibold text-orange-600">Lifetime</div>
                    </div>
                    
                  </div>

                </CardContent>
              </Card>
                </div>

            {/* IP Information */}
            <Card className="glass-card border-0 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                </div>
                  Network Information
                </CardTitle>
                <CardDescription>Your current IP address and device information</CardDescription>
              </CardHeader>
              <CardContent>
                <UserIPDisplay />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}