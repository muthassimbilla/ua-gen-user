"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star, Play, Users, Shield } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center pt-20">
      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold">Introducing UGen Pro 2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            The complete platform for <span className="text-primary">generator tools</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced generator tools for developers and professionals. Create user agents, addresses, and more with our
            powerful and secure platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 py-6">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base px-8 py-6 bg-transparent">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          <div className="pt-6 flex flex-col items-center gap-4">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>No credit card required • Free 14-day trial</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9/5</div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  User Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Uptime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
