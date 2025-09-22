"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SecurityAlert {
  id: string
  event: string
  details: any
  ip: string
  timestamp: string
  severity: "low" | "medium" | "high" | "critical"
}

export function SecurityMonitor() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSecurityAlerts()

    // Set up real-time monitoring (in production, use WebSocket)
    const interval = setInterval(fetchSecurityAlerts, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchSecurityAlerts = async () => {
    try {
      // Mock data - In production, fetch from database
      const mockAlerts: SecurityAlert[] = [
        {
          id: "1",
          event: "multiple_login_failures",
          details: { username: "suspicious_user", attempts: 5 },
          ip: "192.168.1.100",
          timestamp: new Date().toISOString(),
          severity: "high",
        },
        {
          id: "2",
          event: "admin_access",
          details: { path: "/admin/dashboard" },
          ip: "192.168.1.1",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          severity: "medium",
        },
      ]

      setAlerts(mockAlerts)
    } catch (error) {
      console.error("Failed to fetch security alerts:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>নিরাপত্তা মনিটরিং</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">লোড হচ্ছে...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>নিরাপত্তা মনিটরিং</CardTitle>
        <CardDescription>সাম্প্রতিক নিরাপত্তা ইভেন্ট এবং সতর্কতা</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">কোন নিরাপত্তা সতর্কতা নেই</p>
          ) : (
            alerts.map((alert) => (
              <Alert key={alert.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <AlertDescription>
                      <strong>{alert.event}</strong> - IP: {alert.ip}
                      <br />
                      <span className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString("bn-BD")}
                      </span>
                      {alert.details && <div className="mt-2 text-sm">{JSON.stringify(alert.details, null, 2)}</div>}
                    </AlertDescription>
                  </div>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity === "critical"
                      ? "জরুরি"
                      : alert.severity === "high"
                        ? "উচ্চ"
                        : alert.severity === "medium"
                          ? "মাঝারি"
                          : "নিম্ন"}
                  </Badge>
                </div>
              </Alert>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
