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
  title: {
    default: "TaskFlow - Modern Project Management Platform",
    template: "%s | TaskFlow"
  },
  description:
    "The complete platform to manage projects and boost team productivity. Streamline workflows, collaborate seamlessly, and deliver projects faster.",
  keywords: [
    "project management",
    "task management", 
    "team collaboration",
    "productivity",
    "workflow automation",
    "project planning",
    "team productivity",
    "agile management",
    "kanban board",
    "scrum master"
  ],
  authors: [{ name: "TaskFlow Team", url: "https://taskflow.com" }],
  creator: "TaskFlow",
  publisher: "TaskFlow",
  generator: "Next.js",
  applicationName: "TaskFlow",
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
    url: "https://taskflow.com",
    siteName: "TaskFlow",
    title: "TaskFlow - Modern Project Management Platform",
    description: "The complete platform to manage projects and boost team productivity. Streamline workflows, collaborate seamlessly, and deliver projects faster.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TaskFlow - Modern Project Management Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow - Modern Project Management Platform",
    description: "The complete platform to manage projects and boost team productivity.",
    images: ["/twitter-image.jpg"],
    creator: "@taskflow",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "productivity",
  classification: "Business Software",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "TaskFlow",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#4A90E2",
    "theme-color": "#4A90E2",
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
