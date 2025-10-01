export type Locale = 'en' | 'bn'

export const defaultLocale: Locale = 'en'

export const locales: Locale[] = ['en', 'bn']

export const localeNames: Record<Locale, string> = {
  en: 'English',
  bn: 'বাংলা'
}

export const messages = {
  en: {
    hero: {
      title: "The complete platform to manage projects.",
      description: "Your team's toolkit to stop configuring and start innovating. Streamline workflows, boost productivity, and deliver projects faster than ever.",
      primaryButton: "Get Started Free",
      secondaryButton: "Watch Demo",
      badge: "✨ Introducing TaskFlow 2.0",
      disclaimer: "No credit card required • Free 14-day trial"
    },
    features: {
      title: "Everything you need to manage projects",
      description: "Powerful features designed to help your team work smarter, not harder.",
      items: [
        {
          title: "Lightning Fast",
          description: "Built for speed. Experience instant updates and real-time collaboration without lag."
        },
        {
          title: "Team Collaboration", 
          description: "Work together seamlessly with built-in chat, comments, and file sharing."
        },
        {
          title: "Advanced Analytics",
          description: "Get insights into team performance with detailed reports and visualizations."
        },
        {
          title: "Enterprise Security",
          description: "Bank-level encryption and compliance with SOC 2, GDPR, and HIPAA standards."
        },
        {
          title: "Custom Workflows",
          description: "Create automated workflows that match your team's unique processes."
        },
        {
          title: "Time Tracking",
          description: "Track time spent on tasks and projects with integrated time tracking tools."
        }
      ]
    },
    testimonials: {
      title: "Loved by teams worldwide",
      description: "Join thousands of teams who trust TaskFlow to manage their projects.",
      items: [
        {
          quote: "TaskFlow has completely transformed how our team collaborates. We've seen a 40% increase in productivity since switching.",
          author: "Sarah Johnson",
          role: "CEO at TechStart"
        },
        {
          quote: "The best project management tool we've ever used. The interface is intuitive and the features are exactly what we needed.",
          author: "Michael Chen", 
          role: "Product Manager at InnovateCo"
        },
        {
          quote: "We tried dozens of tools before finding TaskFlow. It's the perfect balance of simplicity and power.",
          author: "Emily Rodriguez",
          role: "CTO at DataFlow"
        }
      ]
    }
  },
  bn: {
    hero: {
      title: "প্রজেক্ট ম্যানেজ করার জন্য সম্পূর্ণ প্ল্যাটফর্ম।",
      description: "আপনার দলের টুলকিট যা কনফিগার করা বন্ধ করে উদ্ভাবন শুরু করতে সাহায্য করে। ওয়ার্কফ্লো স্ট্রিমলাইন করুন, উৎপাদনশীলতা বাড়ান এবং আগের চেয়ে দ্রুত প্রজেক্ট সরবরাহ করুন।",
      primaryButton: "বিনামূল্যে শুরু করুন",
      secondaryButton: "ডেমো দেখুন",
      badge: "✨ টাস্কফ্লো ২.০ পরিচয় করিয়ে দিচ্ছি",
      disclaimer: "ক্রেডিট কার্ডের প্রয়োজন নেই • ১৪ দিনের বিনামূল্যে ট্রায়াল"
    },
    features: {
      title: "প্রজেক্ট ম্যানেজ করার জন্য আপনার যা কিছু প্রয়োজন",
      description: "আপনার দলকে আরও স্মার্টভাবে কাজ করতে সাহায্য করার জন্য ডিজাইন করা শক্তিশালী ফিচার।",
      items: [
        {
          title: "বজ্রপাতের মতো দ্রুত",
          description: "গতির জন্য তৈরি। ল্যাগ ছাড়াই তাত্ক্ষণিক আপডেট এবং রিয়েল-টাইম সহযোগিতা অনুভব করুন।"
        },
        {
          title: "দলগত সহযোগিতা",
          description: "বিল্ট-ইন চ্যাট, মন্তব্য এবং ফাইল শেয়ারিংয়ের সাথে নির্বিঘ্নে একসাথে কাজ করুন।"
        },
        {
          title: "উন্নত বিশ্লেষণ",
          description: "বিস্তারিত রিপোর্ট এবং ভিজ্যুয়ালাইজেশনের মাধ্যমে দলের পারফরম্যান্সের অন্তর্দৃষ্টি পান।"
        },
        {
          title: "এন্টারপ্রাইজ সিকিউরিটি",
          description: "ব্যাংক-লেভেল এনক্রিপশন এবং SOC 2, GDPR এবং HIPAA স্ট্যান্ডার্ডের সাথে সম্মতি।"
        },
        {
          title: "কাস্টম ওয়ার্কফ্লো",
          description: "আপনার দলের অনন্য প্রক্রিয়ার সাথে মিলে যাওয়া স্বয়ংক্রিয় ওয়ার্কফ্লো তৈরি করুন।"
        },
        {
          title: "সময় ট্র্যাকিং",
          description: "ইন্টিগ্রেটেড সময় ট্র্যাকিং টুল দিয়ে কাজ এবং প্রজেক্টে ব্যয়িত সময় ট্র্যাক করুন।"
        }
      ]
    },
    testimonials: {
      title: "বিশ্বব্যাপী দলগুলির দ্বারা প্রিয়",
      description: "হাজার হাজার দলের সাথে যোগ দিন যারা তাদের প্রজেক্ট ম্যানেজ করতে টাস্কফ্লোকে বিশ্বাস করে।",
      items: [
        {
          quote: "টাস্কফ্লো আমাদের দলের সহযোগিতার পদ্ধতিকে সম্পূর্ণভাবে রূপান্তর করেছে। পরিবর্তনের পর থেকে আমরা ৪০% উৎপাদনশীলতা বৃদ্ধি দেখেছি।",
          author: "সারা জনসন",
          role: "টেকস্টার্টের সিইও"
        },
        {
          quote: "আমরা যে প্রজেক্ট ম্যানেজমেন্ট টুল ব্যবহার করেছি তার মধ্যে সেরা। ইন্টারফেসটি স্বজ্ঞাত এবং ফিচারগুলি ঠিক আমাদের প্রয়োজন ছিল।",
          author: "মাইকেল চেন",
          role: "ইনোভেটকোর প্রোডাক্ট ম্যানেজার"
        },
        {
          quote: "টাস্কফ্লো খুঁজে পাওয়ার আগে আমরা ডজন ডজন টুল চেষ্টা করেছি। এটি সরলতা এবং শক্তির নিখুঁত ভারসাম্য।",
          author: "এমিলি রড্রিগেজ",
          role: "ডেটাফ্লোর সিটিও"
        }
      ]
    }
  }
} as const

export function getMessages(locale: Locale) {
  return messages[locale] || messages[defaultLocale]
}

