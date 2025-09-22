"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Key, LogOut, Clock, CheckCircle, AlertTriangle, History, Monitor, Smartphone } from "lucide-react"
import { useState, useEffect } from "react"
import ThemeToggle from "@/components/theme-toggle"
import Link from "next/link"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const [loginHistory, setLoginHistory] = useState([])
  const [deviceInfo, setDeviceInfo] = useState<any>(null)

  useEffect(() => {
    loadLoginHistory()
    getDeviceInfo()
  }, [])

  const loadLoginHistory = async () => {
    try {
      // Mock login history data
      const mockHistory = [
        {
          id: 1,
          ip_address: "192.168.1.100",
          device_info: "Chrome on Windows",
          login_status: "success",
          login_attempt_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          logout_at: null,
        },
        {
          id: 2,
          ip_address: "192.168.1.100",
          device_info: "Chrome on Windows",
          login_status: "success",
          login_attempt_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          logout_at: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 3,
          ip_address: "192.168.1.101",
          device_info: "Safari on iPhone",
          login_status: "failed",
          login_attempt_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          logout_at: null,
        },
      ]
      setLoginHistory(mockHistory)
    } catch (error) {
      console.error("Failed to load login history:", error)
    }
  }

  const getDeviceInfo = () => {
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }
    setDeviceInfo(info)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("bn-BD", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getDeviceIcon = (deviceInfo: string) => {
    if (
      deviceInfo.toLowerCase().includes("mobile") ||
      deviceInfo.toLowerCase().includes("iphone") ||
      deviceInfo.toLowerCase().includes("android")
    ) {
      return <Smartphone className="w-4 h-4" />
    }
    return <Monitor className="w-4 h-4" />
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeToggle />
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <User className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="icon" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pt-16">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">প্রোফাইল</h1>
          <p className="text-muted-foreground">আপনার অ্যাকাউন্টের বিস্তারিত তথ্য</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">প্রোফাইল</TabsTrigger>
            <TabsTrigger value="history">লগইন ইতিহাস</TabsTrigger>
            <TabsTrigger value="device">ডিভাইস তথ্য</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  ব্যক্তিগত তথ্য
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">পূর্ণ নাম</Label>
                    <p className="font-medium text-lg">{user.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Telegram Username</Label>
                    <p className="font-medium text-lg">@{user.telegram_username}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">অ্যাকাউন্ট স্ট্যাটাস</Label>
                    <div className="mt-1">
                      <Badge
                        className={
                          user.status === "approved"
                            ? "bg-green-500/10 text-green-600 border-green-500/20"
                            : user.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                        }
                      >
                        {user.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {user.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                        {user.status === "blocked" && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {user.status === "approved" ? "অনুমোদিত" : user.status === "pending" ? "অপেক্ষমান" : "ব্লক করা"}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">বর্তমান IP</Label>
                    <p className="font-mono text-lg text-primary">{user.current_ip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Key তথ্য
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground">Key Expiry</Label>
                    {user.key_expires_at ? (
                      <p className="font-medium text-lg">{formatDate(user.key_expires_at)}</p>
                    ) : (
                      <p className="text-muted-foreground">কোন expiry date নেই</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">শেষ লগইন</Label>
                    {user.last_login_at ? (
                      <p className="font-medium text-lg">{formatDate(user.last_login_at)}</p>
                    ) : (
                      <p className="text-muted-foreground">তথ্য নেই</p>
                    )}
                  </div>
                </div>
                <Button asChild className="w-full md:w-auto">
                  <Link href="/dashboard">Key পরিবর্তন করুন</Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  লগইন ইতিহাস
                </CardTitle>
                <CardDescription>আপনার সাম্প্রতিক লগইন কার্যক্রমের তথ্য</CardDescription>
              </CardHeader>
              <CardContent>
                {loginHistory.length > 0 ? (
                  <div className="space-y-3">
                    {loginHistory.map((login: any) => (
                      <div
                        key={login.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(login.login_status)}
                          <div>
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(login.device_info)}
                              <p className="font-medium">{login.device_info}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">IP: {login.ip_address}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(login.login_attempt_at)}</p>
                          </div>
                        </div>
                        <Badge variant={login.login_status === "success" ? "default" : "destructive"}>
                          {login.login_status === "success" ? "সফল" : "ব্যর্থ"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">কোন লগইন ইতিহাস পাওয়া যায়নি</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="device" className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  ডিভাইস তথ্য
                </CardTitle>
                <CardDescription>আপনার বর্তমান ডিভাইস এবং ব্রাউজারের তথ্য</CardDescription>
              </CardHeader>
              <CardContent>
                {deviceInfo ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Platform</Label>
                      <p className="font-medium">{deviceInfo.platform}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Language</Label>
                      <p className="font-medium">{deviceInfo.language}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Screen Resolution</Label>
                      <p className="font-medium">{deviceInfo.screenResolution}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Timezone</Label>
                      <p className="font-medium">{deviceInfo.timezone}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Cookie Enabled</Label>
                      <p className="font-medium">{deviceInfo.cookieEnabled ? "হ্যাঁ" : "না"}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Online Status</Label>
                      <p className="font-medium">{deviceInfo.onLine ? "অনলাইন" : "অফলাইন"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <Label className="text-sm text-muted-foreground">User Agent</Label>
                      <p className="font-mono text-sm bg-muted/50 p-2 rounded mt-1 break-all">{deviceInfo.userAgent}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">ডিভাইস তথ্য লোড হচ্ছে...</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
