"use client"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, MessageCircle, Calendar, LogOut, Settings, Shield, Clock, CheckCircle, Activity } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
    } catch (error) {
      console.error("[v0] Logout error:", error)
    } finally {
      setLoggingOut(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-4 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-balance">স্বাগতম, {user?.full_name}!</h1>
              <p className="text-muted-foreground mt-1">আপনার ড্যাশবোর্ডে আপনাকে স্বাগতম</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                সেটিংস
              </Button>
              <Button variant="destructive" size="sm" onClick={handleLogout} disabled={loggingOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {loggingOut ? "লগআউট হচ্ছে..." : "লগআউট"}
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">অ্যাকাউন্ট স্ট্যাটাস</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">সক্রিয়</div>
                <p className="text-xs text-muted-foreground">আপনার অ্যাকাউন্ট সম্পূর্ণ সক্রিয়</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">সদস্যতার সময়</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.created_at
                    ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24))
                    : 0}
                </div>
                <p className="text-xs text-muted-foreground">দিন</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">নিরাপত্তা স্কোর</CardTitle>
                <Shield className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">১০০%</div>
                <p className="text-xs text-muted-foreground">সম্পূর্ণ নিরাপদ</p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">সর্বশেষ লগইন</CardTitle>
                <Clock className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">এখনই</div>
                <p className="text-xs text-muted-foreground">সক্রিয় সেশন</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    প্রোফাইল তথ্য
                  </CardTitle>
                  <CardDescription>আপনার অ্যাকাউন্টের বিস্তারিত তথ্য</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                        {user?.full_name ? getInitials(user.full_name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">{user?.full_name}</h3>
                      <Badge variant="secondary" className="mt-1">
                        <MessageCircle className="h-3 w-3 mr-1" />@{user?.telegram_username}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-muted/20">
                      <span className="text-sm text-muted-foreground">পূর্ণ নাম</span>
                      <span className="text-sm font-medium">{user?.full_name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-muted/20">
                      <span className="text-sm text-muted-foreground">টেলিগ্রাম ইউজারনেম</span>
                      <span className="text-sm font-medium">@{user?.telegram_username}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-muted/20">
                      <span className="text-sm text-muted-foreground">যোগদানের তারিখ</span>
                      <span className="text-sm font-medium">
                        {user?.created_at ? formatDate(user.created_at) : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">অ্যাকাউন্ট স্ট্যাটাস</span>
                      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        সক্রিয়
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Activity & Features */}
            <div className="lg:col-span-2 space-y-6">
              {/* Welcome Message */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    স্বাগতম বার্তা
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      আপনার নতুন অ্যাকাউন্টে স্বাগতম! এই ড্যাশবোর্ড থেকে আপনি আপনার প্রোফাইল পরিচালনা করতে পারবেন এবং সিস্টেমের সব ফিচার
                      ব্যবহার করতে পারবেন।
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">নিরাপদ লগইন</Badge>
                      <Badge variant="outline">এনক্রিপ্টেড ডাটা</Badge>
                      <Badge variant="outline">২৪/৭ সাপোর্ট</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>দ্রুত অ্যাকশন</CardTitle>
                  <CardDescription>সাধারণ কাজগুলো দ্রুত সম্পন্ন করুন</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2 bg-transparent">
                      <Settings className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">প্রোফাইল আপডেট</div>
                        <div className="text-xs text-muted-foreground">আপনার তথ্য পরিবর্তন করুন</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-start space-y-2 bg-transparent">
                      <Shield className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">নিরাপত্তা সেটিংস</div>
                        <div className="text-xs text-muted-foreground">পাসওয়ার্ড পরিবর্তন করুন</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>সিস্টেম স্ট্যাটাস</CardTitle>
                  <CardDescription>সিস্টেমের বর্তমান অবস্থা</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">ডাটাবেজ সংযোগ</span>
                      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        সক্রিয়
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Authentication সার্ভিস</span>
                      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        সক্রিয়
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API সার্ভিস</span>
                      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        সক্রিয়
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
