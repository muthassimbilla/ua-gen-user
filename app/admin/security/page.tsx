"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SecurityMonitor } from "@/components/security-monitor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AdminSecurityPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
    }
  }, [router])

  const logout = () => {
    localStorage.removeItem("admin_token")
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
              ← ড্যাশবোর্ড
            </Button>
            <h1 className="text-2xl font-bold">নিরাপত্তা মনিটরিং</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={logout}>
              লগআউট
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">সক্রিয় সেশন</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">45</div>
              <p className="text-sm text-muted-foreground">বর্তমানে অনলাইন</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ব্যর্থ লগইন</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">12</div>
              <p className="text-sm text-muted-foreground">গত ২৪ ঘন্টায়</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">সন্দেহজনক কার্যকলাপ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">3</div>
              <p className="text-sm text-muted-foreground">তদন্তাধীন</p>
            </CardContent>
          </Card>
        </div>

        <SecurityMonitor />
      </main>
    </div>
  )
}
