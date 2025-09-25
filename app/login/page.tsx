"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, MessageCircle, Lock, CheckCircle, XCircle, LogIn, Clock, AlertTriangle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    telegram_username: "",
    password: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [successMessage, setSuccessMessage] = useState("")
  const [pendingApproval, setPendingApproval] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [ipChangeLogout, setIpChangeLogout] = useState(false)

  useEffect(() => {
    const message = searchParams.get("message")
    const reason = searchParams.get("reason")

    if (message) {
      setSuccessMessage(message)
    }

    if (reason === "ip_changed") {
      setIpChangeLogout(true)
    }
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors.length > 0) {
      setErrors([])
      setPendingApproval(false)
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []

    if (!formData.telegram_username.trim()) {
      newErrors.push("Telegram username is required")
    }

    if (!formData.password.trim()) {
      newErrors.push("Password is required")
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    setSuccessMessage("")
    setPendingApproval(false)

    try {
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }

      await login(formData.telegram_username.trim(), formData.password)

      // Wait a bit for the auth context to update
      await new Promise((resolve) => setTimeout(resolve, 100))
      
      const redirectTo = searchParams.get("redirect") || "/tool"
      router.push(redirectTo)
    } catch (error: any) {
      console.error("[v0] Login error:", error)

      if (error.message.includes("not been approved") || error.message.includes("Waiting for admin approval")) {
        setPendingApproval(true)
        setErrors(["Your account is pending approval. Please wait for admin approval before logging in."])
      } else {
        setErrors([error.message || "Login failed. Please try again."])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="auth-form">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-balance">Login to Your Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sign in with your Telegram username and password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {successMessage && (
              <Alert className="border-green-500/20 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-400">{successMessage}</AlertDescription>
              </Alert>
            )}

            {ipChangeLogout && (
              <Alert className="border-orange-500/20 bg-orange-500/10">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <AlertDescription className="text-orange-600">
                  <div className="space-y-2">
                    <p className="font-medium">Your IP address has changed</p>
                    <p className="text-sm">You have been automatically logged out for security reasons. Please log in again.</p>
                    <p className="text-xs text-orange-500">One Key can only be used on one device/IP.</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {pendingApproval && (
              <Alert className="border-yellow-500/20 bg-yellow-500/10">
                <Clock className="h-4 w-4 text-yellow-500" />
                <AlertDescription className="text-yellow-600">
                  <div className="space-y-2">
                    <p className="font-medium">Account Pending Approval</p>
                    <p className="text-sm">
                      Your account has been created successfully but is still waiting for admin approval. You will be
                      able to login once approved.
                    </p>
                    <p className="text-xs text-yellow-500">
                      Approval is usually granted within 24 hours. Please be patient.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {errors.length > 0 && !pendingApproval && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Note:</strong> New accounts require admin approval after registration. You will be able to login
                after receiving approval.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegram_username" className="text-sm font-medium">
                  Telegram Username
                </Label>
                <div className="relative">
                  <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="telegram_username"
                    name="telegram_username"
                    type="text"
                    placeholder="your_username"
                    value={formData.telegram_username}
                    onChange={handleInputChange}
                    className="auth-input pl-10"
                    required
                    autoComplete="username"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Enter username without @ symbol</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="auth-input pl-10 pr-10"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="auth-button w-full" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                New user?{" "}
                <Link href="/signup" className="auth-link font-medium">
                  Create Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
