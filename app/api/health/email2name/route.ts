import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check if GOOGLE_API_KEY is available
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        status: "error",
        message: "GOOGLE_API_KEY not configured",
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime
      }, { status: 500 })
    }

    // Test API with a simple request
    const testResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
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
                  text: "Test API connection. Reply with 'OK' only.",
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10,
          },
        }),
      },
    )

    const responseTime = Date.now() - startTime

    if (!testResponse.ok) {
      const errorData = await testResponse.json()
      return NextResponse.json({
        status: "error",
        message: "Google Gemini API error",
        error: errorData,
        responseTime,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    const data = await testResponse.json()
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    return NextResponse.json({
      status: "healthy",
      message: "Email2Name API is working",
      apiResponse: generatedText,
      responseTime,
      timestamp: new Date().toISOString(),
      apiKeyConfigured: true
    })

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - Date.now()
    }, { status: 500 })
  }
}
