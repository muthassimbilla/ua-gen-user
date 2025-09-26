# Smarty API Setup Guide

## 🔧 Smarty API Configuration

### 1. Get Smarty API Credentials

1. Visit [Smarty API Website](https://www.smarty.com/)
2. Create an account or sign in
3. Go to your dashboard and get your API credentials:
   - **Auth ID** (also called Username)
   - **Auth Token** (also called Password)

### 2. Configure Environment Variables

Create or update your `.env.local` file in the project root:

```bash
# Smarty API Credentials (for client-side)
NEXT_PUBLIC_SMARTY_AUTH_ID=your_auth_id_here
NEXT_PUBLIC_SMARTY_AUTH_TOKEN=your_auth_token_here

# Smarty API Credentials (for server-side proxy)
SMARTY_AUTH_ID=your_auth_id_here
SMARTY_AUTH_TOKEN=your_auth_token_here
```

**Important Notes:**
- `NEXT_PUBLIC_*` variables are for client-side usage
- `SMARTY_*` variables (without NEXT_PUBLIC_) are for server-side proxy
- Both sets should have the same values
- Server-side variables are more secure for API calls

### 3. Test API Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Go to `/tool/address-generator`

3. Click the **"Test API"** button to verify your credentials

4. You should see a green status message if everything is working

### 4. API Features

#### ✅ **Smarty API (Primary)**
- **High accuracy** location data
- **Premium** geocoding service
- **Detailed** address information
- **Reliable** and fast

#### 🔄 **Fallback API (Secondary)**
- **Free** IP geolocation service
- **Basic** location data
- **Backup** when Smarty API fails

### 5. Troubleshooting

#### ❌ **"Smarty API credentials not configured"**
- Check your `.env.local` file
- Make sure variables start with `NEXT_PUBLIC_`
- Restart your development server

#### ❌ **"Smarty API error: 401 Unauthorized"**
- Verify your Auth ID and Auth Token
- Check if your Smarty account is active
- Ensure you have the correct permissions

#### ❌ **"Smarty API error: 403 Forbidden"**
- Check your API usage limits
- Verify your account has sufficient credits
- Contact Smarty support if needed

### 6. API Response Format

Smarty API returns data in this format:

```json
[
  {
    "country": "United States",
    "state_province": "California",
    "city": "Mountain View",
    "postal_code": "94043",
    "latitude": 37.386,
    "longitude": -122.0838,
    "time_zone": "America/Los_Angeles",
    "isp": "Google LLC",
    "organization": "Google LLC"
  }
]
```

### 7. Cost Information

- **Smarty API**: Pay-per-use pricing
- **Fallback API**: Free with rate limits
- Check Smarty pricing on their website

### 8. Support

- **Smarty Documentation**: [https://www.smarty.com/docs](https://www.smarty.com/docs)
- **Smarty Support**: Contact through their website
- **Project Issues**: Check GitHub issues

---

## 🚀 Quick Start

1. Get Smarty API credentials
2. Add to `.env.local`
3. Run `npm run dev`
4. Test at `/tool/address-generator`
5. Enjoy premium IP geocoding! 🎉
