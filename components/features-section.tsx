"use client"

import { Zap, Users, ChartBar as BarChart3, Shield, Workflow, Clock } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed. Experience instant updates and real-time collaboration without lag.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with built-in chat, comments, and file sharing.",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get insights into team performance with detailed reports and visualizations.",
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.",
    color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },
  {
    icon: Workflow,
    title: "Custom Workflows",
    description: "Create automated workflows that match your team's unique processes.",
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track time spent on tasks and projects with integrated time tracking tools.",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-blue-500/5 to-background" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-500/20 px-6 py-3 backdrop-blur-sm shadow-lg">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Powerful Features</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold">
            Everything you need to <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">manage projects</span>
          </h2>

          <p className="text-xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to help your team work smarter, not harder.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group rounded-2xl border p-8 ${feature.color} backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}
            >
              <div className="mb-5 inline-flex p-3 rounded-xl bg-background/50 group-hover:scale-110 transition-transform">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
