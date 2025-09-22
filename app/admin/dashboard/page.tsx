"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface User {
  id: string
  telegram_username: string
  status: "pending" | "approved" | "rejected" | "expired"
  created_at: string
  expires_at: string
  current_ip: string
  last_login: string
}

interface Analytics {
  totalUsers: number
  activeUsers: number
  pendingApprovals: number
  expiredKeys: number
  todayLogins: number
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("admin_token")

      // Fetch users
      const usersResponse = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Fetch analytics
      const analyticsResponse = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (usersResponse.ok && analyticsResponse.ok) {
        const usersData = await usersResponse.json()
        const analyticsData = await analyticsResponse.json()

        setUsers(usersData.users)
        setAnalytics(analyticsData)
      } else {
        setError("ডেটা লোড করতে ব্যর্থ")
      }
    } catch (error) {
      setError("সার্ভার এরর")
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: "approve" | "reject") => {
    try {
      const token = localStorage.getItem("admin_token")
      const response = await fetch("/api/admin/user-action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, action }),
      })

      if (response.ok) {
        fetchData() // Refresh data
      } else {
        setError("অ্যাকশন সম্পন্ন করতে ব্যর্থ")
      }
    } catch (error) {
      setError("সার্ভার এরর")
    }
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">অ্যাডমিন প্যানেল</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={logout}>
              লগআউট
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">মোট ইউজার</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">সক্রিয় ইউজার</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{analytics.activeUsers}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">অনুমোদনের অপেক্ষায়</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{analytics.pendingApprovals}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">মেয়াদ শেষ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{analytics.expiredKeys}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">আজকের লগইন</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{analytics.todayLogins}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">অনুমোদনের অপেক্ষায়</TabsTrigger>
            <TabsTrigger value="approved">অনুমোদিত</TabsTrigger>
            <TabsTrigger value="all">সব ইউজার</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>অনুমোদনের অপেক্ষায় থাকা ইউজার</CardTitle>
                <CardDescription>নতুন ইউজারদের অনুমোদন বা প্রত্যাখ্যান করুন</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter((user) => user.status === "pending")
                    .map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">@{user.telegram_username}</p>
                          <p className="text-sm text-muted-foreground">
                            আবেদনের তারিখ: {new Date(user.created_at).toLocaleDateString("bn-BD")}
                          </p>
                          <p className="text-sm text-muted-foreground">IP: {user.current_ip}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleUserAction(user.id, "approve")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            অনুমোদন
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleUserAction(user.id, "reject")}>
                            প্রত্যাখ্যান
                          </Button>
                        </div>
                      </div>
                    ))}
                  {users.filter((user) => user.status === "pending").length === 0 && (
                    <p className="text-center text-muted-foreground py-8">কোন অনুমোদনের অপেক্ষায় থাকা ইউজার নেই</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>অনুমোদিত ইউজার</CardTitle>
                <CardDescription>সক্রিয় ইউজারদের তালিকা</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users
                    .filter((user) => user.status === "approved")
                    .map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">@{user.telegram_username}</p>
                          <p className="text-sm text-muted-foreground">
                            মেয়াদ শেষ: {new Date(user.expires_at).toLocaleDateString("bn-BD")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            শেষ লগইন:{" "}
                            {user.last_login ? new Date(user.last_login).toLocaleDateString("bn-BD") : "কখনো নয়"}
                          </p>
                          <p className="text-sm text-muted-foreground">IP: {user.current_ip}</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          সক্রিয়
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>সব ইউজার</CardTitle>
                <CardDescription>সিস্টেমের সব ইউজারদের তালিকা</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">@{user.telegram_username}</p>
                        <p className="text-sm text-muted-foreground">
                          তৈরি: {new Date(user.created_at).toLocaleDateString("bn-BD")}
                        </p>
                        <p className="text-sm text-muted-foreground">IP: {user.current_ip}</p>
                      </div>
                      <Badge
                        variant={
                          user.status === "approved"
                            ? "secondary"
                            : user.status === "pending"
                              ? "default"
                              : user.status === "expired"
                                ? "destructive"
                                : "outline"
                        }
                        className={
                          user.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : user.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : user.status === "expired"
                                ? "bg-red-100 text-red-800"
                                : ""
                        }
                      >
                        {user.status === "approved"
                          ? "সক্রিয়"
                          : user.status === "pending"
                            ? "অপেক্ষমান"
                            : user.status === "expired"
                              ? "মেয়াদ শেষ"
                              : "প্রত্যাখ্যাত"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
