"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ProtectedRoute } from "@/components/protected-route"
import { Eye, EyeOff, Lock, CheckCircle, XCircle, ArrowLeft, Key, Shield } from "lucide-react"
import AuthThemeToggle from "@/components/auth-theme-toggle"
import { useNetwork } from "@/contexts/network-context"
import NoInternet from "@/components/no-internet"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { isOnline, retryConnection, isReconnecting } = useNetwork()

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Show no internet page if offline
  if (!isOnline) {
    return <NoInternet onRetry={retryConnection} isReconnecting={isReconnecting} />
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    // Validate current password
    if (!formData.currentPassword.trim()) {
      newErrors.push("Current password is required")
    }

    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.push("New password is required")
    } else if (formData.newPassword.length < 6) {
      newErrors.push("New password must be at least 6 characters long")
    }

    // Validate password confirmation
    if (!formData.confirmPassword.trim()) {
      newErrors.push("Password confirmation is required")
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.push("New password and confirmation password do not match")
    }

    // Check if new password is different from current password
    if (formData.currentPassword === formData.newPassword) {
      newErrors.push("New password must be different from current password")
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Prevent multiple submissions
    if (isSubmitting) return

    // Immediate UI feedback
    setIsSubmitting(true)
    setLoading(true)
    setErrors([])
    setSuccessMessage("")

    try {
      // Validate form
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        setLoading(false)
        setIsSubmitting(false)
        return
      }

      // Add timeout to prevent infinite loading
      const changePasswordTimeout = setTimeout(() => {
        setLoading(false)
        setIsSubmitting(false)
        setErrors(["Password change is taking longer than expected. Please try again."])
      }, 15000) // 15 second timeout

      try {
        console.log("[v0] Starting password change process")

        // Get session token from localStorage
        const sessionToken = localStorage.getItem("session_token")

        if (!sessionToken) {
          throw new Error("Session expired. Please login again.")
        }

        // Call change password API
        const response = await fetch("/api/user/change-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionToken}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
          }),
        })

        const data = await response.json()

        clearTimeout(changePasswordTimeout)

        if (!response.ok) {
          throw new Error(data.error || "Failed to change password")
        }

        console.log("[v0] Password changed successfully")

        // Show success message
        setSuccessMessage("Password changed successfully! You will be redirected to your profile.")

        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        // Redirect to profile after 2 seconds
        setTimeout(() => {
          router.push("/profile")
        }, 2000)
      } catch (changePasswordError) {
        clearTimeout(changePasswordTimeout)
        throw changePasswordError
      }
    } catch (error: any) {
      console.error("[v0] Password change error:", error)
      setErrors([error.message || "Failed to change password"])
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Go Back Button */}
        <div className="absolute top-6 left-6 z-20">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 text-blue-600 dark:text-blue-400 hover:bg-white/20 dark:hover:bg-gray-800/30 hover:border-blue-300/50 dark:hover:border-blue-500/50 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to Profile</span>
          </Link>
        </div>

        {/* Theme Toggle Button */}
        <div className="absolute top-6 right-6 z-20">
          <div className="relative group">
            <AuthThemeToggle />
            <div className="absolute -bottom-12 right-0 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Toggle theme
            </div>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Main Change Password Card */}
          <Card className="glass-card p-6 rounded-3xl shadow-2xl border-0 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10">
            {/* Header */}
            <CardHeader className="text-center space-y-2 pb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Key className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Change Password
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Update your account password for better security
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Success Message */}
              {successMessage && (
                <Alert className="border-green-500/30 bg-green-500/10 backdrop-blur-sm rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <AlertDescription className="text-green-400 font-medium">{successMessage}</AlertDescription>
                </Alert>
              )}

              {/* Error Messages */}
              {errors.length > 0 && (
                <Alert variant="destructive" className="backdrop-blur-sm rounded-xl">
                  <XCircle className="h-5 w-5" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {errors.map((error, index) => (
                        <li key={index} className="font-medium">
                          {error}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Change Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Current Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Current Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Enter your current password"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="h-12 pl-12 pr-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 group-hover:border-blue-300/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                      required
                      autoComplete="current-password"
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-blue-500 transition-colors p-1 rounded-md hover:bg-blue-50/50 dark:hover:bg-blue-900/30"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    New Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="h-12 pl-12 pr-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 group-hover:border-green-300/50 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                      required
                      autoComplete="new-password"
                    />
                    <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-green-500 transition-colors p-1 rounded-md hover:bg-green-50/50 dark:hover:bg-green-900/30"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground ml-1">Password must be at least 6 characters long</p>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-semibold text-foreground flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm New Password
                  </Label>
                  <div className="relative group">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter your new password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="h-12 pl-12 pr-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 group-hover:border-green-300/50 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                      required
                      autoComplete="new-password"
                    />
                    <CheckCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-green-500 transition-colors p-1 rounded-md hover:bg-green-50/50 dark:hover:bg-green-900/30"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>

                  {/* Password Match Indicators */}
                  {formData.confirmPassword && (
                    <div className="flex items-center space-x-2 text-xs">
                      {formData.newPassword === formData.confirmPassword ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-green-500 font-medium">Passwords match</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 text-red-500" />
                          <span className="text-red-500 font-medium">Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden active:scale-[0.98] active:shadow-md"
                  disabled={loading || isSubmitting}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="animate-spin spinner h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Changing Password...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Change Password
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-xs text-muted-foreground/70">© 2025 UGen Pro. All rights reserved.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
