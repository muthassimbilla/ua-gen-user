"use client"

import type React from "react"
import { AuthProvider } from "@/lib/auth-context"
import { NetworkProvider } from "@/contexts/network-context"
import ConditionalLayout from "@/components/conditional-layout"

interface ClientProvidersProps {
  children: React.ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <NetworkProvider>
      <AuthProvider>
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </AuthProvider>
    </NetworkProvider>
  )
}
