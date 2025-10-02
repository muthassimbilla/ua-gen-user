"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Star, MapPin, Download, Plus } from "lucide-react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"

const tools = [
  {
    name: "User Agent Generator",
    description: "Advanced image editing and composition",
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
    color: "from-purple-500 to-purple-600",
    users: "12.5K+",
    rating: 4.9,
    tags: ["iOS & Android", "Social Media", "Custom Headers"],
  },
  {
    name: "Address Generator",
    description: "Professional vector graphics creation",
    features: [
      "Generate real addresses from IP addresses",
      "Create addresses from ZIP codes",
      "Multiple address options with navigation",
      "Copy addresses to clipboard",
    ],
    href: "/tool/address-generator",
    icon: MapPin,
    category: "Location Tools",
    status: "Active",
    color: "from-orange-500 to-orange-600",
    users: "8.2K+",
    rating: 4.7,
    tags: ["IP Geolocation", "ZIP Codes", "Mapbox API"],
  },
]

export default function ToolsPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-full">
        {/* Horizontal Navigation Tabs */}
        <div className="border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-8 px-6 h-12">
            <button className="text-sm font-medium text-foreground border-b-2 border-primary pb-3 -mb-px">Home</button>
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-3">Apps</button>
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-3">Files</button>
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-3">Projects</button>
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-3">Learn</button>
            <div className="flex-1" />
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Install App
            </Button>
            <Button
              size="sm"
              className="gap-2 bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Apps Section */}
          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold">Recent Apps</h3>
                <Button variant="link" className="text-sm">
                  View All
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => {
                  const IconComponent = tool.icon
                  const isActive = tool.status === "Active"

                  return (
                    <Card key={tool.name} className="group hover:shadow-lg transition-all duration-300 border-2">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${tool.color} shadow-md`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>

                        <CardTitle className="text-lg font-bold mb-1">{tool.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{tool.description}</p>
                      </CardHeader>

                      <CardContent className="pt-0">
                        {isActive ? (
                          <Link href={tool.href}>
                            <Button className="w-full" variant="secondary">
                              Open
                            </Button>
                          </Link>
                        ) : (
                          <Button disabled className="w-full" variant="secondary">
                            Coming Soon
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Bottom Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Recent Files</h3>
                  <Button variant="link" className="text-sm">
                    View All
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground text-center py-8">No recent files</p>
                  </CardContent>
                </Card>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-semibold">Active Projects</h3>
                  <Button variant="link" className="text-sm">
                    View All
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground text-center py-8">No active projects</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
