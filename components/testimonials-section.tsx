"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "TaskFlow has completely transformed how our team collaborates. We've seen a 40% increase in productivity since switching.",
    author: "Sarah Johnson",
    role: "CEO at TechStart",
    color: "bg-purple-500",
  },
  {
    quote:
      "The best project management tool we've ever used. The interface is intuitive and the features are exactly what we needed.",
    author: "Michael Chen",
    role: "Product Manager at InnovateCo",
    color: "bg-blue-500",
  },
  {
    quote: "We tried dozens of tools before finding TaskFlow. It's the perfect balance of simplicity and power.",
    author: "Emily Rodriguez",
    role: "CTO at DataFlow",
    color: "bg-orange-500",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-10">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-2">
            <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">Testimonials</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold">
            Loved by <span className="text-orange-600 dark:text-orange-400">teams worldwide</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of teams who trust TaskFlow to manage their projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-xl border bg-card p-6 hover:border-orange-500/50 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-orange-500 text-orange-500" />
                ))}
              </div>

              <p className="text-sm mb-6">"{testimonial.quote}"</p>

              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold`}
                >
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-12">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">10,000+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">98%</div>
            <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
