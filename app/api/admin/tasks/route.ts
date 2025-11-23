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
    
    // Fetch pending tasks
    const tasks = await db.collection('user_tasks')
      .aggregate([
        { $match: { status: 'pending_review' } },
        { $sort: { completedAt: -1 } },
        { $limit: 50 },
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
            taskId: 1,
            adId: 1,
            amount: 1,
            status: 1,
            completedAt: 1,
            fraudScore: 1,
            user: {
              firstName: 1,
              email: 1,
              clerkId: 1
            }
          }
        }
      ])
      .toArray()

    return NextResponse.json({ success: true, tasks })
  } catch (error) {
    console.error('Error fetching admin tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
