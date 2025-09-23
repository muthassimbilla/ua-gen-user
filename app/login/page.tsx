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
import { Eye, EyeOff, MessageCircle, Lock, CheckCircle, XCircle, LogIn } from "lucide-react"

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
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Check for success message from signup
  useEffect(() => {
    const message = searchParams.get("message")
    if (message) {
      setSuccessMessage(message)
    }
  }, [searchParams])

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

    if (!formData.telegram_username.trim()) {
      newErrors.push("টেলিগ্রাম ইউজারনেম প্রয়োজন")
    }

    if (!formData.password.trim()) {
      newErrors.push("পাসওয়ার্ড প্রয়োজন")
    }

    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors([])
    setSuccessMessage("")

    try {
      // Validate form
      const validationErrors = validateForm()
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }

      // Login user
      await login(formData.telegram_username.trim(), formData.password)

      // Get redirect URL or default to /tool
      const redirectTo = searchParams.get("redirect") || "/tool"
      router.push(redirectTo)
    } catch (error: any) {
      console.error("[v0] Login error:", error)
      setErrors([error.message || "লগইন করতে সমস্যা হয়েছে"])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="auth-form">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-balance">আপনার অ্যাকাউন্টে লগইন করুন</CardTitle>
            <CardDescription className="text-muted-foreground">
              টেলিগ্রাম ইউজারনেম এবং পাসওয়ার্ড দিয়ে লগইন করুন
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            {successMessage && (
              <Alert className="border-green-500/20 bg-green-500/10">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-400">{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Error Messages */}
            {errors.length > 0 && (
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Telegram Username Field */}
              <div className="space-y-2">
                <Label htmlFor="telegram_username" className="text-sm font-medium">
                  টেলিগ্রাম ইউজারনেম
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
                <p className="text-xs text-muted-foreground">@ চিহ্ন ছাড়া শুধুমাত্র ইউজারনেম লিখুন</p>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  পাসওয়ার্ড
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="আপনার পাসওয়ার্ড লিখুন"
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

              {/* Submit Button */}
              <Button type="submit" className="auth-button w-full" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
              </Button>
            </form>

            {/* Demo Users Section */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-muted" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">অথবা ডেমো অ্যাকাউন্ট ব্যবহার করুন</span>
                </div>
              </div>

              <div className="grid gap-2">
                <div className="p-3 rounded-lg bg-muted/20 border border-muted/30">
                  <p className="text-xs font-medium text-muted-foreground mb-1">ডেমো ইউজার ১:</p>
                  <p className="text-sm">
                    <span className="font-mono">ahmed_rahman</span> | পাসওয়ার্ড:{" "}
                    <span className="font-mono">demo123456</span>
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-muted/30">
                  <p className="text-xs font-medium text-muted-foreground mb-1">ডেমো ইউজার ২:</p>
                  <p className="text-sm">
                    <span className="font-mono">fatima_khatun</span> | পাসওয়ার্ড:{" "}
                    <span className="font-mono">demo123456</span>
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted/20 border border-muted/30">
                  <p className="text-xs font-medium text-muted-foreground mb-1">ডেমো ইউজার ৩:</p>
                  <p className="text-sm">
                    <span className="font-mono">mohammad_karim</span> | পাসওয়ার্ড:{" "}
                    <span className="font-mono">demo123456</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Signup Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                নতুন ব্যবহারকারী?{" "}
                <Link href="/signup" className="auth-link font-medium">
                  অ্যাকাউন্ট তৈরি করুন
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
