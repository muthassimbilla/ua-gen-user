"use client"

import type React from "react"
import Link from "next/link"
import AuthThemeToggle from "@/components/auth-theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
  variant?: "login" | "signup"
}

export default function AuthLayout({ children, variant = "login" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-400/30 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-32 w-64 h-64 bg-purple-400/30 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-400/20 dark:bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Minimal top navigation */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
          ← Back
        </Link>
        <AuthThemeToggle />
      </div>

      {/* Centered content */}
      <div className="w-full max-w-md relative z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-200/50 dark:border-purple-500/20 p-8">
        {children}
      </div>
    </div>
  )
}
