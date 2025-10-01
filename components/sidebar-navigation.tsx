"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Smartphone, Menu, X, Clock, Home, MapPin } from "lucide-react"
import ThemeToggle from "./theme-toggle"

const navItems = [
  { name: "Home", href: "/tool", icon: Home, status: "Active" },
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
      return pathname === "/tool"
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
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-lg`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200 dark:border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <img src="/u-logo.svg" alt="UGen Pro Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <span className="text-lg font-bold text-gray-900 dark:text-white">UGen Pro</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Developer Suite</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon
                const itemIsActive = isActive(item.href, item.name)
                const isAvailable = item.status === "Active"

                if (!isAvailable) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60"
                    >
                      <IconComponent className="w-5 h-5" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs">Coming Soon</div>
                      </div>
                      <Clock className="w-4 h-4" />
                    </div>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      itemIsActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        itemIsActive
                          ? "bg-blue-100 dark:bg-blue-800/30"
                          : "bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 transition-colors ${
                          itemIsActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        }`}
                      />
                    </div>
                    <span className="flex-1 text-sm font-medium">{item.name}</span>
                    {itemIsActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
              <ThemeToggle />
            </div>
            <div className="text-center space-y-1 px-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">UGen Pro © 2025</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Made with ❤️ for developers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 w-12 h-12 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
      >
        {isSidebarOpen ? (
          <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}
