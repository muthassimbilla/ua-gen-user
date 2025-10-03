"use client"

import Link from "next/link"
import ThemeToggle from "./theme-toggle"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { LogOut, User } from "lucide-react"
import { Button } from "./ui/button"

export default function SimpleHeader() {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-16 bg-gradient-to-r from-white/95 via-white/90 to-white/95 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/95 backdrop-blur-2xl border-b border-white/40 dark:border-slate-700/50 shadow-xl">
      <div className="flex items-center justify-between h-full px-6 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <Image src="/ugenpro-logo.svg" alt="UGen Pro Logo" width={24} height={24} className="rounded-lg relative z-10 object-contain w-full h-full" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            UGen Pro
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200/50 dark:border-blue-800/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user.full_name}</span>
            </div>
          )}

          <ThemeToggle />

          {/* Logout Button */}
          {user && (
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200/50 dark:border-red-800/50 hover:from-red-100 hover:to-orange-100 dark:hover:from-red-900/40 dark:hover:to-orange-900/40 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-semibold">লগ আউট</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
