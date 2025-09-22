import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
})

export const metadata: Metadata = {
  title: "Key Management System - Secure Login & Admin Panel",
  description:
    "Secure key-based authentication system with Telegram username integration, admin approval, and comprehensive monitoring.",
  keywords: "key management, telegram authentication, admin panel, secure login, user management",
  authors: [{ name: "Key Management System" }],
  creator: "Key Management System",
  publisher: "Key Management System",
  generator: "Next.js",
  applicationName: "Key Management System",
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
    url: "https://key-management.vercel.app",
    siteName: "Key Management System",
    title: "Key Management System - Secure Authentication",
    description:
      "Secure key-based authentication system with Telegram username integration and comprehensive admin panel.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Key Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Key Management System - Secure Authentication",
    description: "Secure key-based authentication system with Telegram username integration.",
    images: ["/og-image.png"],
    creator: "@keymanagement",
  },
  other: {
    "application-name": "Key Management System",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Key Management System",
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
    <html lang="bn" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
          storageKey="key-management-theme"
        >
          <>
            <AuthProvider>{children}</AuthProvider>
            <Toaster />
          </>
        </ThemeProvider>
      </body>
    </html>
  )
}
