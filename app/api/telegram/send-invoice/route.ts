import { type NextRequest, NextResponse } from "next/server"

interface TelegramInvoiceRequest {
  transactionId: string
  packageName: string
  packagePrice: number
  packageDuration: number
  userEmail: string
  telegramUsername: string
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramInvoiceRequest = await request.json()
    const { transactionId, packageName, packagePrice, packageDuration, userEmail, telegramUsername } = body

    const botToken = process.env.TELEGRAM_BOT_TOKEN
    if (!botToken) {
      return NextResponse.json({ error: "Telegram bot token not configured" }, { status: 500 })
    }

    // Format duration in Bengali
    const formatDuration = (days: number) => {
      if (days === 365) return "১ বছর"
      if (days === 30) return "৩০ দিন"
      if (days === 7) return "৭ দিন"
      return `${days} দিন`
    }

    const invoiceMessage = `
🎯 **নতুন অর্ডার রিকোয়েস্ট**

📦 **প্যাকেজ:** ${packageName}
💰 **মূল্য:** ৳${packagePrice}
⏰ **সময়কাল:** ${formatDuration(packageDuration)}
📧 **ইমেইল:** ${userEmail}
👤 **Telegram:** @${telegramUsername}
🆔 **অর্ডার ID:** \`${transactionId}\`

---
💳 **পেমেন্ট অপশন:**
🏦 **bKash Personal:** 01XXXXXXXXX
💸 **Nagad Personal:** 01XXXXXXXXX
🏪 **Rocket:** 01XXXXXXXXX-X
🏦 **Bank Transfer:** Dutch-Bangla Bank
   **Account:** XXXXXXXXXX
   **Routing:** XXXXXXXXX

📱 **WhatsApp সাপোর্ট:** +8801XXXXXXXXX

⚠️ **গুরুত্বপূর্ণ নির্দেশনা:**
• পেমেন্ট সম্পন্ন হলে অর্ডার ID সহ স্ক্রিনশট পাঠান
• ২৪ ঘন্টার মধ্যে অ্যাকাউন্ট অ্যাক্টিভ হবে
• কোন সমস্যা হলে সাপোর্টে যোগাযোগ করুন

✅ **অর্ডার স্ট্যাটাস:** অপেক্ষমান
    `.trim()

    const contactMessage = `
🎉 **আপনার অর্ডার সফলভাবে গৃহীত হয়েছে!**

📦 **প্যাকেজ:** ${packageName}
💰 **মূল্য:** ৳${packagePrice}
⏰ **সময়কাল:** ${formatDuration(packageDuration)}
🆔 **অর্ডার ID:** \`${transactionId}\`

💳 **পেমেন্ট করার নিয়ম:**
1️⃣ নিচের যেকোনো মাধ্যমে পেমেন্ট করুন
2️⃣ পেমেন্ট স্ক্রিনশট নিন
3️⃣ অর্ডার ID সহ আমাদের পাঠান

🏦 **পেমেন্ট অপশন:**
• **bKash:** 01XXXXXXXXX (Personal)
• **Nagad:** 01XXXXXXXXX (Personal)
• **Rocket:** 01XXXXXXXXX-X

⏰ **অ্যাক্টিভেশন:** ২ৄ ঘন্টার মধ্যে
🔒 **নিরাপত্তা:** ১০০% নিরাপদ ও এনক্রিপ্টেড

❓ **সাহায্য প্রয়োজন?** নিচের বাটনে ক্লিক করুন 👇
    `.trim()

    // Get admin chat IDs
    const adminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID || process.env.TELEGRAM_CHAT_ID
    const supportUsername = process.env.TELEGRAM_SUPPORT_USERNAME || "support"

    if (adminChatId) {
      const adminResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: invoiceMessage,
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `💬 Contact @${telegramUsername}`,
                  url: `https://t.me/${telegramUsername}`,
                },
                {
                  text: "📧 Send Email",
                  url: `mailto:${userEmail}?subject=Order ${transactionId}&body=Hello, regarding your order...`,
                },
              ],
              [
                {
                  text: "✅ Mark as Paid",
                  callback_data: `mark_paid_${transactionId}`,
                },
                {
                  text: "❌ Cancel Order",
                  callback_data: `cancel_order_${transactionId}`,
                },
              ],
            ],
          },
        }),
      })

      if (!adminResponse.ok) {
        console.error("Failed to send admin message:", await adminResponse.text())
      }
    }

    // Try to send message to user
    try {
      // First, try to get user info by username
      const userInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: `@${telegramUsername}`,
        }),
      })

      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json()

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: userInfo.result.id,
            text: contactMessage,
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "💬 Contact Support",
                    url: `https://t.me/${supportUsername}`,
                  },
                  {
                    text: "📱 WhatsApp Support",
                    url: "https://wa.me/8801XXXXXXXXX",
                  },
                ],
                [
                  {
                    text: "💳 bKash Payment Guide",
                    url: "https://www.bkash.com/how-to-send-money",
                  },
                  {
                    text: "💸 Nagad Payment Guide",
                    url: "https://www.nagad.com.bd/send-money/",
                  },
                ],
                [
                  {
                    text: "📋 Check Order Status",
                    callback_data: `check_status_${transactionId}`,
                  },
                ],
              ],
            },
          }),
        })
      }
    } catch (error) {
      console.error("Error sending user message:", error)
      // Don't fail the request if user message fails
    }

    return NextResponse.json({
      success: true,
      message: "Invoice sent successfully",
      transactionId,
      adminNotified: !!adminChatId,
    })
  } catch (error) {
    console.error("Telegram API error:", error)
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 })
  }
}
