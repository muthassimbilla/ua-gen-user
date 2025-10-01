import { memo } from "react"
import Image from "next/image"

interface Testimonial {
  quote: string
  author: string
  role: string
  avatar: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
  index: number
}

const TestimonialCard = memo(function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const { quote, author, role, avatar } = testimonial
  
  return (
    <div
      className="rounded-lg border border-border bg-card p-8 hover:border-primary/50 transition-all duration-300"
    >
      <p className="text-lg mb-6 leading-relaxed text-balance">"{quote}"</p>
      <div className="flex items-center gap-4">
        <Image
          src={avatar || "/placeholder.svg"}
          alt={`${author} - ${role}`}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
        <div>
          <div className="font-semibold">{author}</div>
          <div className="text-sm text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  )
})

const testimonials: Testimonial[] = [
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

interface TestimonialsSectionProps {
  title?: string
  description?: string
  testimonials?: Testimonial[]
}

const TestimonialsSection = memo(function TestimonialsSection({
  title = "Loved by teams worldwide",
  description = "Join thousands of teams who trust TaskFlow to manage their projects.",
  testimonials: customTestimonials = testimonials
}: TestimonialsSectionProps) {
  return (
    <section id="testimonials" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-balance">{title}</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {customTestimonials.map((testimonial, index) => (
            <TestimonialCard key={`${testimonial.author}-${index}`} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
})

export { TestimonialsSection }
