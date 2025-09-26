// Test Smarty API credentials and connection
export async function testSmartyAPI() {
  const authId = process.env.NEXT_PUBLIC_SMARTY_AUTH_ID
  const authToken = process.env.NEXT_PUBLIC_SMARTY_AUTH_TOKEN
  
  if (!authId || !authToken) {
    return {
      success: false,
      message: 'Smarty API credentials not configured',
      hasCredentials: false
    }
  }

  try {
    // Test with a known IP address using proxy
    const testIP = '8.8.8.8'
    const proxyUrl = `/api/smarty-proxy?ip=${testIP}`
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      return {
        success: true,
        message: 'Smarty API is working correctly',
        hasCredentials: true,
        data: data
      }
    } else {
      const errorData = await response.json()
      return {
        success: false,
        message: errorData.error || `Smarty API error: ${response.status} ${response.statusText}`,
        hasCredentials: true
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Smarty API connection failed: ${error.message}`,
      hasCredentials: true
    }
  }
}
