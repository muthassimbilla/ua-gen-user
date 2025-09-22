"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface ThemeToggleProps {
  className?: string
}

function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    
    if (theme === "system") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("dark")
    } else {
      setTheme("system")
    }
  }

  const getIcon = () => {
    if (!mounted) {
      return <Monitor className="w-5 h-5 text-slate-400 opacity-50" />
    }

    if (theme === "system") {
      return <Monitor className="w-5 h-5 text-blue-500 transition-transform duration-200" />
    } else if (resolvedTheme === "dark") {
      return <Moon className="w-5 h-5 text-yellow-400 transition-transform duration-200" />
    } else {
      return <Sun className="w-5 h-5 text-orange-500 transition-transform duration-200" />
    }
  }

  const getLabel = () => {
    if (!mounted) return "Loading theme toggle"

    if (theme === "system") {
      return "Currently system theme, click to switch to light mode"
    } else if (resolvedTheme === "dark") {
      return "Currently dark theme, click to switch to system mode"
    } else {
      return "Currently light theme, click to switch to dark mode"
    }
  }

  const getTitle = () => {
    if (!mounted) return "Theme toggle loading..."

    if (theme === "system") {
      return "System theme (Auto)"
    } else if (resolvedTheme === "dark") {
      return "Dark theme"
    } else {
      return "Light theme"
    }
  }

  // Prevent hydration mismatch by showing a consistent loading state
  if (!mounted) {
    return (
      <button
        className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center opacity-50 cursor-not-allowed ${className}`}
        aria-label="Loading theme toggle"
        title="Loading theme toggle"
        disabled
      >
        <Monitor className="w-5 h-5 text-slate-400" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 ${className}`}
      aria-label={getLabel()}
      title={getTitle()}
      type="button"
    >
      {getIcon()}
    </button>
  )
}

export default ThemeToggle
export { ThemeToggle }
export type { ThemeToggleProps }
