import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

// GET /api/tasks/user/[userId] - Get all tasks for a user
export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: authUserId } = await auth()
    
    if (!authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await params
    
    const db = await getDatabase()
    const userTasksCollection = db.collection('user_tasks')
    const adsCollection = db.collection('ads')

    // Get all tasks for user
    const tasks = await userTasksCollection.find({ user_id: userId }).sort({ task_opened_at: -1 }).toArray()

    // Populate ad details
    const tasksWithAds = await Promise.all(
      tasks.map(async (task) => {
        const ad = await adsCollection.findOne({ _id: task.ad_id })
        return {
          id: task._id.toString(),
          user_id: task.user_id,
          ad: ad ? {
            id: ad._id.toString(),
            title: ad.title,
            category: ad.category,
            payout: ad.payout,
          } : null,
          status: task.status,
          earned_amount: task.earned_amount,
          proof_screenshot_url: task.proof_screenshot_url,
          task_opened_at: task.task_opened_at,
          task_completed_at: task.task_completed_at,
        }
      })
    )

    return NextResponse.json({
      success: true,
      tasks: tasksWithAds
    })
  } catch (error) {
    console.error('Error fetching user tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
