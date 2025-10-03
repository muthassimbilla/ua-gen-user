"use client"

import Link from "next/link"
import { Sparkles, Twitter, Github, Linkedin, Mail, Heart, ArrowUp } from "lucide-react"
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
    <footer className="relative border-t-2 border-border/50 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-emerald-600 shadow-lg group-hover:shadow-blue-500/50 transition-all group-hover:scale-110 duration-300">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                UGen Pro
              </span>
            </Link>
            <p className="text-muted-foreground/80 text-base leading-relaxed mb-6 max-w-sm">
              Advanced generator tools for developers and professionals. Create user agents, addresses, and more with
              our powerful AI-powered platform.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="https://twitter.com"
                target="_blank"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 border-2 border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 hover:scale-110 transition-all shadow-sm hover:shadow-lg hover:shadow-blue-500/20"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border-2 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 hover:scale-110 transition-all shadow-sm hover:shadow-lg hover:shadow-emerald-500/20"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://linkedin.com"
                target="_blank"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/10 border-2 border-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 hover:scale-110 transition-all shadow-sm hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:hello@ugenpro.com"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 border-2 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 hover:scale-110 transition-all shadow-sm hover:shadow-lg hover:shadow-amber-500/20"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-extrabold text-lg mb-5 text-foreground">Product</h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="#tools"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/tool"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  Tools
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-extrabold text-lg mb-5 text-foreground">Company</h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-extrabold text-lg mb-5 text-foreground">Legal</h3>
            <ul className="space-y-3.5">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all hover:translate-x-1 inline-block font-medium"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-border/50 pt-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground/80 flex items-center gap-1.5 font-medium">
            © 2025 UGen Pro. Made with <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" /> by developers, for developers.
          </p>
          <div className="flex items-center gap-8 text-sm text-muted-foreground/80">
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Status
            </Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Changelog
            </Link>
            <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              Docs
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 animate-in slide-in-from-bottom-4"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </footer>
  )
}
