import { memo } from "react"
import { Zap, Users, BarChart3, Shield, Workflow, Clock } from "lucide-react"

interface Feature {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

interface FeatureCardProps {
  feature: Feature
  index: number
}

const FeatureCard = memo(function FeatureCard({ feature, index }: FeatureCardProps) {
  const { icon: Icon, title, description } = feature
  
  return (
    <div
      className="group relative rounded-lg border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
})

const features: Feature[] = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed. Experience instant updates and real-time collaboration without lag.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with built-in chat, comments, and file sharing.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get insights into team performance with detailed reports and visualizations.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.",
  },
  {
    icon: Workflow,
    title: "Custom Workflows",
    description: "Create automated workflows that match your team's unique processes.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track time spent on tasks and projects with integrated time tracking tools.",
  },
]

interface FeaturesSectionProps {
  title?: string
  description?: string
  features?: Feature[]
}

const FeaturesSection = memo(function FeaturesSection({
  title = "Everything you need to manage projects",
  description = "Powerful features designed to help your team work smarter, not harder.",
  features: customFeatures = features
}: FeaturesSectionProps) {
  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-balance">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {customFeatures.map((feature, index) => (
            <FeatureCard key={`${feature.title}-${index}`} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
})

export { FeaturesSection }
