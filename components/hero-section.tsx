"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center pt-20">
      <div className="container relative z-10 mx-auto px-4 py-6">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 border border-purple-500/20 px-4 py-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">Introducing UGen Pro 2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            The complete platform for <span className="text-purple-600 dark:text-purple-400">generator tools</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Advanced generator tools for developers and professionals. Create user agents, addresses, and more with our
            powerful and secure platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 py-6 bg-purple-600 hover:bg-purple-700">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 py-6 border-purple-500/20 hover:bg-purple-500/10 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">50K+</div>
              <div className="text-sm text-muted-foreground mt-1">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">4.9/5</div>
              <div className="text-sm text-muted-foreground mt-1">User Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">99.9%</div>
              <div className="text-sm text-muted-foreground mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
