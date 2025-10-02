import Link from "next/link"
import { Sparkles, Twitter, Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t bg-muted/30">
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">UGen Pro</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4 max-w-sm">
              Advanced generator tools for developers and professionals. Create user agents, addresses, and more with
              our powerful platform.
            </p>

            <div className="flex items-center gap-2">
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border hover:border-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border hover:border-primary transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border hover:border-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border hover:border-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  API
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-3">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 TaskFlow. All rights reserved.</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Status
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Changelog
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Documentation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
