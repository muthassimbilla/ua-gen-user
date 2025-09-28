"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  CheckCircle,
  Star,
  Zap,
  ArrowRight,
  Menu,
  X,
  CreditCard,
  Smartphone,
  Globe,
  Award,
  Sparkles,
  Crown,
  Heart,
  Activity,
  Database,
  Languages,
  ExternalLink,
  Clock,
  Users,
  Shield,
  BarChart3,
  Lock,
  Send,
  Loader2,
  User,
  AtSign,
  MessageSquare,
  AlertCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    telegramUsername: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errors, setErrors] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Auto-add @ for telegram username
    if (name === "telegramUsername") {
      let processedValue = value
      if (value && !value.startsWith("@")) {
        processedValue = "@" + value
      }
      setFormData(prev => ({ ...prev, [name]: processedValue }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const validateForm = () => {
    const newErrors: string[] = []
    
    if (!formData.name.trim()) {
      newErrors.push("Name is required")
    }
    
    if (!formData.telegramUsername.trim()) {
      newErrors.push("Telegram username is required")
    }
    
    if (!formData.message.trim()) {
      newErrors.push("Message is required")
    } else if (formData.message.length < 10) {
      newErrors.push("Message must be at least 10 characters long")
    }
    
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus("idle")
    
    try {
      // Create the message for Telegram bot
      const telegramMessage = `🆕 *New Contact Form Submission*

👤 *Name:* ${formData.name}
📱 *Telegram:* [@${formData.telegramUsername.replace("@", "")}](https://t.me/${formData.telegramUsername.replace("@", "")})
💬 *Message:*
${formData.message}

⏰ *Time:* ${new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })}

🌐 *Website:* UGen Pro Contact Form`

      // Send to Telegram bot
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          telegramUsername: formData.telegramUsername,
          message: formData.message,
          telegramMessage: telegramMessage
        }),
      })
      
      if (response.ok) {
        const result = await response.json()
        setSubmitStatus("success")
        setFormData({ name: "", telegramUsername: "", message: "" })
      } else {
        const errorResult = await response.json()
        console.error("Form submission error:", errorResult)
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Message */}
      {submitStatus === "success" && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            Message sent successfully! We'll get back to you soon.
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {submitStatus === "error" && (
        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-700 dark:text-red-300">
            There was a problem sending your message. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Telegram Username Field */}
      <div className="space-y-2">
        <label htmlFor="telegramUsername" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Telegram Username *
        </label>
        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            id="telegramUsername"
            name="telegramUsername"
            type="text"
            value={formData.telegramUsername}
            onChange={handleInputChange}
            placeholder="your_username"
            className="pl-10 h-12 rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Message *
        </label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Tell us how we can help you..."
          rows={4}
          className="rounded-xl border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          required
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending Message...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Send className="w-5 h-5" />
            <span>Send Message</span>
          </div>
        )}
      </Button>
    </form>
  )
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [language, setLanguage] = useState<"bn" | "en">("en")
  const [selectedTool, setSelectedTool] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    
    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate')
          }
        })
      },
      { threshold: 0.1 }
    )

    const scrollElements = document.querySelectorAll('.scroll-animate')
    scrollElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  const toggleLanguage = () => {
    setLanguage(language === "bn" ? "en" : "bn")
  }


  const openToolPopup = (index: number) => {
    setSelectedTool(index)
  }

  const closeToolPopup = () => {
    setSelectedTool(null)
  }

  // Language content
  const content = {
    bn: {
      nav: {
        features: "সুবিধা",
        pricing: "মূল্য",
        login: "লগইন",
        signup: "সাইন আপ",
      },
      hero: {
        badge: "CPA মার্কেটিং টুলস",
        title: "CPA মার্কেটারদের জন্য",
        titleHighlight: "প্রিমিয়াম টুলস",
        subtitle: "আপনার CPA মার্কেটিং ক্যাম্পেইন বাড়ান এবং আয় বৃদ্ধি করুন আমাদের শক্তিশালী ও আধুনিক টুলস দিয়ে।",
        benefits: ["CPA মার্কেটারদের জন্য উন্নত টুলস", "রিয়েল-টাইম ক্যাম্পেইন অ্যানালিটিক্স", "নিরাপদ এবং নির্ভরযোগ্য প্ল্যাটফর্ম", "২৪/৭ কাস্টমার সাপোর্ট"],
        cta1: "আয় শুরু করুন",
        cta2: "টুলস দেখুন",
      },
      features: {
        badge: "CPA মার্কেটিং টুলস",
        title: "আমাদের প্রিমিয়াম টুলস",
        subtitle: "CPA মার্কেটারদের জন্য বিশেষভাবে তৈরি করা আধুনিক টুলস যা আপনার ক্যাম্পেইন বাড়াবে এবং আয় বৃদ্ধি করবে।",
        tools: [
          {
            name: "User Agent Generator",
            description: "বিভিন্ন ব্রাউজার ও ডিভাইসের জন্য User Agent string তৈরি করুন। Web scraping ও testing এর জন্য উপযুক্ত।",
            users: "8.2K+ users",
            icon: Smartphone,
            features: ["iOS & Android Support", "Real Browser Detection", "Custom User Agents", "Bulk Generation"],
            useCases: ["Web Scraping", "Testing", "Browser Simulation", "API Testing"],
            timeToGenerate: "Instant",
            accuracy: "99.9%",
          },
          {
            name: "Address Generator",
            description: "IP address বা ZIP code থেকে বাস্তবসম্মত ঠিকানা তৈরি করুন। Testing ও development এর জন্য উপযুক্ত।",
            users: "6.5K+ users",
            icon: Globe,
            features: ["IP to Address", "ZIP Code Lookup", "Real Addresses", "Multiple Formats"],
            useCases: ["Testing", "Development", "Data Validation", "Mock Data"],
            timeToGenerate: "2-3 seconds",
            accuracy: "95%",
          },
          {
            name: "Security Tools",
            description: "আপনার অ্যাপ্লিকেশনের নিরাপত্তা পরীক্ষা করুন এবং বিভিন্ন security vulnerabilities চেক করুন।",
            users: "5.8K+ users",
            icon: Shield,
            features: ["Vulnerability Scan", "SSL Check", "Password Strength", "Security Headers"],
            useCases: ["Security Audit", "Penetration Testing", "Compliance Check", "Risk Assessment"],
            timeToGenerate: "5-10 minutes",
            accuracy: "98%",
          },
          {
            name: "Performance Tools",
            description: "আপনার ওয়েবসাইটের performance analyze করুন এবং optimization suggestions পান।",
            users: "7.3K+ users",
            icon: BarChart3,
            features: ["Speed Analysis", "Core Web Vitals", "Optimization Tips", "Performance Score"],
            useCases: ["SEO Optimization", "User Experience", "Performance Audit", "Speed Testing"],
            timeToGenerate: "1-2 minutes",
            accuracy: "97%",
          },
          {
            name: "Data Encryption",
            description: "আপনার গুরুত্বপূর্ণ ডেটা encrypt করুন এবং secure storage এর জন্য প্রস্তুত করুন।",
            users: "4.1K+ users",
            icon: Lock,
            features: ["AES Encryption", "RSA Keys", "Hash Generation", "Secure Storage"],
            useCases: ["Data Protection", "Secure Communication", "Password Hashing", "File Encryption"],
            timeToGenerate: "Instant",
            accuracy: "100%",
          },
          {
            name: "Analytics Tools",
            description: "আপনার অ্যাপ্লিকেশনের usage analytics দেখুন এবং user behavior analyze করুন।",
            users: "6.7K+ users",
            icon: Activity,
            features: ["Real-time Analytics", "User Tracking", "Custom Reports", "Data Export"],
            useCases: ["Business Intelligence", "User Behavior", "Performance Metrics", "Data Analysis"],
            timeToGenerate: "Real-time",
            accuracy: "99.5%",
          },
        ],
      },
      pricing: {
        badge: "প্রিমিয়াম প্ল্যান",
        title: "প্রিমিয়াম সাবস্ক্রিপশন",
        subtitle: "সব টুলসের আনলিমিটেড অ্যাক্সেস এবং প্রিমিয়াম সুবিধা পান",
        plans: [
          {
            name: "১ মাস",
        price: "৳১,০০০",
        period: "/মাস",
        description: "১ মাসের জন্য সম্পূর্ণ অ্যাক্সেস",
            popular: false,
        features: [
          "সব টুলসে আনলিমিটেড অ্যাক্সেস",
          "প্রায়োরিটি সাপোর্ট ২৪/৭",
          "এক্সক্লুসিভ প্রিমিয়াম ফিচার",
          "নিয়মিত আপডেট ও নতুন টুলস",
          "API অ্যাক্সেস",
          "বুল্ক অপারেশন সাপোর্ট",
        ],
            cta: "১ মাস সাবস্ক্রাইব করুন",
          },
          {
            name: "৩ মাস",
            price: "৳২,৫০০",
            period: "/৩ মাস",
            description: "৩ মাসের জন্য সব সুবিধা",
            popular: true,
            features: [
              "সব টুলসে আনলিমিটেড অ্যাক্সেস",
              "প্রায়োরিটি সাপোর্ট ২৪/৭",
              "এক্সক্লুসিভ প্রিমিয়াম ফিচার",
              "নিয়মিত আপডেট ও নতুন টুলস",
              "API অ্যাক্সেস",
              "বুল্ক অপারেশন সাপোর্ট",
              "১৭% ছাড়",
            ],
            cta: "৩ মাস সাবস্ক্রাইব করুন",
          },
          {
            name: "৬ মাস",
            price: "৳৪,০০০",
            period: "/৬ মাস",
            description: "৬ মাসের জন্য সব সুবিধা",
            popular: false,
            features: [
              "সব টুলসে আনলিমিটেড অ্যাক্সেস",
              "প্রায়োরিটি সাপোর্ট ২৪/৭",
              "এক্সক্লুসিভ প্রিমিয়াম ফিচার",
              "নিয়মিত আপডেট ও নতুন টুলস",
              "API অ্যাক্সেস",
              "বুল্ক অপারেশন সাপোর্ট",
              "৩৩% ছাড়",
            ],
            cta: "৬ মাস সাবস্ক্রাইব করুন",
          },
        ],
        paymentMethods: "পেমেন্ট পদ্ধতি:",
        methods: ["কার্ড", "বিকাশ", "নগদ"],
      },
      testimonials: {
        badge: "গ্রাহকদের মতামত",
        title: "আমাদের গ্রাহকদের মতামত",
        subtitle: "হাজারো ডেভেলপার আমাদের টুলস ব্যবহার করে সফল হচ্ছেন",
        reviews: [
          {
            text: "অসাধারণ টুলস! আমার ডেভেলপমেন্ট প্রসেস অনেক দ্রুত হয়ে গেছে। প্রিমিয়াম সাবস্ক্রিপশন সম্পূর্ণ মূল্যবান।",
            name: "রাকিব আহমেদ",
            role: "সফটওয়্যার ডেভেলপার",
          },
          {
            text: "সাপোর্ট টিম খুবই সহায়ক। কোনো সমস্যা হলে সাথে সাথে সমাধান করে দেয়। টুলসগুলো ব্যবহার করা খুবই সহজ।",
            name: "সুমাইয়া খান",
            role: "ওয়েব ডেভেলপার",
          },
          {
            text: "প্রিমিয়াম ফিচারগুলো সত্যিই গেম চেঞ্জার। আমার প্রজেক্টের কোয়ালিটি অনেক বেড়ে গেছে।",
            name: "মাহমুদ হাসান",
            role: "ফুল স্ট্যাক ডেভেলপার",
          },
        ],
      },
      footer: {
        description: "ডেভেলপারদের জন্য প্রিমিয়াম টুলস যা আপনার উৎপাদনশীলতা বাড়াবে এবং ডেভেলপমেন্ট প্রসেসকে সহজ করবে।",
        quickLinks: "দ্রুত লিংক",
        contact: "যোগাযোগ",
        copyright: "সব অধিকার সংরক্ষিত।",
      },
    },
    en: {
      nav: {
        features: "Features",
        pricing: "Pricing",
        login: "Login",
        signup: "Sign Up",
      },
      hero: {
        badge: "CPA Marketing Tools",
        title: "Premium Tools for",
        titleHighlight: "CPA Marketing",
        subtitle: "Boost your CPA marketing campaigns with our powerful tools designed for affiliate marketers and digital entrepreneurs.",
        benefits: [
          "Advanced tools for CPA marketers",
          "Real-time campaign analytics",
          "Secure and reliable platform",
          "24/7 customer support",
          "Regular updates and new tools",
        ],
        cta1: "Start Earning",
        cta2: "View Tools",
      },
      features: {
        badge: "CPA Marketing Tools",
        title: "Our Premium Tools",
        subtitle:
          "Advanced tools specially designed for CPA marketers that will boost your campaigns and maximize your earnings.",
        tools: [
          {
            name: "User Agent Generator",
            description:
              "Generate realistic User Agent strings for different browsers and devices. Perfect for CPA campaign testing and traffic optimization.",
            users: "12.5K+ users",
            icon: Smartphone,
            features: ["iOS & Android Support", "Real Browser Detection", "Custom User Agents", "Bulk Generation"],
            useCases: ["Campaign Testing", "Traffic Optimization", "Browser Simulation", "A/B Testing"],
            timeToGenerate: "Instant",
            accuracy: "99.9%",
          },
          {
            name: "Address Generator",
            description:
              "Generate realistic addresses from IP addresses or ZIP codes. Perfect for CPA campaign geo-targeting and lead generation.",
            users: "8.2K+ users",
            icon: Globe,
            features: ["IP to Address", "ZIP Code Lookup", "Real Addresses", "Multiple Formats"],
            useCases: ["Geo-targeting", "Lead Generation", "Campaign Testing", "Data Validation"],
            timeToGenerate: "2-3 seconds",
            accuracy: "95%",
          },
          {
            name: "Campaign Security",
            description: "Protect your CPA campaigns from fraud and ensure maximum security for your affiliate links.",
            users: "7.5K+ users",
            icon: Shield,
            features: ["Fraud Detection", "Link Protection", "SSL Check", "Security Headers"],
            useCases: ["Fraud Prevention", "Link Security", "Campaign Protection", "Risk Assessment"],
            timeToGenerate: "5-10 minutes",
            accuracy: "98%",
          },
          {
            name: "Campaign Analytics",
            description: "Analyze your CPA campaign performance and get detailed insights to maximize your ROI.",
            users: "9.1K+ users",
            icon: BarChart3,
            features: ["ROI Analysis", "Conversion Tracking", "Performance Metrics", "Revenue Reports"],
            useCases: ["Campaign Optimization", "ROI Analysis", "Performance Tracking", "Revenue Growth"],
            timeToGenerate: "1-2 minutes",
            accuracy: "97%",
          },
          {
            name: "Lead Management",
            description: "Secure and manage your CPA leads with advanced encryption and data protection.",
            users: "6.8K+ users",
            icon: Lock,
            features: ["Lead Encryption", "Secure Storage", "Data Protection", "Privacy Compliance"],
            useCases: ["Lead Security", "Data Privacy", "Compliance", "Lead Tracking"],
            timeToGenerate: "Instant",
            accuracy: "100%",
          },
          {
            name: "Traffic Analytics",
            description: "Track and analyze your CPA campaign traffic to optimize conversions and maximize earnings.",
            users: "8.9K+ users",
            icon: Activity,
            features: ["Real-time Analytics", "Traffic Tracking", "Custom Reports", "Data Export"],
            useCases: ["Traffic Analysis", "Conversion Optimization", "Campaign Monitoring", "ROI Tracking"],
            timeToGenerate: "Real-time",
            accuracy: "99.5%",
          },
        ],
      },
      pricing: {
        badge: "CPA Marketing Plan",
        title: "Premium Subscription",
        subtitle: "Get unlimited access to all CPA marketing tools and premium benefits",
        plans: [
          {
            name: "1 Month",
        price: "৳2,000",
        period: "/month",
            description: "Full access for 1 month",
            popular: false,
        features: [
          "Unlimited access to all tools",
          "24/7 Priority support",
          "Exclusive CPA marketing features",
          "Regular updates and new tools",
          "API access",
          "Bulk operation support",
        ],
            cta: "Subscribe for 1 Month",
          },
          {
            name: "3 Months",
            price: "৳5,000",
            period: "/3 months",
            description: "Full access for 3 months",
            popular: true,
            features: [
              "Unlimited access to all tools",
              "24/7 Priority support",
              "Exclusive CPA marketing features",
              "Regular updates and new tools",
              "API access",
              "Bulk operation support",
              "17% discount",
            ],
            cta: "Subscribe for 3 Months",
          },
          {
            name: "6 Months",
            price: "৳8,000",
            period: "/6 months",
            description: "Full access for 6 months",
            popular: false,
            features: [
              "Unlimited access to all tools",
              "24/7 Priority support",
              "Exclusive CPA marketing features",
              "Regular updates and new tools",
              "API access",
              "Bulk operation support",
              "33% discount",
            ],
            cta: "Subscribe for 6 Months",
          },
        ],
        paymentMethods: "Payment Methods:",
        methods: ["Card", "bKash", "Cash"],
      },
      testimonials: {
        badge: "Customer Reviews",
        title: "What Our CPA Marketers Say",
        subtitle: "Thousands of CPA marketers are earning more using our tools",
        reviews: [
          {
            text: "Amazing CPA tools! My campaign performance has improved significantly. The premium subscription is completely worth it.",
            name: "Rakib Ahmed",
            role: "CPA Marketer",
          },
          {
            text: "The support team is very helpful. They solve any problem immediately. The tools are very easy to use.",
            name: "Sumaiya Khan",
            role: "Affiliate Marketer",
          },
          {
            text: "The premium features are truly game changers. My CPA earnings have increased significantly.",
            name: "Mahmud Hasan",
            role: "Digital Marketer",
          },
        ],
      },
      footer: {
        description:
          "Premium tools for CPA marketers that will boost your campaigns and maximize your earnings potential.",
        quickLinks: "Quick Links",
        contact: "Contact",
        copyright: "All rights reserved.",
      },
    },
  }

  const t = content[language]

  return (
    <>
      {/* Loading Screen */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl animate-float animate-glow">
                <Zap className="w-12 h-12 text-white animate-wiggle" />
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 animate-ping opacity-20"></div>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-shimmer">
                UGen Pro
              </h1>
              <p className="text-slate-600 dark:text-slate-400 animate-pulse">
                Loading premium tools...
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Animated Background Elements */}
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

        {/* Enhanced animated orbs - Light mode */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-200/30 dark:hidden rounded-full blur-3xl animate-float animate-morphing" />
        <div
          className="absolute bottom-1/4 -right-64 w-96 h-96 bg-indigo-200/30 dark:hidden rounded-full blur-3xl animate-float-reverse animate-morphing"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200/25 dark:hidden rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-emerald-200/30 dark:hidden rounded-full blur-3xl animate-float-reverse" style={{ animationDelay: "3s" }} />

        {/* Enhanced animated orbs - Dark mode */}
        <div className="hidden dark:block absolute top-1/6 -left-48 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/15 rounded-full blur-3xl animate-float animate-morphing" />
        <div
          className="hidden dark:block absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/25 to-pink-500/20 rounded-full blur-3xl animate-float-reverse animate-morphing"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="hidden dark:block absolute bottom-1/4 -right-32 w-72 h-72 bg-gradient-to-r from-indigo-500/20 to-blue-500/15 rounded-full blur-3xl animate-float animate-morphing"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="hidden dark:block absolute bottom-1/6 left-1/3 w-56 h-56 bg-gradient-to-r from-emerald-500/15 to-teal-500/10 rounded-full blur-3xl animate-float-reverse animate-morphing"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="hidden dark:block absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-violet-500/12 to-rose-500/10 rounded-full blur-3xl animate-float animate-morphing"
          style={{ animationDelay: "4s" }}
        />

        {/* Additional floating geometric shapes */}
        <div className="hidden dark:block absolute top-20 right-20 w-4 h-4 bg-gradient-to-r from-yellow-400/60 to-orange-400/60 rotate-45 animate-float animate-rotate" />
        <div className="hidden dark:block absolute bottom-40 left-40 w-6 h-6 bg-gradient-to-r from-green-400/60 to-emerald-400/60 rounded-full animate-float-reverse" style={{ animationDelay: "1.5s" }} />
        <div className="hidden dark:block absolute top-1/2 right-1/3 w-3 h-3 bg-gradient-to-r from-pink-400/60 to-rose-400/60 animate-float" style={{ animationDelay: "2.5s" }} />

        {/* Floating particles - Dark mode only */}
        <div
          className="hidden dark:block absolute top-20 left-20 w-2 h-2 bg-blue-400/50 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        />
        <div
          className="hidden dark:block absolute top-40 right-32 w-1.5 h-1.5 bg-purple-400/50 rounded-full animate-bounce"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="hidden dark:block absolute bottom-32 left-16 w-2.5 h-2.5 bg-cyan-400/50 rounded-full animate-bounce"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="hidden dark:block absolute bottom-20 right-20 w-1 h-1 bg-pink-400/50 rounded-full animate-bounce"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="hidden dark:block absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-emerald-400/50 rounded-full animate-bounce"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="hidden dark:block absolute top-1/3 left-1/4 w-1 h-1 bg-violet-400/50 rounded-full animate-bounce"
          style={{ animationDelay: "5s" }}
        />
        <div
          className="hidden dark:block absolute bottom-1/3 right-1/4 w-2 h-2 bg-rose-400/50 rounded-full animate-bounce"
          style={{ animationDelay: "6s" }}
        />
      </div>
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 ${isLoaded ? 'animate-slide-in-bottom' : 'opacity-0'}`}>
        <div className="glass-card border-b border-white/10 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 hover-lift">
                {/* Custom U Logo */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative overflow-hidden animate-glow">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  {/* U Letter Logo */}
                  <img src="/u-logo.svg" alt="UGen Pro Logo" className="w-full h-full relative z-10 object-contain" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    UGen Pro
                  </span>
                  <p className="text-xs text-muted-foreground -mt-1">Premium Developer Tools</p>
                </div>
              </Link>

              {/* Language Toggle */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleLanguage}
                  className="glass-card px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-white/10 transition-all duration-300 hover-lift animate-shimmer"
                >
                  <Languages className="w-4 h-4 animate-wiggle" />
                  <span className="text-sm font-medium">{language === "bn" ? "বাংলা" : "English"}</span>
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  <button
                    onClick={scrollToFeatures}
                    className="text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                  >
                    {t.nav.features}
                  </button>
                  <button
                    onClick={scrollToPricing}
                    className="text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                  >
                    {t.nav.pricing}
                  </button>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/signup"
                    className="glass-card px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold hover-lift animate-glow"
                  >
                    {t.nav.signup}
                  </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 glass-card rounded-xl">
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
              <div className="md:hidden mt-4 pb-4 border-t border-white/10">
                <nav className="flex flex-col space-y-4 pt-4">
                  <button
                    onClick={() => {
                      scrollToFeatures()
                      setIsMenuOpen(false)
                    }}
                    className="text-muted-foreground hover:text-blue-600 transition-colors text-left font-medium"
                  >
                    {t.nav.features}
                  </button>
                  <button
                    onClick={() => {
                      scrollToPricing()
                      setIsMenuOpen(false)
                    }}
                    className="text-muted-foreground hover:text-blue-600 transition-colors text-left font-medium"
                  >
                    {t.nav.pricing}
                  </button>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                  <Link
                    href="/login"
                    className="text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/signup"
                    className="glass-card px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-center font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.nav.signup}
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-20 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
              <div className={`space-y-8 ${isLoaded ? 'animate-slide-in-left' : 'opacity-0'}`}>
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-semibold shadow-lg backdrop-blur-sm animate-shimmer hover:scale-105 transition-transform duration-300">
                  <Sparkles className="w-4 h-4 animate-pulse animate-wiggle" />
                  <span>{t.hero.badge}</span>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  <span className="block text-left mb-2 tracking-tight animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
                    {t.hero.title}
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-left tracking-tight animate-fade-in-scale animate-glow" style={{ animationDelay: '0.4s' }}>
                    {t.hero.titleHighlight}
                  </span>
                </h1>

                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium animate-fade-in-scale" style={{ animationDelay: '0.6s' }}>{t.hero.subtitle}</p>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {t.hero.benefits.map((benefit, index) => (
                  <div key={index} className={`flex items-center space-x-3 group animate-slide-in-bottom`} style={{ animationDelay: `${0.8 + index * 0.1}s` }}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 hover-lift">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm text-slate-900 dark:text-white font-medium group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-bottom" style={{ animationDelay: '1.2s' }}>
                <Button
                  onClick={scrollToPricing}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-3 hover:scale-105 transform animate-glow hover-lift"
                >
                  <span>{t.hero.cta1}</span>
                  <ArrowRight className="w-5 h-5 animate-bounce" />
                </Button>
                <Button
                  onClick={scrollToFeatures}
                  variant="outline"
                  className="px-8 py-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-800/90 text-slate-900 dark:text-white text-lg font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform hover-lift"
                >
                  <span>{t.hero.cta2}</span>
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className={`relative ${isLoaded ? 'animate-slide-in-right' : 'opacity-0'}`}>
              <Card className="p-6 rounded-2xl border-slate-200/50 dark:border-slate-700/30 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-2xl hover-lift animate-float">
                <CardContent className="p-0">
                  <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-6 shadow-xl backdrop-blur-xl">
                      <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full shadow-md animate-pulse"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-md animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-md animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg w-4/5 shadow-md animate-shimmer"></div>
                        <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg w-3/5 shadow-md animate-shimmer" style={{ animationDelay: '0.5s' }}></div>
                        <div className="h-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg w-2/3 shadow-md animate-shimmer" style={{ animationDelay: '1s' }}></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <Card className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform hover-lift animate-glow">
                          <CardContent className="p-0">
                            <Globe className="w-8 h-8 mx-auto mb-2 animate-float" />
                            <p className="text-sm font-bold">Address Generator</p>
                          </CardContent>
                        </Card>
                        <Card className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform hover-lift animate-glow" style={{ animationDelay: '0.5s' }}>
                          <CardContent className="p-0">
                            <Smartphone className="w-8 h-8 mx-auto mb-2 animate-float-reverse" />
                            <p className="text-sm font-bold">User Agent</p>
                          </CardContent>
                        </Card>
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-shimmer hover:scale-105 transition-transform duration-300">
              <Award className="w-4 h-4 animate-wiggle" />
              <span>{t.features.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 gradient-text">{t.features.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.tools.map((tool, index) => {
              const IconComponent = tool.icon
              return (
                <Card
                key={index}
                  className="p-8 rounded-2xl border-slate-200/50 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/30 group cursor-pointer hover:-translate-y-2 dark:shadow-2xl dark:shadow-slate-900/20 scroll-animate hover-lift animate-glow"
                  onClick={() => openToolPopup(index)}
                  style={{ animationDelay: `${index * 0.1}s` }}
              >
                  <CardContent className="p-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-xl animate-float">
                      <IconComponent className="w-8 h-8 text-white animate-wiggle" />
                </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{tool.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{tool.description}</p>
                <div className="flex items-center justify-between">
                      <Badge variant="default" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 font-semibold px-3 py-1 animate-pulse">
                    <Activity className="w-3 h-3 mr-1 animate-bounce" />
                    Active
                  </Badge>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{tool.users}</span>
                </div>
                    <div className="mt-6">
                      <Button
                        onClick={() => openToolPopup(index)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform flex items-center justify-center space-x-2 animate-shimmer hover-lift"
                      >
                        <ExternalLink className="w-4 h-4 animate-bounce" />
                        <span>Click for details</span>
                      </Button>
              </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-shimmer hover:scale-105 transition-transform duration-300">
              <Crown className="w-4 h-4 animate-wiggle" />
              <span>{t.pricing.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 gradient-text">{t.pricing.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.pricing.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {t.pricing.plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`rounded-3xl p-8 relative overflow-hidden shadow-2xl bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-3xl scroll-animate hover-lift ${
                  plan.popular 
                    ? 'border-2 border-blue-500 ring-4 ring-blue-500/20 animate-glow' 
                    : 'border border-slate-200/50 dark:border-slate-700/30'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
              {/* Popular Badge */}
                {plan.popular && (
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-bl-2xl rounded-tr-3xl text-sm font-semibold">
                    {language === 'bn' ? 'সর্বাধিক জনপ্রিয়' : 'Most Popular'}
              </div>
                )}

              <CardContent className="p-0">
              <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                      <span className="text-5xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                      <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>
                </div>
                    <p className="text-slate-600 dark:text-slate-400">{plan.description}</p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-900 dark:text-white font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
                <Link href="/signup">
                    <Button className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                        : 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white'
                    }`}>
                      {plan.cta}
                  </Button>
              </Link>
                </CardContent>
              </Card>
            ))}
          </div>

              {/* Payment Methods */}
          <div className="mt-12 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{t.pricing.paymentMethods}</p>
                <div className="flex items-center justify-center space-x-4">
                  {t.pricing.methods.map((method, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <CreditCard className="w-4 h-4" />
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 scroll-animate">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-shimmer hover:scale-105 transition-transform duration-300">
              <Heart className="w-4 h-4 animate-wiggle" />
              <span>{t.testimonials.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 gradient-text">{t.testimonials.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.testimonials.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.testimonials.reviews.map((review, index) => (
              <Card
                key={index}
                className="p-8 rounded-2xl border-slate-200/50 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300 scroll-animate hover-lift animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg animate-glow hover:scale-110 transition-transform duration-300">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{review.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{review.role}</p>
                  </div>
                </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Tool Popup Dialog */}
      <Dialog open={selectedTool !== null} onOpenChange={closeToolPopup}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700 shadow-2xl">
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center space-x-4 text-3xl font-bold">
              {selectedTool !== null && (
                <>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                    {(() => {
                      const IconComponent = t.features.tools[selectedTool]?.icon
                      return IconComponent ? <IconComponent className="w-8 h-8 text-white" /> : null
                    })()}
        </div>
                  <div>
                    <span className="text-slate-900 dark:text-white">{t.features.tools[selectedTool]?.name}</span>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700">
                        <Activity className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{t.features.tools[selectedTool]?.users}</span>
                    </div>
                  </div>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400 text-lg mt-4 leading-relaxed">
              {selectedTool !== null && t.features.tools[selectedTool]?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTool !== null && (
            <div className="space-y-8">
              {/* Tool Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card className="p-6 rounded-2xl text-center border-slate-200/50 dark:border-slate-700/30 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Users</p>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{t.features.tools[selectedTool]?.users}</p>
                  </CardContent>
                </Card>
                <Card className="p-6 rounded-2xl text-center border-slate-200/50 dark:border-slate-700/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Time</p>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{t.features.tools[selectedTool]?.timeToGenerate}</p>
                  </CardContent>
                </Card>
                <Card className="p-6 rounded-2xl text-center border-slate-200/50 dark:border-slate-700/30 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Accuracy</p>
                    <p className="font-bold text-lg text-slate-900 dark:text-white">{t.features.tools[selectedTool]?.accuracy}</p>
                  </CardContent>
                </Card>
                <Card className="p-6 rounded-2xl text-center border-slate-200/50 dark:border-slate-700/30 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Status</p>
                    <p className="font-bold text-lg text-green-600">Active</p>
                  </CardContent>
                </Card>
              </div>

              {/* Features */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900 dark:text-white">
                  <div className="w-8 h-8 rounded-xl bg-yellow-500 flex items-center justify-center mr-3 shadow-lg">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {t.features.tools[selectedTool]?.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-700">
                <h3 className="text-xl font-bold mb-4 flex items-center text-slate-900 dark:text-white">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center mr-3 shadow-lg">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  Use Cases
                </h3>
                <div className="flex flex-wrap gap-3">
                  {t.features.tools[selectedTool]?.useCases.map((useCase, index) => (
                    <Badge key={index} variant="outline" className="text-sm px-4 py-2 bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300">
                      {useCase}
                    </Badge>
                  ))}
                </div>
              </div>

                {/* CTA Button */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                  <Link href="/signup" onClick={closeToolPopup}>
                  <Button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform flex items-center justify-center space-x-3">
                      <span>Get Started with {t.features.tools[selectedTool]?.name}</span>
                    <ArrowRight className="w-5 h-5" />
                    </Button>
            </Link>
          </div>
        </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 gradient-text">
              Get in Touch
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Have questions? Need support? We're here to help you succeed with UGen Pro.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <Card className="p-8 rounded-2xl border-slate-200/50 dark:border-slate-700/30 bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm shadow-xl scroll-animate hover-lift animate-float">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center">
                  <MessageSquare className="w-6 h-6 text-blue-500 mr-3 animate-wiggle" />
                  Send us a Message
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-2">
                  We'll get back to you within 24 hours
                </CardDescription>
              </CardHeader>

              <ContactForm />
            </Card>

            {/* Contact Info */}
            <div className="space-y-8 scroll-animate" style={{ animationDelay: '0.2s' }}>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Other Ways to Reach Us
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 hover-lift animate-shimmer">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0 animate-glow">
                      <MessageSquare className="w-6 h-6 text-white animate-float" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Telegram Support</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Get instant help via Telegram</p>
                      <a href="https://t.me/ugenpro_support" className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                        @ugenpro_support
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 hover-lift animate-shimmer" style={{ animationDelay: '0.2s' }}>
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 animate-glow">
                      <Database className="w-6 h-6 text-white animate-float-reverse" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Email Support</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Send us an email anytime</p>
                      <a href="mailto:support@ugenpro.com" className="text-green-600 dark:text-green-400 text-sm font-medium hover:underline">
                        support@ugenpro.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 hover-lift animate-shimmer" style={{ animationDelay: '0.4s' }}>
                    <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0 animate-glow">
                      <Clock className="w-6 h-6 text-white animate-wiggle" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Response Time</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">We respond quickly</p>
                      <span className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                        Within 24 hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden scroll-animate hover-lift">
            <CardContent className="p-0">
              {/* Main Footer Content */}
              <div className="p-8 lg:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                  {/* Company Info */}
                  <div className="space-y-4 scroll-animate">
                    <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg animate-glow">
                  <Zap className="w-7 h-7 text-white animate-wiggle" />
                </div>
                <div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">UGen Pro</span>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Premium Tools</p>
                </div>
              </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{t.footer.description}</p>
                    <div className="flex space-x-4">
                      <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                  {t.nav.login}
                </Link>
                      <Link href="/signup" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium">
                  {t.nav.signup}
                </Link>
              </div>
            </div>

            {/* Quick Links */}
                  <div className="space-y-4 scroll-animate" style={{ animationDelay: '0.1s' }}>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                      <ArrowRight className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2 animate-bounce" />
                      {t.footer.quickLinks}
                    </h3>
              <ul className="space-y-3">
                <li>
                        <button onClick={scrollToFeatures} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center group">
                          <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                    {t.nav.features}
                  </button>
                </li>
                <li>
                        <button onClick={scrollToPricing} className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center group">
                          <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                    {t.nav.pricing}
                  </button>
                </li>
                <li>
                        <Link href="/contact" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center group">
                          <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                          Contact
                        </Link>
                      </li>
                      <li>
                        <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center group">
                          <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                    {t.nav.login}
                  </Link>
                </li>
                <li>
                        <Link href="/signup" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center group">
                          <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                    {t.nav.signup}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
                  <div className="space-y-4 scroll-animate" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                      <Database className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 animate-float" />
                      {t.footer.contact}
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Database className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                        </div>
                        <span className="text-sm">support@ugenpro.com</span>
                </li>
                      <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Smartphone className="w-4 h-4 text-green-500 dark:text-green-400" />
                        </div>
                        <span className="text-sm">+৮৮০ ১৭১২ ৩৪৫৬৭৮</span>
                </li>
                      <li className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                        </div>
                        <span className="text-sm">ঢাকা, বাংলাদেশ</span>
                </li>
              </ul>
            </div>

                  {/* Social & Newsletter */}
                  <div className="space-y-4 scroll-animate" style={{ animationDelay: '0.3s' }}>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                      <Heart className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 animate-pulse" />
                      Stay Connected
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">Get updates on new features and tools</p>
                    <div className="space-y-3">
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/30 transition-colors cursor-pointer hover-lift animate-glow">
                          <span className="text-blue-500 dark:text-blue-400 text-sm font-bold">f</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-blue-400/20 flex items-center justify-center hover:bg-blue-400/30 transition-colors cursor-pointer hover-lift animate-glow" style={{ animationDelay: '0.1s' }}>
                          <span className="text-blue-400 dark:text-blue-300 text-sm font-bold">t</span>
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center hover:bg-pink-500/30 transition-colors cursor-pointer hover-lift animate-glow" style={{ animationDelay: '0.2s' }}>
                          <span className="text-pink-500 dark:text-pink-400 text-sm font-bold">i</span>
                        </div>
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Follow us for updates
                      </div>
                    </div>
            </div>
          </div>

                {/* Bottom Copyright */}
                <div className="border-t border-slate-300 dark:border-slate-700/50 pt-8">
                  <div className="text-center">
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      &copy; ২০২৫ UGen Pro. {t.footer.copyright}
                    </p>
                    <div className="flex items-center justify-center space-x-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>Made with ❤️ in Bangladesh</span>
                      <span>•</span>
                      <span>Powered by Next.js</span>
          </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>
    </div>
    </>
  )
}
