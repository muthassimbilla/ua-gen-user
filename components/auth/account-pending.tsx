"use client"

import { Clock, Mail, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function AccountPending() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth")
  }

  const handleViewPricing = () => {
    router.push("/pricing")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Clock Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full">
            <Clock className="h-12 w-12 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account Pending Approval</h1>
          <p className="text-slate-600 dark:text-slate-400">Your account is waiting for admin approval</p>
        </div>

        {/* Email Card */}
        <Card className="border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Thank you for registering! Your account{" "}
                  <span className="font-medium text-blue-600 dark:text-blue-400">({user?.email})</span> is currently
                  pending approval from our administrators.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What happens next */}
        <div className="space-y-3">
          <h3 className="font-medium text-slate-900 dark:text-slate-100">What happens next:</h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
              Our team will review your account
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
              You'll receive an email notification once approved
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
              After approval, you'll have full access to UAGen Pro
            </li>
          </ul>
        </div>

        {/* Email Verification Warning */}
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <p className="text-sm text-red-700 dark:text-red-300">
              Please verify your email address to complete the registration process.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={handleViewPricing} variant="outline" className="w-full bg-transparent">
            View Pricing Plans
          </Button>
          <Button onClick={handleSignOut} variant="ghost" className="w-full text-slate-600 dark:text-slate-400">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}
