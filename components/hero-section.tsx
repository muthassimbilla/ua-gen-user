"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Star, Zap, Play, Users, Shield, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [currentText, setCurrentText] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const dynamicTexts = [
    "generator tools",
    "user agents", 
    "addresses",
    "fake data",
    "test data"
  ]

  useEffect(() => {
    setMounted(true)
    
    // Dynamic text rotation
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % dynamicTexts.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-background">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-pink-500/5" />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)]" />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl transition-all duration-1000 animate-pulse ${mounted ? 'opacity-70 scale-100' : 'opacity-0 scale-50'}`} 
             style={{ animationDuration: '4s' }} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl transition-all duration-1000 delay-300 animate-pulse ${mounted ? 'opacity-70 scale-100' : 'opacity-0 scale-50'}`} 
             style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <div className={`absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl transition-all duration-1000 delay-500 animate-pulse ${mounted ? 'opacity-70 scale-100' : 'opacity-0 scale-50'}`} 
             style={{ animationDuration: '5s', animationDelay: '2s' }} />
        
        {/* Additional floating elements */}
        <div className={`absolute top-1/3 right-1/4 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl transition-all duration-2000 delay-1000 animate-bounce ${mounted ? 'opacity-50' : 'opacity-0'}`} 
             style={{ animationDuration: '3s' }} />
        <div className={`absolute bottom-1/3 left-1/3 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl transition-all duration-2000 delay-1500 animate-bounce ${mounted ? 'opacity-50' : 'opacity-0'}`} 
             style={{ animationDuration: '4s', animationDelay: '1.5s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className={`mx-auto max-w-5xl text-center space-y-5 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-5 py-2 text-sm shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent font-semibold">
              Introducing UGen Pro 2.0
            </span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-tight">
            The complete platform for{" "}
            <span className="relative inline-block">
              <span 
                className="relative z-10 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent transition-all duration-500"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {dynamicTexts[currentText]}
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 blur-lg transition-all duration-500" />
            </span>
            .
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            Advanced generator tools for developers and professionals. Create user agents, addresses, and more with our
            powerful and secure platform.
          </p>

          {/* Dynamic CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="text-base px-10 py-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-10 py-6 bg-background/50 backdrop-blur-sm border-2 hover:bg-primary/5 hover:border-primary transition-all duration-300 hover:scale-105 group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="pt-4 flex flex-col items-center gap-3">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              <span>No credit card required • Free 14-day trial</span>
            </div>
            
            {/* Dynamic Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-2">
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent group-hover:from-green-500 group-hover:to-blue-500 transition-all duration-500">
                  50K+
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Active Users
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border" />
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent group-hover:from-yellow-500 group-hover:to-orange-500 transition-all duration-500">
                  4.9/5
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  User Rating
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border" />
              <div className="text-center group hover:scale-105 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent group-hover:from-green-500 group-hover:to-emerald-500 transition-all duration-500">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3" />
                  Uptime
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
