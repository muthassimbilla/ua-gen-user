"use client"

import React from "react"
import Link from "next/link"
import AuthThemeToggle from "@/components/auth-theme-toggle"

interface AuthLayoutProps {
  children: React.ReactNode
  variant?: "login" | "signup"
}

export default function AuthLayout({ children, variant = "login" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 page-enter">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 dark:bg-gray-800/30 backdrop-blur-md border border-white/30 dark:border-gray-700/40 text-blue-600 dark:text-blue-400 hover:bg-white/30 dark:hover:bg-gray-800/40 hover:border-blue-300/60 dark:hover:border-blue-500/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-semibold">Go back</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-20">
        <div className="relative group">
          <AuthThemeToggle />
          <div className="absolute -bottom-12 right-0 bg-gray-900/90 dark:bg-gray-100/90 text-white dark:text-gray-900 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap backdrop-blur-sm">
            Toggle theme
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-7xl relative z-10">
        {children}
      </div>
    </div>
  )
}
