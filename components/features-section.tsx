"use client"

import { Zap, Users, BarChart3, Shield, Workflow, Clock } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed. Experience instant updates and real-time collaboration without lag.",
    color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with built-in chat, comments, and file sharing.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get insights into team performance with detailed reports and visualizations.",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.",
    color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  },
  {
    icon: Workflow,
    title: "Custom Workflows",
    description: "Create automated workflows that match your team's unique processes.",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track time spent on tasks and projects with integrated time tracking tools.",
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-10">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-2">
            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Powerful Features</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold">
            Everything you need to <span className="text-blue-600 dark:text-blue-400">manage projects</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help your team work smarter, not harder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className={`rounded-xl border p-6 ${feature.color} transition-all hover:scale-105`}>
              <feature.icon className="h-8 w-8 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
