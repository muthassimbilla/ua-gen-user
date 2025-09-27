"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [language, setLanguage] = useState<"bn" | "en">("bn")

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
        badge: "নতুন প্রিমিয়াম টুলস",
        title: "ডেভেলপারদের জন্য",
        titleHighlight: "প্রিমিয়াম টুলস",
        subtitle: "আপনার ডেভেলপমেন্ট ওয়ার্কফ্লোকে উন্নত করুন এবং উৎপাদনশীলতা বাড়ান আমাদের শক্তিশালী ও আধুনিক টুলস দিয়ে।",
        benefits: ["আনলিমিটেড অ্যাক্সেস সব টুলে", "প্রায়োরিটি সাপোর্ট ২৪/৭", "এক্সক্লুসিভ প্রিমিয়াম ফিচার", "নিয়মিত আপডেট ও নতুন টুলস"],
        cta1: "প্রিমিয়াম নিন",
        cta2: "টুলস দেখুন",
      },
      features: {
        badge: "শক্তিশালী টুলস",
        title: "আমাদের প্রিমিয়াম টুলস",
        subtitle: "ডেভেলপারদের জন্য বিশেষভাবে তৈরি করা আধুনিক টুলস যা আপনার কাজকে সহজ, দ্রুত ও নিরাপদ করে তুলবে।",
        tools: [
          {
            name: "User Agent Generator",
            description: "বিভিন্ন ব্রাউজার ও ডিভাইসের জন্য User Agent string তৈরি করুন। Web scraping ও testing এর জন্য উপযুক্ত।",
            users: "8.2K+ users",
          },
          {
            name: "Security Tools",
            description: "আপনার অ্যাপ্লিকেশনের নিরাপত্তা পরীক্ষা করুন এবং বিভিন্ন security vulnerabilities চেক করুন।",
            users: "5.8K+ users",
          },
          {
            name: "Performance Tools",
            description: "আপনার ওয়েবসাইটের performance analyze করুন এবং optimization suggestions পান।",
            users: "7.3K+ users",
          },
          {
            name: "Data Encryption",
            description: "আপনার গুরুত্বপূর্ণ ডেটা encrypt করুন এবং secure storage এর জন্য প্রস্তুত করুন।",
            users: "4.1K+ users",
          },
          {
            name: "Analytics Tools",
            description: "আপনার অ্যাপ্লিকেশনের usage analytics দেখুন এবং user behavior analyze করুন।",
            users: "6.7K+ users",
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
          {
            question: "ট্রায়াল পিরিয়ড আছে কি?",
            answer: "হ্যাঁ! নতুন গ্রাহকদের জন্য ৭ দিনের ফ্রি ট্রায়াল আছে। ট্রায়াল পিরিয়ডে আপনি সব প্রিমিয়াম ফিচার টেস্ট করতে পারবেন।",
          },
        ],
      },
      cta: {
        title: "আজই শুরু করুন আপনার ডেভেলপমেন্ট জার্নি",
        subtitle: "হাজারো ডেভেলপারের সাথে যোগ দিন যারা ইতিমধ্যে আমাদের টুলস ব্যবহার করে সফল হচ্ছেন",
        button1: "ফ্রি ট্রায়াল শুরু করুন",
        button2: "মূল্য দেখুন",
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
        badge: "New Premium Tools",
        title: "Premium Tools for",
        titleHighlight: "Developers",
        subtitle: "Enhance your development workflow and boost productivity with our powerful and modern tools.",
        benefits: [
          "Unlimited access to all tools",
          "24/7 Priority support",
          "Exclusive premium features",
          "Regular updates and new tools",
        ],
        cta1: "Get Premium",
        cta2: "View Tools",
      },
      features: {
        badge: "Powerful Tools",
        title: "Our Premium Tools",
        subtitle:
          "Modern tools specially designed for developers that will make your work easier, faster and more secure.",
        tools: [
          {
            name: "User Agent Generator",
            description:
              "Generate User Agent strings for different browsers and devices. Perfect for web scraping and testing.",
            users: "8.2K+ users",
          },
          {
            name: "Security Tools",
            description: "Test your application's security and check for various security vulnerabilities.",
            users: "5.8K+ users",
          },
          {
            name: "Performance Tools",
            description: "Analyze your website's performance and get optimization suggestions.",
            users: "7.3K+ users",
          },
          {
            name: "Data Encryption",
            description: "Encrypt your important data and prepare it for secure storage.",
            users: "4.1K+ users",
          },
          {
            name: "Analytics Tools",
            description: "View usage analytics of your application and analyze user behavior.",
            users: "6.7K+ users",
          },
        ],
      },
      pricing: {
        badge: "Premium Plan",
        title: "Premium Subscription",
        subtitle: "Get unlimited access to all tools and premium benefits",
        planName: "Premium",
        price: "৳1,000",
        period: "/month",
        description: "Full access for 1 month",
        popular: "Most Popular",
        features: [
          "Unlimited access to all tools",
          "24/7 Priority support",
          "Exclusive premium features",
          "Regular updates and new tools",
          "API access",
          "Bulk operation support",
        ],
        cta: "Subscribe Now",
        paymentMethods: "Payment Methods:",
        methods: ["Card", "bKash", "Cash"],
      },
      testimonials: {
        badge: "Customer Reviews",
        title: "What Our Customers Say",
        subtitle: "Thousands of developers are succeeding using our tools",
        reviews: [
          {
            text: "Amazing tools! My development process has become much faster. The premium subscription is completely worth it.",
            name: "Rakib Ahmed",
            role: "Software Developer",
          },
          {
            text: "The support team is very helpful. They solve any problem immediately. The tools are very easy to use.",
            name: "Sumaiya Khan",
            role: "Web Developer",
          },
          {
            text: "The premium features are truly game changers. The quality of my projects has improved significantly.",
            name: "Mahmud Hasan",
            role: "Full Stack Developer",
          },
        ],
      },
      faq: {
        badge: "Support",
        title: "Frequently Asked Questions",
        subtitle: "Find answers to your questions",
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
          {
            question: "Is there a trial period?",
            answer:
              "Yes! We offer a 7-day free trial for new customers. During the trial period, you can test all premium features.",
          },
        ],
      },
      cta: {
        title: "Start Your Development Journey Today",
        subtitle: "Join thousands of developers who are already succeeding with our tools",
        button1: "Start Free Trial",
        button2: "View Pricing",
      },
      footer: {
        description:
          "Premium tools for developers that will increase your productivity and make the development process easier.",
        quickLinks: "Quick Links",
        contact: "Contact",
        copyright: "All rights reserved.",
      },
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
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
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-40 right-8 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full border border-blue-200/50">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">{t.hero.badge}</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                  {t.hero.title}
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {t.hero.titleHighlight}
                  </span>
                </h1>

                <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">{t.hero.subtitle}</p>
              </div>

              {/* Key Benefits */}
              <div className="space-y-4">
                {t.hero.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg text-foreground font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToPricing}
                  className="glass-card px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 group"
                >
                  <span>{t.hero.cta1}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={scrollToFeatures}
                  className="glass-card px-8 py-4 rounded-xl border border-white/20 text-foreground text-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                >
                  {t.hero.cta2}
                </button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="glass-card p-8 rounded-3xl border border-white/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
                <div className="relative z-10">
                  <div className="bg-white/50 dark:bg-slate-800/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-4 bg-gradient-to-r from-blue-200 to-indigo-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gradient-to-r from-purple-200 to-pink-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gradient-to-r from-green-200 to-emerald-200 rounded w-2/3"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="glass-card p-4 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-center">
                          <Globe className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm font-semibold">IP Generator</p>
                        </div>
                        <div className="glass-card p-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white text-center">
                          <Smartphone className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-sm font-semibold">User Agent</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full border border-blue-200/50 mb-6">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{t.features.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t.features.title}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">{t.features.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {t.features.tools.map((tool, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{tool.name}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{tool.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                    <Activity className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                  <span className="text-sm text-muted-foreground">{tool.users}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700"
      >
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full border border-blue-200/50 mb-6">
              <Crown className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{t.pricing.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t.pricing.title}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.pricing.subtitle}</p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="glass-card rounded-3xl border-2 border-blue-200/50 p-8 relative overflow-hidden shadow-2xl">
              {/* Popular Badge */}
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-bl-2xl rounded-tr-3xl text-sm font-semibold">
                {t.pricing.popular}
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{t.pricing.planName}</h3>
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-5xl font-bold text-foreground">{t.pricing.price}</span>
                  <span className="text-muted-foreground">{t.pricing.period}</span>
                </div>
                <p className="text-muted-foreground">{t.pricing.description}</p>
              </div>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {t.pricing.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link
                href="/signup"
                className="block w-full glass-card py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center text-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {t.pricing.cta}
              </Link>

              {/* Payment Methods */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground mb-3">{t.pricing.paymentMethods}</p>
                <div className="flex items-center justify-center space-x-4">
                  {t.pricing.methods.map((method, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full border border-blue-200/50 mb-6">
              <Heart className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{t.testimonials.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t.testimonials.title}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.testimonials.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {t.testimonials.reviews.map((review, index) => (
              <div
                key={index}
                className="glass-card p-8 rounded-2xl border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-foreground">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full border border-blue-200/50 mb-6">
              <Settings className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">{t.faq.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">{t.faq.title}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.faq.subtitle}</p>
          </div>

          <div className="space-y-4">
            {t.faq.questions.map((faq, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl border border-white/20 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <span className="text-lg font-semibold text-foreground">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-6 h-6 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-muted-foreground" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="px-8 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">{t.cta.title}</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">{t.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="glass-card px-8 py-4 rounded-xl bg-white text-blue-600 text-lg font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t.cta.button1}
            </Link>
            <button
              onClick={scrollToPricing}
              className="glass-card px-8 py-4 rounded-xl border-2 border-white text-white text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 backdrop-blur-sm"
            >
              {t.cta.button2}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 px-4">
        <div className="container mx-auto">
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
