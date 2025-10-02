"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "TaskFlow has completely transformed how our team collaborates. We've seen a 40% increase in productivity since switching.",
    author: "Sarah Johnson",
    role: "CEO at TechStart",
    rating: 5,
  },
  {
    quote:
      "The best project management tool we've ever used. The interface is intuitive and the features are exactly what we needed.",
    author: "Michael Chen",
    role: "Product Manager at InnovateCo",
    rating: 5,
  },
  {
    quote: "We tried dozens of tools before finding TaskFlow. It's the perfect balance of simplicity and power.",
    author: "Emily Rodriguez",
    role: "CTO at DataFlow",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-16 bg-muted/30">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            <Star className="h-4 w-4 text-primary fill-primary" />
            <span className="text-primary font-semibold">Testimonials</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold">
            Loved by <span className="text-primary">teams worldwide</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join thousands of teams who trust TaskFlow to manage their projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-lg border bg-card p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                ))}
              </div>

              <p className="text-sm mb-6">"{testimonial.quote}"</p>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
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

        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              ))}
            </div>
            <div className="text-xl font-bold">4.9/5</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">10,000+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold">98%</div>
            <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
          </div>
        </div>
      </div>
    </section>
  )
}
