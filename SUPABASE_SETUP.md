# Supabase Setup Guide

## সমস্যা: auth.users টেবিল তৈরি হচ্ছে না

আপনার প্রজেক্টে `auth.users` টেবিল তৈরি হচ্ছে না কারণ Supabase সঠিকভাবে কনফিগার করা হয়নি।

## সমাধান:

### ১. Supabase প্রজেক্ট তৈরি করুন

1. [Supabase Dashboard](https://supabase.com/dashboard) এ যান
2. "New Project" ক্লিক করুন
3. আপনার প্রজেক্টের নাম দিন
4. একটি ডেটাবেস পাসওয়ার্ড সেট করুন
5. আপনার রিজিয়ন নির্বাচন করুন

### ২. Environment Variables সেট করুন

`.env.local` ফাইল তৈরি করুন এবং নিম্নলিখিত ভ্যারিয়েবল যোগ করুন:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/login
```

### ৩. Database Schema সেটআপ করুন

Supabase Dashboard এ যান:
1. **SQL Editor** এ যান
2. `scripts/` ফোল্ডার থেকে SQL ফাইলগুলো চালান:
   - `001_create_profiles_table.sql`
   - `002_create_user_sessions_table.sql`
   - `003_create_user_ip_history_table.sql`
   - `004_create_admins_table.sql`
   - `005_insert_default_admin.sql`
   - `009_setup_profile_trigger.sql`
   - `010_fix_profile_creation.sql`

### ৪. Authentication সেটিংস

Supabase Dashboard এ:
1. **Authentication** > **Settings** এ যান
2. **Site URL** সেট করুন: `http://localhost:3000`
3. **Redirect URLs** এ যোগ করুন: `http://localhost:3000/login`

### ৫. Email Authentication সেটআপ

1. **Authentication** > **Settings** > **Email** এ যান
2. **Enable email confirmations** চেক করুন
3. **SMTP settings** কনফিগার করুন (ঐচ্ছিক)

## গুরুত্বপূর্ণ নোট:

- `auth.users` টেবিল Supabase দ্বারা স্বয়ংক্রিয়ভাবে তৈরি হয়
- আপনার SQL স্ক্রিপ্টগুলো শুধুমাত্র `public.profiles` টেবিল তৈরি করে
- `auth.users` টেবিলে রেফারেন্স করার জন্য `profiles` টেবিল তৈরি করা হয়

## পরীক্ষা:

সেটআপ সম্পূর্ণ হওয়ার পর:
1. `npm run dev` চালান
2. `/signup` পেজে যান
3. একটি নতুন অ্যাকাউন্ট তৈরি করুন
4. Supabase Dashboard এ **Authentication** > **Users** এ যান
5. আপনার নতুন ইউজার দেখতে পাবেন

## সমস্যা সমাধান:

যদি এখনও সমস্যা থাকে:
1. Environment variables সঠিক কিনা চেক করুন
2. Supabase প্রজেক্ট সক্রিয় কিনা চেক করুন
3. Browser console এ error messages দেখুন
4. Network tab এ API calls চেক করুন
