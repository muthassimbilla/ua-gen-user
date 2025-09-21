"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { UserManagementTable } from "@/components/admin/user-management-table"
import { useAuth } from "@/hooks/use-auth"
import { AuthForm } from "@/components/auth/auth-form"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield } from "lucide-react"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const { user, profile, loading, isAdmin } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Card className="w-full max-w-md bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-2xl">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-indigo-600 dark:text-indigo-400" />
            <p className="text-slate-600 dark:text-slate-300">লোড হচ্ছে...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Card className="w-full max-w-md bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/80 to-orange-600/80 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <Alert className="border-red-200/50 bg-red-50/20 backdrop-blur-sm">
              <AlertDescription className="text-red-800 dark:text-red-200">
                আপনার এই পেজে প্রবেশের অনুমতি নেই। শুধুমাত্র অ্যাডমিনরা এই পেজ দেখতে পারবেন।
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />
      case "users":
        return <UserManagementTable statusFilter="all" />
      case "pending":
        return <UserManagementTable statusFilter="pending" />
      case "approved":
        return <UserManagementTable statusFilter="approved" />
      case "rejected":
        return <UserManagementTable statusFilter="rejected" />
      case "suspended":
        return <UserManagementTable statusFilter="suspended" />
      case "settings":
        return (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 backdrop-blur-md rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">সেটিংস</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  সেটিংস পেজ শীঘ্রই আসছে। এখানে আপনি সিস্টেম কনফিগারেশন, প্রাইসিং প্যাকেজ এবং অন্যান্য সেটিংস পরিবর্তন করতে পারবেন।
                </p>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return <AdminDashboard />
    }
  }

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  )
}
