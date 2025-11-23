import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDatabase } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

// PUT /api/withdraw/approve/[id] - Admin approves withdrawal
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
    const { transaction_id } = body
    
    const db = await getDatabase()
    const withdrawalsCollection = db.collection('withdrawals')

    // Get withdrawal
    const withdrawal = await withdrawalsCollection.findOne({ _id: new ObjectId(id) })

    if (!withdrawal) {
      return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 })
    }

    if (withdrawal.status === 'approved') {
      return NextResponse.json({ error: 'Withdrawal already approved' }, { status: 400 })
    }

    // Update withdrawal status
    await withdrawalsCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'approved',
          processedAt: new Date(),
          transaction_id: transaction_id || null,
        }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Withdrawal approved successfully'
    })
  } catch (error) {
    console.error('Error approving withdrawal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
