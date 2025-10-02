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
  BookOpen,
  Users,
  Bookmark,
  Settings,
  ChevronDown,
  Search,
  Sparkles,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navigation = [
  { name: "Home", href: "/tool", icon: Home, count: null },
  { name: "Apps", href: "/tool", icon: Layers, count: 2 },
  { name: "Files", href: "/tool", icon: FileText, count: null },
  { name: "Projects", href: "/tool", icon: FolderKanban, count: 4 },
  { name: "Learn", href: "/tool", icon: BookOpen, count: null },
  { name: "Community", href: "/tool", icon: Users, count: null },
  { name: "Resources", href: "/tool", icon: Bookmark, count: null },
]

export function SidebarNav() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight">UGen Pro</h1>
          <p className="text-xs text-muted-foreground">Creative Suite</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search..." className="pl-9 bg-muted/50 border-0 focus-visible:ring-1" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          const hasDropdown = ["Apps", "Files", "Projects", "Learn", "Community", "Resources"].includes(item.name)
          const isExpanded = expandedItems.includes(item.name)

          return (
            <div key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
                onClick={(e) => {
                  if (hasDropdown) {
                    e.preventDefault()
                    toggleExpand(item.name)
                  }
                }}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.count !== null && (
                  <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs">
                    {item.count}
                  </Badge>
                )}
                {hasDropdown && (
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                )}
              </Link>
            </div>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <Link
          href="/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors mb-2"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">John Doe</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            Pro
          </Badge>
        </div>
      </div>
    </div>
  )
}
