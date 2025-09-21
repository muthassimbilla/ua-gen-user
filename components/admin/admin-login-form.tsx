"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Shield, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { validateGmailEmail } from "@/lib/auth/gmail-validator"

export function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailWarnings, setEmailWarnings] = useState<string[]>([])
  const { signIn } = useAuth()
  const router = useRouter()

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value
    setEmail(emailValue)
    setError("")

    if (emailValue) {
      const validation = validateGmailEmail(emailValue)
      setEmailWarnings(validation.warnings || [])
    } else {
      setEmailWarnings([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const emailValidation = validateGmailEmail(email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error!)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await signIn(email, password)

      if (error) {
        setError("ইমেইল বা পাসওয়ার্ড ভুল। অথবা আপনার অ্যাডমিন অনুমতি নেই।")
        return
      }

      router.refresh()
    } catch (err) {
      setError("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Card className="w-full max-w-md bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">অ্যাডমিন প্যানেল</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করুন</CardDescription>
        </CardHeader>

        <CardContent>
          {emailWarnings.length > 0 && (
            <Alert className="mb-4 border-yellow-200/50 bg-yellow-50/20 backdrop-blur-sm">
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                {emailWarnings.map((warning, index) => (
                  <div key={index}>⚠️ {warning}</div>
                ))}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                ইমেইল
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="admin@gmail.com"
                required
                className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                পাসওয়ার্ড
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-white/30 dark:border-slate-700/30 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200/50 bg-red-50/20 backdrop-blur-sm">
                <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  লগইন হচ্ছে...
                </>
              ) : (
                "লগইন করুন"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">শুধুমাত্র অনুমোদিত অ্যাডমিনরা এই প্যানেল ব্যবহার করতে পারবেন</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
