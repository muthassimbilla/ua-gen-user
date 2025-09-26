// Smarty API integration for address generation
const SMARTY_API_BASE_URL = 'https://us-reverse-geocoding.api.smarty.com/lookup'
const SMARTY_AUTH_ID = process.env.NEXT_PUBLIC_SMARTY_AUTH_ID
const SMARTY_AUTH_TOKEN = process.env.NEXT_PUBLIC_SMARTY_AUTH_TOKEN

export interface SmartyAddressData {
  ip: string
  country: string
  region: string
  city: string
  postal_code: string
  full_address: string
  street_address: string
  latitude: number
  longitude: number
  timezone: string
  isp: string
  organization: string
}

export class SmartyAPI {
  private static async makeRequest(ip: string): Promise<any> {
    if (!SMARTY_AUTH_ID || !SMARTY_AUTH_TOKEN) {
      throw new Error('Smarty API credentials not configured')
    }

    // Use proxy endpoint to avoid CORS issues
    const proxyUrl = `/api/smarty-proxy?ip=${encodeURIComponent(ip)}`
    
    try {
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Smarty API Error Response:', errorData)
        throw new Error(errorData.error || `Smarty API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Smarty API Response:', data)
      return data
    } catch (error: any) {
      console.error('Smarty API Network Error:', error)
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Unable to connect to Smarty API. Please check your internet connection and try again.')
      }
      throw error
    }
  }

  static async getAddressFromIP(ip: string): Promise<SmartyAddressData> {
    try {
      const data = await this.makeRequest(ip)
      
      // Parse Smarty API response - it returns an array
      const result = Array.isArray(data) ? data[0] : data
      
      if (!result) {
        throw new Error('No location data found for this IP address')
      }

      console.log('Parsed Smarty API Result:', result)

      const city = result.city || 'Unknown'
      const state = result.state_province || result.region || result.state || 'Unknown'
      const country = result.country || result.country_name || 'Unknown'
      const postal = result.postal_code || result.postal || result.zipcode || 'Unknown'
      
      return {
        ip: ip,
        country: country,
        region: state,
        city: city,
        postal_code: postal,
        full_address: `${city}, ${state}, ${country} ${postal}`.replace(/Unknown/g, '').replace(/,\s*,/g, ',').trim(),
        street_address: 'Street address not available',
        latitude: parseFloat(result.latitude) || 0,
        longitude: parseFloat(result.longitude) || 0,
        timezone: result.time_zone || result.timezone || 'Unknown',
        isp: result.isp || result.organization || 'Unknown',
        organization: result.organization || result.isp || 'Unknown'
      }
    } catch (error: any) {
      console.error('Smarty API Error:', error)
      throw new Error(`Failed to fetch address data: ${error.message}`)
    }
  }

  // Fallback method using free IP geolocation API
  static async getAddressFromIPFallback(ip: string): Promise<SmartyAddressData> {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()

      if (data.error) {
        throw new Error(data.reason || 'Failed to fetch location data')
      }

      const city = data.city || 'Unknown'
      const state = data.region || 'Unknown'
      const country = data.country_name || 'Unknown'
      const postal = data.postal || 'Unknown'
      
      return {
        ip: ip,
        country: country,
        region: state,
        city: city,
        postal_code: postal,
        full_address: `${city}, ${state}, ${country} ${postal}`.replace(/Unknown/g, '').replace(/,\s*,/g, ',').trim(),
        street_address: 'Street address not available',
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0,
        timezone: data.timezone || 'Unknown',
        isp: data.org || 'Unknown',
        organization: data.org || 'Unknown'
      }
    } catch (error: any) {
      console.error('Fallback API Error:', error)
      throw new Error(`Failed to fetch address data: ${error.message}`)
    }
  }
}
