"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Copy, CheckCircle, Clipboard } from "lucide-react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"

interface NameData {
  fullName: string
  firstName: string
  lastName: string
  gender: string
  country: string
  type: string
}

export default function Email2NamePage() {
  const [email, setEmail] = useState("")
  const [nameData, setNameData] = useState<NameData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [autoGenerate, setAutoGenerate] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const generateName = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/email2name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      const result = await response.json()

      if (result.success) {
        setNameData(result.data)
        toast.success("Name generated successfully")
      } else {
        toast.error(result.error || "Failed to generate name")
        setNameData(null)
      }
    } catch (error) {
      toast.error("API call failed")
      setNameData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setEmail(text.trim())
      toast.success("Pasted from clipboard")

      if (autoGenerate && text.trim().includes("@")) {
        setTimeout(() => {
          generateName()
        }, 100)
      }
    } catch (err) {
      toast.error("Cannot access clipboard")
    }
  }

  const copyToClipboard = async (value: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(fieldName)
      toast.success(`${fieldName} copied`)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      toast.error("Failed to copy")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Card - Input */}
          <Card className="h-[550px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-500" />
                Input Email
              </CardTitle>
              <CardDescription>Enter an email address to generate a name</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1">
              <div className="space-y-2">
                <Label htmlFor="email-input">Email Address</Label>
                <div className="flex gap-2">
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        generateName()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon" onClick={pasteFromClipboard} title="Paste from clipboard">
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-generate"
                  checked={autoGenerate}
                  onCheckedChange={(checked) => setAutoGenerate(checked as boolean)}
                />
                <label
                  htmlFor="auto-generate"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  Auto Generate on Paste
                </label>
              </div>

              <Button onClick={generateName} disabled={isLoading || !email.trim()} className="w-full" size="lg">
                {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Mail className="h-4 w-4 mr-2" />}
                Generate Name
              </Button>
            </CardContent>
          </Card>

          {/* Right Card - Output */}
          <Card className="h-[550px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Generated Information
              </CardTitle>
              <CardDescription>AI-generated name and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 overflow-y-auto">
              {nameData ? (
                <>
                  {/* Full Name */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nameData.fullName, "Full Name")}
                        className={`h-8 w-8 p-0 transition-all ${
                          copiedField === "Full Name" ? "bg-green-100 dark:bg-green-800/30" : ""
                        }`}
                      >
                        {copiedField === "Full Name" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                      <p className="font-medium">{nameData.fullName}</p>
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nameData.firstName, "First Name")}
                        className={`h-8 w-8 p-0 transition-all ${
                          copiedField === "First Name" ? "bg-green-100 dark:bg-green-800/30" : ""
                        }`}
                      >
                        {copiedField === "First Name" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                      <p className="font-medium">{nameData.firstName}</p>
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nameData.lastName, "Last Name")}
                        className={`h-8 w-8 p-0 transition-all ${
                          copiedField === "Last Name" ? "bg-green-100 dark:bg-green-800/30" : ""
                        }`}
                      >
                        {copiedField === "Last Name" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                      <p className="font-medium">{nameData.lastName}</p>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nameData.gender, "Gender")}
                        className={`h-8 w-8 p-0 transition-all ${
                          copiedField === "Gender" ? "bg-green-100 dark:bg-green-800/30" : ""
                        }`}
                      >
                        {copiedField === "Gender" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                      <p className="font-medium">{nameData.gender}</p>
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Country</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nameData.country, "Country")}
                        className={`h-8 w-8 p-0 transition-all ${
                          copiedField === "Country" ? "bg-green-100 dark:bg-green-800/30" : ""
                        }`}
                      >
                        {copiedField === "Country" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="p-4 rounded-lg border bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800">
                      <p className="font-medium">{nameData.country}</p>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nameData.type, "Type")}
                        className={`h-8 w-8 p-0 transition-all ${
                          copiedField === "Type" ? "bg-green-100 dark:bg-green-800/30" : ""
                        }`}
                      >
                        {copiedField === "Type" ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div
                      className={`p-4 rounded-lg border ${
                        nameData.type.toLowerCase() === "business"
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          : "bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800"
                      }`}
                    >
                      <p
                        className={`font-medium ${
                          nameData.type.toLowerCase() === "business"
                            ? "text-red-700 dark:text-red-400"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {nameData.type}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-muted-foreground">No data yet</h3>
                  <p className="text-sm text-muted-foreground">Enter an email and click Generate to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
