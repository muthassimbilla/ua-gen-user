"use client"

import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { StatusNotificationProvider } from "@/components/status-notification-provider"
import { NetworkProvider } from "@/contexts/network-context"
import ConditionalLayout from "@/components/conditional-layout"
import PageTransition from "@/components/page-transition"

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <NetworkProvider>
      <StatusNotificationProvider>
        <AuthProvider>
          <ConditionalLayout>
            <PageTransition>{children}</PageTransition>
          </ConditionalLayout>
        </AuthProvider>
      </StatusNotificationProvider>
    </NetworkProvider>
  )
}
