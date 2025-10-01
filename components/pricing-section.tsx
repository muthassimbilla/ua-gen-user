import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: "$9",
    description: "Perfect for small teams getting started",
    features: ["Up to 10 team members", "5 projects", "Basic analytics", "Email support", "1GB storage"],
  },
  {
    name: "Professional",
    price: "$29",
    description: "For growing teams that need more power",
    features: [
      "Up to 50 team members",
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "50GB storage",
      "Custom workflows",
      "Time tracking",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For large organizations with advanced needs",
    features: [
      "Unlimited team members",
      "Unlimited projects",
      "Advanced analytics & reporting",
      "24/7 dedicated support",
      "Unlimited storage",
      "Custom workflows",
      "Time tracking",
      "SSO & advanced security",
      "Custom integrations",
    ],
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-balance">Simple, transparent pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-lg border ${
                plan.popular ? "border-primary shadow-lg scale-105" : "border-border"
              } bg-card p-8`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
              </div>

              <Button className="w-full mb-6" variant={plan.popular ? "default" : "outline"}>
                Get Started
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
