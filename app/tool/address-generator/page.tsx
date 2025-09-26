"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
  Globe,
  Building,
  Navigation,
  Clock,
  Shield,
  AlertCircle,
  Loader2,
  Search,
  Clipboard,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

interface AddressData {
  ip: string
  full_address: string
  street_address: string
  city: string
  region: string
  country: string
  postal_code: string
  timezone: string
  isp: string
  organization: string
}

export default function AddressGeneratorPage() {
  const [ipAddress, setIpAddress] = useState("")
  const [addressData, setAddressData] = useState<AddressData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const getAddressFromIP = async (ip: string): Promise<AddressData> => {
    try {
      const response = await fetch(`https://ipwho.is/${ip}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || "Failed to get location data")
      }

      return {
        ip: data.ip,
        full_address: `${data.city}, ${data.region}, ${data.country}`,
        street_address: `${data.city}, ${data.region}`,
        city: data.city,
        region: data.region,
        country: data.country,
        postal_code: data.postal || "N/A",
        timezone: data.timezone?.id || "N/A",
        isp: data.connection?.isp || "N/A",
        organization: data.connection?.org || "N/A",
      }
    } catch (error: any) {
      console.error("IP Geolocation API Error:", error)
      throw new Error("Failed to fetch location data. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setAddressData(null)

    try {
      // Validate IP address format
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      if (!ipRegex.test(ipAddress)) {
        throw new Error("Please enter a valid IP address format (e.g., 8.8.8.8)")
      }

      const result = await getAddressFromIP(ipAddress)
      setAddressData(result)
    } catch (err: any) {
      setError(err.message || "Failed to fetch address data")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getCurrentIP = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("https://api.ipify.org?format=json")
      const data = await response.json()
      setIpAddress(data.ip)
    } catch (err) {
      setError("Failed to get current IP address")
    } finally {
      setLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setIpAddress(text.trim())

      // Auto-generate if valid IP
      const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
      if (ipRegex.test(text.trim())) {
        // Auto-generate after a short delay
        setTimeout(() => {
          handleSubmit(new Event("submit") as any)
        }, 500)
      }
    } catch (err) {
      setError("Failed to paste from clipboard")
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="fixed inset-0 -z-10">
          {/* Light mode background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-pink-50/50 dark:hidden" />

          {/* Dark mode enhanced background */}
          <div className="hidden dark:block absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/25 via-transparent to-pink-900/25" />
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/15 via-transparent to-rose-900/15" />
          </div>

          {/* Animated orbs */}
          <div className="absolute top-1/4 -left-64 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 -right-64 w-96 h-96 bg-pink-200/30 dark:bg-pink-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />

          {/* Floating particles */}
          <div
            className="absolute top-20 left-20 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-40 right-32 w-1.5 h-1.5 bg-pink-400/60 rounded-full animate-bounce"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="absolute bottom-32 left-16 w-2.5 h-2.5 bg-violet-400/60 rounded-full animate-bounce"
            style={{ animationDelay: "2.5s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <Card className="glass-card p-8 rounded-3xl shadow-2xl border-0 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Address Generator
                    </CardTitle>
                    <p className="text-muted-foreground">Enter an IP address to get its location information</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Using ipwho.is API for location data
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Free and reliable IP geolocation service</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ip" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      IP Address
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="ip"
                        type="text"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        placeholder="Enter IP address"
                        className="flex-1 h-12 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm focus:bg-background/80 transition-all duration-200"
                        required
                      />
                      <Button
                        type="button"
                        onClick={handlePaste}
                        variant="outline"
                        className="h-12 px-4 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
                        disabled={loading}
                        title="Paste IP address from clipboard"
                      >
                        <Clipboard className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        onClick={getCurrentIP}
                        variant="outline"
                        className="h-12 px-4 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-background/80 transition-all duration-200"
                        disabled={loading}
                        title="Use current IP address"
                      >
                        <Navigation className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Click the clipboard icon to paste IP address, or navigation icon to use your current IP
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Looking up address...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Generate Address
                      </div>
                    )}
                  </Button>
                </form>

                {error && (
                  <Alert variant="destructive" className="backdrop-blur-sm rounded-xl">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-6">
              {addressData ? (
                <Card className="glass-card p-8 rounded-3xl shadow-2xl border-0 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10">
                  <CardHeader className="text-center pb-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Location Found
                    </CardTitle>
                    <p className="text-muted-foreground">Address information for {addressData.ip}</p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Full Address */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Complete Address
                      </h4>
                      <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm">
                        <p className="text-foreground font-medium">{addressData.full_address}</p>
                      </div>
                    </div>

                    {/* Street Address */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Street Address
                      </h4>
                      <div className="p-3 rounded-lg bg-background/50 backdrop-blur-sm">
                        <p className="text-foreground font-medium">{addressData.street_address}</p>
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-border/30">
                        <div className="flex items-center gap-3">
                          <Building className="w-5 h-5 text-purple-500" />
                          <span className="font-medium">City</span>
                        </div>
                        <span className="text-foreground">{addressData.city}</span>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-border/30">
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">Country</span>
                        </div>
                        <span className="text-foreground">{addressData.country}</span>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-border/30">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Region</span>
                        </div>
                        <span className="text-foreground">{addressData.region}</span>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-border/30">
                        <div className="flex items-center gap-3">
                          <Navigation className="w-5 h-5 text-orange-500" />
                          <span className="font-medium">Postal Code</span>
                        </div>
                        <span className="text-foreground">{addressData.postal_code}</span>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-background/30 backdrop-blur-sm border border-border/30">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-purple-500" />
                          <span className="font-medium">Timezone</span>
                        </div>
                        <span className="text-foreground">{addressData.timezone}</span>
                      </div>
                    </div>

                    {/* ISP Information */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Network Information
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">ISP</span>
                          <span className="text-sm text-foreground">{addressData.isp}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Organization</span>
                          <span className="text-sm text-foreground">{addressData.organization}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="glass-card p-8 rounded-3xl shadow-2xl border-0 backdrop-blur-xl bg-white/10 dark:bg-gray-900/10">
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shadow-lg">
                      <MapPin className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No Address Data</h3>
                    <p className="text-muted-foreground">Enter an IP address to see its location information</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
