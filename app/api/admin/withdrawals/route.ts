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
    
    const withdrawals = await db.collection('withdrawals')
      .aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 100 },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'clerkId',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 1,
            amount: 1,
            upiId: 1,
            status: 1,
            createdAt: 1,
            user: {
              firstName: 1,
              email: 1
            }
          }
        }
      ])
      .toArray()

    return NextResponse.json({ success: true, withdrawals })
  } catch (error) {
    console.error('Error fetching withdrawals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
