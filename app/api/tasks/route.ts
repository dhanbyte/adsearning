import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDatabase()
    const tasksCollection = db.collection('tasks')
    const userTasksCollection = db.collection('userTasks')

    // Get all active tasks
    const allTasks = await tasksCollection.find({ active: true }).toArray()

    // Get user's completed tasks
    const completedTasks = await userTasksCollection.find({ 
      clerkId: userId,
      completed: true 
    }).toArray()

    const completedTaskIds = completedTasks.map(t => t.taskId.toString())

    // Filter out completed tasks
    const availableTasks = allTasks.filter(task => 
      !completedTaskIds.includes(task._id.toString())
    )

    return NextResponse.json({
      success: true,
      tasks: availableTasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        type: task.type,
        reward: task.reward,
        duration: task.duration,
        url: task.url,
        imageUrl: task.imageUrl,
      }))
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { taskId } = await request.json()

    const db = await getDatabase()
    const tasksCollection = db.collection('tasks')
    const userTasksCollection = db.collection('userTasks')
    const usersCollection = db.collection('users')

    // Get task details
    const task = await tasksCollection.findOne({ _id: taskId })
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    // Check if already completed
    const existingCompletion = await userTasksCollection.findOne({
      clerkId: userId,
      taskId: taskId,
      completed: true
    })

    if (existingCompletion) {
      return NextResponse.json({ error: 'Task already completed' }, { status: 400 })
    }

    // Mark task as completed
    await userTasksCollection.insertOne({
      clerkId: userId,
      taskId: taskId,
      completed: true,
      completedAt: new Date(),
      reward: task.reward
    })

    // Update user balance and stats
    await usersCollection.updateOne(
      { clerkId: userId },
      {
        $inc: {
          balance: task.reward,
          totalEarnings: task.reward,
          tasksCompleted: 1,
          adsWatched: task.type === 'ad' ? 1 : 0
        },
        $set: {
          updatedAt: new Date()
        }
      }
    )

    return NextResponse.json({
      success: true,
      reward: task.reward,
      message: `You earned ₹${task.reward}!`
    })
  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
