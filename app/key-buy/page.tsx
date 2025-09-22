"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Key, UserCheck, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import ThemeToggle from "@/components/theme-toggle"

export default function KeyBuyPage() {
  const [fullName, setFullName] = useState("")
  const [telegramUsername, setTelegramUsername] = useState("")
  const [key, setKey] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [approved, setApproved] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          telegram_username: telegramUsername,
          key: key,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitted(true)
        setApproved(data.approved || false)
      } else {
        setError(data.message || "Registration failed")
      }
    } catch (err) {
      setError("একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className={`p-4 rounded-full ${approved ? "bg-green-500/10" : "bg-yellow-500/10"}`}>
                {approved ? (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                ) : (
                  <AlertTriangle className="h-12 w-12 text-yellow-500" />
                )}
              </div>
            </div>
            {approved ? (
              <>
                <h1 className="text-2xl font-bold text-green-600">সফল!</h1>
                <p className="text-muted-foreground">আপনার অ্যাকাউন্ট অনুমোদিত হয়েছে। এখন আপনি লগইন করতে পারেন।</p>
                <Button asChild className="w-full">
                  <Link href="/login">লগইন করুন</Link>
                </Button>
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-yellow-600">অপেক্ষা করুন</h1>
                <p className="text-muted-foreground text-center">
                  আপনার অ্যাকাউন্ট তৈরি হয়েছে কিন্তু এখনো অনুমোদিত হয়নি।
                  <br />
                  দয়া করে চ্যাট এ ক্লিক করে এডমিন এর সাথে যোগাযোগ করুন।
                </p>
                <Button asChild className="w-full">
                  <Link href="/tools">Pricing Page এ যান</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-foreground">Key কিনুন</h1>
          <p className="text-muted-foreground">নতুন অ্যাকাউন্ট তৈরি করুন</p>
        </div>
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">নিবন্ধন</CardTitle>
            <CardDescription>আপনার তথ্য দিয়ে নতুন অ্যাকাউন্ট তৈরি করুন</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  পূর্ণ নাম
                </Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
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
                  type="text"
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
                    জমা দিচ্ছি...
                  </>
                ) : (
                  "জমা দিন"
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
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/login">ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
