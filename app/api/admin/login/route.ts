import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const adminEmail = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (email === adminEmail && password === adminPassword) {
      // Set admin session cookie
      const cookieStore = await cookies()
      cookieStore.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })

      return NextResponse.json({
        success: true,
        message: 'Login successful'
      })
    } else {
      return NextResponse.json({
        error: 'Invalid credentials'
      }, { status: 401 })
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({
      error: 'Internal server error'
    }, { status: 500 })
  }
}
