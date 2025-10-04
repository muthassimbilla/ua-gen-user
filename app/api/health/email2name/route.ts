import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check if API keys are available
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY
    const googleApiKey = process.env.GOOGLE_API_KEY
    
    if (!deepseekApiKey && !googleApiKey) {
      return NextResponse.json({
        status: "error",
        message: "No API key configured. Please add DEEPSEEK_API_KEY or GOOGLE_API_KEY",
        timestamp: new Date().toISOString(),
        responseTime: Date.now() - startTime
      }, { status: 500 })
    }

    // Test API with a simple request
    let testResponse: Response
    let apiProvider = ""
    
    if (deepseekApiKey) {
      // Test DeepSeek API
      apiProvider = "DeepSeek"
      testResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${deepseekApiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content: "Test API connection. Reply with 'OK' only."
            }
          ],
          temperature: 0.1,
          max_tokens: 10,
        }),
      })
    } else {
      // Test Google Gemini API
      apiProvider = "Google Gemini"
      testResponse = await fetch(
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
    }

    const responseTime = Date.now() - startTime

    if (!testResponse.ok) {
      const errorData = await testResponse.json()
      return NextResponse.json({
        status: "error",
        message: `${apiProvider} API error`,
        error: errorData,
        apiProvider: apiProvider,
        responseTime,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    const data = await testResponse.json()
    let generatedText = ""
    
    if (apiProvider === "DeepSeek") {
      generatedText = data.choices?.[0]?.message?.content || ""
    } else {
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    }

    return NextResponse.json({
      status: "healthy",
      message: "Email2Name API is working",
      apiResponse: generatedText,
      apiProvider: apiProvider,
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
