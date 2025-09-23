import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import PageTransition from "@/components/page-transition"
import AutoUpdateProvider from "@/components/auto-update-provider"
import ServiceWorkerRegistration from "@/components/service-worker-registration"
import { AuthProvider } from "@/lib/auth-context"
import ConditionalLayout from "@/components/conditional-layout"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "Flo Hiv Tool - Professional User Agent Generator for iOS & Samsung",
  description:
    "Generate thousands of unique, professional-grade iOS and Samsung user agents for Instagram and Facebook. Fast, secure, and reliable user agent generation tool.",
  keywords:
    "user agent generator, iOS user agent, Samsung user agent, Instagram user agent, Facebook user agent, mobile user agent",
  authors: [{ name: "Flo Hiv Tool" }],
  creator: "Flo Hiv Tool",
  publisher: "Flo Hiv Tool",
  generator: "Next.js",
  applicationName: "Flo Hiv Tool",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://uagen-pro.vercel.app",
    siteName: "Flo Hiv Tool",
    title: "Flo Hiv Tool - Professional User Agent Generator",
    description:
      "Generate thousands of unique, professional-grade iOS and Samsung user agents for Instagram and Facebook. Fast, secure, and reliable user agent generation tool.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Flo Hiv Tool - User Agent Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flo Hiv Tool - Professional User Agent Generator",
    description:
      "Generate thousands of unique, professional-grade iOS and Samsung user agents for Instagram and Facebook.",
    images: ["/og-image.png"],
    creator: "@flohivtool",
  },
  other: {
    "application-name": "Flo Hiv Tool",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Flo Hiv Tool",
    "format-detection": "telephone=no",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3b82f6" },
    { media: "(prefers-color-scheme: dark)", color: "#1e40af" },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel.com" />
        <link rel="dns-prefetch" href="https://api.vercel.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Flo Hiv Tool" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="devtools-pro-theme"
        >
          <AuthProvider>
            <AutoUpdateProvider>
              <ConditionalLayout>
                <PageTransition>{children}</PageTransition>
              </ConditionalLayout>
              <Toaster />
              <ServiceWorkerRegistration />
            </AutoUpdateProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
