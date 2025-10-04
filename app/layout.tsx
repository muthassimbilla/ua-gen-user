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
  adjustFontFallback: true,
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "UGen Pro - Advanced Generator Tools Platform",
  description:
    "The complete platform for advanced generator tools. Create user agents, addresses, and more with our powerful and secure tools.",
  keywords: "generator tools, user agent generator, address generator, online tools, productivity tools",
  authors: [{ name: "UGen Pro" }],
  creator: "UGen Pro",
  publisher: "UGen Pro",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "UGen Pro - Advanced Generator Tools Platform",
    description: "The complete platform for advanced generator tools. Create user agents, addresses, and more with our powerful and secure tools.",
    type: "website",
    url: "https://ugenpro.com",
    siteName: "UGen Pro",
    images: [
      {
        url: "/ugenpro-social-sharing.svg",
        width: 1200,
        height: 630,
        alt: "UGen Pro - Premium Tools For CPA Marketing",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "UGen Pro - Advanced Generator Tools Platform",
    description: "The complete platform for advanced generator tools. Create user agents, addresses, and more with our powerful and secure tools.",
    images: ["/ugenpro-social-sharing.svg"],
    creator: "@ugenpro",
  },
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
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#4A90E2" },
    { media: "(prefers-color-scheme: dark)", color: "#4A90E2" },
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
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={true}
          storageKey="taskflow-theme"
        >
          <ClientProviders>{children}</ClientProviders>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
