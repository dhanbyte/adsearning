import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, upiId } = await request.json()

    // Minimum withdrawal is ₹200
    if (!amount || amount < 200) {
      return NextResponse.json({ 
        success: false,
        error: 'Minimum withdrawal amount is ₹200' 
      }, { status: 400 })
    }

    if (!upiId) {
      return NextResponse.json({ error: 'UPI ID is required' }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection('users')
    const withdrawalsCollection = db.collection('withdrawals')

    // Get user data
    const user = await usersCollection.findOne({ clerkId: userId })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.balance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    // Create withdrawal request
    await withdrawalsCollection.insertOne({
      userId: userId,
      amount: amount,
      method: 'UPI',
      upiId: upiId,
      status: 'pending',
      createdAt: new Date(),
    })

    // Deduct amount from user balance
    await usersCollection.updateOne(
      { clerkId: userId },
      {
        $inc: { balance: -amount },
        $set: { updatedAt: new Date() }
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully'
    })
  } catch (error) {
    console.error('Error processing withdrawal:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

