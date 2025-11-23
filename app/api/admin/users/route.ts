import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin_token')

    if (!adminToken || adminToken.value !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDatabase()
    
    const users = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .project({
        _id: 1,
        firstName: 1,
        lastName: 1,
        email: 1,
        balance: 1,
        totalEarnings: 1,
        createdAt: 1,
        clerkId: 1
      })
      .toArray()

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
