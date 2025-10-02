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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-muted transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Go back</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <AuthThemeToggle />
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl relative z-10">{children}</div>
    </div>
  )
}
