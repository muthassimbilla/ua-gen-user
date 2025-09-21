"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { validateGmailEmail } from "@/lib/auth/gmail-validator"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, MessageCircle, CreditCard } from "lucide-react"

interface PricingPackage {
  id: string
  name: string
  description: string
  price: number
  duration_days: number
  user_agent_limit: number
  features: string[]
  is_active: boolean
}

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  package: PricingPackage
  userEmail?: string
}

export function PurchaseModal({ isOpen, onClose, package: pkg, userEmail }: PurchaseModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    email: userEmail || "",
    telegramUsername: "",
  })

  const { toast } = useToast()
  const supabase = createClient()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate Gmail email
    const emailValidation = validateGmailEmail(formData.email)
    if (!emailValidation.isValid) {
      setError(emailValidation.error!)
      setLoading(false)
      return
    }

    // Validate Telegram username
    if (!formData.telegramUsername.trim()) {
      setError("Telegram Username প্রয়োজন")
      setLoading(false)
      return
    }

    // Remove @ from telegram username if present
    const cleanTelegramUsername = formData.telegramUsername.replace("@", "")

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("লগইন করুন")
        setLoading(false)
        return
      }

      // Create transaction record
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          package_id: pkg.id,
          email: formData.email,
          telegram_username: cleanTelegramUsername,
          amount: pkg.price,
          status: "pending",
        })
        .select()
        .single()

      if (transactionError) {
        setError("অর্ডার তৈরিতে সমস্যা হয়েছে")
        setLoading(false)
        return
      }

      // Send Telegram notification
      await sendTelegramNotification(transaction.id, pkg, formData.email, cleanTelegramUsername)

      setSuccess("আপনার অর্ডার সফলভাবে তৈরি হয়েছে! Telegram এ ইনভয়েস পাঠানো হয়েছে।")

      toast({
        title: "Success",
        description: "অর্ডার সফলভাবে তৈরি হয়েছে!",
      })

      // Reset form
      setFormData({
        email: userEmail || "",
        telegramUsername: "",
      })

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose()
        setSuccess("")
      }, 2000)
    } catch (err) {
      console.error("Purchase error:", err)
      setError("অর্ডার প্রক্রিয়াকরণে সমস্যা হয়েছে")
    } finally {
      setLoading(false)
    }
  }

  const sendTelegramNotification = async (
    transactionId: string,
    pkg: PricingPackage,
    email: string,
    telegramUsername: string,
  ) => {
    try {
      // Call our API route to send Telegram message
      const response = await fetch("/api/telegram/send-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId,
          packageName: pkg.name,
          packagePrice: pkg.price,
          packageDuration: pkg.duration_days,
          userEmail: email,
          telegramUsername,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send Telegram notification")
      }

      // Update transaction to mark telegram message as sent
      await supabase.from("transactions").update({ telegram_message_sent: true }).eq("id", transactionId)
    } catch (error) {
      console.error("Telegram notification error:", error)
      // Don't throw error here as the transaction was created successfully
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>প্যাকেজ কিনুন</span>
          </DialogTitle>
          <DialogDescription>
            <strong>{pkg.name}</strong> - ৳{pkg.price}
            <br />
            {pkg.description}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Gmail ইমেইল</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                required
                disabled={!!userEmail} // Disable if user is logged in
              />
            </div>
            {userEmail && <p className="text-xs text-muted-foreground">লগইন করা ইমেইল ব্যবহার হবে</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telegramUsername">Telegram Username</Label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="telegramUsername"
                name="telegramUsername"
                type="text"
                placeholder="username (@ ছাড়া)"
                value={formData.telegramUsername}
                onChange={handleInputChange}
                className="pl-10"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">
              আপনার Telegram username লিখুন (@ চিহ্ন ছাড়া)। এখানে ইনভয়েস পাঠানো হবে।
            </p>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">অর্ডার সারাংশ:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>প্যাকেজ:</span>
                <span>{pkg.name}</span>
              </div>
              <div className="flex justify-between">
                <span>মূল্য:</span>
                <span>৳{pkg.price}</span>
              </div>
              <div className="flex justify-between">
                <span>সময়কাল:</span>
                <span>
                  {pkg.duration_days === 365
                    ? "১ বছর"
                    : pkg.duration_days === 30
                      ? "৩০ দিন"
                      : `${pkg.duration_days} দিন`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              বাতিল
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 button-primary">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  প্রক্রিয়াকরণ...
                </>
              ) : (
                "অর্ডার করুন"
              )}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground text-center">
          অর্ডার করার পর আপনার Telegram এ ইনভয়েস এবং পেমেন্ট নির্দেশনা পাঠানো হবে।
        </div>
      </DialogContent>
    </Dialog>
  )
}
