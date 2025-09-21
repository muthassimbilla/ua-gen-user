"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface RealtimeStats {
  onlineUsers: number
  pendingApprovals: number
  recentTransactions: number
}

interface RealtimeContextType {
  stats: RealtimeStats
  isConnected: boolean
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<RealtimeStats>({
    onlineUsers: 0,
    pendingApprovals: 0,
    recentTransactions: 0,
  })
  const [isConnected, setIsConnected] = useState(false)
  const { user, isAdmin } = useAuth()
  const supabase = createClient()

  useEffect(() => {
    if (user) {
      setupRealtimeSubscriptions()
    }
  }, [user])

  const setupRealtimeSubscriptions = () => {
    if (!user) return

    // Subscribe to user profile changes (for admin)
    const userProfilesChannel = supabase
      .channel("user_profiles_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_profiles",
        },
        (payload) => {
          if (isAdmin) {
            // Update pending approvals count
            fetchPendingApprovals()
          }
        },
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    // Subscribe to transaction changes
    const transactionsChannel = supabase
      .channel("transactions_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
        },
        (payload) => {
          if (isAdmin) {
            setStats((prev) => ({
              ...prev,
              recentTransactions: prev.recentTransactions + 1,
            }))
          }
        },
      )
      .subscribe()

    // Presence tracking for online users
    const presenceChannel = supabase
      .channel("online_users")
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState()
        const onlineCount = Object.keys(state).length
        setStats((prev) => ({
          ...prev,
          onlineUsers: onlineCount,
        }))
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          })
        }
      })

    // Initial data fetch
    if (isAdmin) {
      fetchPendingApprovals()
    }

    return () => {
      supabase.removeChannel(userProfilesChannel)
      supabase.removeChannel(transactionsChannel)
      supabase.removeChannel(presenceChannel)
    }
  }

  const fetchPendingApprovals = async () => {
    try {
      const { count } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      setStats((prev) => ({
        ...prev,
        pendingApprovals: count || 0,
      }))
    } catch (error) {
      console.error("Error fetching pending approvals:", error)
    }
  }

  return <RealtimeContext.Provider value={{ stats, isConnected }}>{children}</RealtimeContext.Provider>
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}
