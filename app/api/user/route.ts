import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await currentUser()
    const db = await getDatabase()
    const usersCollection = db.collection('users')

    // Check if user exists in database
    let dbUser = await usersCollection.findOne({ clerkId: userId })

    // If user doesn't exist, create them
    if (!dbUser) {
      const newUser = {
        clerkId: userId,
        email: user?.emailAddresses[0]?.emailAddress || '',
        name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User',
        phone: user?.phoneNumbers?.[0]?.phoneNumber || null,
        referralCode: generateReferralCode(),
        referredBy: null,
        totalEarnings: 0,
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const result = await usersCollection.insertOne(newUser)
      dbUser = await usersCollection.findOne({ _id: result.insertedId })
    }

    if (!dbUser) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: dbUser._id,
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        name: dbUser.name,
        phone: dbUser.phone,
        balance: dbUser.balance,
        totalEarnings: dbUser.totalEarnings,
        referralCode: dbUser.referralCode,
        referredBy: dbUser.referredBy,
        createdAt: dbUser.createdAt,
        updatedAt: dbUser.updatedAt,
      }
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}
