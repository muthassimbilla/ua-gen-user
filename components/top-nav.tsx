"use client"

import { Bell, Menu, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import Link from "next/link"

interface TopNavProps {
  title: string
  onMenuClick?: () => void
}

export function TopNav({ title, onMenuClick }: TopNavProps) {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <div className="relative flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900 px-6 shadow-sm backdrop-blur-xl">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 opacity-50"></div>
      
      <div className="relative flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 dark:hover:from-purple-900/20 dark:hover:to-blue-900/20 transition-all duration-300 hover:shadow-md" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 flex items-center justify-center shadow-lg">
            <div className="h-4 w-4 rounded-md bg-white/20"></div>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 dark:from-slate-200 dark:via-slate-100 dark:to-slate-200 bg-clip-text text-transparent">
            {user?.full_name || title}
          </h1>
        </div>
      </div>

      <div className="relative flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          disabled={!mounted}
          aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="group rounded-xl hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 hover:shadow-md hover:scale-105"
        >
          <div className="p-1 rounded-lg group-hover:bg-gradient-to-r group-hover:from-yellow-100 group-hover:to-orange-100 dark:group-hover:from-blue-800 dark:group-hover:to-purple-800 transition-all duration-300">
            {mounted ? (
              resolvedTheme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-500 group-hover:text-yellow-600 transition-all duration-300 group-hover:rotate-180" />
              ) : (
                <Moon className="h-5 w-5 text-blue-500 group-hover:text-blue-600 transition-all duration-300 group-hover:-rotate-12" />
              )
            ) : (
              <div className="h-5 w-5 animate-pulse bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded" />
            )}
          </div>
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="group relative rounded-xl hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300 hover:shadow-md hover:scale-105"
        >
          <div className="p-1 rounded-lg group-hover:bg-gradient-to-r group-hover:from-red-100 group-hover:to-pink-100 dark:group-hover:from-red-800 dark:group-hover:to-pink-800 transition-all duration-300">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-all duration-300 group-hover:animate-pulse" />
          </div>
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs border-2 border-white dark:border-slate-900 shadow-lg animate-pulse">
            3
          </Badge>
        </Button>

        {/* Profile Avatar */}
        <Link href="/profile" className="ml-1">
          <div className="group relative">
            <Avatar className="h-9 w-9 cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-lg ring-2 ring-transparent hover:ring-purple-300 dark:hover:ring-purple-600">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 text-white text-sm font-bold shadow-inner">
                {user?.full_name?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"></div>
          </div>
        </Link>
      </div>
    </div>
  )
}
