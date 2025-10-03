"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Menu, Globe } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavigationProps {
  locale: "en" | "bn"
  onLocaleChange: (locale: "en" | "bn") => void
}

export function Navigation({ locale, onLocaleChange }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const content = {
    en: {
      tools: "Tools",
      signIn: "Sign In",
      getStarted: "Get Started",
    },
    bn: {
      tools: "টুল",
      signIn: "সাইন ইন",
      getStarted: "শুরু করুন",
    },
  }

  const t = content[locale]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">UGen Pro</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#tools"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.tools}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onLocaleChange(locale === "en" ? "bn" : "en")}
            className="h-9 w-9"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
          </Button>

          <ThemeToggle />

          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              {t.signIn}
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">{t.getStarted}</Button>
          </Link>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-lg">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <a href="#tools" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              {t.tools}
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
