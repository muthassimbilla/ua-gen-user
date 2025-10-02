"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Menu } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl">UGen Pro</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <a href="#features" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#pricing" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </a>
            <a href="#testimonials" className="block text-sm font-medium py-2" onClick={() => setMobileMenuOpen(false)}>
              Testimonials
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
