"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SecurityAlert {
  id: string
  type: "failed_login" | "suspicious_activity" | "multiple_devices"
  message: string
  user_id?: string
  ip_address: string
  created_at: string
  severity: "low" | "medium" | "high"
}

interface DeviceInfo {
  user_id: string
  telegram_username: string
  ip_addresses: string[]
  device_count: number
  last_login: string
}

export default function SecurityMonitoring() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [devices, setDevices] = useState<DeviceInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/adminbilla/login")
      return
    }

    fetchSecurityData()
  }, [router])

  const fetchSecurityData = async () => {
    try {
      const token = localStorage.getItem("admin_token")

      const [alertsResponse, devicesResponse] = await Promise.all([
        fetch("/api/adminbilla/security-alerts", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/adminbilla/device-monitoring", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (alertsResponse.ok && devicesResponse.ok) {
        const alertsData = await alertsResponse.json()
        const devicesData = await devicesResponse.json()

        setAlerts(alertsData.alerts)
        setDevices(devicesData.devices)
      } else {
        setError("ডেটা লোড করতে ব্যর্থ")
      }
    } catch (error) {
      setError("সার্ভার এরর")
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "high":
        return "উচ্চ"
      case "medium":
        return "মাঝারি"
      case "low":
        return "নিম্ন"
      default:
        return "অজানা"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push("/adminbilla/dashboard")}>
              ← ড্যাশবোর্ড
            </Button>
            <h1 className="text-2xl font-bold">সিকিউরিটি মনিটরিং</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("admin_token")
                router.push("/adminbilla/login")
              }}
            >
              লগআউট
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>সিকিউরিটি এলার্ট</CardTitle>
              <CardDescription>সন্দেহজনক কার্যকলাপ এবং নিরাপত্তা সতর্কতা</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getSeverityColor(alert.severity)}>{getSeverityText(alert.severity)}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(alert.created_at).toLocaleString("bn-BD")}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">IP: {alert.ip_address}</p>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">কোন সিকিউরিটি এলার্ট নেই</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Device Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle>ডিভাইস মনিটরিং</CardTitle>
              <CardDescription>ইউজারদের ডিভাইস এবং IP ট্র্যাকিং</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {devices.map((device) => (
                  <div key={device.user_id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">@{device.telegram_username}</p>
                      <Badge variant={device.device_count > 1 ? "destructive" : "secondary"}>
                        {device.device_count} ডিভাইস
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        শেষ লগইন: {new Date(device.last_login).toLocaleString("bn-BD")}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        <p>IP ঠিকানা:</p>
                        <ul className="list-disc list-inside ml-2">
                          {device.ip_addresses.map((ip, index) => (
                            <li key={index}>{ip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
                {devices.length === 0 && <p className="text-center text-muted-foreground py-8">কোন ডিভাইস তথ্য নেই</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
