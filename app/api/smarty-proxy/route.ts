import { NextRequest, NextResponse } from 'next/server'

// Convert fallback API response to Smarty format
function convertFallbackToSmartyFormat(data: any, ip: string) {
  console.log('Converting ipwho.is API response:', data)
  
  // Helper function to create full address
  const createFullAddress = (city: string, state: string, country: string, postal: string) => {
    const parts = [city, state, country].filter(part => part && part !== 'Unknown')
    const address = parts.join(', ')
    return postal && postal !== 'Unknown' ? `${address} ${postal}` : address
  }
  
  // Helper function to create street address (if available)
  const createStreetAddress = (data: any) => {
    const street = data.street || data.streetAddress || data.address || data.road || ''
    const houseNumber = data.houseNumber || data.house_number || data.number || ''
    
    if (street && houseNumber) {
      return `${houseNumber} ${street}`
    } else if (street) {
      return street
    } else if (houseNumber) {
      return houseNumber
    }
    return 'Street address not available'
  }
  
  // Handle ipwho.is API response format
  if (data.success === false) {
    throw new Error(data.message || 'ipwho.is API returned error')
  }
  
  const city = data.city || 'Unknown'
  const state = data.region || data.state || data.regionName || 'Unknown'
  const country = data.country || 'Unknown'
  const postal = data.postal || data.postal_code || data.zip || 'Unknown'
  
  return {
    country: country,
    state_province: state,
    city: city,
    postal_code: postal,
    full_address: createFullAddress(city, state, country, postal),
    street_address: createStreetAddress(data),
    latitude: 0, // Removed coordinates
    longitude: 0, // Removed coordinates
    time_zone: data.timezone || data.time_zone || 'Unknown',
    isp: data.isp || data.org || data.connection?.isp || 'Unknown',
    organization: data.connection?.org || data.organization || data.isp || 'Unknown'
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ip = searchParams.get('ip')
    
    if (!ip) {
      return NextResponse.json({ error: 'IP address is required' }, { status: 400 })
    }

    // For now, skip Smarty API and use fallback APIs directly
    // This will prevent JSON parsing errors
    console.log('Using fallback APIs directly for IP:', ip)
    
    // Use ipwho.is API only
    try {
      console.log(`Using ipwho.is API for IP: ${ip}`)
      
      // Create AbortController for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout
      
      const response = await fetch(`https://ipwho.is/${ip}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        signal: controller.signal,
        // Add additional fetch options
        cache: 'no-cache',
        mode: 'cors',
      })
      
      clearTimeout(timeoutId)
      
      console.log('ipwho.is API Response Status:', response.status)
      console.log('ipwho.is API Response Headers:', Object.fromEntries(response.headers.entries()))
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('ipwho.is API Error Response:', errorText)
        throw new Error(`ipwho.is API failed with status: ${response.status} - ${response.statusText}`)
      }
      
      const contentType = response.headers.get('content-type')
      console.log('ipwho.is API Content-Type:', contentType)
      
      if (!contentType || !contentType.includes('application/json')) {
        const responseText = await response.text()
        console.error('ipwho.is API Invalid Content-Type. Response:', responseText)
        throw new Error(`Invalid content type from ipwho.is API: ${contentType}`)
      }
      
      const data = await response.json()
      console.log('ipwho.is API Success:', data)
      
      // Check if API returned an error
      if (data.success === false) {
        console.error('ipwho.is API returned error:', data.message)
        throw new Error(`ipwho.is API error: ${data.message}`)
      }
      
      // Convert to Smarty format
      const convertedData = convertFallbackToSmartyFormat(data, ip)
      console.log('Converted data:', convertedData)
      
      return NextResponse.json(convertedData)
      
    } catch (error: any) {
      console.error('ipwho.is API error:', error)
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: ipwho.is API took too long to respond')
      } else if (error.message.includes('fetch') || error.message.includes('Network') || error.message.includes('connection')) {
        throw new Error('Network error: Unable to connect to ipwho.is API. Please check your internet connection.')
      } else if (error.message.includes('timeout')) {
        throw new Error('Request timeout: Please try again.')
      } else {
        throw new Error(`ipwho.is API error: ${error.message}`)
      }
    }
    
    return NextResponse.json(
      { error: 'All fallback APIs failed. Please try again later.' },
      { status: 500 }
    )
    
  } catch (error: any) {
    console.error('Proxy Error:', error)
    return NextResponse.json(
      { error: `Proxy error: ${error.message}` },
      { status: 500 }
    )
  }
}
