"use client"

import { useState, useRef, useEffect } from "react"
import { User, LogOut, ChevronDown, Settings } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function TopNavigation() {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  if (!user) return null

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 h-16 bg-gradient-to-r from-white/95 via-white/90 to-white/95 dark:from-slate-900/95 dark:via-slate-900/90 dark:to-slate-900/95 backdrop-blur-2xl border-b border-white/40 dark:border-slate-700/50 lg:left-64 shadow-xl">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - User's full name */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              Welcome, {user.full_name}
            </h1>
          </div>
          <div className="sm:hidden">
            <h1 className="text-base font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              {user.full_name}
            </h1>
          </div>
        </div>

        {/* Right side - Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-slate-100/80 to-slate-200/60 dark:from-slate-800/80 dark:to-slate-700/60 hover:from-slate-200/80 hover:to-slate-300/60 dark:hover:from-slate-700/80 dark:hover:to-slate-600/60 transition-all duration-300 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <User className="w-5 h-5 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-all duration-300 ${
                isProfileOpen ? "rotate-180 scale-110" : "group-hover:scale-110"
              }`}
            />
          </button>

          {/* Profile dropdown card */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-gradient-to-br from-white/95 to-white/90 dark:from-slate-800/95 dark:to-slate-900/90 rounded-3xl shadow-2xl border border-white/40 dark:border-slate-700/50 backdrop-blur-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300">
              {/* Profile header */}
              <div className="p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-slate-800/80 dark:to-slate-700/80 border-b border-slate-200/50 dark:border-slate-600/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                    <User className="w-7 h-7 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg">{user.full_name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                      {user.email || (user.telegram_username ? `@${user.telegram_username}` : "")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Profile info */}
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Account Created:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">
                      {new Date(user.created_at).toLocaleDateString("en-US")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/50">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Last Updated:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-semibold">
                      {new Date(user.updated_at).toLocaleDateString("en-US")}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Link
                    href="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-800/20 hover:from-blue-100 hover:to-indigo-200 dark:hover:from-blue-900/30 dark:hover:to-indigo-800/30 text-blue-600 dark:text-blue-400 rounded-2xl transition-all duration-300 font-semibold hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <Settings className="w-5 h-5" />
                    View Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:from-red-100 hover:to-red-200 dark:hover:from-red-900/30 dark:hover:to-red-800/30 text-red-600 dark:text-red-400 rounded-2xl transition-all duration-300 font-semibold hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
