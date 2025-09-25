"use client"

import { useState, useRef, useEffect } from "react"
import { User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

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
    <div className="fixed top-0 left-0 right-0 z-40 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 lg:left-64">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - User's full name */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Welcome, {user.full_name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">@{user.telegram_username}</p>
          </div>
          <div className="sm:hidden">
            <h1 className="text-base font-semibold text-slate-800 dark:text-slate-200">{user.full_name}</h1>
          </div>
        </div>

        {/* Right side - Profile dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-all duration-200 border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform duration-200 ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile dropdown card */}
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl overflow-hidden">
              {/* Profile header */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border-b border-slate-200/50 dark:border-slate-600/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{user.full_name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">@{user.telegram_username}</p>
                  </div>
                </div>
              </div>

              {/* Profile info */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Account Created:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {new Date(user.created_at).toLocaleDateString("en-US")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Last Updated:</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {new Date(user.updated_at).toLocaleDateString("en-US")}
                    </span>
                  </div>
                </div>

                {/* Logout button */}
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-600/50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl transition-all duration-200 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
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
