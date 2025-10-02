import type React from "react"
import { Inter } from "next/font/google"
import { AdminAuthProvider } from "@/lib/admin-auth-context"
import { AdminConditionalLayout } from "@/components/admin-conditional-layout"

const inter = Inter({ subsets: ["latin"] })

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <div
        className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20 relative overflow-hidden`}
      >
        {/* Floating color orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <AdminConditionalLayout>{children}</AdminConditionalLayout>
      </div>
    </AdminAuthProvider>
  )
}
