"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavigationProps {
  activeSection?: string
}

export function Navigation({ activeSection = "hero" }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { id: "hero", label: "Home", href: "#hero" },
    { id: "tools", label: "Tools", href: "#tools" },
    { id: "pricing", label: "Pricing", href: "#pricing" },
    { id: "testimonials", label: "Reviews", href: "#testimonials" },
  ]

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl border-b shadow-lg"
          : "bg-background/80 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            UGen Pro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg ${
                activeSection === item.id
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </a>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="hover:bg-blue-500/10 hover:text-blue-600 font-semibold">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg hover:shadow-blue-500/50 transition-all duration-300 font-semibold"
            >
              Get Started
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/98 backdrop-blur-xl animate-in slide-in-from-top-2 duration-300">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  activeSection === item.id
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link href="/login" className="block sm:hidden">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
