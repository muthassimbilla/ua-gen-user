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
    <div className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{user?.full_name || title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          disabled={!mounted}
          aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="hover:bg-primary/10"
        >
          {mounted ? (
            resolvedTheme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-500" />
            )
          ) : (
            <div className="h-5 w-5 animate-pulse bg-muted rounded" />
          )}
        </Button>
        <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs border-2 border-background">
            3
          </Badge>
        </Button>
        <Link href="/profile" className="ml-2">
          <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs font-semibold">
              {user?.full_name?.substring(0, 2).toUpperCase() || user?.email?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </div>
  )
}
