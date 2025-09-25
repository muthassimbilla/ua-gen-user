"use client"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Shield, LogOut, Settings } from "lucide-react"
import { UserIPDisplay } from "@/components/user-ip-display"

export default function ProfilePage() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground">Your account information and settings</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your account's main information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg font-medium">{user?.full_name}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Telegram Username</label>
                    <p className="text-lg font-medium">@{user?.telegram_username}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Status</label>
                    <div className="flex items-center gap-2 mt-1">
                      {user?.is_approved ? (
                        <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                          <Shield className="w-3 h-3 mr-1" />
                          Approved
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Pending Approval</Badge>
                      )}

                      {user?.is_active && <Badge variant="outline">সক্রিয়</Badge>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">যোগদানের তারিখ</label>
                    <p className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {user?.created_at ? formatDate(user.created_at) : "অজানা"}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Settings className="w-4 h-4 mr-2" />
                    প্রোফাইল সম্পাদনা
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* IP and Device Info */}
            <UserIPDisplay />
          </div>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>অ্যাকাউন্ট নিরাপত্তা</CardTitle>
              <CardDescription>আপনার অ্যাকাউন্টের নিরাপত্তা সম্পর্কিত গুরুত্বপূর্ণ তথ্য</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="font-medium text-blue-600 mb-2">একক ডিভাইস নীতি</h4>
                  <p className="text-sm text-blue-600/80">
                    আপনার Key শুধুমাত্র একটি ডিভাইসে ব্যবহার করা যাবে। নতুন ডিভাইসে লগইন করলে পুরানো ডিভাইস থেকে স্বয়ংক্রিয়ভাবে লগআউট হয়ে
                    যাবেন।
                  </p>
                </div>

                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <h4 className="font-medium text-orange-600 mb-2">IP পরিবর্তন সতর্কতা</h4>
                  <p className="text-sm text-orange-600/80">
                    আপনার IP ঠিকানা পরিবর্তন হলে নিরাপত্তার জন্য স্বয়ংক্রিয়ভাবে লগআউট হয়ে যাবেন। পুনরায় লগইন করতে হবে।
                  </p>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <h4 className="font-medium text-green-600 mb-2">নিরাপদ সেশন</h4>
                  <p className="text-sm text-green-600/80">
                    আপনার সেশন ৭ দিন পর্যন্ত সক্রিয় থাকবে। নিষ্ক্রিয়তার কারণে স্বয়ংক্রিয়ভাবে মেয়াদ শেষ হয়ে যাবে।
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
