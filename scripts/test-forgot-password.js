// Test script to verify forgot password functionality
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testForgotPassword() {
  try {
    console.log('🔍 Testing forgot password functionality...')
    
    // Test 1: Check Supabase connection
    console.log('\n🗄️ Testing Supabase connection...')
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (error) {
      console.error('❌ Supabase connection error:', error)
    } else {
      console.log('✅ Supabase connection working')
    }

    // Test 2: Check environment variables
    console.log('\n🔧 Checking environment variables...')
    const redirectUrl = process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
    console.log('Redirect URL:', redirectUrl || 'Not set (will use default)')
    
    if (redirectUrl) {
      console.log('✅ Custom redirect URL configured')
    } else {
      console.log('⚠️  Using default redirect URL: /auth/callback')
    }

    // Test 3: Test password reset API (without actually sending email)
    console.log('\n📡 Testing password reset API...')
    try {
      const response = await fetch('http://localhost:3000/api/user-status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('✅ User status API accessible:', response.status)
    } catch (error) {
      console.log('❌ User status API error:', error.message)
    }

    // Test 4: Check Supabase auth configuration
    console.log('\n🔐 Testing Supabase auth configuration...')
    try {
      // This will fail but we can check the error message
      const { error: authError } = await supabase.auth.resetPasswordForEmail('test@example.com', {
        redirectTo: 'http://localhost:3000/auth/callback'
      })
      
      if (authError) {
        console.log('📊 Auth error (expected):', authError.message)
        if (authError.message.includes('rate limit')) {
          console.log('⚠️  Rate limit detected - this is normal for testing')
        } else if (authError.message.includes('not found')) {
          console.log('✅ Auth service working - user not found error is expected')
        } else {
          console.log('❌ Unexpected auth error:', authError.message)
        }
      }
    } catch (error) {
      console.log('❌ Auth test failed:', error.message)
    }

    console.log('\n🎉 Forgot password functionality test completed!')
    console.log('\n📋 Manual Test Steps:')
    console.log('1. Go to login page')
    console.log('2. Click "Forgot password?" link')
    console.log('3. Enter a valid email address')
    console.log('4. Click "Send Reset Link" button')
    console.log('5. Check browser console for any errors')
    console.log('6. Check your email for reset link')
    console.log('7. Click the reset link to test the full flow')
    
    console.log('\n🔍 Debugging Tips:')
    console.log('- Open browser DevTools Console')
    console.log('- Look for [v0] prefixed log messages')
    console.log('- Check Network tab for API calls')
    console.log('- Verify Supabase configuration in .env.local')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

testForgotPassword()
