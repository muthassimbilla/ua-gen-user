"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function AuthThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 animate-pulse" />
    )
  }

  const toggleTheme = () => {
    if (theme === "system") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("system")
    }
  }

  const getIcon = () => {
    if (theme === "system") {
      return <Monitor className="w-5 h-5 text-blue-500 transition-transform duration-200" />
    } else if (resolvedTheme === "dark") {
      return <Sun className="w-5 h-5 text-yellow-500 transition-transform duration-200" />
    } else {
      return <Moon className="w-5 h-5 text-slate-600 transition-transform duration-200" />
    }
  }

  const getLabel = () => {
    if (theme === "system") {
      return "Switch to light mode"
    } else if (resolvedTheme === "dark") {
      return "Switch to system mode"
    } else {
      return "Switch to dark mode"
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-12 h-12 rounded-2xl bg-white/10 dark:bg-gray-900/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-800/30 hover:border-white/30 dark:hover:border-gray-600/40 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl group"
      aria-label={getLabel()}
      title={getLabel()}
    >
      <div className="group-hover:scale-110 transition-transform duration-200">
        {getIcon()}
      </div>
    </button>
  )
}
