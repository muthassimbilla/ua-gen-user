"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Code, Settings, Smartphone, Menu, X, Clock, Home } from "lucide-react"
import ThemeToggle from "./theme-toggle"

const navItems = [
  { name: "Home", href: "/tool", icon: Home, status: "Active" },
  { name: "User Agent Generator", href: "/tool/user-agent-generator", icon: Smartphone, status: "Active" },
  { name: "Duplicate Checker", href: "/tool/api-tester", icon: Code, status: "Coming Soon" },
  { name: "Address Generator", href: "/tool/config-generator", icon: Settings, status: "Coming Soon" },
]

export default function SidebarNavigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const isActive = (href: string, name: string) => {
    if (name === "Home") {
      return pathname === "/tool"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } glass-nav`}
      >
        <div className="flex flex-col h-full relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-40 right-8 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10 relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg glass-floating relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <Code className="w-6 h-6 text-white relative z-10" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent glass-text-glow">
              Flo Hiv Tool
            </span>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 overflow-y-auto relative">
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-4 mb-4">
                Navigation
              </div>
              {navItems.map((item) => {
                const IconComponent = item.icon
                const itemIsActive = isActive(item.href, item.name)
                const isAvailable = item.status === "Active"

                if (!isAvailable) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-60"
                    >
                      <IconComponent className="w-5 h-5 relative z-10 text-slate-400 dark:text-slate-500" />
                      <div className="flex-1 relative z-10">
                        <div className="text-sm">{item.name}</div>
                        <div className="text-xs text-slate-400 dark:text-slate-500">Coming Soon</div>
                      </div>
                      <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500 relative z-10" />
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium group relative overflow-hidden ${
                      itemIsActive
                        ? "glass-button bg-gradient-to-r from-blue-500/20 to-indigo-600/20 text-blue-600 dark:text-blue-400 shadow-lg border border-blue-500/30"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 glass-button hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {itemIsActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
                    )}

                    <IconComponent
                      className={`w-5 h-5 relative z-10 ${
                        itemIsActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500"
                      }`}
                    />
                    <div className="flex-1 relative z-10">
                      <div className="text-sm">{item.name}</div>
                    </div>
                    {itemIsActive && (
                      <div className="w-2 h-2 rounded-full bg-blue-500/60 glass-floating relative z-10" />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="px-4 py-6 border-t border-white/10 relative">
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Theme</span>
              <ThemeToggle />
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400">Flo Hiv Tool © 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-xl glass-button flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
      >
        {isSidebarOpen ? (
          <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        ) : (
          <Menu className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-xl transition-all duration-300"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}
