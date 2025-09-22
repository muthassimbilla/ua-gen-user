"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Key, User, Wrench } from "lucide-react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

export default function LoginPage() {
  const [telegramUsername, setTelegramUsername] = useState("")
  const [key, setKey] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(telegramUsername, key)
      if (!success) {
        setError("লগইন ব্যর্থ হয়েছে। আপনার Telegram Username এবং Key চেক করুন।")
      }
    } catch (err) {
      setError("একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-primary/10">
              <Key className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">স্বাগতম</h1>
          <p className="text-muted-foreground">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">লগইন</CardTitle>
            <CardDescription>আপনার Telegram Username এবং Key দিয়ে লগইন করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="telegram_username" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Telegram Username
                </Label>
                <Input
                  id="telegram_username"
                  type="text"
                  placeholder="@username"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Key
                </Label>
                <Input
                  id="key"
                  type="password"
                  placeholder="আপনার Key লিখুন"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
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
            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">অথবা</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/key-buy">Key কিনুন</Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link href="/tools">
                    <Wrench className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground">
          সমস্যা হলে{" "}
          <Link href="/tools" className="text-primary hover:underline">
            Our Tools
          </Link>{" "}
          পেজে যান
        </p>
      </div>
    </div>
  )
}
