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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      {/* Minimal top navigation */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </Link>
        <AuthThemeToggle />
      </div>

      {/* Centered content */}
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
