import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { cookies } from 'next/headers'
import { ObjectId } from 'mongodb'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('admin_token')

    if (!adminToken || adminToken.value !== process.env.ADMIN_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action } = await request.json()
    const db = await getDatabase()
    const withdrawalId = new ObjectId(params.id)

    const withdrawal = await db.collection('withdrawals').findOne({ _id: withdrawalId })

    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 })
    }

    if (withdrawal.status !== 'pending') {
      return NextResponse.json({ error: 'Withdrawal already processed' }, { status: 400 })
    }

    if (action === 'approve') {
      await db.collection('withdrawals').updateOne(
        { _id: withdrawalId },
        { 
          $set: { 
            status: 'completed',
            processedAt: new Date()
          } 
        }
      )
      return NextResponse.json({ success: true, message: 'Withdrawal approved' })
    } 
    
    if (action === 'reject') {
      // Refund user balance
      await db.collection('users').updateOne(
        { clerkId: withdrawal.userId },
        { $inc: { balance: withdrawal.amount } }
      )

      await db.collection('withdrawals').updateOne(
        { _id: withdrawalId },
        { 
          $set: { 
            status: 'rejected',
            processedAt: new Date()
          } 
        }
      )
      return NextResponse.json({ success: true, message: 'Withdrawal rejected and refunded' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error processing withdrawal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
