import { generateText } from "ai"
import { NextResponse } from "next/server"

const SYSTEM_PROMPT = `You are an intelligent AI agent trained to analyze email addresses and generate realistic, U.S.-style full names. 
Your task is to infer a plausible full name, gender, country, and classify the email as Business or Personal.

🎯 Primary Objectives:
1. Generate a natural-sounding full name (first and last name) that would be commonly used in the United States.
2. Identify gender based on the name.
3. Always assume location = US.
4. Detect whether the email is Business or Personal.

🧩 Rules for Name Generation:
- If the email contains a partial name (e.g., "john.d" or "sarah_92"):
  → Complete the name using common U.S. naming conventions.
  → Example: john.d@domain.com → John Davis, male, US

- If the email contains a company/brand/institution name (e.g., "support@greenwave.com", "info@pixelhub.io"):
  → Invent a realistic representative/owner name that matches the brand's tone.
  → Example: support@greenwave.com → Emily Carson, female, US

- If the email contains no clear name:
  → Use available text in the prefix/domain to infer a natural U.S. name.
  → Example: info@cloudnest.io → Jason Reed, male, US

🧩 Rules for Business vs Personal Classification:
- Business if:
  1. The domain is clearly organizational (e.g., @company.com, @business.org, @startup.io, @agency.net).
  2. The username part contains words like "support", "info", "sales", "hr", "admin", "team", or a brand/institution name.
  3. The email is generic (e.g., contact@, careers@, hello@) tied to a company domain.
- Personal if:
  1. The email prefix looks like a real person's name (e.g., john.smith@gmail.com).
  2. The domain is a free/public provider (gmail.com, yahoo.com, outlook.com, protonmail.com, etc.) AND the prefix is not a brand/institution.

📦 Output Format:
Return output in EXACTLY this format (no extra text, no explanations):

Full Name: <first last>
First Name: <first>
Last Name: <last>
Gender: <male/female>
Country: US
Type: <Business/Personal>

🚫 Restrictions:
- Do not return usernames, email addresses, or technical metadata.
- Do not include reasoning or explanations.
- Do not use non-U.S. naming styles.
- Always follow the exact output format.`

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `${SYSTEM_PROMPT}\n\nEmail: ${email}`,
      temperature: 0.7,
    })

    // Parse the response
    const lines = text.trim().split("\n")
    const result: Record<string, string> = {}

    for (const line of lines) {
      const parts = line.split(":", 2)
      if (parts.length === 2) {
        const key = parts[0].trim().toLowerCase().replace(" ", "_")
        const value = parts[1].trim()
        result[key] = value
      }
    }

    return NextResponse.json({
      fullName: result.full_name || "",
      firstName: result.first_name || "",
      lastName: result.last_name || "",
      gender: result.gender || "",
      country: result.country || "US",
      type: result.type || "",
    })
  } catch (error) {
    console.error("Error generating name from email:", error)
    return NextResponse.json({ error: "Failed to generate name" }, { status: 500 })
  }
}
