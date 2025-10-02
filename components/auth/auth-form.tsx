"use client"

import React, { memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, User, Shield, LogIn, UserPlus, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface AuthFormProps {
  variant: "login" | "signup"
  formData: {
    full_name?: string
    email: string
    password: string
    confirmPassword?: string
  }
  errors: string[]
  loading: boolean
  isSubmitting: boolean
  showPassword: boolean
  showConfirmPassword?: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onTogglePassword: () => void
  onToggleConfirmPassword?: () => void
  flashMessage?: { type: string; message: string } | null
  showSuccessMessage?: boolean
  successMessage?: string
  sessionInvalidReason?: boolean
  ipChangeLogout?: boolean
  pendingApproval?: boolean
}

const AuthForm = memo(function AuthForm({
  variant,
  formData,
  errors,
  loading,
  isSubmitting,
  showPassword,
  showConfirmPassword = false,
  onInputChange,
  onSubmit,
  onTogglePassword,
  onToggleConfirmPassword,
  flashMessage,
  showSuccessMessage = false,
  successMessage,
  sessionInvalidReason = false,
  ipChangeLogout = false,
  pendingApproval = false,
}: AuthFormProps) {
  const isLogin = variant === "login"
  const hasConfirmPassword = variant === "signup"

  return (
    <div className="w-full max-w-sm mx-auto lg:mx-0 px-4 sm:px-0">
      <Card className="glass-card p-4 sm:p-6 rounded-2xl shadow-xl border-0 backdrop-blur-xl bg-white/15 dark:bg-gray-900/15 relative overflow-hidden">
        {/* Card background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-gray-800/5"></div>
        
        <CardHeader className="text-center space-y-2 pb-4 relative z-10">
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {isLogin ? "Sign In" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm">
            {isLogin ? "Enter your credentials to access your account" : "Fill in your details to get started"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 relative z-10">
          {/* Success Messages */}
          {flashMessage && (
            <Alert
              className={`border-green-500/30 bg-green-500/10 backdrop-blur-sm rounded-xl transition-all duration-500 ease-out ${
                showSuccessMessage ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertDescription className="text-green-400 font-medium">{flashMessage.message}</AlertDescription>
            </Alert>
          )}

          {successMessage && !flashMessage && (
            <Alert
              className={`border-green-500/30 bg-green-500/10 backdrop-blur-sm rounded-xl transition-all duration-500 ease-out ${
                showSuccessMessage ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
              }`}
            >
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertDescription className="text-green-400 font-medium">{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Session Messages */}
          {sessionInvalidReason && (
            <Alert className="border-orange-500/30 bg-orange-500/10 backdrop-blur-sm rounded-xl">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <AlertDescription className="text-orange-600">
                <div className="space-y-2">
                  <p className="font-semibold">Session Expired</p>
                  <p className="text-sm">Your previous session has expired. Please log in again to continue.</p>
                  <p className="text-xs text-orange-500 font-medium">
                    Session data has been cleared for security.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {ipChangeLogout && (
            <Alert className="border-orange-500/30 bg-orange-500/10 backdrop-blur-sm rounded-xl">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <AlertDescription className="text-orange-600">
                <div className="space-y-2">
                  <p className="font-semibold">Security Alert: IP Address Changed</p>
                  <p className="text-sm">
                    Your session has expired due to IP address change. This is a security feature to protect
                    your account.
                  </p>
                  <p className="text-xs text-orange-500 font-medium">
                    Please log in again to continue. Your account is secure.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {pendingApproval && (
            <Alert className="border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm rounded-xl">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <AlertDescription className="text-yellow-600">
                <div className="space-y-2">
                  <p className="font-semibold">Account Pending Approval</p>
                  <p className="text-sm">
                    Your account has been created successfully but is still waiting for admin approval.
                  </p>
                  <p className="text-xs text-yellow-500 font-medium">
                    Approval is usually granted within 24 hours. Please be patient.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Messages */}
          {errors.length > 0 && !pendingApproval && (
            <Alert variant="destructive" className="backdrop-blur-sm rounded-xl">
              <XCircle className="h-5 w-5" />
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="font-medium">
                      {error}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Full Name Field - Only for Signup */}
            {!isLogin && (
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
                    value={formData.full_name || ""}
                    onChange={onInputChange}
                        className="h-10 sm:h-12 pl-10 sm:pl-12 pr-4 rounded-xl border-border/50 bg-background/60 backdrop-blur-sm focus:bg-background/90 transition-all duration-300 group-hover:border-blue-300/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 text-sm"
                    required
                  />
                  <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors duration-200" />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <div className="relative group">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={isLogin ? "your@email.com" : "yourname@gmail.com"}
                  value={formData.email}
                  onChange={onInputChange}
                        className="h-10 sm:h-12 pl-10 sm:pl-12 pr-4 rounded-xl border-border/50 bg-background/60 backdrop-blur-sm focus:bg-background/90 transition-all duration-300 group-hover:border-blue-300/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 text-sm"
                  required
                  autoComplete="email"
                />
                <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors duration-200" />
              </div>
              {!isLogin && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Only Gmail addresses (@gmail.com) are accepted
                </p>
              )}
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
                  onChange={onInputChange}
                        className="h-10 sm:h-12 pl-10 sm:pl-12 pr-10 sm:pr-12 rounded-xl border-border/50 bg-background/60 backdrop-blur-sm focus:bg-background/90 transition-all duration-300 group-hover:border-blue-300/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 text-sm"
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors duration-200" />
                <button
                  type="button"
                  onClick={onTogglePassword}
                  className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-blue-500 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/30"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {isLogin && (
                <div className="text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            {/* Confirm Password Field - Only for Signup */}
            {hasConfirmPassword && (
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
                    value={formData.confirmPassword || ""}
                    onChange={onInputChange}
                        className="h-10 sm:h-12 pl-10 sm:pl-12 pr-10 sm:pr-12 rounded-xl border-border/50 bg-background/60 backdrop-blur-sm focus:bg-background/90 transition-all duration-300 group-hover:border-blue-300/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 text-sm"
                    required
                  />
                  <Shield className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors duration-200" />
                  <button
                    type="button"
                    onClick={onToggleConfirmPassword}
                    className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-blue-500 transition-colors duration-200 p-1 rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/30"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {/* Password Match Indicators */}
                {formData.confirmPassword && formData.confirmPassword.length > 0 && (
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
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-10 sm:h-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden active:scale-[0.98] active:shadow-lg text-sm"
              disabled={loading || isSubmitting}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin spinner h-4 w-4 text-white"
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
                  <span>{isLogin ? "Signing in..." : "Creating Account..."}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {isLogin ? "Sign In" : "Create Account"}
                </div>
              )}
            </Button>
          </form>

          {/* Auth Link */}
          <div className="text-center pt-1">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "New user? " : "Already have an account? "}
              <Link
                href={isLogin ? "/signup" : "/login"}
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 hover:underline"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground/80">© 2025 UGen Pro. All rights reserved.</p>
      </div>
    </div>
  )
})

export default AuthForm
