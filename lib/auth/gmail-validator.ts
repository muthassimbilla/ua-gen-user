// Gmail domain validation utility
export function isGmailEmail(email: string): boolean {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i
  return gmailRegex.test(email)
}

export function validateGmailEmail(email: string): { isValid: boolean; error?: string } {
  if (!email) {
    return { isValid: false, error: "Email is required" }
  }

  if (!isGmailEmail(email)) {
    return {
      isValid: false,
      error: "শুধুমাত্র Gmail ইমেইল ব্যবহার করুন (example@gmail.com)",
    }
  }

  return { isValid: true }
}
