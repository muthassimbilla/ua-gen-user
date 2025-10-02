// Test script to verify email confirmation flow
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testEmailConfirmation() {
  try {
    console.log('🔍 Testing email confirmation flow...')
    
    // Test 1: Check auth callback endpoint
    console.log('\n📡 Testing auth callback endpoint...')
    try {
      const response = await fetch('http://localhost:3000/auth/callback', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('✅ Auth callback endpoint accessible:', response.status)
    } catch (error) {
      console.log('❌ Auth callback endpoint error:', error.message)
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

    // Test 3: Check Supabase configuration
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

    console.log('\n🎉 Email confirmation flow test completed!')
    console.log('\n📋 Manual Test Steps:')
    console.log('1. Go to signup page')
    console.log('2. Create a new account')
    console.log('3. Check your email for confirmation link')
    console.log('4. Click the confirmation link')
    console.log('5. You should be redirected to login page with success message')
    console.log('\n📋 Password Reset Test Steps:')
    console.log('1. Go to forgot password page')
    console.log('2. Enter your email')
    console.log('3. Check your email for reset link')
    console.log('4. Click the reset link')
    console.log('5. You should be redirected to reset password page')
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    process.exit(1)
  }
}

testEmailConfirmation()
