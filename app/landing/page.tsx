"use client"

import type React from "react"

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
  Send,
  Loader2,
  User,
  AtSign,
  MessageSquare,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import CounterAnimation from "@/components/counter-animation"

// Contact Form Component
function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    telegramUsername: "",
    message: "",
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
      setFormData((prev) => ({ ...prev, [name]: processedValue }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
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
        minute: "2-digit",
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
          telegramMessage: telegramMessage,
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
                <li key={index} className="text-sm">
                  {error}
                </li>
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
  const [language, setLanguage] = useState<"bn" | "en">("en") // Default to English
  const [selectedTool, setSelectedTool] = useState<number | null>(null)

  const [scrollPosition, setScrollPosition] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Placeholder for translations, assuming it's defined elsewhere or will be imported
  // For now, using the existing content object directly.
  const translations = {
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
        benefits: [
          "CPA মার্কেটারদের জন্য উন্নত টুলস",
          "রিয়েল-টাইম ক্যাম্পেইন অ্যানালিটিক্স",
          "নিরাপদ এবং নির্ভরযোগ্য প্ল্যাটফর্ম",
          "২৪/৭ কাস্টমার সাপোর্ট",
        ],
        cta1: "Buy Premium",
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
          {
            text: "API অ্যাক্সেস এবং বুল্ক অপারেশন সাপোর্ট আমার কাজকে অনেক সহজ করে দিয়েছে। দারুণ সার্ভিস!",
            name: "তানভীর ইসলাম",
            role: "ব্যাকএন্ড ডেভেলপার",
          },
          {
            text: "নিয়মিত আপডেট এবং নতুন ফিচার পাওয়া যায়। টিম সত্যিই ইউজারদের ফিডব্যাক শোনে এবং কাজ করে।",
            name: "নাজমুল হক",
            role: "মোবাইল অ্যাপ ডেভেলপার",
          },
          {
            text: "সিকিউরিটি ফিচারগুলো অসাধারণ। আমার ক্লায়েন্টরা খুবই সন্তুষ্ট। সবাইকে রেকমেন্ড করি।",
            name: "ফারহানা আক্তার",
            role: "ফ্রিল্যান্স ডেভেলপার",
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
        subtitle:
          "Boost your CPA marketing campaigns with our powerful tools designed for affiliate marketers and digital entrepreneurs.",
        benefits: [
          "Advanced tools for CPA marketers",
          "Real-time campaign analytics",
          "Secure and reliable platform",
          "24/7 customer support",
          "Regular updates and new tools",
        ],
        cta1: "Buy Premium",
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
        methods: ["Card", "bKash", "Nagad"],
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
          {
            text: "API access and bulk operations have made my workflow so much easier. Excellent service and great value!",
            name: "Tanvir Islam",
            role: "Performance Marketer",
          },
          {
            text: "Regular updates and new features keep coming. The team really listens to user feedback and delivers.",
            name: "Nazmul Haque",
            role: "Media Buyer",
          },
          {
            text: "Security features are outstanding. My clients are very satisfied. I recommend it to everyone in the industry.",
            name: "Farhana Akter",
            role: "Freelance Marketer",
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

  const t = translations[language]

  useEffect(() => {
    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate")
          }
        })
      },
      { threshold: 0.1 },
    )

    const scrollElements = document.querySelectorAll(".scroll-animate")
    scrollElements.forEach((el) => observer.observe(el))

    // Text animation
    const words = ["CPA Marketing", "Self Sign Up"]
    let currentIndex = 0
    const textElement = document.getElementById("animated-text")
    
    if (textElement) {
      const animateText = () => {
        textElement.style.opacity = "0"
        textElement.style.transform = "translateY(10px)"
        
        setTimeout(() => {
          currentIndex = (currentIndex + 1) % words.length
          textElement.textContent = words[currentIndex]
          
          textElement.style.opacity = "1"
          textElement.style.transform = "translateY(0)"
        }, 200)
      }
      
      const interval = setInterval(animateText, 1500)
      
      return () => {
        observer.disconnect()
        clearInterval(interval)
      }
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        // Reset to 0 when reaching the end of first set
        // The total width of the duplicated content is roughly 2 * (6 reviews * 400px width + 5 gaps * 32px gap)
        // Let's estimate the total width to be around 2 * (2400 + 160) = 5120px.
        // We want to reset when we've scrolled past the first full set, which is around 2560px.
        // Adjusting the reset point to be more precise based on the actual content width.
        // The width of the container is `fit-content`, and the gap is 8.
        // The total width of one set of reviews is approximately 6 * 400px + 5 * 32px = 2400px + 160px = 2560px.
        // So, we reset when `prev` is less than or equal to `-2560`.
        if (prev <= -2560) return 0
        return prev - 1 // Move 1px to the left every 20ms
      })
    }, 20)

    return () => clearInterval(interval)
  }, [isPaused])

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "center" })
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

  // Language content (moved to the top for clarity)
  // const content = { ... } // This was moved to the top

  // const t = content[language] // This is now using the 'translations' object

  return (
    <>

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
          <div
            className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-200/25 dark:hidden rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-emerald-200/30 dark:hidden rounded-full blur-3xl animate-float-reverse"
            style={{ animationDelay: "3s" }}
          />

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
          <div
            className="hidden dark:block absolute bottom-40 left-40 w-6 h-6 bg-gradient-to-r from-green-400/60 to-emerald-400/60 rounded-full animate-float-reverse"
            style={{ animationDelay: "1.5s" }}
          />
          <div
            className="hidden dark:block absolute top-1/2 right-1/3 w-3 h-3 bg-gradient-to-r from-pink-400/60 to-rose-400/60 animate-float"
            style={{ animationDelay: "2.5s" }}
          />

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
        <header className="fixed top-0 w-full z-50 animate-slide-in-bottom">
          <div className="glass-card border-b border-white/10 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-3 hover-lift group">
                  {/* Custom U Logo */}
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-xl overflow-hidden animate-glow group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                    <img
                      src="/images/logo.jpg"
                      alt="UGen Pro Logo"
                      className="w-8 h-8 relative z-10 object-contain rounded-lg group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Sparkle effects */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                    <div
                      className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                  <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:via-indigo-500 group-hover:to-purple-500 transition-all duration-300">
                      UGen Pro
                    </span>
                    <p className="text-xs text-muted-foreground -mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                      Premium Developer Tools
                    </p>
                  </div>
                </Link>

                {/* Language Toggle & Navigation */}
                <div className="flex items-center space-x-4">
                  {/* Language Toggle */}
                  <button
                    onClick={toggleLanguage}
                    className="relative glass-card px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-white/20 dark:hover:bg-slate-800/50 transition-all duration-300 hover-lift animate-shimmer group overflow-hidden"
                  >
                    {/* Animated background on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    <Languages className="w-4 h-4 animate-wiggle relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-sm font-medium relative z-10">{language === "bn" ? "বাংলা" : "English"}</span>

                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                  </button>

                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center space-x-2">
                    <button
                      onClick={scrollToFeatures}
                      className="relative px-4 py-2 rounded-xl text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium group overflow-hidden"
                    >
                      {/* Animated underline */}
                      <span className="relative z-10">{t.nav.features}</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                      {/* Background on hover */}
                      <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    <button
                      onClick={scrollToPricing}
                      className="relative px-4 py-2 rounded-xl text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium group overflow-hidden"
                    >
                      <span className="relative z-10">{t.nav.pricing}</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    <button
                      onClick={scrollToContact}
                      className="relative px-4 py-2 rounded-xl text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium group overflow-hidden"
                    >
                      <span className="relative z-10">Contact</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    <Link
                      href="/login"
                      className="relative px-4 py-2 rounded-xl text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium group overflow-hidden"
                    >
                      <span className="relative z-10">{t.nav.login}</span>
                      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>

                    <Link
                      href="/signup"
                      className="relative glass-card px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold hover-lift animate-glow group overflow-hidden ml-2"
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      <div className="relative z-10 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        <span>{t.nav.signup}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>

                      {/* Glowing border effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/50 via-indigo-400/50 to-purple-400/50 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
                    </Link>
                  </nav>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 glass-card rounded-xl hover:bg-white/20 dark:hover:bg-slate-800/50 transition-all duration-300 hover-lift group"
                  >
                    {isMenuOpen ? (
                      <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                    ) : (
                      <Menu className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation */}
              {isMenuOpen && (
                <div className="md:hidden mt-4 pb-4 border-t border-white/10 animate-slide-in-top">
                  <nav className="flex flex-col space-y-2 pt-4">
                    <button
                      onClick={() => {
                        scrollToFeatures()
                        setIsMenuOpen(false)
                      }}
                      className="relative text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 text-left font-medium px-4 py-3 rounded-xl hover:bg-blue-500/10 dark:hover:bg-blue-500/20 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span>{t.nav.features}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        scrollToPricing()
                        setIsMenuOpen(false)
                      }}
                      className="relative text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 text-left font-medium px-4 py-3 rounded-xl hover:bg-blue-500/10 dark:hover:bg-blue-500/20 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span>{t.nav.pricing}</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        scrollToContact()
                        setIsMenuOpen(false)
                      }}
                      className="relative text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 text-left font-medium px-4 py-3 rounded-xl hover:bg-blue-500/10 dark:hover:bg-blue-500/20 group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span>Contact</span>
                      </div>
                    </button>

                    <Link
                      href="/login"
                      className="relative text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-medium px-4 py-3 rounded-xl hover:bg-blue-500/10 dark:hover:bg-blue-500/20 group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span>{t.nav.login}</span>
                      </div>
                    </Link>

                    <Link
                      href="/signup"
                      className="relative glass-card px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 text-center font-semibold shadow-xl hover:shadow-2xl group overflow-hidden mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {/* Animated shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                      <div className="relative z-10 flex items-center justify-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>{t.nav.signup}</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Link>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative z-10 px-6 pt-20 pb-16 min-h-screen">
          <div className="max-w-7xl mx-auto h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center h-full">
              {/* Hero Content */}
              <div className="space-y-8">
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-sm font-semibold shadow-lg backdrop-blur-sm animate-pulse-glow hover:scale-105 transition-transform duration-300">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>{t.hero.badge}</span>
                    <div
                      className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    ></div>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-tight">
                    <div className="block text-left">
                      <span className="inline-block mr-4 animate-text-shimmer">Premium Tools</span>
                      <span className="inline-block text-slate-500 dark:text-slate-400 font-medium text-4xl md:text-6xl">For</span>
                      <div className="inline-block ml-4">
                        <span 
                          id="animated-text"
                          className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent font-black text-4xl md:text-6xl animate-text-shimmer transition-all duration-300 ease-in-out"
                          style={{
                            opacity: 1,
                            transform: "translateY(0)"
                          }}
                        >
                          CPA Marketing
                        </span>
                      </div>
                    </div>
                  </h1>

                  <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
                    {t.hero.subtitle}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6">
                  <Button
                    onClick={scrollToPricing}
                    className="px-10 py-6 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:via-amber-600 hover:to-orange-600 text-white text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 flex items-center justify-center space-x-3 hover:scale-105 transform animate-pulse-glow relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Crown className="w-6 h-6 animate-bounce relative z-10" />
                    <span className="relative z-10 font-black tracking-wide">{t.hero.cta1}</span>
                    <Sparkles className="w-6 h-6 animate-pulse relative z-10" />
                    {/* Golden shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </Button>
                  <Button
                    onClick={scrollToFeatures}
                    variant="outline"
                    className="px-10 py-6 rounded-2xl border-2 border-slate-300 dark:border-slate-600 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white text-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                  >
                    <span>{t.hero.cta2}</span>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="bento-grid h-[600px] relative perspective-1000">
                  {/* Large Feature Card - Enhanced with parallax and 3D effects */}
                  <div className="bento-large interactive-card card-3d bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/5 border-purple-500/30 animate-float-gentle backdrop-blur-xl shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 group">
                    <div className="card-3d-inner p-8 h-full flex flex-col justify-between relative overflow-hidden">
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Floating particles */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full animate-float opacity-60" />
                      <div
                        className="absolute bottom-8 left-8 w-1.5 h-1.5 bg-pink-400 rounded-full animate-float-reverse opacity-60"
                        style={{ animationDelay: "1s" }}
                      />
                      <div
                        className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-60"
                        style={{ animationDelay: "2s" }}
                      />

                      <div className="relative z-10">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 flex items-center justify-center mb-6 animate-pulse-glow shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 relative">
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/30 to-transparent" />
                          <Zap className="w-10 h-10 text-white animate-bounce relative z-10 drop-shadow-2xl" />

                          {/* Sparkle effects */}
                          <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                          <div
                            className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                            style={{ animationDelay: "0.3s" }}
                          />
                        </div>

                        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          IMMERSIVE EXPERIENCE
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                          A visual identity uniting music fans from all over the world by allowing them to come together
                          through music
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 relative z-10">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" />
                          <div
                            className="w-3 h-3 bg-pink-500 rounded-full animate-pulse shadow-lg shadow-pink-500/50"
                            style={{ animationDelay: "0.5s" }}
                          />
                          <div
                            className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"
                            style={{ animationDelay: "1s" }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Live Now</span>
                      </div>

                      {/* Glowing border effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* Medium Stats Card - Enhanced with counter animation */}
                  <div
                    className="bento-medium interactive-card card-3d bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-blue-500/5 border-blue-500/30 animate-float-reverse backdrop-blur-xl shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 group"
                    style={{ animationDelay: "1s" }}
                  >
                    <div className="card-3d-inner p-6 h-full flex flex-col justify-center text-center relative overflow-hidden">
                      {/* Animated gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Floating particles */}
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce opacity-60" />
                      <div
                        className="absolute bottom-2 left-2 w-1 h-1 bg-cyan-400 rounded-full animate-bounce opacity-60"
                        style={{ animationDelay: "0.5s" }}
                      />

                      <div className="relative z-10">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 animate-pulse-glow shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 relative">
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent" />
                          <Activity className="w-8 h-8 text-white animate-bounce relative z-10 drop-shadow-2xl" />

                          {/* Sparkle effects */}
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                        </div>

                        <div className="text-4xl font-black text-slate-900 dark:text-white mb-2 animate-text-shimmer group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-cyan-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          <CounterAnimation target={100} suffix="+" />
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-bold tracking-wide">
                          SATISFIED USERS
                        </p>

                        {/* Progress indicator */}
                        <div className="mt-4 w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full animate-pulse"
                            style={{ width: "95%" }}
                          />
                        </div>
                      </div>

                      {/* Glowing border effect */}
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* Small Feature Cards - Enhanced with better animations */}
                  <div
                    className="bento-small interactive-card card-3d bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-green-500/5 border-green-500/30 animate-float-gentle backdrop-blur-xl shadow-2xl hover:shadow-green-500/30 transition-all duration-500 group"
                    style={{ animationDelay: "2s" }}
                  >
                    <div className="card-3d-inner p-4 h-full flex flex-col justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 flex items-center justify-center mx-auto mb-3 animate-pulse-glow shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent" />
                          <Shield className="w-6 h-6 text-white relative z-10 drop-shadow-2xl" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                        </div>
                        <p className="text-xs font-black text-slate-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-green-600 group-hover:to-emerald-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          SECURE
                        </p>
                      </div>

                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    </div>
                  </div>

                  <div
                    className="bento-small interactive-card card-3d bg-gradient-to-br from-orange-500/10 via-red-500/10 to-orange-500/5 border-orange-500/30 animate-float-reverse backdrop-blur-xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 group"
                    style={{ animationDelay: "3s" }}
                  >
                    <div className="card-3d-inner p-4 h-full flex flex-col justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-orange-600 flex items-center justify-center mx-auto mb-3 animate-pulse-glow shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent" />
                          <Clock className="w-6 h-6 text-white animate-wiggle relative z-10 drop-shadow-2xl" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                        </div>
                        <p className="text-xs font-black text-slate-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-red-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          FAST
                        </p>
                      </div>

                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    </div>
                  </div>

                  {/* Small Feature Cards - Enhanced */}
                  <div
                    className="bento-small interactive-card card-3d bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-pink-500/5 border-pink-500/30 animate-float-reverse backdrop-blur-xl shadow-2xl hover:shadow-pink-500/30 transition-all duration-500 group"
                    style={{ animationDelay: "2.5s" }}
                  >
                    <div className="card-3d-inner p-4 h-full flex flex-col justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-rose-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-3 animate-pulse-glow shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent" />
                          <Heart className="w-6 h-6 text-white animate-pulse relative z-10 drop-shadow-2xl" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                        </div>
                        <p className="text-xs font-black text-slate-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-rose-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          LOVED
                        </p>
                      </div>

                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    </div>
                  </div>

                  <div
                    className="bento-small interactive-card card-3d bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-yellow-500/5 border-yellow-500/30 animate-float-gentle backdrop-blur-xl shadow-2xl hover:shadow-yellow-500/30 transition-all duration-500 group"
                    style={{ animationDelay: "3.5s" }}
                  >
                    <div className="card-3d-inner p-4 h-full flex flex-col justify-center text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 via-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 flex items-center justify-center mx-auto mb-3 animate-pulse-glow shadow-2xl group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 relative">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent" />
                          <Award className="w-6 h-6 text-white animate-bounce relative z-10 drop-shadow-2xl" />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                        </div>
                        <p className="text-xs font-black text-slate-900 dark:text-white group-hover:bg-gradient-to-r group-hover:from-yellow-600 group-hover:to-orange-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                          #1 RATED
                        </p>
                      </div>

                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                    </div>
                  </div>
                </div>

                {/* Enhanced ambient glow effects */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/20 rounded-full blur-3xl animate-morph" />
                <div
                  className="absolute -bottom-24 -right-24 w-40 h-40 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/20 rounded-full blur-3xl animate-morph"
                  style={{ animationDelay: "4s" }}
                />
                <div
                  className="absolute top-1/2 -right-12 w-32 h-32 bg-gradient-to-r from-green-500/25 via-emerald-500/25 to-green-500/15 rounded-full blur-3xl animate-morph"
                  style={{ animationDelay: "2s" }}
                />
                <div
                  className="absolute top-1/4 -left-12 w-28 h-28 bg-gradient-to-r from-indigo-500/25 via-purple-500/25 to-indigo-500/15 rounded-full blur-3xl animate-morph"
                  style={{ animationDelay: "6s" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-shimmer hover:scale-105 transition-transform duration-300">
                <Award className="w-4 h-4 animate-wiggle" />
                <span>{t.features.badge}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 gradient-text">
                {t.features.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.features.tools.map((tool, index) => {
                const IconComponent = tool.icon
                return (
                  <Card
                    key={index}
                    className="group relative overflow-hidden rounded-3xl border-2 border-slate-200/50 dark:border-slate-700/30 bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-800/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/20 dark:hover:shadow-blue-500/40 cursor-pointer hover:-translate-y-3 hover:scale-[1.02] hover-lift animate-float"
                    onClick={() => openToolPopup(index)}
                  >
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Glowing border effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                    <CardContent className="relative p-8">
                      {/* Enhanced Icon with gradient background and animations */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-float">
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent" />
                          <IconComponent className="relative w-10 h-10 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />

                          {/* Sparkle effect */}
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                          <div
                            className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                            style={{ animationDelay: "0.3s" }}
                          />
                        </div>
                      </div>

                      {/* Title with gradient on hover */}
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {tool.name}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 text-sm">
                        {tool.description}
                      </p>

                      {/* Stats badges */}
                      <div className="flex items-center justify-between mb-6">
                        <Badge
                          variant="default"
                          className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-400 border-2 border-green-300 dark:border-green-700 font-bold px-4 py-1.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                          <Activity className="w-4 h-4 mr-1.5 animate-pulse" />
                          Active
                        </Badge>
                        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                          <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span>{tool.users}</span>
                        </div>
                      </div>

                      {/* Enhanced CTA Button */}
                      <Button
                        onClick={() => openToolPopup(index)}
                        className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white font-bold text-base transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 transform overflow-hidden group/btn"
                      >
                        {/* Animated shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />

                        <div className="relative flex items-center justify-center space-x-3">
                          <ExternalLink className="w-5 h-5 group-hover/btn:rotate-45 transition-transform duration-300" />
                          <span className="font-black tracking-wide">View Details</span>
                          <Sparkles className="w-5 h-5 group-hover/btn:scale-125 transition-transform duration-300" />
                        </div>
                      </Button>

                      {/* Decorative corner elements */}
                      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-shimmer hover:scale-105 transition-transform duration-300">
                <Crown className="w-4 h-4 animate-wiggle" />
                <span>{t.pricing.badge}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 gradient-text">
                {t.pricing.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {t.pricing.plans.map((plan, index) => (
                <Card
                  key={index}
                  className={`group relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover-lift animate-float ${
                    plan.popular
                      ? "border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20 dark:shadow-blue-500/40 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20"
                      : "border-2 border-slate-200/50 dark:border-slate-700/30 bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-800/60"
                  } backdrop-blur-xl`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 text-white px-4 py-1.5 rounded-bl-2xl rounded-tr-3xl text-xs font-bold shadow-lg animate-pulse-glow flex items-center space-x-1.5">
                      <Crown className="w-3 h-3 animate-bounce" />
                      <span>{language === "bn" ? "সর্বাধিক জনপ্রিয়" : "Most Popular"}</span>
                      <Sparkles className="w-3 h-3 animate-pulse" />
                    </div>
                  )}

                  <CardContent className="relative p-4">
                    <div className="relative mb-3">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
                      <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 animate-float mx-auto">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                        <Crown className="relative w-6 h-6 text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />

                        {/* Sparkle effect */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
                        <div
                          className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                          style={{ animationDelay: "0.3s" }}
                        />
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                        {plan.name}
                      </h3>
                      <div className="flex items-center justify-center space-x-1.5 mb-2">
                        <span className="text-3xl font-black text-slate-900 dark:text-white">{plan.price}</span>
                        <span className="text-slate-600 dark:text-slate-400 font-semibold text-sm">{plan.period}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 font-medium text-xs">{plan.description}</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/30 transition-all duration-300"
                        >
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <CheckCircle className="w-2.5 h-2.5 text-white" />
                          </div>
                          <span className="text-slate-900 dark:text-white font-medium text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Link href="/signup">
                      <Button
                        className={`relative w-full py-2.5 rounded-2xl text-sm font-bold transition-all duration-500 shadow-xl hover:shadow-2xl hover:scale-105 transform overflow-hidden group/btn ${
                          plan.popular
                            ? "bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white"
                            : "bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 hover:from-slate-600 hover:via-slate-700 hover:to-slate-800 text-white"
                        }`}
                      >
                        {/* Animated shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />

                        <div className="relative flex items-center justify-center space-x-1.5">
                          <Crown className="w-3.5 h-3.5 group-hover/btn:rotate-12 transition-transform duration-300" />
                          <span className="font-black tracking-wide">{plan.cta}</span>
                          <Sparkles className="w-3.5 h-3.5 group-hover/btn:scale-125 transition-transform duration-300" />
                        </div>
                      </Button>
                    </Link>

                    {/* Decorative corner elements */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 font-semibold">
                {t.pricing.paymentMethods}
              </p>
              <div className="flex items-center justify-center space-x-6">
                {/* Card Payment */}
                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    {language === "bn" ? "কার্ড" : "Card"}
                  </span>
                </div>

                {/* bKash Payment */}
                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-700 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg">
                    {/* bKash Icon */}
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-pink-700 dark:text-pink-300">
                    {language === "bn" ? "বিকাশ" : "bKash"}
                  </span>
                </div>

                {/* Nagad Payment */}
                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border border-orange-200 dark:border-orange-700 hover:scale-105 transition-transform duration-300 shadow-lg">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                    {/* Nagad Icon */}
                    <svg
                      className="w-5 h-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-orange-700 dark:text-orange-300">
                    {language === "bn" ? "নগদ" : "Nagad"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="relative z-10 px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-shimmer hover:scale-105 transition-transform duration-300">
                <Heart className="w-4 h-4 animate-wiggle" />
                <span>{t.testimonials.badge}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 gradient-text">
                {t.testimonials.title}
              </h2>
            </div>

            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Gradient overlays for fade effect */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none" />

              {/* Scrolling container */}
              <div
                className="flex gap-8 transition-transform duration-75 ease-linear"
                style={{
                  transform: `translateX(${scrollPosition}px)`,
                  width: "fit-content",
                }}
              >
                {/* First set of reviews */}
                {t.testimonials.reviews.map((review, index) => (
                  <Card
                    key={`first-${index}`}
                    className="group/card relative overflow-hidden rounded-3xl border-2 border-slate-200/50 dark:border-slate-700/30 bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-800/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/20 dark:hover:shadow-blue-500/40 cursor-pointer hover:-translate-y-3 hover:scale-[1.02] flex-shrink-0 w-[400px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover/card:opacity-100 blur-xl transition-opacity duration-500" />

                    <CardContent className="relative p-8">
                      <div className="flex items-center mb-6 space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="relative">
                            <Star
                              className="w-6 h-6 text-yellow-400 fill-current drop-shadow-lg group-hover/card:scale-110 transition-transform duration-300"
                              style={{ transitionDelay: `${i * 0.05}s` }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center opacity-50 group-hover/card:opacity-100 transition-opacity duration-300">
                        <MessageSquare className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-base font-medium relative z-10">
                        "{review.text}"
                      </p>

                      <div className="flex items-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-full blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 animate-pulse" />
                          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500 animate-glow">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                            <span className="relative z-10">{review.name.charAt(0)}</span>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover/card:opacity-100 animate-ping" />
                          </div>
                        </div>

                        <div className="ml-4">
                          <p className="font-black text-lg text-slate-900 dark:text-white group-hover/card:bg-gradient-to-r group-hover/card:from-blue-600 group-hover/card:via-purple-600 group-hover/card:to-pink-600 group-hover/card:bg-clip-text group-hover/card:text-transparent transition-all duration-300">
                            {review.name}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">{review.role}</p>
                        </div>
                      </div>

                      <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    </CardContent>
                  </Card>
                ))}

                {/* Duplicate set for seamless loop */}
                {t.testimonials.reviews.map((review, index) => (
                  <Card
                    key={`second-${index}`}
                    className="group/card relative overflow-hidden rounded-3xl border-2 border-slate-200/50 dark:border-slate-700/30 bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-800/60 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 hover:shadow-blue-500/20 dark:hover:shadow-blue-500/40 cursor-pointer hover:-translate-y-3 hover:scale-[1.02] flex-shrink-0 w-[400px]"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover/card:opacity-100 blur-xl transition-opacity duration-500" />

                    <CardContent className="relative p-8">
                      <div className="flex items-center mb-6 space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="relative">
                            <Star
                              className="w-6 h-6 text-yellow-400 fill-current drop-shadow-lg group-hover/card:scale-110 transition-transform duration-300"
                              style={{ transitionDelay: `${i * 0.05}s` }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center opacity-50 group-hover/card:opacity-100 transition-opacity duration-300">
                        <MessageSquare className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                      </div>

                      <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-base font-medium relative z-10">
                        "{review.text}"
                      </p>

                      <div className="flex items-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-full blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 animate-pulse" />
                          <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-2xl group-hover/card:scale-110 group-hover/card:rotate-6 transition-all duration-500 animate-glow">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                            <span className="relative z-10">{review.name.charAt(0)}</span>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover/card:opacity-100 animate-ping" />
                          </div>
                        </div>

                        <div className="ml-4">
                          <p className="font-black text-lg text-slate-900 dark:text-white group-hover/card:bg-gradient-to-r group-hover/card:from-blue-600 group-hover/card:via-purple-600 group-hover/card:to-pink-600 group-hover/card:bg-clip-text group-hover/card:text-transparent transition-all duration-300">
                            {review.name}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">{review.role}</p>
                        </div>
                      </div>

                      <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700"
                        >
                          <Activity className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {t.features.tools[selectedTool]?.users}
                        </span>
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
                      <p className="font-bold text-lg text-slate-900 dark:text-white">
                        {t.features.tools[selectedTool]?.users}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="p-6 rounded-2xl text-center border-slate-200/50 dark:border-slate-700/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Time</p>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">
                        {t.features.tools[selectedTool]?.timeToGenerate}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="p-6 rounded-2xl text-center border-slate-200/50 dark:border-slate-700/30 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Accuracy</p>
                      <p className="font-bold text-lg text-slate-900 dark:text-white">
                        {t.features.tools[selectedTool]?.accuracy}
                      </p>
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
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-3 rounded-xl bg-white/60 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                      >
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
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-sm px-4 py-2 bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300"
                      >
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
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 gradient-text">
                Get in Touch
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <Card className="p-8 rounded-2xl border-slate-200/50 dark:border-slate-700/30 bg-white/80 dark:bg-slate-800/40 backdrop-blur-sm shadow-xl hover-lift animate-float">
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
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Other Ways to Reach Us</h3>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 hover-lift animate-shimmer">
                      <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0 animate-glow">
                        <MessageSquare className="w-6 h-6 text-white animate-float" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Telegram Support</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Get instant help via Telegram</p>
                        <a
                          href="https://t.me/ugenpro_support"
                          className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
                        >
                          @ugenpro_support
                        </a>
                      </div>
                    </div>

                    <div
                      className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-700 hover-lift animate-shimmer"
                      style={{ animationDelay: "0.2s" }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 animate-glow">
                        <Database className="w-6 h-6 text-white animate-float-reverse" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Email Support</h4>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">Send us an email anytime</p>
                        <a
                          href="mailto:support@ugenpro.com"
                          className="text-green-600 dark:text-green-400 text-sm font-medium hover:underline"
                        >
                          support@ugenpro.com
                        </a>
                      </div>
                    </div>

                    <div
                      className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-700 hover-lift animate-shimmer"
                      style={{ animationDelay: "0.4s" }}
                    >
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
            <Card className="bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden hover-lift rounded-3xl">
              <CardContent className="p-0">
                {/* Main Footer Content */}
                <div className="p-8 lg:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div className="space-y-4 scroll-animate">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg animate-glow">
                          <img
                            src="/images/logo.jpg"
                            alt="UGen Pro Logo"
                            className="w-7 h-7 object-contain rounded-lg"
                          />
                        </div>
                        <div>
                          <span className="text-xl font-bold text-slate-900 dark:text-white">UGen Pro</span>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Premium Tools</p>
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {t.footer.description}
                      </p>
                      <div className="flex space-x-4">
                        <Link
                          href="/login"
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
                        >
                          {t.nav.login}
                        </Link>
                        <Link
                          href="/signup"
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
                        >
                          {t.nav.signup}
                        </Link>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4 scroll-animate" style={{ animationDelay: "0.1s" }}>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                        <ArrowRight className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-2 animate-bounce" />
                        {t.footer.quickLinks}
                      </h3>
                      <ul className="space-y-3">
                        <li>
                          <button
                            onClick={scrollToFeatures}
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center group"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                            {t.nav.features}
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={scrollToPricing}
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center group"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                            {t.nav.pricing}
                          </button>
                        </li>
                        <li>
                          <button
                            onClick={scrollToContact}
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center group"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                            Contact
                          </button>
                        </li>
                        <li>
                          <Link
                            href="/login"
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center group"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                            {t.nav.login}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/signup"
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm flex items-center group"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full mr-3 group-hover:bg-slate-900 dark:group-hover:bg-white transition-colors" />
                            {t.nav.signup}
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4 scroll-animate" style={{ animationDelay: "0.2s" }}>
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
                    <div className="space-y-4 scroll-animate" style={{ animationDelay: "0.3s" }}>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
                        <Heart className="w-5 h-5 text-red-500 dark:text-red-400 mr-2 animate-pulse" />
                        Stay Connected
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        Get updates on new features and tools
                      </p>
                      <div className="space-y-3">
                        <div className="flex space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center hover:bg-blue-500/30 transition-colors cursor-pointer hover-lift animate-glow">
                            <span className="text-blue-500 dark:text-blue-400 text-sm font-bold">f</span>
                          </div>
                          <div
                            className="w-8 h-8 rounded-lg bg-blue-400/20 flex items-center justify-center hover:bg-blue-400/30 transition-colors cursor-pointer hover-lift animate-glow"
                            style={{ animationDelay: "0.1s" }}
                          >
                            <span className="text-blue-400 dark:text-blue-300 text-sm font-bold">t</span>
                          </div>
                          <div
                            className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center hover:bg-pink-500/30 transition-colors cursor-pointer hover-lift animate-glow"
                            style={{ animationDelay: "0.2s" }}
                          >
                            <span className="text-pink-500 dark:text-pink-400 text-sm font-bold">i</span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Follow us for updates</div>
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
