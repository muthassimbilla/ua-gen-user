"use client"

import type { UserStatus } from "./user-status-service"

export class StatusChecker {
  private static instance: StatusChecker
  private checkInterval: NodeJS.Timeout | null = null
  private isChecking = false

  static getInstance(): StatusChecker {
    if (!StatusChecker.instance) {
      StatusChecker.instance = new StatusChecker()
    }
    return StatusChecker.instance
  }

  startChecking(intervalMs = 30000): void {
    if (this.checkInterval) {
      console.log("[v0] Status checking already started")
      return
    }

    console.log("[v0] Starting status checking every", intervalMs, "ms")
    
    this.checkInterval = setInterval(async () => {
      if (this.isChecking) {
        console.log("[v0] Status check already in progress, skipping")
        return
      }

      await this.checkStatus()
    }, intervalMs)

    // Initial check
    this.checkStatus()
  }

  stopChecking(): void {
    if (this.checkInterval) {
      console.log("[v0] Stopping status checking")
      clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }

  private async checkStatus(): Promise<void> {
    if (this.isChecking) return

    this.isChecking = true

    try {
      console.log("[v0] Checking user status...")
      
      const response = await fetch("/api/user-status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const status: UserStatus = await response.json()

      console.log("[v0] Status check result:", status)

      if (!status.is_valid) {
        console.log("[v0] User status invalid, dispatching event")
        
        // Dispatch custom event for auth context to handle
        window.dispatchEvent(
          new CustomEvent("user-status-invalid", {
            detail: status,
          })
        )
      }

    } catch (error) {
      console.error("[v0] Status check failed:", error)
      
      // Only dispatch error event for non-network errors
      if (!error.message?.includes("fetch") && !error.message?.includes("network")) {
        window.dispatchEvent(
          new CustomEvent("user-status-invalid", {
            detail: {
              is_valid: false,
              status: "inactive",
              message: "Unable to verify account status.",
            },
          })
        )
      }
    } finally {
      this.isChecking = false
    }
  }

  // Manual status check
  async checkStatusNow(): Promise<UserStatus | null> {
    try {
      const response = await fetch("/api/user-status", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const status: UserStatus = await response.json()
      return status
    } catch (error) {
      console.error("[v0] Manual status check failed:", error)
      return null
    }
  }
}
