"use client"

import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { StatusNotificationProvider } from "@/components/status-notification-provider"
import { NetworkProvider } from "@/contexts/network-context"
import ConditionalLayout from "@/components/conditional-layout"

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <NetworkProvider>
      <StatusNotificationProvider>
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </AuthProvider>
      </StatusNotificationProvider>
    </NetworkProvider>
  )
}
