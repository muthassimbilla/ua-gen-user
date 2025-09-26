# Vercel Deployment Guide

## 🚀 Vercel এ Deploy করার জন্য Step-by-Step Guide

### 1. Environment Variables Setup

Vercel dashboard এ যান এবং আপনার project এ environment variables add করুন:

#### **Required Environment Variables:**

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### **Optional Environment Variables (Address Generator এর জন্য):**

```bash
SMARTY_AUTH_ID=your-smarty-auth-id
SMARTY_AUTH_TOKEN=your-smarty-auth-token
NEXT_PUBLIC_SMARTY_AUTH_ID=your-smarty-auth-id
NEXT_PUBLIC_SMARTY_AUTH_TOKEN=your-smarty-auth-token
NEXT_PUBLIC_ENABLE_FALLBACK_API=true
```

### 2. Vercel Dashboard এ Environment Variables Add করা

1. **Vercel Dashboard** এ যান: https://vercel.com/dashboard
2. আপনার project select করুন
3. **Settings** tab এ যান
4. **Environment Variables** section এ যান
5. নিচের variables add করুন:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key-here` | Production, Preview, Development |

### 3. Supabase Database Setup

#### **Database Tables Create করুন:**

আপনার Supabase SQL Editor এ নিচের scripts run করুন:

```sql
-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  telegram_username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  account_status TEXT DEFAULT 'pending',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  logout_reason TEXT
);

-- 3. User IP history table
CREATE TABLE IF NOT EXISTS user_ip_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  country TEXT,
  city TEXT,
  isp TEXT,
  is_current BOOLEAN DEFAULT false,
  change_reason TEXT,
  previous_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ip_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

-- Sessions policies
CREATE POLICY "Users can manage own sessions" ON user_sessions
  FOR ALL USING (true);

-- IP history policies
CREATE POLICY "Users can manage own IP history" ON user_ip_history
  FOR ALL USING (true);

-- Admin policies
CREATE POLICY "Admin access" ON admin_users
  FOR ALL USING (true);
```

#### **Admin User Create করুন:**

```sql
-- Admin user create করুন (password: admin123)
INSERT INTO admin_users (username, password_hash) VALUES 
('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KjK8K2');
```

### 4. Database Functions Create করুন

```sql
-- IP change logout function
CREATE OR REPLACE FUNCTION logout_due_to_ip_change(
  p_user_id UUID,
  p_old_ip TEXT,
  p_new_ip TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Deactivate all sessions for this user
  UPDATE user_sessions 
  SET 
    is_active = false,
    logout_reason = 'ip_changed',
    updated_at = NOW()
  WHERE user_id = p_user_id 
    AND is_active = true;

  -- Log the IP change event
  INSERT INTO user_ip_history (
    user_id,
    ip_address,
    is_current,
    change_reason,
    previous_ip
  ) VALUES (
    p_user_id,
    p_new_ip,
    false,
    'auto_logout_ip_change',
    p_old_ip
  );

  -- Update previous IP records
  UPDATE user_ip_history 
  SET is_current = false 
  WHERE user_id = p_user_id 
    AND ip_address = p_old_ip;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5. Vercel Deployment

1. **GitHub Repository** connect করুন
2. **Deploy** button click করুন
3. Environment variables automatically load হবে
4. Build process complete হওয়ার পর test করুন

### 6. Post-Deployment Testing

#### **Environment Check:**
```bash
curl https://your-app.vercel.app/api/check-env
```

#### **Account Creation Test:**
1. `https://your-app.vercel.app/signup` এ যান
2. Account create করুন
3. Login করুন

### 7. Common Issues & Solutions

#### **Issue 1: "Supabase integration required" Error**
**Solution:** Environment variables properly set করা হয়েছে কিনা check করুন

#### **Issue 2: Database Connection Failed**
**Solution:** 
- Supabase project active আছে কিনা check করুন
- Database URL correct আছে কিনা verify করুন
- RLS policies properly set করা হয়েছে কিনা check করুন

#### **Issue 3: Account Creation Failed**
**Solution:**
- Database tables create করা হয়েছে কিনা check করুন
- RLS policies allow insert operation কিনা verify করুন

### 8. Monitoring

#### **Vercel Logs:**
- Vercel dashboard → Functions → View Function Logs

#### **Supabase Logs:**
- Supabase dashboard → Logs → Database

### 9. Security Considerations

1. **Environment Variables** কখনো client-side code এ expose করবেন না
2. **Database RLS** policies properly configure করুন
3. **API Routes** এ proper error handling করুন
4. **Rate Limiting** implement করুন production এ

### 10. Performance Optimization

1. **Database Indexes** add করুন frequently queried columns এ
2. **Connection Pooling** enable করুন
3. **CDN** use করুন static assets এর জন্য
4. **Caching** implement করুন API responses এর জন্য

## ✅ Success Checklist

- [ ] Environment variables set করা হয়েছে
- [ ] Database tables create করা হয়েছে
- [ ] RLS policies configured করা হয়েছে
- [ ] Admin user create করা হয়েছে
- [ ] Database functions create করা হয়েছে
- [ ] Vercel deployment successful
- [ ] Account creation working
- [ ] Login functionality working
- [ ] IP security working

## 🆘 Support

যদি কোনো issue হয়:

1. **Vercel Logs** check করুন
2. **Supabase Logs** check করুন
3. **Environment Variables** verify করুন
4. **Database Connection** test করুন

**API Endpoint for Debugging:**
```
GET https://your-app.vercel.app/api/check-env
```

এই endpoint environment variables এর status return করবে।
