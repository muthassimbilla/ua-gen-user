import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, telegramUsername, message, telegramMessage } = body

    // Validate required fields
    if (!name || !telegramUsername || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Get Telegram Bot Token and Chat ID from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const chatId = process.env.TELEGRAM_CHAT_ID

    // If Telegram bot is not configured, return success
    if (!botToken || !chatId) {
      return NextResponse.json(
        {
          success: true,
          message: "Contact form submitted successfully (Telegram bot not configured)",
          telegramMessageId: null
        },
        { status: 200 }
      )
    }

    // Send message to Telegram
    try {
      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: "Markdown",
            disable_web_page_preview: true,
          }),
        }
      )

      if (!telegramResponse.ok) {
        return NextResponse.json(
          {
            success: true,
            message: "Contact form submitted successfully (Telegram delivery failed)",
            telegramMessageId: null
          },
          { status: 200 }
        )
      }

      const telegramData = await telegramResponse.json()
      return NextResponse.json(
        {
          success: true,
          message: "Contact form submitted successfully",
          telegramMessageId: telegramData?.result?.message_id
        },
        { status: 200 }
      )
    } catch (telegramError) {
      return NextResponse.json(
        {
          success: true,
          message: "Contact form submitted successfully (Telegram delivery failed)",
          telegramMessageId: null
        },
        { status: 200 }
      )
    }

  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
