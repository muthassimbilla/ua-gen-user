// Quick setup script for environment variables
const fs = require('fs')
const path = require('path')

const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback

# Instructions:
# 1. Replace the placeholder values with your actual Supabase credentials
# 2. Get these values from your Supabase project dashboard
# 3. Go to Settings > API in your Supabase dashboard
# 4. Copy the Project URL and anon public key
`

const envPath = path.join(process.cwd(), '.env.local')

try {
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists')
    console.log('📁 Location:', envPath)
    console.log('🔍 Please check if it has the correct Supabase credentials')
  } else {
    // Create .env.local file
    fs.writeFileSync(envPath, envContent)
    console.log('✅ .env.local file created successfully!')
    console.log('📁 Location:', envPath)
    console.log('')
    console.log('🔧 Next steps:')
    console.log('1. Open .env.local file')
    console.log('2. Replace placeholder values with your Supabase credentials')
    console.log('3. Get credentials from: https://supabase.com/dashboard')
    console.log('4. Restart your development server')
  }
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message)
  console.log('')
  console.log('🔧 Manual steps:')
  console.log('1. Create a file named .env.local in your project root')
  console.log('2. Add the following content:')
  console.log('')
  console.log(envContent)
}
