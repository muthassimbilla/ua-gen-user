"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { validateGmailEmail } from "@/lib/auth/gmail-validator"
import { Loader2, Mail, Lock, User, Zap } from "lucide-react"

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("signin")
  const [emailWarnings, setEmailWarnings] = useState<string[]>([])
  const router = useRouter()

  const { signUp, signIn, resetPassword, signInWithMagicLink } = useAuth()

  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const restrictionMessage = searchParams.get("message")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError("")

    if (e.target.name === "email" && e.target.value) {
      const validation = validateGmailEmail(e.target.value)
      setEmailWarnings(validation.warnings || [])
    } else if (e.target.name === "email") {
      setEmailWarnings([])
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const emailValidation = validateGmailEmail(formData.email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error!)
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("পাসওয়ার্ড মিল নেই")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে")
      setIsLoading(false)
      return
    }

    if (!formData.fullName.trim()) {
      setError("পূর্ণ নাম প্রয়োজন")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.fullName.trim())

      if (error) {
        if (error.message.includes("already registered")) {
          setError("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে। লগইন করুন।")
        } else {
          setError(`সাইনআপে সমস্যা: ${error.message}`)
        }
      } else {
        setSuccess("সাইনআপ সফল! আপনার ইমেইল চেক করুন এবং ভেরিফাই করুন। ভেরিফাই করার পর admin অনুমোদনের জন্য অপেক্ষা করুন।")
        setFormData({ email: "", password: "", confirmPassword: "", fullName: "" })
        setTimeout(() => {
          setActiveTab("signin")
          setSuccess("")
        }, 3000)
      }
    } catch (err) {
      console.error("Signup exception:", err)
      setError("সাইনআপে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const emailValidation = validateGmailEmail(formData.email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error!)
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await signIn(formData.email, formData.password)

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("ভুল ইমেইল বা পাসওয়ার্ড")
        } else if (error.message.includes("Email not confirmed")) {
          setError("প্রথমে আপনার ইমেইল ভেরিফাই করুন")
        } else {
          setError(`লগইনে সমস্যা: ${error.message}`)
        }
      } else {
        router.push("/")
      }
    } catch (err) {
      console.error("Signin exception:", err)
      setError("লগইনে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const emailValidation = validateGmailEmail(formData.email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error!)
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await resetPassword(formData.email)

      if (error) {
        setError(`পাসওয়ার্ড রিসেটে সমস্যা: ${error.message}`)
      } else {
        setSuccess("পাসওয়ার্ড রিসেট লিংক আপনার ইমেইলে পাঠানো হয়েছে।")
      }
    } catch (err) {
      console.error("Reset password exception:", err)
      setError("পাসওয়ার্ড রিসেটে সমস্যা হয়েছে।")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const emailValidation = validateGmailEmail(formData.email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error!)
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await signInWithMagicLink(formData.email)

      if (error) {
        setError(`ম্যাজিক লিংক পাঠাতে সমস্যা: ${error.message}`)
      } else {
        setSuccess("ম্যাজিক লিংক আপনার ইমেইলে পাঠানো হয়েছে।")
      }
    } catch (err) {
      console.error("Magic link exception:", err)
      setError("ম্যাজিক লিংক পাঠাতে সমস্যা হয়েছে।")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">UAGen Pro</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            শুধুমাত্র Gmail ইমেইল দিয়ে সাইনআপ করুন
          </CardDescription>
        </CardHeader>
        <CardContent>
          {restrictionMessage === "account_restricted" && (
            <Alert className="mb-4 border-red-200/50 bg-red-50/20 backdrop-blur-sm text-red-800 dark:text-red-200">
              <AlertDescription>
                <strong>অ্যাকাউন্ট সীমাবদ্ধ:</strong> আপনার অ্যাকাউন্ট প্রত্যাখ্যাত বা স্থগিত করা হয়েছে। আরও তথ্যের জন্য সাপোর্টের সাথে যোগাযোগ
                করুন।
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 border-red-200/50 bg-red-50/20 backdrop-blur-sm text-red-800 dark:text-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 border-green-200/50 bg-green-50/20 backdrop-blur-sm text-green-800 dark:text-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {emailWarnings.length > 0 && (
            <Alert className="mb-4 border-yellow-200/50 bg-yellow-50/20 backdrop-blur-sm text-yellow-800 dark:text-yellow-200">
              <AlertDescription>
                {emailWarnings.map((warning, index) => (
                  <div key={index}>⚠️ {warning}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 bg-white/30 dark:bg-slate-700/30 backdrop-blur-md">
              <TabsTrigger
                value="signin"
                className="data-[state=active]:bg-white/50 data-[state=active]:backdrop-blur-md"
              >
                লগইন
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-white/50 data-[state=active]:backdrop-blur-md"
              >
                সাইনআপ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Gmail ইমেইল</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">পাসওয়ার্ড</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500/80 to-purple-600/80 backdrop-blur-md hover:from-indigo-600/80 hover:to-purple-700/80"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      লগইন হচ্ছে...
                    </>
                  ) : (
                    "লগইন করুন"
                  )}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <Button variant="link" onClick={() => setActiveTab("reset")} className="text-sm">
                  পাসওয়ার্ড ভুলে গেছেন?
                </Button>
                <Button
                  variant="link"
                  onClick={() => setActiveTab("magic")}
                  className="text-sm flex items-center justify-center"
                >
                  <Zap className="mr-1 h-3 w-3" />
                  ম্যাজিক লিংক দিয়ে লগইন
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">পূর্ণ নাম</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="আপনার নাম"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Gmail ইমেইল</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">পাসওয়ার্ড</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="পাসওয়ার্ড আবার লিখুন"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500/80 to-purple-600/80 backdrop-blur-md hover:from-indigo-600/80 hover:to-purple-700/80"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      সাইনআপ হচ্ছে...
                    </>
                  ) : (
                    "সাইনআপ করুন"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {activeTab === "reset" && (
            <div className="space-y-4 mt-4">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Gmail ইমেইল</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500/80 to-purple-600/80 backdrop-blur-md hover:from-indigo-600/80 hover:to-purple-700/80"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    "রিসেট লিংক পাঠান"
                  )}
                </Button>
              </form>

              <Button variant="link" onClick={() => setActiveTab("signin")} className="w-full text-sm">
                লগইনে ফিরে যান
              </Button>
            </div>
          )}

          {activeTab === "magic" && (
            <div className="space-y-4 mt-4">
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Gmail ইমেইল</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10 bg-white/30 dark:bg-slate-700/30 backdrop-blur-md border-white/50 dark:border-slate-600/50"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500/80 to-purple-600/80 backdrop-blur-md hover:from-indigo-600/80 hover:to-purple-700/80"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      পাঠানো হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-4 w-4" />
                      ম্যাজিক লিংক পাঠান
                    </>
                  )}
                </Button>
              </form>

              <Button variant="link" onClick={() => setActiveTab("signin")} className="w-full text-sm">
                লগইনে ফিরে যান
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
