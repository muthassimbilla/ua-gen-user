"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { NotificationBell } from "@/components/notifications/notification-bell"
import { Users, UserCheck, UserX, Settings, BarChart3, Menu, X, LogOut, Shield, Wifi, WifiOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRealtime } from "@/components/realtime/realtime-provider"

interface AdminLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

const sidebarItems = [
  { id: "dashboard", label: "ড্যাশবোর্ড", icon: BarChart3 },
  { id: "users", label: "ইউজার ম্যানেজমেন্ট", icon: Users },
  { id: "pending", label: "অনুমোদনের অপেক্ষায়", icon: UserCheck },
  { id: "rejected", label: "প্রত্যাখ্যাত ইউজার", icon: UserX },
  { id: "settings", label: "সেটিংস", icon: Settings },
]

export function AdminLayout({ children, activeTab, onTabChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { stats, isConnected } = useRealtime()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-sidebar-primary" />
              <h1 className="text-lg font-bold text-sidebar-foreground">Admin Panel</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
              {isConnected ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-red-500" />}
              <span>{isConnected ? "সংযুক্ত" : "সংযোগ বিচ্ছিন্ন"}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted rounded p-2">
                <div className="font-medium">{stats.onlineUsers}</div>
                <div className="text-muted-foreground">অনলাইন</div>
              </div>
              <div className="bg-muted rounded p-2">
                <div className="font-medium">{stats.pendingApprovals}</div>
                <div className="text-muted-foreground">অপেক্ষমান</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start nav-link-transition",
                    activeTab === item.id && "nav-link-active bg-sidebar-primary text-sidebar-primary-foreground",
                  )}
                  onClick={() => {
                    onTabChange(item.id)
                    setSidebarOpen(false)
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="mb-3">
              <p className="text-sm font-medium text-sidebar-foreground">{profile?.full_name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-sidebar-accent text-sidebar-accent-foreground mt-1">
                {profile?.role === "super_admin" ? "সুপার অ্যাডমিন" : "অ্যাডমিন"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full bg-transparent">
              <LogOut className="mr-2 h-4 w-4" />
              লগআউট
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                <Menu className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold text-foreground">
                {sidebarItems.find((item) => item.id === activeTab)?.label || "ড্যাশবোর্ড"}
              </h2>
            </div>

            <div className="flex items-center space-x-2">
              <NotificationBell />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
