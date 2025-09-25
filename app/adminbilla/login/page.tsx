"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminAuthService } from "@/lib/admin-auth-service"
import { useAdminAuth } from "@/lib/admin-auth-context"
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

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

  useEffect(() => {
    if (admin) {
      console.log("[v0] Admin already logged in, redirecting to dashboard")
      router.replace("/adminbilla")
    }
  }, [admin, router])

  if (admin) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await AdminAuthService.login(credentials)
      console.log("[v0] Login successful, calling login function")
      login(result.admin, result.sessionToken)

      setTimeout(() => {
        router.replace("/adminbilla")
      }, 100)
    } catch (error: any) {
      console.log("[v0] Login failed:", error.message)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = () => {
    setCredentials({
      username: "admin",
      password: "admin123",
    })
  }

  return (
    <div className="min-h-screen auth-container flex items-center justify-center p-4">
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
      </div>

      <div className="w-full max-w-md relative">
        {/* Main Login Card */}
        <div className="glass-card p-8 rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <Shield className="w-10 h-10 text-white relative z-10" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Admin Panel
            </h1>
            <p className="text-muted-foreground">Secure Admin Login</p>
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
                Admin Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  placeholder="Enter admin username"
                  className="pl-10 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
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
                  Logging in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Login
                </div>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-800 dark:text-blue-200">Demo Account</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-700 dark:text-blue-300">Username:</span>
                <code className="px-2 py-1 bg-blue-100/50 dark:bg-blue-800/30 rounded text-blue-800 dark:text-blue-200 font-mono">
                  admin
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700 dark:text-blue-300">Password:</span>
                <code className="px-2 py-1 bg-blue-100/50 dark:bg-blue-800/30 rounded text-blue-800 dark:text-blue-200 font-mono">
                  admin123
                </code>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillDemoCredentials}
              className="w-full mt-3 border-blue-200/50 dark:border-blue-800/50 text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/30 bg-transparent"
            >
              Use Demo Credentials
            </Button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">This is a secure admin panel. Your login information is encrypted.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">© 2025 User Agent Generator. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
