import { z } from "zod"
import { MapPin, Mail } from "lucide-react"

export const ToolSchema = z.object({
  id: z.string(),
  name: z.object({
    en: z.string(),
    bn: z.string(),
  }),
  description: z.object({
    en: z.string(),
    bn: z.string(),
  }),
  icon: z.any(),
  features: z.array(
    z.object({
      en: z.string(),
      bn: z.string(),
    }),
  ),
  demoImage: z.string().optional(),
  ctaText: z.object({
    en: z.string(),
    bn: z.string(),
  }),
  ctaLink: z.string(),
  color: z.string(),
})

export type Tool = z.infer<typeof ToolSchema>

export const toolsData: Tool[] = [
  {
    id: "address-generator",
    name: {
      en: "Address Generator",
      bn: "ঠিকানা জেনারেটর",
    },
    description: {
      en: "Generate realistic US addresses instantly using IP or ZIP code with our powerful API integration.",
      bn: "আইপি বা জিপ কোড ব্যবহার করে তাৎক্ষণিকভাবে বাস্তবসম্মত মার্কিন ঠিকানা তৈরি করুন।",
    },
    icon: MapPin,
    features: [
      {
        en: "Generate addresses from IP addresses",
        bn: "আইপি ঠিকানা থেকে ঠিকানা তৈরি করুন",
      },
      {
        en: "Generate addresses from ZIP codes",
        bn: "জিপ কোড থেকে ঠিকানা তৈরি করুন",
      },
      {
        en: "Real-time geocoding with Mapbox API",
        bn: "ম্যাপবক্স এপিআই দিয়ে রিয়েল-টাইম জিওকোডিং",
      },
      {
        en: "Copy individual fields or full address",
        bn: "পৃথক ফিল্ড বা সম্পূর্ণ ঠিকানা কপি করুন",
      },
      {
        en: "Fallback data for common ZIP codes",
        bn: "সাধারণ জিপ কোডের জন্য ফলব্যাক ডেটা",
      },
    ],
    demoImage: "/address-generator-tool-interface.jpg",
    ctaText: {
      en: "Try Address Generator",
      bn: "ঠিকানা জেনারেটর ব্যবহার করুন",
    },
    ctaLink: "/tool/address-generator",
    color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  },
  {
    id: "email2name",
    name: {
      en: "Email to Name",
      bn: "ইমেইল থেকে নাম",
    },
    description: {
      en: "Transform email addresses into realistic names using AI-powered generation with Google Gemini.",
      bn: "গুগল জেমিনি এআই ব্যবহার করে ইমেইল ঠিকানাকে বাস্তবসম্মত নামে রূপান্তর করুন।",
    },
    icon: Mail,
    features: [
      {
        en: "AI-powered name generation with Google Gemini",
        bn: "গুগল জেমিনি দিয়ে এআই-চালিত নাম তৈরি",
      },
      {
        en: "Generate full name, first name, and last name",
        bn: "সম্পূর্ণ নাম, প্রথম নাম এবং শেষ নাম তৈরি করুন",
      },
      {
        en: "Detect gender and email type (Business/Personal)",
        bn: "লিঙ্গ এবং ইমেইল টাইপ সনাক্ত করুন (ব্যবসা/ব্যক্তিগত)",
      },
      {
        en: "Auto-generate on paste feature",
        bn: "পেস্ট করার সাথে সাথে স্বয়ংক্রিয় তৈরি",
      },
      {
        en: "Copy individual fields with one click",
        bn: "এক ক্লিকে পৃথক ফিল্ড কপি করুন",
      },
    ],
    demoImage: "/email-to-name-converter-ai-tool.jpg",
    ctaText: {
      en: "Try Email2Name",
      bn: "Email2Name ব্যবহার করুন",
    },
    ctaLink: "/tool/email2name",
    color: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  },
]
