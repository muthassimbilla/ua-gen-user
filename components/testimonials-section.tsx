"use client"

import { Star, Quote, TrendingUp, Users, Award } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const testimonials = [
  {
    quote:
      "UGen Pro has completely transformed how our team works. The tools are incredibly intuitive and powerful. We've seen a 40% increase in productivity!",
    author: "Sarah Johnson",
    role: "CEO at TechStart",
    color: "bg-gradient-to-br from-purple-500 to-purple-600",
    rating: 5,
  },
  {
    quote:
      "The best generator tools we've ever used. The AI-powered features are exactly what we needed. Saves us hours every day.",
    author: "Michael Chen",
    role: "Product Manager at InnovateCo",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    rating: 5,
  },
  {
    quote:
      "We tried dozens of tools before finding UGen Pro. It's the perfect balance of simplicity and power. Highly recommended!",
    author: "Emily Rodriguez",
    role: "CTO at DataFlow",
    color: "bg-gradient-to-br from-orange-500 to-orange-600",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.15 })

  return (
    <section 
      id="testimonials" 
      ref={sectionRef}
      className="relative py-12 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-orange-500/5 to-background" />
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div 
          className={`text-center space-y-3 mb-10 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-pink-500/10 border border-orange-500/20 px-5 py-2.5 backdrop-blur-sm shadow-lg">
            <Star className="h-4 w-4 text-orange-600 dark:text-orange-400 fill-orange-600 dark:fill-orange-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              Testimonials
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-balance leading-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              developers worldwide
            </span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Join thousands of developers who trust UGen Pro to boost their productivity
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group transition-all duration-700 ${
                isVisible 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
                {/* Quote Icon */}
                <div className="absolute -top-3 -left-3">
                  <div className="p-2 rounded-full bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 backdrop-blur-sm">
                    <Quote className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 fill-orange-500 text-orange-500 animate-pulse" 
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm md:text-base leading-relaxed mb-6 text-foreground/90">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <div
                    className={`h-12 w-12 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{testimonial.author}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div 
          className={`grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-500/10 mb-3">
              <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-1">
              4.9/5
            </div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-3">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-1">
              10,000+
            </div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>

          <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 mb-3">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-1">
              98%
            </div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}
