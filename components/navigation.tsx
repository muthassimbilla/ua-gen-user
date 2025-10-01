"use client"

import { memo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLocale } from "@/components/locale-provider"
import { Menu, X } from "lucide-react"

interface NavigationProps {
  className?: string
}

const Navigation = memo(function Navigation({ className = "" }: NavigationProps) {
  const { locale, messages } = useLocale()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: "#features", label: locale === 'bn' ? "ফিচার" : "Features" },
    { href: "#pricing", label: locale === 'bn' ? "মূল্য" : "Pricing" },
    { href: "#testimonials", label: locale === 'bn' ? "প্রশংসাপত্র" : "Testimonials" },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-border transition-all duration-200 ${
      isScrolled 
        ? 'bg-background/95 backdrop-blur-md shadow-sm' 
        : 'bg-background/80 backdrop-blur-sm'
    } ${className}`}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link 
          href="/" 
          className="flex items-center space-x-2 group"
          aria-label={locale === 'bn' ? "টাস্কফ্লো হোম" : "TaskFlow Home"}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary group-hover:scale-105 transition-transform duration-200">
            <span className="font-bold text-primary-foreground text-lg">T</span>
          </div>
          <span className="font-bold text-xl">TaskFlow</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 hover:scale-105"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">
              {locale === 'bn' ? "সাইন ইন" : "Sign In"}
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">
              {locale === 'bn' ? "শুরু করুন" : "Get Started"}
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <Button asChild variant="ghost" size="sm" className="justify-start">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  {locale === 'bn' ? "সাইন ইন" : "Sign In"}
                </Link>
              </Button>
              <Button asChild size="sm" className="justify-start">
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  {locale === 'bn' ? "শুরু করুন" : "Get Started"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
})

export { Navigation }
