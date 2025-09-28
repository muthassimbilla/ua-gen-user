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
  ChevronDown,
  ChevronUp,
  CreditCard,
  Smartphone,
  Globe,
  Award,
  Sparkles,
  Crown,
  Heart,
  Activity,
  Database,
  Settings,
  Languages,
  ExternalLink,
  Clock,
  Users,
  Shield,
  BarChart3,
  Lock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [language, setLanguage] = useState<"bn" | "en">("en")
  const [selectedTool, setSelectedTool] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const scrollToPricing = () => {
    document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
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
        planName: "প্রিমিয়াম",
        price: "৳১,০০০",
        period: "/মাস",
        description: "১ মাসের জন্য সম্পূর্ণ অ্যাক্সেস",
        popular: "সর্বাধিক জনপ্রিয়",
        features: [
          "সব টুলসে আনলিমিটেড অ্যাক্সেস",
          "প্রায়োরিটি সাপোর্ট ২৪/৭",
          "এক্সক্লুসিভ প্রিমিয়াম ফিচার",
          "নিয়মিত আপডেট ও নতুন টুলস",
          "API অ্যাক্সেস",
          "বুল্ক অপারেশন সাপোর্ট",
        ],
        cta: "এখনই সাবস্ক্রাইব করুন",
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
      faq: {
        badge: "সহায়তা",
        title: "প্রায়শই জিজ্ঞাসিত প্রশ্ন",
        subtitle: "আপনার প্রশ্নের উত্তর খুঁজে পান",
        questions: [
          {
            question: "সাবস্ক্রিপশন কিভাবে ক্যানসেল করব?",
            answer:
              "আপনি যেকোনো সময় আপনার অ্যাকাউন্ট সেটিংস থেকে সাবস্ক্রিপশন ক্যানসেল করতে পারেন। ক্যানসেল করার পর আপনার অ্যাক্সেস বর্তমান বিলিং সাইকেল শেষ পর্যন্ত থাকবে।",
          },
          {
            question: "পেমেন্ট কি পদ্ধতিতে করতে পারব?",
            answer:
              "আমরা ডেবিট/ক্রেডিট কার্ড, বিকাশ, নগদ, রকেট এবং অন্যান্য জনপ্রিয় পেমেন্ট পদ্ধতি সাপোর্ট করি। সব পেমেন্ট নিরাপদ এবং এনক্রিপ্টেড।",
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
        planName: "CPA Marketing",
        price: "৳2,000",
        period: "/month",
        description: "Full access for CPA marketers",
        popular: "Most Popular",
        features: [
          "Unlimited access to all tools",
          "24/7 Priority support",
          "Exclusive CPA marketing features",
          "Regular updates and new tools",
          "API access",
          "Bulk operation support",
        ],
        cta: "Start Earning",
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
      faq: {
        badge: "Support",
        title: "Frequently Asked Questions",
        subtitle: "Find answers to your CPA marketing questions",
        questions: [
          {
            question: "How do I cancel my subscription?",
            answer:
              "You can cancel your subscription anytime from your account settings. After cancellation, your access will remain until the end of the current billing cycle.",
          },
          {
            question: "What payment methods do you accept?",
            answer:
              "We support debit/credit cards, bKash, cash, Rocket and other popular payment methods. All payments are secure and encrypted.",
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

        {/* Animated orbs - Light mode */}
        <div className="absolute top-1/4 -left-64 w-96 h-96 bg-blue-200/30 dark:hidden rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 -right-64 w-96 h-96 bg-indigo-200/30 dark:hidden rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Enhanced animated orbs - Dark mode */}
        <div className="hidden dark:block absolute top-1/6 -left-48 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div
          className="hidden dark:block absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/25 to-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="hidden dark:block absolute bottom-1/4 -right-32 w-72 h-72 bg-gradient-to-r from-indigo-500/20 to-blue-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="hidden dark:block absolute bottom-1/6 left-1/3 w-56 h-56 bg-gradient-to-r from-emerald-500/15 to-teal-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="hidden dark:block absolute top-1/2 left-1/2 w-48 h-48 bg-gradient-to-r from-violet-500/12 to-rose-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
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
      <header className="fixed top-0 w-full z-50">
        <div className="glass-card border-b border-white/10 backdrop-blur-md">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                  <Zap className="w-7 h-7 text-white relative z-10" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    DevTools Pro
                  </span>
                  <p className="text-xs text-muted-foreground -mt-1">Premium Developer Tools</p>
                </div>
              </Link>

              {/* Language Toggle */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleLanguage}
                  className="glass-card px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-white/10 transition-all duration-300"
                >
                  <Languages className="w-4 h-4" />
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
                    href="/login"
                    className="text-muted-foreground hover:text-blue-600 transition-colors font-medium"
                  >
                    {t.nav.login}
                  </Link>
                  <Link
                    href="/signup"
                    className="glass-card px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
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
      <section className="relative z-10 px-6 pt-16 lg:pt-12 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-semibold shadow-lg backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <span>{t.hero.badge}</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white leading-tight">
                  <span className="block text-left mb-3 tracking-tight">
                    {t.hero.title}
                  </span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent text-left tracking-tight">
                    {t.hero.titleHighlight}
                  </span>
                </h1>

                <p className="text-2xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">{t.hero.subtitle}</p>
              </div>

              {/* Key Benefits */}
              <div className="space-y-6">
                {t.hero.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl text-slate-900 dark:text-white font-semibold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6">
                <Button
                  onClick={scrollToPricing}
                  className="px-10 py-5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-3xl flex items-center justify-center space-x-4 hover:scale-105 transform"
                >
                  <span>{t.hero.cta1}</span>
                  <ArrowRight className="w-6 h-6" />
                </Button>
                <Button
                  onClick={scrollToFeatures}
                  variant="outline"
                  className="px-10 py-5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 hover:bg-white/90 dark:hover:bg-slate-800/90 text-slate-900 dark:text-white text-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 transform"
                >
                  <span>{t.hero.cta2}</span>
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <Card className="p-10 rounded-3xl border-slate-200/50 dark:border-slate-700/30 bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl shadow-3xl">
                <CardContent className="p-0">
                  <div className="bg-white/60 dark:bg-slate-800/60 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-lg"></div>
                        <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-6 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg w-4/5 shadow-lg"></div>
                        <div className="h-6 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg w-3/5 shadow-lg"></div>
                        <div className="h-6 bg-gradient-to-r from-green-200 to-emerald-200 rounded-lg w-2/3 shadow-lg"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-6">
                        <Card className="p-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform">
                          <CardContent className="p-0">
                          <Globe className="w-10 h-10 mx-auto mb-3" />
                            <p className="text-base font-bold">Address Generator</p>
                          </CardContent>
                        </Card>
                        <Card className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 text-white text-center border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform">
                          <CardContent className="p-0">
                          <Smartphone className="w-10 h-10 mx-auto mb-3" />
                          <p className="text-base font-bold">User Agent</p>
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
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>{t.features.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.features.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.tools.map((tool, index) => {
              const IconComponent = tool.icon
              return (
                <Card
                key={index}
                  className="p-8 rounded-2xl border-slate-200/50 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/30 group cursor-pointer hover:-translate-y-2 dark:shadow-2xl dark:shadow-slate-900/20"
                  onClick={() => openToolPopup(index)}
              >
                  <CardContent className="p-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-xl">
                      <IconComponent className="w-8 h-8 text-white" />
                </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{tool.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">{tool.description}</p>
                <div className="flex items-center justify-between">
                      <Badge variant="default" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700 font-semibold px-3 py-1">
                    <Activity className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                      <span className="text-sm text-slate-500 dark:text-slate-400">{tool.users}</span>
                </div>
                    <div className="mt-4 flex items-center text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Click for details
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
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Crown className="w-4 h-4" />
              <span>{t.pricing.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.pricing.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.pricing.subtitle}</p>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="rounded-3xl border-2 border-blue-500 p-8 relative overflow-hidden shadow-2xl bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm">
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-bl-2xl rounded-tr-3xl text-sm font-semibold">
                {t.pricing.popular}
              </div>

              <CardContent className="p-0">
              <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.pricing.planName}</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                    <span className="text-5xl font-bold text-slate-900 dark:text-white">{t.pricing.price}</span>
                    <span className="text-slate-600 dark:text-slate-400">{t.pricing.period}</span>
                </div>
                  <p className="text-slate-600 dark:text-slate-400">{t.pricing.description}</p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {t.pricing.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-900 dark:text-white font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
                <Link href="/signup">
                  <Button className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                {t.pricing.cta}
                  </Button>
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 text-center">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Heart className="w-4 h-4" />
              <span>{t.testimonials.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.testimonials.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.testimonials.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.testimonials.reviews.map((review, index) => (
              <Card
                key={index}
                className="p-8 rounded-2xl border-slate-200/50 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
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

      {/* FAQ Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
              <Settings className="w-4 h-4" />
              <span>{t.faq.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">{t.faq.title}</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">{t.faq.subtitle}</p>
          </div>

          <div className="space-y-4">
            {t.faq.questions.map((faq, index) => (
              <Card
                key={index}
                className="rounded-2xl border-slate-200/50 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-lg font-semibold text-slate-900 dark:text-white">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-8 pb-6">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Tool Popup Dialog */}
      <Dialog open={selectedTool !== null} onOpenChange={closeToolPopup}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              {selectedTool !== null && (
                <>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    {(() => {
                      const IconComponent = t.features.tools[selectedTool]?.icon
                      return IconComponent ? <IconComponent className="w-6 h-6 text-white" /> : null
                    })()}
        </div>
                  <span>{t.features.tools[selectedTool]?.name}</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-lg text-slate-600 dark:text-slate-400">
              {selectedTool !== null && t.features.tools[selectedTool]?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTool !== null && (
            <div className="space-y-6">
              {/* Tool Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 rounded-xl text-center border-slate-200/50 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Users</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{t.features.tools[selectedTool]?.users}</p>
                  </CardContent>
                </Card>
                <Card className="p-4 rounded-xl text-center border-slate-200/50 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Time</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{t.features.tools[selectedTool]?.timeToGenerate}</p>
                  </CardContent>
                </Card>
                <Card className="p-4 rounded-xl text-center border-slate-200/50 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Accuracy</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{t.features.tools[selectedTool]?.accuracy}</p>
                  </CardContent>
                </Card>
                <Card className="p-4 rounded-xl text-center border-slate-200/50 dark:border-slate-700/30 bg-white/70 dark:bg-slate-800/40 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <Activity className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">Status</p>
                    <p className="font-semibold text-green-600">Active</p>
                  </CardContent>
                </Card>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Star className="w-5 h-5 text-yellow-500 mr-2" />
                  Key Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {t.features.tools[selectedTool]?.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Globe className="w-5 h-5 text-blue-500 mr-2" />
                  Use Cases
                </h3>
                <div className="flex flex-wrap gap-2">
                  {t.features.tools[selectedTool]?.useCases.map((useCase, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {useCase}
                    </Badge>
                  ))}
                </div>
              </div>

                {/* CTA Button */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Link href="/signup" onClick={closeToolPopup}>
                    <Button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                      <span>Get Started with {t.features.tools[selectedTool]?.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
            </Link>
          </div>
        </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="relative z-10 bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold">DevTools Pro</span>
                  <p className="text-sm text-slate-400">Premium Developer Tools</p>
                </div>
              </div>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed">{t.footer.description}</p>
              <div className="flex space-x-6">
                <Link href="/login" className="text-slate-400 hover:text-white transition-colors font-medium">
                  {t.nav.login}
                </Link>
                <Link href="/signup" className="text-slate-400 hover:text-white transition-colors font-medium">
                  {t.nav.signup}
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t.footer.quickLinks}</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={scrollToFeatures} className="text-slate-400 hover:text-white transition-colors">
                    {t.nav.features}
                  </button>
                </li>
                <li>
                  <button onClick={scrollToPricing} className="text-slate-400 hover:text-white transition-colors">
                    {t.nav.pricing}
                  </button>
                </li>
                <li>
                  <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
                    {t.nav.login}
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-slate-400 hover:text-white transition-colors">
                    {t.nav.signup}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-6">{t.footer.contact}</h3>
              <ul className="space-y-3 text-slate-400">
                <li className="flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>support@devtoolspro.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4" />
                  <span>+৮৮০ ১৭১২ ৩৪৫৬৭৮</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>ঢাকা, বাংলাদেশ</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; ২০২৪ DevTools Pro. {t.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
