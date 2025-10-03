"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export function HeroSection() {
  const { ref: heroRef, isVisible } = useScrollAnimation({ threshold: 0.2 })

  const content = {
    badge: "🚀 Powerful Tools for Developers",
    title: "The complete toolkit for",
    titleHighlight: "modern development",
    subtitle: "Build faster. Ship smarter.",
    description:
      "Advanced generator tools designed for developers and professionals. Create addresses, transform emails, and more with our AI-powered platform.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "View Tools",
    feature1: "Lightning Fast",
    feature2: "Secure & Private",
    feature3: "AI Powered",
  }

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative min-h-[80vh] flex items-center justify-center pt-16 pb-8 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Radial Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-6">
        <div 
          className={`mx-auto max-w-5xl text-center space-y-6 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-cyan-500/10 border border-blue-500/20 px-6 py-3 backdrop-blur-sm shadow-lg hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer hover:scale-105"
          >
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              {content.badge}
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-balance leading-[1.1]">
              {content.title}{" "}
              <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">
                {content.titleHighlight}
              </span>
            </h1>
            <p className="text-2xl md:text-3xl font-semibold text-muted-foreground/90">
              {content.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground/80 max-w-3xl mx-auto text-pretty leading-relaxed">
            {content.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/signup">
              <Button
                size="lg"
                className="text-lg px-10 py-8 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 group rounded-xl font-semibold"
              >
                {content.ctaPrimary}
                <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#tools">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-10 py-8 bg-background/50 backdrop-blur-sm border-2 hover:bg-blue-500/5 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 rounded-xl font-semibold"
              >
                {content.ctaSecondary}
              </Button>
            </a>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm hover:bg-blue-500/20 transition-all duration-300">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">{content.feature1}</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm hover:bg-emerald-500/20 transition-all duration-300">
              <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">{content.feature2}</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-sm hover:bg-cyan-500/20 transition-all duration-300">
              <Rocket className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">{content.feature3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
