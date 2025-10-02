"use client"

import { Bell, Cloud, MessageSquare, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TopNavProps {
  title: string
  onMenuClick?: () => void
}

export function TopNav({ title, onMenuClick }: TopNavProps) {
  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Cloud className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
            3
          </Badge>
        </Button>
        <Avatar className="h-8 w-8 ml-2">
          <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xs">
            JD
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}
