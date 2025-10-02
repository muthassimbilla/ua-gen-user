# 🔧 Environment Setup Guide

## ❌ **Issue: Forgot Password Not Working**

The forgot password functionality is not working because **environment variables are missing**.

## 🛠️ **Solution: Create .env.local File**

### **Step 1: Create .env.local file**
Create a new file called `.env.local` in your project root directory with the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### **Step 2: Get Supabase Credentials**

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Get Project URL**
   - Go to Settings > API
   - Copy the "Project URL" (starts with https://)

3. **Get Anon Key**
   - In the same API settings page
   - Copy the "anon public" key

4. **Update .env.local**
   - Replace `your_supabase_url_here` with your Project URL
   - Replace `your_supabase_anon_key_here` with your anon key

### **Step 3: Example .env.local**

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

### **Step 4: Restart Development Server**

After creating the .env.local file:

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
# or
yarn dev
```

## 🔍 **Verification**

1. **Go to Forgot Password Page**
   - Visit: http://localhost:3000/forgot-password
   - You should see a blue debug panel at the top

2. **Check Debug Information**
   - ✅ NEXT_PUBLIC_SUPABASE_URL is set
   - ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set
   - 📍 Redirect URL: http://localhost:3000/auth/callback

3. **Test Forgot Password**
   - Enter a valid email address
   - Click "Send Reset Link"
   - Check browser console for logs

## 🚨 **Common Issues**

### **Issue 1: Still showing "❌ Missing environment variables"**
- **Solution**: Make sure .env.local is in the project root directory
- **Check**: File should be at the same level as package.json

### **Issue 2: "Failed to send reset email"**
- **Solution**: Check Supabase email settings
- **Go to**: Supabase Dashboard > Authentication > Email Templates
- **Enable**: "Reset Password" template

### **Issue 3: "Rate limit exceeded"**
- **Solution**: Wait a few minutes between attempts
- **Check**: Supabase rate limit settings

## 📋 **Quick Checklist**

- [ ] .env.local file created
- [ ] NEXT_PUBLIC_SUPABASE_URL set
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY set
- [ ] Development server restarted
- [ ] Debug panel shows green checkmarks
- [ ] Supabase email templates enabled

## 🆘 **Still Not Working?**

1. **Check Browser Console** (F12)
   - Look for error messages
   - Check Network tab for failed requests

2. **Verify Supabase Project**
   - Make sure project is active
   - Check if API keys are correct

3. **Test with Different Email**
   - Try with a known working email
   - Check if it's a specific email issue

---

**After following these steps, the forgot password functionality should work properly!** 🚀
