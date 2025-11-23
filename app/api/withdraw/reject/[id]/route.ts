import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PUT /api/withdraw/reject/[id] - Admin rejects withdrawal
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
    const withdrawalsCollection = db.collection('withdrawals')
    const usersCollection = db.collection('users')

    // Get withdrawal
    const withdrawal = await withdrawalsCollection.findOne({ _id: new ObjectId(id) })

    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 })
    }

    if (withdrawal.status === 'rejected') {
      return NextResponse.json({ error: 'Withdrawal already rejected' }, { status: 400 })
    }

    // Update withdrawal status
    await withdrawalsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'rejected',
          processedAt: new Date(),
          rejection_reason: reason || 'Withdrawal request rejected',
        }
      }
    )

    // Refund amount to user balance
    await usersCollection.updateOne(
      { clerkId: withdrawal.clerkId },
      {
        $inc: { balance: withdrawal.amount },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Withdrawal rejected and amount refunded to user'
    })
  } catch (error) {
    console.error('Error rejecting withdrawal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
