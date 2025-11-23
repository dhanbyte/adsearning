import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { getUserFraudScoreAvg, checkNewUserDailyCap } from '@/lib/fraudDetection'

// GET /api/user/overview - Get user dashboard overview
export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDatabase()
    const usersCollection = db.collection('users')
    const userTasksCollection = db.collection('user_tasks')

    // Get user data
    const user = await usersCollection.findOne({ clerkId: userId })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate user age in days
    const userCreatedAt = new Date(user.createdAt)
    const userAgeDays = Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24))

    // Get today's earnings
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayEarnings = await userTasksCollection.aggregate([
      {
        $match: {
          userId: userId,
          status: 'approved',
          completedAt: { $gte: today.toISOString() }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$earnedAmount' }
        }
      }
    ]).toArray()

    const todayTotal = todayEarnings[0]?.total || 0

    // Get total tasks completed
    const totalTasksCompleted = await userTasksCollection.countDocuments({
      userId: userId,
      status: 'approved'
    })

    // Get pending tasks count
    const pendingTasks = await userTasksCollection.countDocuments({
      userId: userId,
      status: { $in: ['pending', 'completed'] }
    })

    // Determine user level
    let level = 'New'
    if (userAgeDays > 30 && totalTasksCompleted > 100) {
      level = 'VIP'
    } else if (userAgeDays > 7 && totalTasksCompleted > 50) {
      level = 'Trusted'
    }

    // Get daily cap info
    const dailyCapInfo = await checkNewUserDailyCap(userId, userAgeDays)

    // Get average fraud score
    const avgFraudScore = await getUserFraudScoreAvg(userId)

    // Get recent tasks (last 5)
    const recentTasks = await userTasksCollection.find({
      userId: userId
    })
    .sort({ openedAt: -1 })
    .limit(5)
    .toArray()

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          balance: user.balance,
          totalEarnings: user.totalEarnings,
          referralCode: user.referralCode,
          createdAt: user.createdAt,
          ageDays: userAgeDays,
          level: level
        },
        stats: {
          todayEarnings: todayTotal,
          totalTasksCompleted: totalTasksCompleted,
          pendingTasks: pendingTasks,
          avgFraudScore: avgFraudScore
        },
        dailyCap: {
          current: dailyCapInfo.currentTotal,
          limit: dailyCapInfo.limit,
          exceeded: dailyCapInfo.exceeded,
          percentage: Math.min(100, (dailyCapInfo.currentTotal / dailyCapInfo.limit) * 100)
        },
        recentTasks: recentTasks.map(task => ({
          id: task._id.toString(),
          status: task.status,
          earnedAmount: task.earnedAmount,
          completedAt: task.completedAt
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching user overview:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
