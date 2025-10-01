"use client"

import { Star, Quote, Sparkles } from "lucide-react"

const testimonials = [
  {
    quote:
      "TaskFlow has completely transformed how our team collaborates. We've seen a 40% increase in productivity since switching.",
    author: "Sarah Johnson",
    role: "CEO at TechStart",
    avatar: "/professional-woman-diverse.png",
    rating: 5,
  },
  {
    quote:
      "The best project management tool we've ever used. The interface is intuitive and the features are exactly what we needed.",
    author: "Michael Chen",
    role: "Product Manager at InnovateCo",
    avatar: "/professional-man.jpg",
    rating: 5,
  },
  {
    quote: "We tried dozens of tools before finding TaskFlow. It's the perfect balance of simplicity and power.",
    author: "Emily Rodriguez",
    role: "CTO at DataFlow",
    avatar: "/professional-woman-2.png",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm px-4 py-1.5 text-sm">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-primary font-semibold">Testimonials</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-balance">
            Loved by{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              teams worldwide
            </span>
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
            Join thousands of teams who trust TaskFlow to manage their projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-8 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Quote className="h-16 w-16 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="relative text-lg mb-8 leading-relaxed text-balance">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-purple-500 p-0.5">
                    <div className="h-full w-full rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-card" />
                </div>
                <div>
                  <div className="font-bold text-lg">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>

              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <div className="text-2xl font-bold">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold">10,000+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="hidden sm:block w-px h-16 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold">98%</div>
            <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
