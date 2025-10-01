"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminAuthService } from "@/lib/admin-auth-service"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Shield, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react"
import AuthThemeToggle from "@/components/auth-theme-toggle"
import { useNetwork } from "@/contexts/network-context"
import NoInternet from "@/components/no-internet"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { admin, login } = useAdminAuth()
  const { isOnline, retryConnection, isReconnecting } = useNetwork()

  useEffect(() => {
    if (admin) {
      console.log("[v0] Admin already logged in, redirecting to dashboard")
      router.replace("/adminbilla")
    }
  }, [admin, router])

  if (admin) {
    return null
  }

  // Show no internet page if offline
  if (!isOnline) {
    return <NoInternet onRetry={retryConnection} isReconnecting={isReconnecting} />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Attempting login with:", credentials.username)
      const result = await AdminAuthService.login(credentials)
      console.log("[v0] Login successful, calling login function")
      login(result.admin, result.sessionToken)

      router.replace("/adminbilla")
    } catch (error: any) {
      console.error("[v0] Admin login error:", error)
      setError(error.message || "লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।")
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <AuthThemeToggle />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-orange-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/5 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Floating particles */}
        <div
          className="absolute top-20 left-20 w-2 h-2 bg-red-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="absolute top-40 right-32 w-1.5 h-1.5 bg-orange-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-32 left-16 w-2.5 h-2.5 bg-red-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute bottom-20 right-20 w-1 h-1 bg-orange-400/60 rounded-full animate-bounce"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Login Card */}
        <div className="glass-card p-8 rounded-3xl shadow-2xl border-0 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <Shield className="w-10 h-10 text-white relative z-10" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              অ্যাডমিন প্যানেল
            </h1>
            <p className="text-muted-foreground">সুরক্ষিত অ্যাডমিন লগইন</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 text-sm text-red-600 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-foreground">
                অ্যাডমিন ইউজারনেম
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="অ্যাডমিন ইউজারনেম লিখুন"
                  className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                পাসওয়ার্ড
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="পাসওয়ার্ড লিখুন"
                  className="pl-10 pr-12 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  লগইন হচ্ছে...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  লগইন
                </div>
              )}
            </Button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">এটি একটি সুরক্ষিত অ্যাডমিন প্যানেল। আপনার লগইন তথ্য এনক্রিপ্ট করা।</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">© 2025 UGen Pro. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </div>
  )
}
