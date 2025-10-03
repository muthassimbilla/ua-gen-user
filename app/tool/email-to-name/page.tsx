"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Mail, Sparkles, ClipboardPaste } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Navigation } from "@/components/navigation"

interface NameData {
  fullName: string
  firstName: string
  lastName: string
  gender: string
  country: string
  type: string
}

export default function EmailToNamePage() {
  const [email, setEmail] = useState("")
  const [nameData, setNameData] = useState<NameData>({
    fullName: "",
    firstName: "",
    lastName: "",
    gender: "",
    country: "",
    type: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [autoGenerate, setAutoGenerate] = useState(true)
  const { toast } = useToast()

  const generateName = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/email-to-name", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate name")
      }

      const data = await response.json()
      setNameData(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to generate name. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setEmail(text)
      if (autoGenerate && text.includes("@")) {
        // Wait a bit for state to update
        setTimeout(() => {
          generateName()
        }, 100)
      }
    } catch (error) {
      toast({
        title: "Clipboard Error",
        description: "Could not read from clipboard",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value)
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-pink-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900">
      <Navigation />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
            Email to Name Generator
          </h1>
          <p className="text-muted-foreground text-lg">Generate realistic names from email addresses using AI</p>
        </div>

        <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-950 dark:to-orange-950">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Enter Email Address
            </CardTitle>
            <CardDescription>Paste or type an email address to generate a realistic name</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">
                  Email Address
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        generateName()
                      }
                    }}
                    className="flex-1 border-2 border-purple-200 dark:border-purple-800 focus:border-purple-500"
                  />
                  <Button
                    onClick={handlePaste}
                    variant="outline"
                    size="icon"
                    className="border-2 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-950 bg-transparent"
                  >
                    <ClipboardPaste className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="auto-generate"
                    checked={autoGenerate}
                    onCheckedChange={(checked) => setAutoGenerate(checked as boolean)}
                  />
                  <Label
                    htmlFor="auto-generate"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Auto Generate on Paste
                  </Label>
                </div>

                <Button
                  onClick={generateName}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 text-white font-semibold px-8"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Output Section */}
            {(nameData.fullName || isLoading) && (
              <div className="space-y-4 pt-6 border-t-2 border-purple-200 dark:border-purple-800">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Generated Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                    <div className="flex gap-2">
                      <Input
                        value={nameData.fullName}
                        readOnly
                        className="bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800"
                      />
                      <Button
                        onClick={() => copyToClipboard(nameData.fullName, "Full Name")}
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* First Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                    <div className="flex gap-2">
                      <Input
                        value={nameData.firstName}
                        readOnly
                        className="bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800"
                      />
                      <Button
                        onClick={() => copyToClipboard(nameData.firstName, "First Name")}
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                    <div className="flex gap-2">
                      <Input
                        value={nameData.lastName}
                        readOnly
                        className="bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800"
                      />
                      <Button
                        onClick={() => copyToClipboard(nameData.lastName, "Last Name")}
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                    <div className="flex gap-2">
                      <Input
                        value={nameData.gender}
                        readOnly
                        className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800"
                      />
                      <Button
                        onClick={() => copyToClipboard(nameData.gender, "Gender")}
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Country</Label>
                    <div className="flex gap-2">
                      <Input
                        value={nameData.country}
                        readOnly
                        className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                      />
                      <Button
                        onClick={() => copyToClipboard(nameData.country, "Country")}
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                    <div className="flex gap-2">
                      <Input
                        value={nameData.type}
                        readOnly
                        className={`${
                          nameData.type.toLowerCase() === "business"
                            ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold"
                            : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-semibold"
                        }`}
                      />
                      <Button
                        onClick={() => copyToClipboard(nameData.type, "Type")}
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-2 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2 text-orange-900 dark:text-orange-100">How it works</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• AI analyzes the email address structure and domain</li>
              <li>• Generates realistic U.S.-style names based on email patterns</li>
              <li>• Classifies as Business (red) or Personal (green)</li>
              <li>• All data is generated in real-time using advanced AI</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
