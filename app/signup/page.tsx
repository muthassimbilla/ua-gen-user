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
import { AuthService, ValidationUtils, PasswordUtils } from "@/lib/auth-client"
import { setClientFlashMessage } from "@/lib/flash-messages"
import { Eye, EyeOff, User, MessageCircle, Lock, CheckCircle, XCircle, AlertTriangle, Sparkles, Shield, Zap, UserPlus } from "lucide-react"
import AuthThemeToggle from "@/components/auth-theme-toggle"
import { useNetwork } from "@/contexts/network-context"
import NoInternet from "@/components/no-internet"

export default function SignupPage() {
  const router = useRouter()
  const { isOnline, retryConnection, isReconnecting } = useNetwork()
  const [formData, setFormData] = useState({
    full_name: "",
    telegram_username: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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

    // Validate full name
    const nameValidation = ValidationUtils.validateFullName(formData.full_name)
    if (!nameValidation.isValid) {
      newErrors.push(...nameValidation.errors)
    }

    // Validate telegram username
    const usernameValidation = ValidationUtils.validateTelegramUsername(formData.telegram_username)
    if (!usernameValidation.isValid) {
      newErrors.push(...usernameValidation.errors)
    }

    // Validate password
    const passwordValidation = PasswordUtils.validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      newErrors.push(...passwordValidation.errors)
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.push("Password and confirmation password do not match")
    }

    return newErrors
  }

  // Show no internet page if offline
  if (!isOnline) {
    return <NoInternet onRetry={retryConnection} isReconnecting={isReconnecting} />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Prevent multiple submissions
    if (isSubmitting) return
    
    // Immediate UI feedback - no freeze
    setIsSubmitting(true)
    setLoading(true)
    setErrors([])

    // Use requestAnimationFrame to ensure UI updates before heavy operations
    requestAnimationFrame(async () => {
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
        const signupTimeout = setTimeout(() => {
          setLoading(false)
          setIsSubmitting(false)
          setErrors(["Signup is taking longer than expected. Please try again."])
        }, 15000) // 15 second timeout

        try {
          console.log("[v0] Starting signup process")

          // Create account
          await AuthService.signup({
            full_name: formData.full_name.trim(),
            telegram_username: formData.telegram_username.trim(),
            password: formData.password,
          })

          clearTimeout(signupTimeout)
          console.log("[v0] Signup successful, redirecting to login")

          // Set flash message and redirect
          setClientFlashMessage('success', 'Account created successfully! Please wait for admin approval.')
          
          // Smooth transition to login page
          setTimeout(() => {
            router.push("/login")
          }, 500) // Small delay for smooth transition
        } catch (signupError) {
          clearTimeout(signupTimeout)
          throw signupError
        }
      } catch (error: any) {
        console.error("[v0] Signup error:", error)

        if (error.message.includes("Supabase")) {
          setErrors([
            error.message,
            "Solution: Click the gear icon in the top right of the project and add Supabase integration.",
          ])
        } else {
          setErrors([error.message || "Failed to create account"])
        }
        setLoading(false)
        setIsSubmitting(false)
      }
    })
  }

  return (
    <div className="h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <AuthThemeToggle />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
        
        {/* Floating Particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-green-400/60 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-32 left-16 w-2.5 h-2.5 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: "2.5s" }} />
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-cyan-400/60 rounded-full animate-bounce" style={{ animationDelay: "3s" }} />
      </div>

      <div className="w-full max-w-6xl relative z-10">
        {/* Header with Home Link */}
        <div className="mb-8 text-center lg:text-left">
          <Link 
            href="/landing" 
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="text-sm font-medium">← হোমে ফিরে যান</span>
          </Link>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <UserPlus className="w-10 h-10 text-white relative z-10" />
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Join Our Community
              </h1>
              <p className="text-xl text-muted-foreground">
                Create your account and unlock access to powerful tools and exclusive features.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-muted-foreground">Quick and easy registration</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-muted-foreground">Secure account protection</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-muted-foreground">Instant access to all features</span>
              </div>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0">
            {/* Main Signup Card */}
            <Card className="glass-card p-6 rounded-3xl shadow-2xl border-0 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10">
          {/* Header */}
          <CardHeader className="text-center space-y-2 pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            {/* Error Messages */}
            {errors.length > 0 && (
              <Alert variant="destructive" className="backdrop-blur-sm rounded-xl">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {errors.map((error, index) => (
                      <li key={index} className="font-medium">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}


            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <div className="relative group">
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="h-12 pl-12 pr-4 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 group-hover:border-green-300/50 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                    required
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
                </div>
              </div>

              {/* Telegram Username Field */}
              <div className="space-y-2">
                <Label htmlFor="telegram_username" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Telegram Username
                </Label>
                <div className="relative group">
                  <Input
                    id="telegram_username"
                    name="telegram_username"
                    type="text"
                    placeholder="your_username"
                    value={formData.telegram_username}
                    onChange={handleInputChange}
                    className="h-12 pl-12 pr-4 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 group-hover:border-green-300/50 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                    required
                  />
                  <MessageCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
                </div>
                <p className="text-xs text-muted-foreground ml-1">Enter username without @ symbol</p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative group">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="h-12 pl-12 pr-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 group-hover:border-green-300/50 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-green-500 transition-colors p-1 rounded-md hover:bg-green-50/50 dark:hover:bg-green-900/30"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="h-12 pl-12 pr-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200 group-hover:border-green-300/50 focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20"
                    required
                  />
                  <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-hover:text-green-500 transition-colors" />
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
                    {formData.password === formData.confirmPassword ? (
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
                className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden active:scale-[0.98] active:shadow-md" 
                disabled={loading || isSubmitting}
                style={{
                  transform: isSubmitting ? 'scale(0.98)' : undefined,
                  transition: 'transform 0.1s ease-in-out'
                }}
              >
                {/* Immediate loading overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                    <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-white font-semibold drop-shadow-lg">Creating Account...</span>
                    </div>
                  </div>
                )}
                
                {/* Button content */}
                <div className={`flex items-center gap-2 transition-opacity duration-200 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                  <UserPlus className="h-5 w-5" />
                  Create Account
                </div>
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200 hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground/70">
                © 2025 User Agent Generator. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
