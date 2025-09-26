# Vercel Deployment Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. Account Creation Failed on Vercel

#### **Symptoms:**
- Signup page loads but account creation fails
- Error: "Supabase integration required"
- Error: "Failed to create account"

#### **Solutions:**

##### **Step 1: Check Environment Variables**
\`\`\`bash
# Test environment variables
curl https://your-app.vercel.app/api/check-env
\`\`\`

**Expected Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "isConfigured": true,
    "hasUrl": true,
    "hasKey": true,
    "urlPreview": "https://your-project.supabase.co...",
    "keyPreview": "eyJhbGciOi...",
    "environment": "production",
    "platform": "Vercel"
  }
}
\`\`\`

**If `isConfigured: false`:**
1. Vercel Dashboard → Settings → Environment Variables
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy the application

##### **Step 2: Verify Supabase Configuration**
1. Go to Supabase Dashboard
2. Check if project is active
3. Verify URL and anon key match environment variables
4. Check if database is accessible

##### **Step 3: Check Database Tables**
Run in Supabase SQL Editor:
\`\`\`sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'user_sessions', 'user_ip_history', 'admin_users');
\`\`\`

##### **Step 4: Check RLS Policies**
\`\`\`sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'user_sessions', 'user_ip_history');
\`\`\`

### 2. Database Connection Issues

#### **Symptoms:**
- "Supabase not available" error
- Database queries failing
- Connection timeout

#### **Solutions:**

##### **Step 1: Check Supabase Project Status**
1. Supabase Dashboard → Settings → General
2. Ensure project is not paused
3. Check if billing is up to date

##### **Step 2: Verify Database URL Format**
\`\`\`
Correct: https://your-project-id.supabase.co
Wrong: https://your-project.supabase.co
Wrong: your-project-id.supabase.co
\`\`\`

##### **Step 3: Check API Key Permissions**
1. Supabase Dashboard → Settings → API
2. Ensure anon key has proper permissions
3. Check if RLS is properly configured

### 3. RLS (Row Level Security) Issues

#### **Symptoms:**
- "Permission denied" errors
- Data not visible after creation
- Insert/Update operations failing

#### **Solutions:**

##### **Step 1: Disable RLS Temporarily (for testing)**
\`\`\`sql
-- Disable RLS for testing
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_ip_history DISABLE ROW LEVEL SECURITY;
\`\`\`

##### **Step 2: Create Proper RLS Policies**
\`\`\`sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ip_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_sessions" ON user_sessions FOR ALL USING (true);
CREATE POLICY "Allow all operations on user_ip_history" ON user_ip_history FOR ALL USING (true);
\`\`\`

### 4. Build Errors on Vercel

#### **Symptoms:**
- Build fails during deployment
- TypeScript errors
- Missing dependencies

#### **Solutions:**

##### **Step 1: Check Build Logs**
1. Vercel Dashboard → Deployments
2. Click on failed deployment
3. Check build logs for specific errors

##### **Step 2: Fix TypeScript Errors**
\`\`\`bash
# Run locally to check for errors
npm run build
\`\`\`

##### **Step 3: Update Dependencies**
\`\`\`bash
# Update all dependencies
npm update

# Or install specific versions
npm install @supabase/supabase-js@latest
\`\`\`

### 5. Environment Variables Not Loading

#### **Symptoms:**
- Environment variables showing as undefined
- Different behavior between local and production

#### **Solutions:**

##### **Step 1: Check Variable Names**
Ensure exact spelling:
- `NEXT_PUBLIC_SUPABASE_URL` (not `SUPABASE_URL`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (not `SUPABASE_ANON_KEY`)

##### **Step 2: Check Environment Scope**
In Vercel Dashboard:
- Production: ✅
- Preview: ✅  
- Development: ✅

### 6. CORS Issues

#### **Symptoms:**
- "CORS policy" errors
- API calls failing from browser

#### **Solutions:**

##### **Step 1: Check Supabase CORS Settings**
1. Supabase Dashboard → Settings → API
2. Add your Vercel domain to allowed origins
3. Or use wildcard: `*`

##### **Step 2: Use API Routes for External Calls**
Create API routes for external API calls to avoid CORS issues.

### 7. Performance Issues

#### **Symptoms:**
- Slow page loads
- Timeout errors
- High response times

#### **Solutions:**

##### **Step 1: Check Database Performance**
\`\`\`sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
\`\`\`

##### **Step 2: Add Database Indexes**
\`\`\`sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_users_telegram_username ON users(telegram_username);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
\`\`\`

##### **Step 3: Optimize Queries**
- Use `select()` to limit returned columns
- Add `limit()` to prevent large result sets
- Use proper `where` clauses

### 8. Debugging Tools

#### **Environment Check API**
\`\`\`bash
curl https://your-app.vercel.app/api/check-env
\`\`\`

#### **Vercel Function Logs**
1. Vercel Dashboard → Functions
2. Click on function name
3. View real-time logs

#### **Supabase Logs**
1. Supabase Dashboard → Logs
2. Filter by Database or API
3. Check for errors

### 9. Quick Fixes

#### **Reset Everything:**
1. Delete all environment variables
2. Add them again with correct values
3. Redeploy application
4. Test account creation

#### **Database Reset:**
1. Drop all tables
2. Recreate tables with proper RLS
3. Create admin user
4. Test functionality

#### **Complete Redeploy:**
1. Delete Vercel project
2. Reconnect GitHub repository
3. Add environment variables
4. Deploy fresh

### 10. Prevention Tips

1. **Always test locally first** with same environment variables
2. **Use environment-specific configurations**
3. **Monitor logs regularly**
4. **Keep dependencies updated**
5. **Use proper error handling**
6. **Test all functionality after deployment**

## 🆘 Emergency Contacts

- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **GitHub Issues:** Create issue in your repository

## 📊 Monitoring Checklist

- [ ] Environment variables configured
- [ ] Database accessible
- [ ] RLS policies working
- [ ] Account creation working
- [ ] Login working
- [ ] IP security working
- [ ] No CORS errors
- [ ] Performance acceptable
- [ ] Logs clean
- [ ] All features functional
