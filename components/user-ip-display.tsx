"use client"

import { useEffect, useState } from "react"
import { Globe, Shield, Smartphone, RefreshCw, LogOut, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { AuthService, type UserDevice } from "@/lib/auth-client"
import { useAuth } from "@/lib/auth-context"

interface UserIPInfo {
  ip: string
  user_id: string
}

export function UserIPDisplay() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [currentIP, setCurrentIP] = useState<string | null>(null)
  const [devices, setDevices] = useState<UserDevice[]>([])
  const [loading, setLoading] = useState(true)
  const [showDevices, setShowDevices] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (user) {
      loadIPInfo()
    }
  }, [user])

  const loadIPInfo = async () => {
    try {
      setLoading(true)

      // Get current IP
      const response = await fetch("/api/user/current-ip")
      if (response.ok) {
        const data = await response.json()
        setCurrentIP(data.data.ip)
      }

      // Get user devices
      const sessionToken = localStorage.getItem("session_token")
      if (sessionToken) {
        const userDevices = await AuthService.getUserDevices(sessionToken)
        setDevices(userDevices)
      }
    } catch (error) {
      console.error("Error loading IP info:", error)
      toast({
        title: "Error",
        description: "Failed to load IP information",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadIPInfo()
    setRefreshing(false)

    toast({
      title: "Success",
      description: "IP information updated",
    })
  }

  const handleLogoutOtherDevices = async () => {
    try {
      const response = await fetch("/api/user/devices?action=logout-others", {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })
        await loadIPInfo() // Reload data
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout from other devices",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("bn-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDeviceIcon = (deviceName?: string) => {
    if (!deviceName) return <Smartphone className="w-4 h-4" />

    if (deviceName.toLowerCase().includes("iphone") || deviceName.toLowerCase().includes("android")) {
      return <Smartphone className="w-4 h-4" />
    }

    return <Globe className="w-4 h-4" />
  }

  if (!user) return null

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security Information
            </CardTitle>
            <CardDescription>Your current IP address and device information</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current IP */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium">Current IP Address</p>
              <p className="text-sm text-muted-foreground">
                {loading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  <code className="font-mono bg-background px-2 py-1 rounded text-foreground">
                    {currentIP || "Unknown"}
                  </code>
                )}
              </p>
            </div>
          </div>
          <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
            Active
          </Badge>
        </div>

        {/* Device Summary */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{devices.length} devices registered</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setShowDevices(!showDevices)}>
            {showDevices ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Show
              </>
            )}
          </Button>
        </div>

        {/* Device List */}
        {showDevices && (
          <div className="space-y-3">
            {loading ? (
              <div className="space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-muted/50 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : devices.length > 0 ? (
              <>
                {devices.map((device, index) => (
                  <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {getDeviceIcon(device.device_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{device.device_name || "Unknown Device"}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {device.browser_info} • {device.os_info}
                        </p>
                        <p className="text-xs text-muted-foreground">Last seen: {formatDate(device.last_seen)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {device.is_blocked ? (
                        <Badge variant="destructive" className="text-xs">
                          Blocked
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {device.total_logins} logins
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

                {devices.length > 1 && (
                  <div className="pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogoutOtherDevices}
                      className="w-full bg-transparent"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout from all other devices
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Smartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No device information found</p>
              </div>
            )}
          </div>
        )}

        {/* Security Notice */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-600 mb-1">Security Notice</p>
              <p className="text-blue-600/80 text-xs leading-relaxed">
                You will be automatically logged out if your IP address changes. One Key can only be used on one device.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
