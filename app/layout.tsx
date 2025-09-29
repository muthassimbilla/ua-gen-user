import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ClientProviders from "@/components/client-providers"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "UGen Pro - Professional User Agent Generator for iOS & Samsung",
  description:
    "Generate thousands of unique, professional-grade iOS and Samsung user agents for Instagram and Facebook. Fast, secure, and reliable user agent generation tool.",
  keywords:
    "user agent generator, iOS user agent, Samsung user agent, Instagram user agent, Facebook user agent, mobile user agent",
  authors: [{ name: "UGen Pro" }],
  creator: "UGen Pro",
  publisher: "UGen Pro",
  generator: "Next.js",
  applicationName: "UGen Pro",
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
    siteName: "UGen Pro",
    title: "UGen Pro - Professional User Agent Generator",
    description:
      "Generate thousands of unique, professional-grade iOS and Samsung user agents for Instagram and Facebook. Fast, secure, and reliable user agent generation tool.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UGen Pro - User Agent Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UGen Pro - Professional User Agent Generator",
    description:
      "Generate thousands of unique, professional-grade iOS and Samsung user agents for Instagram and Facebook.",
    images: ["/og-image.png"],
    creator: "@ugenpro",
  },
  other: {
    "application-name": "UGen Pro",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "UGen Pro",
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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={true}
          storageKey="devtools-pro-theme"
        >
          <ClientProviders>
            {children}
          </ClientProviders>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
