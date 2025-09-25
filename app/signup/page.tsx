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
import { Eye, EyeOff, User, MessageCircle, Lock, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    full_name: "",
    telegram_username: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    errors: [] as string[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Real-time password validation
    if (name === "password") {
      const validation = PasswordUtils.validatePassword(value)
      setPasswordValidation(validation)
    }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])

    try {
      // Validate form
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }

      console.log("[v0] Starting signup process")

      // Create account
      await AuthService.signup({
        full_name: formData.full_name.trim(),
        telegram_username: formData.telegram_username.trim(),
        password: formData.password,
      })

      console.log("[v0] Signup successful, redirecting to login")

      // Redirect to login page with success message
      router.push("/login?message=Account created successfully! You can login after admin approval.")
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="auth-form">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-balance">Create New Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in your information to create a new account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
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
                <strong>Note:</strong> Supabase database integration is required to create an account. If you get an
                error, click the gear icon in the top right of the project and add Supabase integration.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="auth-input pl-10"
                    required
                  />
                </div>
              </div>

              {/* Telegram Username Field */}
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
                  />
                </div>
                <p className="text-xs text-muted-foreground">Enter username without @ symbol</p>
              </div>

              {/* Password Field */}
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
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="auth-input pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {/* Password Validation Indicators */}
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      {passwordValidation.isValid ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span className={passwordValidation.isValid ? "text-green-500" : "text-red-500"}>
                        Password is {passwordValidation.isValid ? "strong" : "weak"}
                      </span>
                    </div>
                    {passwordValidation.errors.length > 0 && (
                      <ul className="text-xs text-red-400 space-y-1">
                        {passwordValidation.errors.map((error, index) => (
                          <li key={index} className="flex items-center space-x-1">
                            <XCircle className="h-3 w-3" />
                            <span>{error}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="auth-input pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-400 flex items-center space-x-1">
                    <XCircle className="h-3 w-3" />
                    <span>Passwords do not match</span>
                  </p>
                )}
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-xs text-green-500 flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Passwords match</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="auth-button w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="auth-link font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
