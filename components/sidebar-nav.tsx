"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Layers,
  ChevronDown,
  Sparkles,
  Smartphone,
  MapPin,
  Mail,
  LogOut,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/tool", icon: Home, count: null },
  { name: "Tools", href: "/tool", icon: Layers, count: 3, hasDropdown: true },
]

const toolsSubmenu = [
  { name: "User Agent Generator", href: "/tool/user-agent-generator", icon: Smartphone },
  { name: "Address Generator", href: "/tool/address-generator", icon: MapPin },
  { name: "Email2Name", href: "/tool/email2name", icon: Mail },
]

export function SidebarNav() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Tools"])

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-r border-slate-200 dark:border-slate-700 shadow-xl">
      {/* Header with enhanced design */}
      <div className="relative flex h-16 items-center gap-3 border-b border-slate-200 dark:border-slate-700 px-6 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 opacity-50"></div>
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent"></div>
          <Sparkles className="h-6 w-6 text-white relative z-10 animate-pulse" />
        </div>
        <div className="relative">
          <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">UGen Pro</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Creative Suite</p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-2 right-2 h-1 w-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-2 right-4 h-1 w-1 bg-blue-400 rounded-full animate-pulse"></div>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-6 overflow-y-auto bg-gradient-to-b from-transparent via-slate-50/30 to-transparent dark:via-slate-800/30">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.name === "Tools" && pathname.startsWith("/tool"))
          const isExpanded = expandedItems.includes(item.name)

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 overflow-hidden",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]"
                    : "text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10 hover:text-blue-700 dark:hover:text-blue-300 hover:shadow-sm hover:scale-[1.01]"
                )}
                onClick={(e) => {
                  if (item.hasDropdown) {
                    e.preventDefault()
                    toggleExpand(item.name)
                  }
                }}
              >
                {/* Shimmer effect for active items */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
                )}
                <div className={cn(
                  "relative p-2 rounded-lg transition-all duration-300",
                  isActive 
                    ? "bg-white/20 shadow-inner" 
                    : "group-hover:bg-white/10 dark:group-hover:bg-black/10"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-300",
                    isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  )} />
                </div>
                <span className="flex-1 font-semibold">{item.name}</span>
                {item.count !== null && (
                  <Badge className={cn(
                    "h-6 min-w-6 px-2 text-xs font-bold transition-all duration-300",
                    isActive 
                      ? "bg-white/20 text-white border-white/30" 
                      : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30"
                  )}>
                    {item.count}
                  </Badge>
                )}
                {item.hasDropdown && (
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-all duration-300",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600",
                    isExpanded && "rotate-180"
                  )} />
                )}
              </Link>

              {item.name === "Tools" && isExpanded && (
                <div className="ml-6 mt-2 space-y-1 relative">
                  {/* Connecting line */}
                  <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 to-indigo-300 dark:from-blue-600 dark:to-indigo-600"></div>
                  {toolsSubmenu.map((subItem, index) => {
                    const isSubActive = pathname === subItem.href
                    return (
                      <div key={subItem.name} className="relative">
                        {/* Connection dot */}
                        <div className="absolute left-1.5 top-3 h-2 w-2 rounded-full bg-blue-400 dark:bg-blue-500"></div>
                        <Link
                          href={subItem.href}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ml-4",
                            isSubActive
                              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm border-l-2 border-blue-400"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:from-slate-800 dark:hover:to-slate-700 hover:text-slate-700 dark:hover:text-slate-200 hover:shadow-sm"
                          )}
                        >
                          <div className={cn(
                            "p-1.5 rounded-md transition-all duration-300",
                            isSubActive 
                              ? "bg-blue-100 dark:bg-blue-800" 
                              : "group-hover:bg-slate-200 dark:group-hover:bg-slate-600"
                          )}>
                            <subItem.icon className={cn(
                              "h-4 w-4 flex-shrink-0 transition-all duration-300",
                              isSubActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                            )} />
                          </div>
                          <span className="font-medium">{subItem.name}</span>
                          {/* Hover indicator */}
                          <div className={cn(
                            "absolute right-2 h-1 w-1 rounded-full transition-all duration-300",
                            isSubActive ? "bg-blue-400" : "bg-transparent group-hover:bg-slate-400"
                          )}></div>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 dark:border-slate-700 p-4 space-y-3 bg-gradient-to-t from-slate-50/50 to-transparent dark:from-slate-800/50">
        {/* Account Status Card */}
        <div className="relative rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border border-green-200/50 dark:border-green-700/50 px-4 py-3 shadow-lg backdrop-blur-sm overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-emerald-200/30 dark:from-green-600/20 dark:to-emerald-600/20 rounded-full -translate-y-10 translate-x-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-teal-200/30 to-green-200/30 dark:from-teal-600/20 dark:to-green-600/20 rounded-full translate-y-8 -translate-x-8"></div>
          
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative">
                <div className="h-3 w-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute inset-0 h-3 w-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-75"></div>
              </div>
              <p className="text-sm font-bold bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">Account Active</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Expires on:</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                {user?.expiryDate ? new Date(user.expiryDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'Dec 31, 2024'}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="group w-full justify-start gap-3 rounded-xl px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-gradient-to-r hover:from-red-50 hover:via-pink-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:via-pink-900/20 dark:hover:to-rose-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:shadow-md border border-transparent hover:border-red-200 dark:hover:border-red-800"
        >
          <div className="p-1.5 rounded-lg group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-all duration-300">
            <LogOut className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
          </div>
          <span className="font-medium">Logout</span>
          <div className="ml-auto h-1 w-1 rounded-full bg-transparent group-hover:bg-red-400 transition-all duration-300"></div>
        </Button>
      </div>
    </div>
  )
}
