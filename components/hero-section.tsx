"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  locale: "en" | "bn"
}

export function HeroSection({ locale }: HeroSectionProps) {
  const content = {
    en: {
      badge: "Powerful Tools for Developers",
      title: "The complete toolkit for",
      titleHighlight: "modern development",
      description:
        "Advanced generator tools designed for developers and professionals. Create addresses, transform emails, and more with our AI-powered platform.",
      ctaPrimary: "Get Started",
      ctaSecondary: "View Tools",
    },
    bn: {
      badge: "ডেভেলপারদের জন্য শক্তিশালী টুল",
      title: "আধুনিক উন্নয়নের জন্য",
      titleHighlight: "সম্পূর্ণ টুলকিট",
      description:
        "ডেভেলপার এবং পেশাদারদের জন্য ডিজাইন করা উন্নত জেনারেটর টুল। আমাদের এআই-চালিত প্ল্যাটফর্ম দিয়ে ঠিকানা তৈরি করুন, ইমেইল রূপান্তর করুন এবং আরও অনেক কিছু।",
      ctaPrimary: "শুরু করুন",
      ctaSecondary: "টুল দেখুন",
    },
  }

  const t = content[locale]

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-20">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold text-sm">{t.badge}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            {t.title} <span className="text-primary">{t.titleHighlight}</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">{t.description}</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup">
              <Button size="lg" className="text-base px-8 py-6">
                {t.ctaPrimary}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#tools">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 bg-transparent">
                {t.ctaSecondary}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
