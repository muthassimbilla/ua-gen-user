# Telegram Bot Setup Guide

## 1. Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Choose a name for your bot (e.g., "UGen Pro Contact Bot")
4. Choose a username for your bot (e.g., "ugenpro_contact_bot")
5. Copy the bot token that BotFather provides

## 2. Get Your Chat ID

1. Start a conversation with your bot
2. Send any message to the bot
3. Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
4. Look for the "chat" object and copy the "id" value

## 3. Set Environment Variables

Create a `.env.local` file in your project root:

\`\`\`env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
\`\`\`

Example:
\`\`\`env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
\`\`\`

## 4. Test the Setup

1. Visit: `http://localhost:3000/api/contact/test` (GET request)
2. This will show you if the environment variables are set correctly

## 5. Test the Contact Form

1. Go to: `http://localhost:3000/contact`
2. Fill out the form and submit
3. Check your Telegram for the message

## Troubleshooting

### If you get "There was a problem sending your message":

1. Check if environment variables are set correctly
2. Verify the bot token is valid
3. Make sure you've started a conversation with the bot
4. Check the server console for error logs

### If Telegram bot is not configured:

The form will still work and log the data to the console. You can check the server logs to see the submitted data.

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your bot token secure
- Consider using environment-specific configurations for production
