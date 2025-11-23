import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    // Check admin session
    const cookieStore = await cookies()
    const adminSession = cookieStore.get('admin_session')

    if (!adminSession || adminSession.value !== 'true') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const db = await getDatabase()
    const usersCollection = db.collection('users')
    const adsCollection = db.collection('ads')
    const userTasksCollection = db.collection('user_tasks')
    const withdrawalsCollection = db.collection('withdrawals')

    // Get total users
    const totalUsers = await usersCollection.countDocuments()

    // Get total earnings distributed
    const earningsResult = await usersCollection.aggregate([
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: '$totalEarnings' }
        }
      }
    ]).toArray()

    const totalEarningsDistributed = earningsResult[0]?.totalEarnings || 0

    // Get total active ads
    const totalActiveAds = await adsCollection.countDocuments({ status: 'active' })

    // Get pending tasks count
    const pendingTasks = await userTasksCollection.countDocuments({ 
      status: { $in: ['pending', 'completed'] } 
    })

    // Get pending withdrawals count
    const pendingWithdrawals = await withdrawalsCollection.countDocuments({ 
      status: 'pending' 
    })

    // Get total tasks completed
    const totalTasksCompleted = await userTasksCollection.countDocuments({
      status: 'approved'
    })

    // Get total withdrawals amount
    const withdrawalsResult = await withdrawalsCollection.aggregate([
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: null,
          totalWithdrawn: { $sum: '$amount' }
        }
      }
    ]).toArray()

    const totalWithdrawn = withdrawalsResult[0]?.totalWithdrawn || 0

    // Get recent stats (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const newUsersLast7Days = await usersCollection.countDocuments({
      createdAt: { $gte: sevenDaysAgo.toISOString() }
    })

    const tasksLast7Days = await userTasksCollection.countDocuments({
      openedAt: { $gte: sevenDaysAgo.toISOString() }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalEarningsDistributed,
        totalActiveAds,
        pendingTasks,
        pendingWithdrawals,
        totalTasksCompleted,
        totalWithdrawn,
        recentStats: {
          newUsersLast7Days,
          tasksLast7Days
        }
      }
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

