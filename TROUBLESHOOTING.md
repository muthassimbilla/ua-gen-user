# Smarty API Troubleshooting Guide

## 🔧 Common Issues and Solutions

### 1. "Proxy error: fetch failed"

#### **Possible Causes:**
- Missing environment variables
- Incorrect API credentials
- Network connectivity issues
- Smarty API service down

#### **Solutions:**

##### **Step 1: Check Environment Variables**
1. Open `.env.local` file in project root
2. Ensure both sets of credentials are present:
   ```bash
   # Client-side
   NEXT_PUBLIC_SMARTY_AUTH_ID=your_auth_id
   NEXT_PUBLIC_SMARTY_AUTH_TOKEN=your_auth_token
   
   # Server-side
   SMARTY_AUTH_ID=your_auth_id
   SMARTY_AUTH_TOKEN=your_auth_token
   ```

##### **Step 2: Debug Credentials**
1. Go to `/tool/address-generator`
2. Click **"Debug"** button
3. Check console for debug information
4. Verify credentials are loaded correctly

##### **Step 3: Test API Connection**
1. Click **"Test API"** button
2. Check the status message
3. If still failing, try restarting development server

##### **Step 4: Restart Development Server**
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### 2. "Smarty API credentials not configured"

#### **Solution:**
1. Get credentials from [Smarty API](https://www.smarty.com/)
2. Add to `.env.local` file
3. Restart development server
4. Test again

### 3. "Smarty API error: 401 Unauthorized"

#### **Solution:**
1. Verify Auth ID and Auth Token are correct
2. Check if account is active
3. Ensure credentials match exactly (no extra spaces)

### 4. "Smarty API error: 403 Forbidden"

#### **Solution:**
1. Check API usage limits
2. Verify account has sufficient credits
3. Contact Smarty support

### 5. "Network error: Unable to connect"

#### **Solution:**
1. Check internet connection
2. Try different network
3. Check if Smarty API is accessible
4. Use fallback API (automatic)

## 🚀 Quick Fixes

### **Fix 1: Environment Variables**
```bash
# Create .env.local file
touch .env.local

# Add credentials
echo "NEXT_PUBLIC_SMARTY_AUTH_ID=your_id" >> .env.local
echo "NEXT_PUBLIC_SMARTY_AUTH_TOKEN=your_token" >> .env.local
echo "SMARTY_AUTH_ID=your_id" >> .env.local
echo "SMARTY_AUTH_TOKEN=your_token" >> .env.local
```

### **Fix 2: Restart Everything**
```bash
# Stop server
# Clear cache
rm -rf .next
# Restart
npm run dev
```

### **Fix 3: Test Fallback**
- If Smarty API fails, fallback API will work automatically
- Check console for "Trying fallback API..." message

## 🔍 Debug Steps

### **Step 1: Check Console Logs**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Check Network tab for failed requests

### **Step 2: Test API Endpoints**
1. Test proxy: `http://localhost:3000/api/smarty-proxy?ip=8.8.8.8`
2. Test debug: `http://localhost:3000/api/debug-smarty`
3. Check responses in browser

### **Step 3: Verify Credentials**
1. Use Debug button in Address Generator
2. Check if credentials are loaded
3. Verify lengths are correct

## 📞 Support

### **If Still Not Working:**
1. Check [Smarty API Status](https://status.smarty.com/)
2. Contact Smarty support
3. Check project GitHub issues
4. Verify account permissions

### **Fallback Option:**
- The system automatically uses free API if Smarty fails
- No configuration needed for fallback
- Basic location data will be available

---

## ✅ Success Indicators

When everything is working:
- ✅ "Smarty API is working correctly" message
- ✅ Green status indicator
- ✅ Detailed location data returned
- ✅ No error messages in console

## ❌ Failure Indicators

When there are issues:
- ❌ "Proxy error: fetch failed"
- ❌ Red status indicator
- ❌ Error messages in console
- ❌ Fallback API used instead
