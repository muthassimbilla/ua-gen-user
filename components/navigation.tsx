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
          ? "bg-background/98 backdrop-blur-2xl border-b-2 border-border/50 shadow-xl shadow-black/5"
          : "bg-background/60 backdrop-blur-lg border-b-2 border-transparent"
      }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-6 md:px-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 shadow-xl group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
            <Sparkles className="h-6 w-6 text-white group-hover:animate-pulse" />
          </div>
          <span className="font-extrabold text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            UGen Pro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`relative px-5 py-2.5 text-sm font-bold transition-all duration-300 rounded-xl ${
                activeSection === item.id
                  ? "text-blue-600 dark:text-blue-400 bg-blue-500/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
              )}
            </a>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" className="hover:bg-blue-500/10 hover:text-blue-600 font-bold px-5 py-2 rounded-xl text-sm">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-xl hover:shadow-blue-500/50 transition-all duration-300 font-bold px-6 py-2.5 rounded-xl text-sm hover:scale-105"
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
        <div className="md:hidden border-t-2 border-border/50 bg-background/98 backdrop-blur-2xl animate-in slide-in-from-top-2 duration-300 shadow-xl">
          <div className="container mx-auto px-6 py-6 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`block px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${
                  activeSection === item.id
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground hover:bg-muted/80"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link href="/login" className="block sm:hidden">
              <Button variant="ghost" className="w-full justify-start font-bold px-5 py-3.5 rounded-xl">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
