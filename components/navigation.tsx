"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles, Menu } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            UGen Pro
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-10">
          <a
            href="#features"
            className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
          >
            Pricing
          </a>
          <a
            href="#testimonials"
            className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
          >
            Testimonials
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/login">
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden sm:inline-flex hover:bg-primary/10 transition-all duration-300"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-6 space-y-4">
            <a
              href="#features"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2 cursor-pointer"
              onClick={() => setMobileMenuOpen(false)}
            >
              Testimonials
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
