"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Smartphone, Menu, X, Clock, Home, MapPin } from "lucide-react"
import ThemeToggle from "./theme-toggle"

const navItems = [
  { name: "Home", href: "/premium-tools", icon: Home, status: "Active" },
  { name: "User Agent Generator", href: "/tool/user-agent-generator", icon: Smartphone, status: "Active" },
  { name: "Address Generator", href: "/tool/address-generator", icon: MapPin, status: "Active" },
]

export default function SidebarNavigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const isActive = (href: string, name: string) => {
    if (name === "Home") {
      return pathname === "/premium-tools"
    }
    if (name === "User Agent Generator") {
      return pathname === "/tool/user-agent-generator"
    }
    if (name === "Address Generator") {
      return pathname === "/tool/address-generator"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-500 ease-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } bg-gradient-to-b from-white/20 via-white/10 to-white/5 dark:from-gray-900/30 dark:via-gray-900/20 dark:to-gray-900/10 backdrop-blur-2xl border-r border-white/30 dark:border-gray-700/40 shadow-2xl`}
      >
        <div className="flex flex-col h-full relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-40 right-8 w-24 h-24 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "2s" }}
            />
          </div>

          {/* Logo */}
          <div className="flex items-center gap-4 px-6 py-8 border-b border-white/30 dark:border-gray-700/40 relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-white/20" />
              {/* U Letter Logo */}
              <img
                src="/u-logo.svg"
                alt="UGen Pro Logo"
                className="w-full h-full relative z-10 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="flex-1">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                UGen Pro
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Developer Suite</p>
            </div>
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
                    className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-medium group relative overflow-hidden min-h-[60px] ${
                      itemIsActive
                        ? "bg-gradient-to-r from-blue-500/25 via-indigo-500/20 to-purple-500/25 text-blue-600 dark:text-blue-400 shadow-xl border border-blue-500/40 backdrop-blur-sm transform scale-[1.02]"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white/15 dark:hover:bg-gray-800/40 backdrop-blur-sm hover:scale-[1.02] hover:shadow-lg"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {itemIsActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-pulse" />
                    )}

                    <div
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        itemIsActive
                          ? "bg-blue-500/20 dark:bg-blue-500/30"
                          : "bg-slate-100/50 dark:bg-slate-800/50 group-hover:bg-blue-500/20"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 relative z-10 transition-all duration-300 ${
                          itemIsActive
                            ? "text-blue-600 dark:text-blue-400 scale-110"
                            : "text-slate-500 dark:text-slate-400 group-hover:text-blue-500 group-hover:scale-110"
                        }`}
                      />
                    </div>
                    <div className="flex-1 relative z-10 min-w-0">
                      <div className="text-sm font-semibold whitespace-nowrap truncate">{item.name}</div>
                    </div>
                    {itemIsActive && (
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse relative z-10 shadow-lg" />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="px-4 py-6 border-t border-white/30 dark:border-gray-700/40 relative">
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-white/10 dark:bg-gray-800/30 backdrop-blur-sm border border-white/20 dark:border-gray-700/30">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Theme</span>
              <ThemeToggle />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">UGen Pro © 2025</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">Made with ❤️ for developers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 w-14 h-14 rounded-2xl bg-white/20 dark:bg-gray-900/20 backdrop-blur-xl border border-white/30 dark:border-gray-700/40 flex items-center justify-center shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 active:scale-95"
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
