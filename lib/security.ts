import crypto from "crypto"

export class SecurityUtils {
  // Generate secure random key
  static generateSecureKey(length = 32): string {
    return crypto.randomBytes(length).toString("hex")
  }

  // Hash password with salt
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString("hex")
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
    return `${salt}:${hash}`
  }

  // Verify password
  static verifyPassword(password: string, hashedPassword: string): boolean {
    const [salt, hash] = hashedPassword.split(":")
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex")
    return hash === verifyHash
  }

  // Validate IP address
  static isValidIP(ip: string): boolean {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  // Check if IP is suspicious (basic implementation)
  static isSuspiciousIP(ip: string): boolean {
    // Add your suspicious IP detection logic here
    const suspiciousRanges = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"]

    // This is a basic check - in production, use proper IP range checking
    return false
  }

  // Generate JWT token
  static generateJWT(payload: any, secret: string, expiresIn = "24h"): string {
    // In production, use proper JWT library
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url")
    const payloadStr = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString(
      "base64url",
    )
    const signature = crypto.createHmac("sha256", secret).update(`${header}.${payloadStr}`).digest("base64url")

    return `${header}.${payloadStr}.${signature}`
  }

  // Verify JWT token
  static verifyJWT(token: string, secret: string): any {
    try {
      const [header, payload, signature] = token.split(".")
      const expectedSignature = crypto.createHmac("sha256", secret).update(`${header}.${payload}`).digest("base64url")

      if (signature !== expectedSignature) {
        throw new Error("Invalid signature")
      }

      const decodedPayload = JSON.parse(Buffer.from(payload, "base64url").toString())

      if (decodedPayload.exp < Date.now()) {
        throw new Error("Token expired")
      }

      return decodedPayload
    } catch (error) {
      throw new Error("Invalid token")
    }
  }

  // Log security event
  static logSecurityEvent(event: string, details: any, ip?: string) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      ip,
      severity: this.getEventSeverity(event),
    }

    console.log(`[SECURITY] ${JSON.stringify(logEntry)}`)

    // In production, send to monitoring service
    // await sendToMonitoringService(logEntry)
  }

  private static getEventSeverity(event: string): "low" | "medium" | "high" | "critical" {
    const severityMap: Record<string, "low" | "medium" | "high" | "critical"> = {
      login_attempt: "low",
      login_failure: "medium",
      multiple_login_failures: "high",
      admin_access: "medium",
      unauthorized_access: "high",
      suspicious_activity: "critical",
      rate_limit_exceeded: "medium",
    }

    return severityMap[event] || "low"
  }
}
