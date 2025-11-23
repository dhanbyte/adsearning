import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PUT /api/tasks/approve/[id] - Admin approves a task
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check admin session
    const cookieStore = await cookies()
    const adminSession = cookieStore.get('admin_session')

    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    
    const db = await getDatabase()
    const userTasksCollection = db.collection('user_tasks')
    const adsCollection = db.collection('ads')
    const usersCollection = db.collection('users')

    // Get task
    const task = await userTasksCollection.findOne({ _id: new ObjectId(id) })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (task.status === 'approved') {
      return NextResponse.json({ error: 'Task already approved' }, { status: 400 })
    }

    // Get ad details
    const ad = await adsCollection.findOne({ _id: task.ad_id })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    const payout = ad.payout

    // Update task status
    await userTasksCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'approved',
          earned_amount: payout,
        }
      }
    )

    // Update user balance
    await usersCollection.updateOne(
      { clerkId: task.user_id },
      {
        $inc: {
          balance: payout,
          totalEarnings: payout,
        },
        $set: {
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Task approved successfully',
      payout: payout
    })
  } catch (error) {
    console.error('Error approving task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
