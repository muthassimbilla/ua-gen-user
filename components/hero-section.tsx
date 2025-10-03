"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

interface HeroSectionProps {
  locale: "en" | "bn"
}

export function HeroSection({ locale }: HeroSectionProps) {
  const { ref: heroRef, isVisible } = useScrollAnimation({ threshold: 0.2 })

  const content = {
    en: {
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
    },
    bn: {
      badge: "🚀 ডেভেলপারদের জন্য শক্তিশালী টুল",
      title: "আধুনিক উন্নয়নের জন্য",
      titleHighlight: "সম্পূর্ণ টুলকিট",
      subtitle: "দ্রুত তৈরি করুন। স্মার্টভাবে শিপ করুন।",
      description:
        "ডেভেলপার এবং পেশাদারদের জন্য ডিজাইন করা উন্নত জেনারেটর টুল। আমাদের এআই-চালিত প্ল্যাটফর্ম দিয়ে ঠিকানা তৈরি করুন, ইমেইল রূপান্তর করুন এবং আরও অনেক কিছু।",
      ctaPrimary: "ফ্রি শুরু করুন",
      ctaSecondary: "টুল দেখুন",
      feature1: "দ্রুতগতি",
      feature2: "নিরাপদ ও সুরক্ষিত",
      feature3: "এআই চালিত",
    },
  }

  const t = content[locale]

  return (
    <section 
      id="hero" 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        
        {/* Radial Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12">
        <div 
          className={`mx-auto max-w-5xl text-center space-y-8 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 border border-purple-500/20 px-5 py-2.5 backdrop-blur-sm shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer hover:scale-105"
          >
            <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
              {t.badge}
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-balance leading-tight">
              {t.title}{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                {t.titleHighlight}
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-muted-foreground/80">
              {t.subtitle}
            </p>
          </div>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            {t.description}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="text-base px-8 py-7 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 group"
              >
                {t.ctaPrimary}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#tools">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 py-7 bg-transparent border-2 hover:bg-purple-500/5 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                {t.ctaSecondary}
              </Button>
            </a>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{t.feature1}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">{t.feature2}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
              <Rocket className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">{t.feature3}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
