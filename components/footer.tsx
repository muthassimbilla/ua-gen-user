import Link from "next/link"
import { Sparkles, Twitter, Github, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-gradient-to-b from-background to-muted/30 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-6 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 shadow-lg group-hover:shadow-primary/50 transition-all duration-300">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                TaskFlow
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-sm">
              The complete platform to manage projects and boost team productivity. Join thousands of teams worldwide.
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-3">
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
              >
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Features</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#pricing" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Pricing</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Integrations</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">API</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">About</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Blog</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Careers</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Privacy</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Terms</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Security</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">Cookies</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 TaskFlow. All rights reserved.
          </p>
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
