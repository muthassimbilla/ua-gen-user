import { memo } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  title?: string
  subtitle?: string
  description?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
  badgeText?: string
  disclaimerText?: string
}

const HeroSection = memo(function HeroSection({
  title = "The complete platform to manage projects.",
  subtitle = "Introducing TaskFlow 2.0",
  description = "Your team's toolkit to stop configuring and start innovating. Streamline workflows, boost productivity, and deliver projects faster than ever.",
  primaryButtonText = "Get Started Free",
  primaryButtonHref = "/signup",
  secondaryButtonText = "Watch Demo",
  secondaryButtonHref = "#demo",
  badgeText = "✨ Introducing TaskFlow 2.0",
  disclaimerText = "No credit card required • Free 14-day trial"
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="container relative z-10 mx-auto px-4 py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-border bg-muted px-4 py-1.5 text-sm">
            <span className="text-muted-foreground">{badgeText}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance">
            {title.split(' ').map((word, index) => 
              word === 'manage' ? (
                <span key={index} className="text-primary"> {word} </span>
              ) : (
                <span key={index}> {word} </span>
              )
            )}
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button asChild size="lg" className="text-base px-8">
              <Link href={primaryButtonHref}>
                {primaryButtonText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base px-8 bg-transparent">
              <Link href={secondaryButtonHref}>
                {secondaryButtonText}
              </Link>
            </Button>
          </div>

          <div className="pt-8 text-sm text-muted-foreground">{disclaimerText}</div>
        </div>
      </div>
    </section>
  )
})

export { HeroSection }
