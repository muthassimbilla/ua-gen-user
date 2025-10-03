"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Menu, Globe, X } from "lucide-react"
import { useState, useEffect } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavigationProps {
  locale: "en" | "bn"
  onLocaleChange: (locale: "en" | "bn") => void
  activeSection?: string
}

export function Navigation({ locale, onLocaleChange, activeSection = "hero" }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const content = {
    en: {
      home: "Home",
      tools: "Tools",
      pricing: "Pricing",
      testimonials: "Reviews",
      signIn: "Sign In",
      getStarted: "Get Started",
    },
    bn: {
      home: "হোম",
      tools: "টুল",
      pricing: "প্রাইসিং",
      testimonials: "রিভিউ",
      signIn: "সাইন ইন",
      getStarted: "শুরু করুন",
    },
  }

  const t = content[locale]

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { id: "hero", label: t.home, href: "#hero" },
    { id: "tools", label: t.tools, href: "#tools" },
    { id: "pricing", label: t.pricing, href: "#pricing" },
    { id: "testimonials", label: t.testimonials, href: "#testimonials" },
  ]

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
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            UGen Pro
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                activeSection === item.id
                  ? "text-purple-600 dark:text-purple-400"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-full" />
              )}
            </a>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onLocaleChange(locale === "en" ? "bn" : "en")}
            className="h-9 w-9 hover:bg-purple-500/10 hover:text-purple-600 transition-all"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
          </Button>

          <ThemeToggle />

          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm" className="hover:bg-purple-500/10 hover:text-purple-600">
              {t.signIn}
            </Button>
          </Link>
          <Link href="/signup">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
            >
              {t.getStarted}
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
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSection === item.id
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                    : "text-muted-foreground hover:bg-muted"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link href="/login" className="block sm:hidden">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                {t.signIn}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
