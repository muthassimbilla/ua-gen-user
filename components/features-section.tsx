"use client"

import { Zap, Users, BarChart3, Shield, Workflow, Clock } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed. Experience instant updates and real-time collaboration without lag.",
    color: "text-yellow-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with built-in chat, comments, and file sharing.",
    color: "text-blue-500",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get insights into team performance with detailed reports and visualizations.",
    color: "text-purple-500",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.",
    color: "text-green-500",
  },
  {
    icon: Workflow,
    title: "Custom Workflows",
    description: "Create automated workflows that match your team's unique processes.",
    color: "text-indigo-500",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track time spent on tasks and projects with integrated time tracking tools.",
    color: "text-red-500",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-16 bg-muted/30">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-primary font-semibold">Powerful Features</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold">
            Everything you need to <span className="text-primary">manage projects</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Powerful features designed to help your team work smarter, not harder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="rounded-lg border bg-card p-6 hover:border-primary transition-colors">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>

              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
