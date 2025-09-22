"use client"

import type React from "react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Globe, Calendar, Shield, LogOut, Edit3, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import ThemeToggle from "@/components/theme-toggle"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [newKey, setNewKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [keyHistory, setKeyHistory] = useState([])

  useEffect(() => {
    // Load key usage history
    loadKeyHistory()
  }, [])

  const loadKeyHistory = async () => {
    try {
      // This would fetch from your API
      const mockHistory = [
        {
          id: 1,
          old_key: "OLD_KEY_123",
          new_key: "CURRENT_KEY",
          changed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          changed_by: "user",
        },
      ]
      setKeyHistory(mockHistory)
    } catch (error) {
      console.error("Failed to load key history:", error)
    }
  }

  const handleKeyChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // Here you would call your API to change the key
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call

      setMessage("Key সফলভাবে পরিবর্তন হয়েছে")
      setNewKey("")
      loadKeyHistory()
    } catch (error) {
      setMessage("Key পরিবর্তন করতে ব্যর্থ হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            অনুমোদিত
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="w-3 h-3 mr-1" />
            অপেক্ষমান
          </Badge>
        )
      case "blocked":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            ব্লক করা
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
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

  const getDaysUntilExpiry = () => {
    if (!user?.key_expires_at) return null
    const expiryDate = new Date(user.key_expires_at)
    const today = new Date()
    const diffTime = expiryDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const daysUntilExpiry = getDaysUntilExpiry()

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeToggle />
        <Button variant="outline" size="icon" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6 pt-16">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">ড্যাশবোর্ড</h1>
          <p className="text-muted-foreground">স্বাগতম, {user.full_name}</p>
        </div>

        {/* Key Expiry Warning */}
        {daysUntilExpiry !== null && daysUntilExpiry <= 7 && (
          <Alert variant={daysUntilExpiry <= 3 ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>আপনার Key {daysUntilExpiry} দিন পর expire হবে। অনুগ্রহ করে নতুন Key নিন।</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                ব্যবহারকারীর তথ্য
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">নাম</Label>
                <p className="font-medium">{user.full_name}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Telegram</Label>
                <p className="font-medium">@{user.telegram_username}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">স্ট্যাটাস</Label>
                <div className="mt-1">{getStatusBadge(user.status)}</div>
              </div>
            </CardContent>
          </Card>

          {/* Current IP Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                বর্তমান IP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-2xl font-mono font-bold text-primary">{user.current_ip}</div>
                <p className="text-sm text-muted-foreground">আপনার বর্তমান IP ঠিকানা</p>
              </div>
            </CardContent>
          </Card>

          {/* Key Expiry Card */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Key Expiry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                {user.key_expires_at ? (
                  <>
                    <div
                      className={`text-lg font-bold ${daysUntilExpiry && daysUntilExpiry <= 7 ? "text-red-500" : "text-green-500"}`}
                    >
                      {daysUntilExpiry} দিন বাকি
                    </div>
                    <p className="text-sm text-muted-foreground">{formatDate(user.key_expires_at)}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">কোন expiry date নেই</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Change Section */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Key পরিবর্তন করুন
            </CardTitle>
            <CardDescription>আপনার বর্তমান Key পরিবর্তন করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleKeyChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new_key">নতুন Key</Label>
                <Input
                  id="new_key"
                  type="text"
                  placeholder="নতুন Key লিখুন"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  required
                />
              </div>

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={loading || !newKey}>
                {loading ? "পরিবর্তন করা হচ্ছে..." : "Key পরিবর্তন করুন"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Key Usage History */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Key ব্যবহারের ইতিহাস
            </CardTitle>
            <CardDescription>আপনার পূর্ববর্তী Key পরিবর্তনের তথ্য</CardDescription>
          </CardHeader>
          <CardContent>
            {keyHistory.length > 0 ? (
              <div className="space-y-3">
                {keyHistory.map((history: any) => (
                  <div key={history.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">Key পরিবর্তিত হয়েছে</p>
                      <p className="text-sm text-muted-foreground">{formatDate(history.changed_at)}</p>
                    </div>
                    <Badge variant="outline">{history.changed_by === "user" ? "ব্যবহারকারী" : "অ্যাডমিন"}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">কোন Key পরিবর্তনের ইতিহাস নেই</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
