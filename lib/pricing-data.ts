import { z } from "zod"

export const PricingPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.string(),
  duration: z.string(),
  original_price: z.string().optional(),
  discount: z.string().optional(),
  savings: z.string().optional(),
  description: z.string().optional(),
  features: z.array(z.string()),
  is_popular: z.boolean(),
  icon: z.string().optional(),
  gradient: z.string(),
})

export type PricingPlan = z.infer<typeof PricingPlanSchema>

export const pricingPlans: PricingPlan[] = [
  {
    id: "1-month",
    name: "1 Month",
    price: "৳1,000",
    duration: "for 1 month",
    description: "Perfect for getting started",
    features: [
      "User Agent Generator (Unlimited)",
      "Address Generator (Unlimited)",
      "Email → Name Generator (Unlimited)",
      "24/7 Support",
    ],
    is_popular: false,
    icon: "Zap",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "4-months",
    name: "4 Months",
    price: "৳1,600",
    duration: "for 4 months",
    original_price: "৳4,000",
    discount: "60% Save",
    savings: "Save ৳2,400",
    description: "Most Popular Plan",
    features: [
      "User Agent Generator (Unlimited)",
      "Address Generator (Unlimited)",
      "Email → Name Generator (Unlimited)",
      "24/7 Support",
    ],
    is_popular: true,
    icon: "Crown",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "6-months",
    name: "6 Months",
    price: "৳3,000",
    duration: "for 6 months",
    original_price: "৳6,000",
    discount: "50% Save",
    savings: "Save ৳3,000",
    description: "Maximum Value Savings",
    features: [
      "User Agent Generator (Unlimited)",
      "Address Generator (Unlimited)",
      "Email → Name Generator (Unlimited)",
      "24/7 Support",
    ],
    is_popular: false,
    icon: "Sparkles",
    gradient: "from-orange-500 to-red-600",
  },
]

pricingPlans.forEach((plan) => {
  PricingPlanSchema.parse(plan)
})