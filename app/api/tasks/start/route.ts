import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { checkRateLimit, recordTaskStart } from '@/lib/rateLimit'

// POST /api/tasks/start - User starts a task/ad
export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Rate limiting: max 10 task-start per 10 minutes
    const rateLimit = checkRateLimit(userId)
    if (!rateLimit.allowed) {
      const resetInMinutes = Math.ceil(rateLimit.resetIn / 60000)
      return NextResponse.json(
        { 
          success: false, 
          error: `Rate limit exceeded. Please try again in ${resetInMinutes} minutes.`,
          resetIn: rateLimit.resetIn
        },
        { status: 429 }
      )
    }

    const { adId } = await request.json()

    if (!adId) {
      return NextResponse.json(
        { success: false, error: 'Ad ID is required' },
        { status: 400 }
      )
    }

    const db = await getDatabase()
    const adsCollection = db.collection('ads')
    const userTasksCollection = db.collection('user_tasks')

    // Check if ad exists
    const ad = await adsCollection.findOne({ _id: new ObjectId(adId) })

    if (!ad) {
      return NextResponse.json({ error: 'Ad not found' }, { status: 404 })
    }

    if (ad.status !== 'active') {
      return NextResponse.json({ error: 'Ad is not active' }, { status: 400 })
    }

    // Check if user already started this task
    const existingTask = await userTasksCollection.findOne({
      userId: userId,
      adId: new ObjectId(adId),
      status: { $in: ['pending', 'completed'] }
    })

    if (existingTask) {
      return NextResponse.json({ 
        error: 'Task already started or completed',
        taskId: existingTask._id.toString()
      }, { status: 400 })
    }

    // Create new task
    const newTask = {
      userId: userId,
      adId: new ObjectId(adId),
      status: 'pending',
      earnedAmount: 0,
      proofImageUrl: null,
      externalTransactionId: null,
      openedAt: new Date(),
      completedAt: null,
    }

    const result = await userTasksCollection.insertOne(newTask)

    // Record task start time for anti-fraud validation
    recordTaskStart(result.insertedId.toString())

    return NextResponse.json({
      success: true,
      taskId: result.insertedId.toString(),
      ad: {
        id: ad._id.toString(),
        title: ad.title,
        link: ad.link,
        payout: ad.payout,
        category: ad.category,
      },
      message: 'Task started successfully'
    })
  } catch (error) {
    console.error('Error starting task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

