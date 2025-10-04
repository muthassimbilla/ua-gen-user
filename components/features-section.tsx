"use client"

import { Zap, Users, BarChart3, Shield, Workflow, Clock } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { motion } from "framer-motion"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed. Experience instant updates and real-time collaboration without lag.",
    color: "from-primary/20 to-primary/5",
    borderColor: "border-primary/30",
    iconBg: "from-primary/30 to-primary/10",
    textColor: "text-primary",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with built-in chat, comments, and file sharing.",
    color: "from-accent/20 to-accent/5",
    borderColor: "border-accent/30",
    iconBg: "from-accent/30 to-accent/10",
    textColor: "text-accent",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get insights into team performance with detailed reports and visualizations.",
    color: "from-tertiary/20 to-tertiary/5",
    borderColor: "border-tertiary/30",
    iconBg: "from-tertiary/30 to-tertiary/10",
    textColor: "text-tertiary",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards.",
    color: "from-quaternary/20 to-quaternary/5",
    borderColor: "border-quaternary/30",
    iconBg: "from-quaternary/30 to-quaternary/10",
    textColor: "text-quaternary",
  },
  {
    icon: Workflow,
    title: "Custom Workflows",
    description: "Create automated workflows that match your team's unique processes.",
    color: "from-primary/20 to-accent/5",
    borderColor: "border-primary/30",
    iconBg: "from-primary/30 to-accent/20",
    textColor: "text-primary",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Track time spent on tasks and projects with integrated time tracking tools.",
    color: "from-accent/20 to-tertiary/5",
    borderColor: "border-accent/30",
    iconBg: "from-accent/30 to-tertiary/20",
    textColor: "text-accent",
  },
]

export function FeaturesSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 })

  return (
    <section id="features" ref={sectionRef} className="relative py-16 md:py-20 overflow-hidden">
      {/* Enhanced background with purple gradient layers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/3 via-accent/2 to-background" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-primary/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-radial from-accent/6 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-12 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 rounded-full glass shadow-glow px-6 py-3 backdrop-blur-xl">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span className="gradient-text font-bold text-sm">Powerful Features</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-balance">
            <span className="text-shadow-lg">Everything you need to</span>{" "}
            <span className="gradient-text-rainbow text-shadow-lg">
              manage projects
            </span>
          </h2>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance font-medium">
            Powerful features designed to help your team work smarter, not harder, with 
            <span className="text-primary font-semibold"> cutting-edge technology</span>.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className={`group rounded-2xl border-2 ${feature.borderColor} p-6 bg-gradient-to-br ${feature.color} glass hover:glass-strong transition-all duration-500 hover-lift cursor-pointer relative overflow-hidden`}
            >
              {/* Decorative gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconBg} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`} />
              
              <div className="relative z-10">
                <div className={`mb-4 inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.iconBg} shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.textColor}`} />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-foreground transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/90 transition-colors">
                  {feature.description}
                </p>
                
                {/* Hover indicator */}
                <div className={`mt-3 w-8 h-1 bg-gradient-to-r ${feature.iconBg} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
