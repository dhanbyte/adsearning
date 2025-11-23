import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

// GET /api/withdraw/user/[userId] - Get withdrawal history for user
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
    const withdrawalsCollection = db.collection('withdrawals')

    const withdrawals = await withdrawalsCollection
      .find({ clerkId: userId })
      .sort({ created_at: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      withdrawals: withdrawals.map(w => ({
        id: w._id.toString(),
        amount: w.amount,
        method: w.method || 'UPI',
        upi_id: w.upiId,
        status: w.status,
        created_at: w.requestedAt || w.created_at,
        processed_at: w.processedAt,
      }))
    })
  } catch (error) {
    console.error('Error fetching withdrawals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
