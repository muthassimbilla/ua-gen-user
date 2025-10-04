import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const testEmail = searchParams.get('email') || 'test@example.com'
    
    console.log(`[DEBUG] Testing Email2Name API with email: ${testEmail}`)
    
    // Check environment variables
    const deepseekApiKey = process.env.DEEPSEEK_API_KEY
    const googleApiKey = process.env.GOOGLE_API_KEY
    const hasDeepseekKey = !!deepseekApiKey
    const hasGoogleKey = !!googleApiKey
    const deepseekKeyPreview = deepseekApiKey ? `${deepseekApiKey.substring(0, 8)}...` : 'Not set'
    const googleKeyPreview = googleApiKey ? `${googleApiKey.substring(0, 8)}...` : 'Not set'
    
    // Test the actual API call
    let apiTestResult = null
    let apiError = null
    let apiProvider = ""
    
    if (hasDeepseekKey || hasGoogleKey) {
      try {
        let response: Response
        
        if (hasDeepseekKey) {
          // Test DeepSeek API
          apiProvider = "DeepSeek"
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
                  content: "You are an AI that generates names from email addresses. Always respond in the exact format: Full Name: [name], First Name: [first], Last Name: [last], Gender: [male/female], Country: US, Type: [Business/Personal]"
                },
                {
                  role: "user",
                  content: `Generate a name for this email: ${testEmail}`
                }
              ],
              temperature: 0.7,
              max_tokens: 200,
            }),
          })
        } else {
          // Test Google Gemini API
          apiProvider = "Google Gemini"
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
                        text: `Generate a name for this email: ${testEmail}. Reply with: Full Name: John Doe, First Name: John, Last Name: Doe, Gender: male, Country: US, Type: Personal`,
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

        if (response.ok) {
          const data = await response.json()
          apiTestResult = {
            success: true,
            response: data,
            status: response.status,
            statusText: response.statusText,
            apiProvider: apiProvider
          }
        } else {
          const errorData = await response.json()
          apiError = {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
            apiProvider: apiProvider
          }
        }
      } catch (error) {
        apiError = {
          type: 'network_error',
          message: error instanceof Error ? error.message : 'Unknown error',
          apiProvider: apiProvider
        }
      }
    }
    
    const responseTime = Date.now() - startTime
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      environment: {
        hasDeepseekKey,
        hasGoogleKey,
        deepseekKeyPreview,
        googleKeyPreview,
        nodeEnv: process.env.NODE_ENV
      },
      testEmail,
      apiTest: apiTestResult,
      apiError,
      apiProvider: apiProvider,
      recommendations: []
    }
    
    // Add recommendations based on results
    if (!hasDeepseekKey && !hasGoogleKey) {
      debugInfo.recommendations.push("Set DEEPSEEK_API_KEY or GOOGLE_API_KEY in your environment variables")
    }
    
    if (hasDeepseekKey) {
      debugInfo.recommendations.push("DeepSeek API key is configured and will be used")
    }
    
    if (hasGoogleKey && !hasDeepseekKey) {
      debugInfo.recommendations.push("Google Gemini API key is configured and will be used")
    }
    
    if (apiError) {
      if (apiError.status === 429) {
        debugInfo.recommendations.push(`${apiProvider} API quota/rate limit exceeded - check your API limits`)
      } else if (apiError.status === 403) {
        debugInfo.recommendations.push(`${apiProvider} API key invalid or permissions issue`)
      } else if (apiError.type === 'network_error') {
        debugInfo.recommendations.push("Network connectivity issue")
      } else {
        debugInfo.recommendations.push(`Check ${apiProvider} API configuration and try again`)
      }
    }
    
    if (apiTestResult) {
      debugInfo.recommendations.push("API is working correctly")
    }
    
    return NextResponse.json({
      status: "success",
      debug: debugInfo
    })
    
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
