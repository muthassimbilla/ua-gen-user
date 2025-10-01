const testimonials = [
  {
    quote:
      "TaskFlow has completely transformed how our team collaborates. We've seen a 40% increase in productivity since switching.",
    author: "Sarah Johnson",
    role: "CEO at TechStart",
    avatar: "/professional-woman-diverse.png",
  },
  {
    quote:
      "The best project management tool we've ever used. The interface is intuitive and the features are exactly what we needed.",
    author: "Michael Chen",
    role: "Product Manager at InnovateCo",
    avatar: "/professional-man.jpg",
  },
  {
    quote: "We tried dozens of tools before finding TaskFlow. It's the perfect balance of simplicity and power.",
    author: "Emily Rodriguez",
    role: "CTO at DataFlow",
    avatar: "/professional-woman-2.png",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-balance">Loved by teams worldwide</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Join thousands of teams who trust TaskFlow to manage their projects.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300"
            >
              <p className="text-lg mb-6 leading-relaxed text-balance">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
