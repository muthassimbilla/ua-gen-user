export interface PricingPlan {
  id: string
  name: string
  price: string
  duration: string
  original_price?: string
  discount?: string
  description?: string
  features: string[]
  is_popular: boolean
  icon?: string
  gradient: string
}

export const pricingPlans: PricingPlan[] = [
  {
    id: "1",
    name: "Basic",
    price: "৳৪৯৯",
    duration: "মাস",
    description: "Perfect for individuals and small projects",
    features: ["সকল Basic Tools এক্সেস", "১০০টি পর্যন্ত প্রজেক্ট", "৫ GB স্টোরেজ", "ইমেইল সাপোর্ট", "মাসিক রিপোর্ট"],
    is_popular: false,
    icon: "Zap",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    id: "2",
    name: "Premium",
    price: "৳৯৯৯",
    duration: "মাস",
    original_price: "৳১,৪৯৯",
    discount: "৩৩% ছাড়",
    description: "Best for growing teams and businesses",
    features: [
      "সকল Premium Tools এক্সেস",
      "আনলিমিটেড প্রজেক্ট",
      "৫০ GB স্টোরেজ",
      "অগ্রাধিকার সাপোর্ট",
      "দৈনিক রিপোর্ট",
      "কাস্টম ব্র্যান্ডিং",
      "API এক্সেস",
    ],
    is_popular: true,
    icon: "Crown",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "3",
    name: "Enterprise",
    price: "৳২,৪৯৯",
    duration: "মাস",
    description: "For large organizations with advanced needs",
    features: [
      "সকল Enterprise Tools এক্সেস",
      "আনলিমিটেড সব কিছু",
      "আনলিমিটেড স্টোরেজ",
      "২৪/৭ ডেডিকেটেড সাপোর্ট",
      "রিয়েল-টাইম রিপোর্ট",
      "কাস্টম ইন্টিগ্রেশন",
      "ডেডিকেটেড একাউন্ট ম্যানেজার",
      "SLA গ্যারান্টি",
    ],
    is_popular: false,
    icon: "Sparkles",
    gradient: "from-orange-500 to-red-600",
  },
]
