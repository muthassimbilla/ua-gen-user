"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Layers,
  FileText,
  FolderKanban,
  Settings,
  ChevronDown,
  Sparkles,
  Smartphone,
  MapPin,
  Mail,
  LogOut,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/tool", icon: Home, count: null },
  { name: "Tools", href: "/tool", icon: Layers, count: 3, hasDropdown: true },
  { name: "Profile", href: "/profile", icon: FileText, count: null },
  { name: "Premium", href: "/premium-tools", icon: FolderKanban, count: null },
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
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-blue-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold">UGen Pro</h1>
          <p className="text-xs text-muted-foreground">Creative Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.name === "Tools" && pathname.startsWith("/tool"))
          const isExpanded = expandedItems.includes(item.name)

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                onClick={(e) => {
                  if (item.hasDropdown) {
                    e.preventDefault()
                    toggleExpand(item.name)
                  }
                }}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.count !== null && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs bg-primary/20 text-primary">
                    {item.count}
                  </Badge>
                )}
                {item.hasDropdown && (
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                )}
              </Link>

              {item.name === "Tools" && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {toolsSubmenu.map((subItem) => {
                    const isSubActive = pathname === subItem.href
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                          isSubActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <subItem.icon className="h-4 w-4" />
                        <span>{subItem.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="border-t p-4 space-y-2">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-xs font-semibold">
              {user?.email?.substring(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.email || "User"}</p>
            <p className="text-xs text-muted-foreground">Pro Plan</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}
