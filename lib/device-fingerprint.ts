// Device fingerprinting utility for tracking unique devices
// This helps implement single-device login policy

export interface DeviceInfo {
  fingerprint: string
  name: string
  browser: string
  os: string
  screenResolution: string
  timezone: string
  language: string
  userAgent: string
}

export class DeviceFingerprint {
  static async generateFingerprint(): Promise<string> {
    if (typeof window === "undefined") {
      return "server-side-" + Math.random().toString(36).substr(2, 9)
    }

    try {
      const components = []

      // Screen information
      components.push(screen.width + "x" + screen.height)
      components.push(screen.colorDepth)
      components.push(screen.pixelDepth)

      // Timezone
      try {
        components.push(Intl.DateTimeFormat().resolvedOptions().timeZone)
      } catch (e) {
        components.push("unknown-timezone")
      }

      // Language
      components.push(navigator.language || "unknown-lang")

      // User agent
      components.push(navigator.userAgent || "unknown-ua")

      // Platform
      components.push(navigator.platform || "unknown-platform")

      // Hardware concurrency (CPU cores)
      if ("hardwareConcurrency" in navigator) {
        components.push(navigator.hardwareConcurrency)
      }

      // Memory (if available)
      if ("deviceMemory" in navigator) {
        components.push((navigator as any).deviceMemory)
      }

      try {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.textBaseline = "top"
          ctx.font = "14px Arial"
          ctx.fillText("Device fingerprint test", 2, 2)
          components.push(canvas.toDataURL().slice(-50)) // Last 50 chars
        } else {
          components.push("no-canvas")
        }
      } catch (e) {
        components.push("canvas-error")
      }

      try {
        const canvas = document.createElement("canvas")
        const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
        if (gl) {
          const renderer = gl.getParameter(gl.RENDERER) || "unknown-renderer"
          const vendor = gl.getParameter(gl.VENDOR) || "unknown-vendor"
          components.push(renderer + "|" + vendor)
        } else {
          components.push("no-webgl")
        }
      } catch (e) {
        components.push("webgl-error")
      }

      // Create hash from components
      const fingerprint = await this.hashString(components.join("|"))
      console.log("[v0] Generated device fingerprint:", fingerprint.substring(0, 8) + "...")
      return fingerprint
    } catch (error) {
      console.error("[v0] Error generating fingerprint:", error)
      // Fallback fingerprint
      return "fallback-" + Date.now().toString(36) + "-" + Math.random().toString(36).substr(2, 5)
    }
  }

  static async getDeviceInfo(): Promise<DeviceInfo> {
    const fingerprint = await this.generateFingerprint()

    return {
      fingerprint,
      name: this.getDeviceName(),
      browser: this.getBrowserInfo(),
      os: this.getOSInfo(),
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      userAgent: navigator.userAgent,
    }
  }

  private static getDeviceName(): string {
    if (typeof window === "undefined") return "Server"

    const userAgent = navigator.userAgent

    // Mobile devices
    if (/iPhone/.test(userAgent)) {
      const match = userAgent.match(/iPhone OS ([\d_]+)/)
      return `iPhone (iOS ${match ? match[1].replace(/_/g, ".") : "Unknown"})`
    }

    if (/iPad/.test(userAgent)) {
      return "iPad"
    }

    if (/Android/.test(userAgent)) {
      const match = userAgent.match(/Android ([\d.]+)/)
      return `Android Device (${match ? match[1] : "Unknown"})`
    }

    // Desktop
    if (/Windows/.test(userAgent)) {
      return "Windows PC"
    }

    if (/Mac OS X/.test(userAgent)) {
      return "Mac"
    }

    if (/Linux/.test(userAgent)) {
      return "Linux PC"
    }

    return "Unknown Device"
  }

  private static getBrowserInfo(): string {
    if (typeof window === "undefined") return "Server"

    const userAgent = navigator.userAgent

    if (/Chrome/.test(userAgent) && !/Edge/.test(userAgent)) {
      const match = userAgent.match(/Chrome\/([\d.]+)/)
      return `Chrome ${match ? match[1] : "Unknown"}`
    }

    if (/Firefox/.test(userAgent)) {
      const match = userAgent.match(/Firefox\/([\d.]+)/)
      return `Firefox ${match ? match[1] : "Unknown"}`
    }

    if (/Safari/.test(userAgent) && !/Chrome/.test(userAgent)) {
      const match = userAgent.match(/Version\/([\d.]+)/)
      return `Safari ${match ? match[1] : "Unknown"}`
    }

    if (/Edge/.test(userAgent)) {
      const match = userAgent.match(/Edge\/([\d.]+)/)
      return `Edge ${match ? match[1] : "Unknown"}`
    }

    return "Unknown Browser"
  }

  private static getOSInfo(): string {
    if (typeof window === "undefined") return "Server"

    const userAgent = navigator.userAgent

    if (/Windows NT 10/.test(userAgent)) return "Windows 10/11"
    if (/Windows NT 6.3/.test(userAgent)) return "Windows 8.1"
    if (/Windows NT 6.2/.test(userAgent)) return "Windows 8"
    if (/Windows NT 6.1/.test(userAgent)) return "Windows 7"
    if (/Windows/.test(userAgent)) return "Windows"

    if (/Mac OS X ([\d_]+)/.test(userAgent)) {
      const match = userAgent.match(/Mac OS X ([\d_]+)/)
      return `macOS ${match ? match[1].replace(/_/g, ".") : "Unknown"}`
    }

    if (/iPhone OS ([\d_]+)/.test(userAgent)) {
      const match = userAgent.match(/iPhone OS ([\d_]+)/)
      return `iOS ${match ? match[1].replace(/_/g, ".") : "Unknown"}`
    }

    if (/Android ([\d.]+)/.test(userAgent)) {
      const match = userAgent.match(/Android ([\d.]+)/)
      return `Android ${match ? match[1] : "Unknown"}`
    }

    if (/Linux/.test(userAgent)) return "Linux"

    return "Unknown OS"
  }

  private static async hashString(str: string): Promise<string> {
    if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
      // Fallback for server-side or older browsers
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = (hash << 5) - hash + char
        hash = hash & hash // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(36)
    }

    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
    return hashHex.slice(0, 16) // First 16 characters
  }
}

// IP detection utility
export class IPDetection {
  static async getCurrentIP(): Promise<string | null> {
    try {
      console.log("[v0] Detecting current IP...")

      const services = [
        { url: "https://api.ipify.org?format=json", key: "ip" },
        { url: "https://httpbin.org/ip", key: "origin" },
        { url: "https://api.my-ip.io/ip.json", key: "ip" },
      ]

      for (const service of services) {
        try {
          console.log("[v0] Trying IP service:", service.url)

          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)

          const response = await fetch(service.url, {
            signal: controller.signal,
            headers: {
              Accept: "application/json",
            },
          })

          clearTimeout(timeoutId)

          if (response.ok) {
            const data = await response.json()
            const ip = data[service.key]

            if (ip && typeof ip === "string") {
              console.log("[v0] IP detected:", ip)
              return ip
            }
          }
        } catch (e) {
          console.warn(`[v0] IP service ${service.url} failed:`, e)
          continue
        }
      }

      console.warn("[v0] All IP services failed, using fallback")
      return "127.0.0.1" // Fallback IP
    } catch (error) {
      console.error("[v0] Failed to detect IP:", error)
      return "127.0.0.1" // Fallback IP
    }
  }

  static async getIPInfo(ip: string): Promise<{
    country?: string
    city?: string
    isp?: string
  } | null> {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`, {
        timeout: 5000,
      })

      if (response.ok) {
        const data = await response.json()
        return {
          country: data.country_name,
          city: data.city,
          isp: data.org,
        }
      }
    } catch (error) {
      console.warn("Failed to get IP info:", error)
    }

    return null
  }
}
