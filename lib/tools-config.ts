import { z } from "zod"
import { MapPin, Mail, Monitor } from "lucide-react"

export const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.any(),
  features: z.array(z.string()),
  demoImage: z.string().optional(),
  demoVideo: z.string().optional(),
  ctaText: z.string(),
  ctaLink: z.string(),
  color: z.string(),
})

export type Tool = z.infer<typeof ToolSchema>

export const toolsData: Tool[] = [
  {
    id: "user-agent-generator",
    name: "User Agent Generator",
    description: "Generate realistic user agent strings for different browsers and devices instantly.",
    icon: Monitor,
    features: [
      "Generate user agents for Chrome, Firefox, Safari, Edge",
      "Support for mobile and desktop devices",
      "Real-time generation with latest versions",
      "Copy with one click",
      "Bulk generation support",
    ],
    demoVideo: "https://www.youtube.com/embed/ScMzIvxBSi4?controls=1&rel=0&modestbranding=1&autoplay=0&mute=0",
    demoImage: "/user-agent-generator-tool-interface.jpg",
    ctaText: "Use User Agent Generator",
    ctaLink: "/tool/user-agent-generator",
    color: "from-green-500/20 to-emerald-500/20 border-green-500/30",
  },
  {
    id: "address-generator",
    name: "Address Generator",
    description: "Generate realistic US addresses instantly using IP or ZIP code with our powerful API integration.",
    icon: MapPin,
    features: [
      "Generate addresses from IP addresses",
      "Generate addresses from ZIP codes",
      "Real-time geocoding with Mapbox API",
      "Copy individual fields or full address",
      "Fallback data for common ZIP codes",
    ],
    demoVideo: "https://www.youtube.com/embed/ScMzIvxBSi4?controls=1&rel=0&modestbranding=1&autoplay=0&mute=0",
    ctaText: "Use Address Generator",
    ctaLink: "/tool/address-generator",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  },
  {
    id: "email2name",
    name: "Email to Name",
    description: "Transform email addresses into realistic names using AI-powered generation with Google Gemini.",
    icon: Mail,
    features: [
      "AI-powered name generation with Google Gemini",
      "Generate full name, first name, and last name",
      "Detect gender and email type (Business/Personal)",
      "Auto-generate on paste feature",
      "Copy individual fields with one click",
    ],
    demoVideo: "https://www.youtube.com/embed/ScMzIvxBSi4?controls=1&rel=0&modestbranding=1&autoplay=0&mute=0",
    ctaText: "Use Email2Name",
    ctaLink: "/tool/email2name",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
]
