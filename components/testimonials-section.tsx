"use client"

import { Star, Quote, TrendingUp, Users, Award } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const testimonials = [
  {
    quote:
      "UGen Pro has completely transformed how our team works. The tools are incredibly intuitive and powerful. We've seen a 40% increase in productivity!",
    author: "Sarah Johnson",
    role: "CEO at TechStart",
    color: "bg-gradient-to-br from-blue-500 to-blue-600",
    rating: 5,
  },
  {
    quote:
      "The best generator tools we've ever used. The AI-powered features are exactly what we needed. Saves us hours every day.",
    author: "Michael Chen",
    role: "Product Manager at InnovateCo",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
    rating: 5,
  },
  {
    quote:
      "We tried dozens of tools before finding UGen Pro. It's the perfect balance of simplicity and power. Highly recommended!",
    author: "Emily Rodriguez",
    role: "CTO at DataFlow",
    color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
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
        <div className="absolute inset-0 bg-gradient-to-b from-background via-cyan-500/5 to-background" />
        <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 -right-32 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <div 
          className={`text-center space-y-3 mb-10 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-emerald-500/10 border border-cyan-500/20 px-6 py-3 backdrop-blur-sm shadow-lg">
            <Star className="h-5 w-5 text-cyan-600 dark:text-cyan-400 fill-cyan-600 dark:fill-cyan-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Testimonials
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold text-balance leading-tight">
            Loved by{" "}
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
              developers worldwide
            </span>
          </h2>

          <p className="text-xl text-muted-foreground/80 max-w-3xl mx-auto text-pretty leading-relaxed">
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
              <div className="relative h-full rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-2">
                {/* Quote Icon */}
                <div className="absolute -top-3 -left-3">
                  <div className="p-3 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-sm">
                    <Quote className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-cyan-500 text-cyan-500 animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-base md:text-lg leading-relaxed mb-6 text-foreground/90">
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
          className={`grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto transition-all duration-1000 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-cyan-500/10 mb-4">
              <Award className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-cyan-600 to-cyan-500 bg-clip-text text-transparent mb-2">
              4.9/5
            </div>
            <div className="text-sm text-muted-foreground/80 font-medium">Average Rating</div>
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/10 mb-4">
              <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
              10,000+
            </div>
            <div className="text-sm text-muted-foreground/80 font-medium">Happy Customers</div>
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 backdrop-blur-sm hover:scale-105 transition-transform">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 mb-4">
              <TrendingUp className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mb-2">
              98%
            </div>
            <div className="text-sm text-muted-foreground/80 font-medium">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}
