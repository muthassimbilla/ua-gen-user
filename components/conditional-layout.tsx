"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import SidebarNavigation from "@/components/sidebar-navigation"
import TopNavigation from "@/components/top-navigation"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  const { user, loading } = useAuth()

  // Routes that don't need sidebar (auth pages)
  const authRoutes = ["/login", "/signup"]
  const isAuthRoute = authRoutes.includes(pathname)

  // Show loading while checking authentication for non-auth routes
  if (!isAuthRoute && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          {/* Animated Spinner Container */}
          <div className="relative">
            {/* Outer Ring */}
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
            
            {/* Inner Ring */}
            <div className="absolute inset-2 w-16 h-16 border-4 border-purple-200 dark:border-purple-800 rounded-full animate-spin border-t-purple-600 dark:border-t-purple-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
            </div>
            
            {/* Sparkle Effects */}
            <div className="absolute -top-3 -right-3">
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <div className="absolute -bottom-3 -left-3">
              <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
          
          {/* Loading Text with Animation */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">Loading UGen Pro</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-4">Initializing your workspace...</p>
            
            {/* Animated Dots */}
            <div className="flex items-center justify-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // For auth routes, render without sidebar and top nav
  if (isAuthRoute) {
    return <>{children}</>
  }

  // For protected routes, render with both sidebar and top nav if user is authenticated
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <SidebarNavigation />
        <TopNavigation />
        <div className="lg:ml-64 pt-16">{children}</div>
      </div>
    )
  }

  // If not authenticated and not on auth route, render without sidebar
  // (middleware will handle redirects)
  return <>{children}</>
}
