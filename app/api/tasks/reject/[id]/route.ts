import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PUT /api/tasks/reject/[id] - Admin rejects a task
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
    const body = await request.json()
    const { reason } = body
    
    const db = await getDatabase()
    const userTasksCollection = db.collection('user_tasks')

    // Get task
    const task = await userTasksCollection.findOne({ _id: new ObjectId(id) })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (task.status === 'rejected') {
      return NextResponse.json({ error: 'Task already rejected' }, { status: 400 })
    }

    // Update task status
    await userTasksCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'rejected',
          earned_amount: 0,
          rejection_reason: reason || 'Task did not meet requirements',
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Task rejected successfully'
    })
  } catch (error) {
    console.error('Error rejecting task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
