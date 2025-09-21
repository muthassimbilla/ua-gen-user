// Gmail domain validation utility
export function isGmailEmail(email: string): boolean {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
  return gmailRegex.test(email)
}

export function hasDotInLocalPart(email: string): boolean {
  const [localPart] = email.split("@")
  return localPart?.includes(".") || false
}

export function validateGmailEmail(email: string): {
  isValid: boolean
  error?: string
  warnings?: string[]
} {
  if (!email) {
    return { isValid: false, error: "Email is required" }
  }

  const warnings: string[] = []

  // Check for dot in email (before @)
  if (hasDotInLocalPart(email)) {
    warnings.push("ডট মেইল সাপোর্টেড নয়। ডট ছাড়া ইমেইল ব্যবহার করুন।")
  }

  // Check if it's Gmail domain
  if (!isGmailEmail(email)) {
    return {
      isValid: false,
      error: "শুধুমাত্র Gmail ইমেইল ব্যবহার করুন (example@gmail.com)",
      warnings,
    }
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

export function getEmailDomain(email: string): string {
  const parts = email.split("@")
  return parts.length > 1 ? parts[1].toLowerCase() : ""
}

export function validateEmailDomain(email: string): {
  isValid: boolean
  error?: string
  domain?: string
} {
  const domain = getEmailDomain(email)

  if (!domain) {
    return { isValid: false, error: "সঠিক ইমেইল ফরম্যাট ব্যবহার করুন" }
  }

  if (domain !== "gmail.com") {
    return {
      isValid: false,
      error: "শুধুমাত্র Gmail ইমেইল ব্যবহার করুন",
      domain,
    }
  }

  return { isValid: true, domain }
}
