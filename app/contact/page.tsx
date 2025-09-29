"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MessageCircle, Send, CheckCircle, AlertCircle, User, Mail, MessageSquare, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    telegramUsername: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<string[]>([])
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []
    
    if (!formData.name.trim()) {
      newErrors.push("Name is required")
    }
    
    if (!formData.telegramUsername.trim()) {
      newErrors.push("Telegram username is required")
    } else if (!formData.telegramUsername.startsWith("@")) {
      newErrors.push("Telegram username must start with @")
    }
    
    if (!formData.message.trim()) {
      newErrors.push("Message is required")
    } else if (formData.message.trim().length < 10) {
      newErrors.push("Message must be at least 10 characters")
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus("idle")
    
    try {
      // Create the message for Telegram bot
      const telegramMessage = `🆕 *New Contact Form Submission*

👤 *Name:* ${formData.name}
📱 *Telegram:* [@${formData.telegramUsername.replace("@", "")}](https://t.me/${formData.telegramUsername.replace("@", "")})
💬 *Message:*
${formData.message}

⏰ *Time:* ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })}

🌐 *Website:* UGen Pro Contact Form`

      // Send to Telegram bot
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          telegramUsername: formData.telegramUsername,
          message: formData.message,
          telegramMessage: telegramMessage
        }),
      })
      
      if (response.ok) {
        const result = await response.json()
        setSubmitStatus("success")
        setFormData({ name: "", telegramUsername: "", message: "" })
      } else {
        const errorResult = await response.json()
        console.error("Form submission error:", errorResult)
        setDebugInfo(`HTTP ${response.status}: ${errorResult.message || 'Unknown error'}`)
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setDebugInfo(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/landing" 
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg hover:shadow-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Go back</span>
        </Link>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <Card className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border-white/50 dark:border-slate-700/40 shadow-2xl">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <MessageCircle className="w-8 h-8 text-white relative z-10" />
              <div className="absolute -top-1 -right-1">
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Get in Touch
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
              Share your feedback, suggestions, or questions with us. We'll get back to you quickly.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Your Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  disabled={isSubmitting}
                />
              </div>

              {/* Telegram Username Field */}
              <div className="space-y-2">
                <Label htmlFor="telegramUsername" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2 text-green-500" />
                  Telegram Username *
                </Label>
                <Input
                  id="telegramUsername"
                  name="telegramUsername"
                  type="text"
                  value={formData.telegramUsername}
                  onChange={handleInputChange}
                  placeholder="@username"
                  className="h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-green-500 dark:focus:border-green-400 transition-colors"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your Telegram username must start with @
                </p>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-purple-500" />
                  Your Message *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Write your feedback, suggestions, or questions..."
                  rows={6}
                  className="rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-400 transition-colors resize-none"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Write at least 10 characters
                </p>
              </div>

              {/* Error Messages */}
              {errors.length > 0 && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {submitStatus === "success" && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Your message has been sent successfully! We'll get back to you soon.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {submitStatus === "error" && (
                <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    There was a problem sending your message. Please try again.
                    {debugInfo && (
                      <div className="mt-2 text-xs font-mono bg-red-100 dark:bg-red-900/30 p-2 rounded">
                        Debug: {debugInfo}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}


              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </div>
                )}
              </Button>

            </form>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-500" />
                Why Contact Us?
              </h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  Fast and reliable support
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  Your feedback is important to us
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  Suggestions for new features and improvements
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                  Technical issue resolution
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
