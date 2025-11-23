import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// POST /api/tasks/complete - User completes a task
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { task_id, proof_screenshot_url } = await request.json()

    if (!task_id) {
      return NextResponse.json({ error: 'Task ID is required' }, { status: 400 })
    }

    const db = await getDatabase()
    const userTasksCollection = db.collection('user_tasks')
    const adsCollection = db.collection('ads')
    const usersCollection = db.collection('users')

    // Get task
    const task = await userTasksCollection.findOne({ 
      _id: new ObjectId(task_id),
      user_id: userId 
    })

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (task.status === 'completed') {
      return NextResponse.json({ error: 'Task already completed' }, { status: 400 })
    }

    // Get ad details
    const ad = await adsCollection.findOne({ _id: task.ad_id })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    // Update task based on category
    let updateData: any = {
      task_completed_at: new Date(),
      proof_screenshot_url: proof_screenshot_url || null,
    }

    // Handle different ad categories
    if (ad.category === 'view_only') {
      // View only - no earning, auto approve
      updateData.status = 'approved'
      updateData.earned_amount = 0
    } else if (ad.category === 'earnable') {
      // Earnable - needs admin approval
      updateData.status = 'completed'
      updateData.earned_amount = 0 // Will be set on approval
    } else if (ad.category === 'conditional') {
      // Conditional - needs admin verification
      updateData.status = 'completed'
      updateData.earned_amount = 0 // Will be set on approval
    }

    await userTasksCollection.updateOne(
      { _id: new ObjectId(task_id) },
      { $set: updateData }
    )

    // Update user stats
    await usersCollection.updateOne(
      { clerkId: userId },
      {
        $inc: { 
          adsWatched: 1,
          tasksCompleted: 1 
        },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({
      success: true,
      message: ad.category === 'view_only' 
        ? 'Task completed! No earning for view-only ads.' 
        : 'Task submitted! Waiting for admin approval.',
      status: updateData.status,
      payout: ad.payout,
      category: ad.category
    })
  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
