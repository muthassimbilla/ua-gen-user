"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, ArrowRight, Code, Settings, Shield, Star, Clock, Users } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"

const tools = [
  {
    name: "Flo Hiv Tool",
    features: [
      "Generate realistic iOS & Android user agents",
      "Support for Instagram & Facebook apps",
      "Advanced customization options",
      "Custom headers and parameters",
    ],
    href: "/tool/user-agent-generator",
    icon: Smartphone,
    category: "Mobile Development",
    status: "Active",
    color: "from-blue-500 to-indigo-600",
    users: "12.5K+",
    rating: 4.9,
    tags: ["iOS & Android", "Social Media", "Custom Headers"],
  },
  {
    name: "Duplicate Checker",
    features: [
      "Test and debug REST APIs easily",
      "Advanced request building tools",
      "Response analysis and validation",
      "Automated testing capabilities",
    ],
    href: "/tool/api-tester",
    icon: Code,
    category: "Development",
    status: "Coming Soon",
    color: "from-emerald-500 to-teal-600",
    users: "Coming Soon",
    rating: null,
    tags: ["REST APIs", "Authentication", "Bulk Testing"],
  },
  {
    name: "Address Generator",
    features: [
      "Generate framework configuration files",
      "Support for popular deployment platforms",
      "Development environment setup",
      "Docker and CI/CD configurations",
    ],
    href: "/tool/config-generator",
    icon: Settings,
    category: "DevOps",
    status: "Coming Soon",
    color: "from-purple-500 to-pink-600",
    users: "Coming Soon",
    rating: null,
    tags: ["Docker", "CI/CD", "Cloud Deploy"],
  },
]

export default function ToolsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="fixed inset-0 -z-10">
          {/* Light mode background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50 dark:hidden" />
          
          {/* Dark mode enhanced background */}
          <div className="hidden dark:block absolute inset-0">
            {/* Multiple gradient layers for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/25 via-purple-900/15 to-indigo-900/25" />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/10 via-transparent to-pink-900/10" />
            <div className="absolute inset-0 bg-gradient-to-bl from-emerald-900/8 via-transparent to-orange-900/8" />
            <div className="absolute inset-0 bg-gradient-to-tl from-violet-900/5 via-transparent to-rose-900/5" />
          </div>
          
          {/* Animated orbs - Light mode */}
          <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-200/30 dark:hidden rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-indigo-200/30 dark:hidden rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          
          {/* Enhanced animated orbs - Dark mode */}
          <div className="hidden dark:block absolute top-1/6 -left-48 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="hidden dark:block absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/25 to-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="hidden dark:block absolute bottom-1/4 -right-32 w-72 h-72 bg-gradient-to-r from-indigo-500/20 to-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="hidden dark:block absolute bottom-1/6 left-1/3 w-56 h-56 bg-gradient-to-r from-emerald-500/15 to-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "3s" }} />
          <div className="hidden dark:block absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-violet-500/12 to-rose-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "4s" }} />
          
          {/* Floating particles - Dark mode only */}
          <div className="hidden dark:block absolute top-20 left-20 w-2 h-2 bg-blue-400/50 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
          <div className="hidden dark:block absolute top-40 right-32 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-bounce" style={{ animationDelay: "1.5s" }} />
          <div className="hidden dark:block absolute bottom-32 left-16 w-2.5 h-2.5 bg-cyan-400/50 rounded-full animate-bounce" style={{ animationDelay: "2.5s" }} />
          <div className="hidden dark:block absolute bottom-20 right-20 w-1 h-1 bg-pink-400/50 rounded-full animate-bounce" style={{ animationDelay: "3s" }} />
          <div className="hidden dark:block absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-bounce" style={{ animationDelay: "4s" }} />
          <div className="hidden dark:block absolute top-1/3 left-1/4 w-1 h-1 bg-violet-400/50 rounded-full animate-bounce" style={{ animationDelay: "5s" }} />
          <div className="hidden dark:block absolute bottom-1/3 right-1/4 w-2 h-2 bg-rose-400/50 rounded-full animate-bounce" style={{ animationDelay: "6s" }} />
        </div>

        {/* Header Section */}
        <section className="relative z-10 px-6 pt-16 lg:pt-12 pb-8">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Developer Tools
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Powerful tools designed to streamline your development workflow and boost productivity
              </p>
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="relative z-10 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool, index) => {
                const IconComponent = tool.icon
                const isActive = tool.status === "Active"

                return (
                  <div
                    key={tool.name}
                    className="group cursor-pointer h-full"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Card className="h-full flex flex-col bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm border-slate-200/50 dark:border-slate-700/30 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/30 group overflow-hidden relative hover:-translate-y-2 dark:shadow-2xl dark:shadow-slate-900/20">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                      />

                      <CardHeader className="pb-6 relative">
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                          >
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              variant={isActive ? "default" : "secondary"}
                              className={`${
                                isActive
                                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700"
                                  : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700"
                              } font-semibold px-3 py-1`}
                            >
                              {tool.status}
                            </Badge>
                            {tool.rating && (
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold text-slate-900 dark:text-white">{tool.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 mb-2">
                          {tool.name}
                        </CardTitle>

                        <div className="flex items-center gap-2 mb-4">
                          <Badge
                            variant="outline"
                            className="text-xs font-medium border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-400"
                          >
                            {tool.category}
                          </Badge>
                          {isActive && (
                            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Users className="w-3 h-3" />
                              {tool.users}
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="pt-0 relative flex-1 flex flex-col justify-between">
                        <div className="mb-6">
                          <ul className="space-y-2">
                            {tool.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                <span className="text-sm leading-relaxed">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {tool.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700 font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {isActive ? (
                            <Link href={tool.href}>
                              <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white group-hover:scale-[1.02] transition-all duration-300 font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl">
                                <span className="flex items-center justify-center gap-2">
                                  <Shield className="w-4 h-4" />
                                  Launch Tool
                                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </span>
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              disabled
                              className="w-full py-3 rounded-xl font-semibold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Coming Soon
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>

          </div>
        </section>
      </div>
    </ProtectedRoute>
  )
}
