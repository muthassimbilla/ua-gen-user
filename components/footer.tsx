"use client"

import Link from "next/link"
import { ArrowUp, Twitter, Linkedin, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative bg-card border-t border-border overflow-hidden">
      {/* Enhanced decorative purple gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/3 to-tertiary/2" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-primary/8 to-transparent blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-accent/6 to-transparent blur-3xl animate-pulse" />

      <div className="container relative z-10 mx-auto px-4 py-12">
        {/* Card-based Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Company Info Card */}
          <div className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 shadow-glow hover:shadow-glow-accent">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl transition-all duration-300 group-hover:scale-110 shadow-glow">
                <img 
                  src="/logo.svg" 
                  alt="UGen Pro Logo" 
                  className="w-full h-full rounded-xl"
                />
              </div>
              <span className="font-bold text-xl gradient-text">UGen Pro</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Professional AI-powered tools for developers and teams. Fast, reliable, and built for scale.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl glass hover:glass-strong flex items-center justify-center transition-all duration-300 hover-lift shadow-glow group"
              >
                <Twitter className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl glass hover:glass-strong flex items-center justify-center transition-all duration-300 hover-lift shadow-glow group"
              >
                <Linkedin className="w-4 h-4 text-foreground group-hover:text-accent transition-colors" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl glass hover:glass-strong flex items-center justify-center transition-all duration-300 hover-lift shadow-glow group"
              >
                <Github className="w-4 h-4 text-foreground group-hover:text-tertiary transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 shadow-glow hover:shadow-glow-accent">
            <h3 className="font-bold text-lg mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium hover-lift block py-1 hover:text-primary">
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link href="#tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium hover-lift block py-1 hover:text-accent">
                  🛠️ Tools
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium hover-lift block py-1 hover:text-tertiary">
                  💰 Pricing
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium hover-lift block py-1 hover:text-primary">
                  📞 Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Card */}
          <div className="glass rounded-2xl p-6 hover:glass-strong transition-all duration-300 shadow-glow hover:shadow-glow-accent">
            <h3 className="font-bold text-lg mb-4 text-foreground">Support</h3>
            <ul className="space-y-2 mb-4">
              <li>
                <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium hover-lift block py-1 hover:text-primary">
                  📚 Help Center
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium hover-lift block py-1 hover:text-accent">
                  📖 Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium hover-lift block py-1 hover:text-tertiary">
                  🔌 API Reference
                </Link>
              </li>
              <li>
                <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium hover-lift block py-1 hover:text-primary">
                  👥 Community
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-xl bg-gradient-to-r from-primary via-accent to-tertiary hover:from-primary/90 hover:via-accent/90 hover:to-tertiary/90 text-primary-foreground shadow-color hover:shadow-glow-accent interactive-scale group"
        >
          <ArrowUp className="h-5 w-5 group-hover:animate-bounce" />
        </Button>
      )}
    </footer>
  )
}
