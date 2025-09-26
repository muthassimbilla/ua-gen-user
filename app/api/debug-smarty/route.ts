import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authId = process.env.SMARTY_AUTH_ID || process.env.NEXT_PUBLIC_SMARTY_AUTH_ID
    const authToken = process.env.SMARTY_AUTH_TOKEN || process.env.NEXT_PUBLIC_SMARTY_AUTH_TOKEN
    
    const debugInfo = {
      hasServerCredentials: {
        SMARTY_AUTH_ID: !!process.env.SMARTY_AUTH_ID,
        SMARTY_AUTH_TOKEN: !!process.env.SMARTY_AUTH_TOKEN,
      },
      hasClientCredentials: {
        NEXT_PUBLIC_SMARTY_AUTH_ID: !!process.env.NEXT_PUBLIC_SMARTY_AUTH_ID,
        NEXT_PUBLIC_SMARTY_AUTH_TOKEN: !!process.env.NEXT_PUBLIC_SMARTY_AUTH_TOKEN,
      },
      resolvedCredentials: {
        authId: !!authId,
        authToken: !!authToken,
        authIdLength: authId?.length || 0,
        authTokenLength: authToken?.length || 0,
      },
      environment: process.env.NODE_ENV,
    }
    
    console.log('Smarty API Debug Info:', debugInfo)
    
    return NextResponse.json({
      success: true,
      message: 'Debug information retrieved',
      data: debugInfo
    })
    
  } catch (error: any) {
    console.error('Debug Error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: `Debug error: ${error.message}` 
      },
      { status: 500 }
    )
  }
}
