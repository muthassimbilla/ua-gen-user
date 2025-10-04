import { type NextRequest, NextResponse } from "next/server"

const SYSTEM_PROMPT = `
🧠 System Prompt for AI Agent (Advanced Email → Name & Type Classifier)

You are an intelligent AI agent trained to analyze email addresses and generate realistic, U.S.-style full names. 
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
- Always follow the exact output format.
`

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "Invalid email address" }, { status: 400 })
    }

    // Log usage for monitoring
    const requestId = Math.random().toString(36).substring(7)
    console.log(`[${requestId}] Email2Name API called for: ${email}`)
    
    // Log request details
    console.log(`[${requestId}] Request details:`, {
      email: email,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })

    // Check if DEEPSEEK_API_KEY is available
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY
    const googleApiKey = process.env.GOOGLE_API_KEY
    
    if (!deepseekApiKey && !googleApiKey) {
      return NextResponse.json(
        { success: false, error: "No API key configured. Please add DEEPSEEK_API_KEY or GOOGLE_API_KEY to your environment variables." },
        { status: 500 },
      )
    }

    // Choose API provider (DeepSeek preferred)
    let response: Response
    let apiProvider = ""
    
    if (deepseekApiKey) {
      // Use DeepSeek API
      apiProvider = "DeepSeek"
      console.log(`[${requestId}] Using DeepSeek API for email: ${email}`)
      
      response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${deepseekApiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: `Email: ${email}`
            }
          ],
          temperature: 0.7,
          max_tokens: 200,
        }),
      })
    } else {
      // Fallback to Google Gemini API
      apiProvider = "Google Gemini"
      console.log(`[${requestId}] Using Google Gemini API for email: ${email}`)
      
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${googleApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${SYSTEM_PROMPT}\n\nEmail: ${email}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 200,
            },
          }),
        },
      )
    }

    if (!response.ok) {
      const errorData = await response.json()
      console.error(`[${requestId}] ${apiProvider} API error:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        email: email,
        apiProvider: apiProvider,
        timestamp: new Date().toISOString()
      })
      
      // Check for quota exceeded error
      if (errorData.error?.message?.includes("quota") || errorData.error?.message?.includes("limit") || errorData.error?.message?.includes("rate")) {
        console.error(`[${requestId}] QUOTA/RATE LIMIT EXCEEDED for email: ${email} using ${apiProvider}`)
        return NextResponse.json(
          { 
            success: false, 
            error: `${apiProvider} API quota/rate limit exceeded. Please check your API key limits or upgrade your plan.`,
            requestId: requestId,
            apiProvider: apiProvider,
            timestamp: new Date().toISOString()
          },
          { status: 429 },
        )
      }
      
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to generate name from email using ${apiProvider}: ${errorData.error?.message || "Unknown error"}`,
          requestId: requestId,
          apiProvider: apiProvider,
          timestamp: new Date().toISOString()
        },
        { status: 500 },
      )
    }

    const data = await response.json()
    let generatedText = ""
    
    if (apiProvider === "DeepSeek") {
      generatedText = data.choices?.[0]?.message?.content || ""
    } else {
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    }

    if (!generatedText) {
      return NextResponse.json({ success: false, error: "No response from AI" }, { status: 500 })
    }

    // Parse the response
    const result = {
      fullName: "",
      firstName: "",
      lastName: "",
      gender: "",
      country: "",
      type: "",
    }

    const lines = generatedText.trim().split("\n")
    for (const line of lines) {
      const parts = line.split(":", 2)
      if (parts.length === 2) {
        const key = parts[0].trim().toLowerCase()
        const value = parts[1].trim()

        if (key.includes("full name")) {
          result.fullName = value
        } else if (key.includes("first name")) {
          result.firstName = value
        } else if (key.includes("last name")) {
          result.lastName = value
        } else if (key.includes("gender")) {
          result.gender = value
        } else if (key.includes("country")) {
          result.country = value
        } else if (key.includes("type")) {
          result.type = value
        }
      }
    }

    console.log(`[${requestId}] Successfully generated name for: ${email} using ${apiProvider}`, {
      result: result,
      apiProvider: apiProvider,
      responseTime: Date.now() - Date.now(),
      timestamp: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      data: result,
      requestId: requestId,
      apiProvider: apiProvider,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    const requestId = Math.random().toString(36).substring(7)
    console.error(`[${requestId}] Email2Name API error:`, {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      email: email,
      timestamp: new Date().toISOString()
    })
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error",
      requestId: requestId,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
