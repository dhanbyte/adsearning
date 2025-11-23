import { NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import crypto from 'crypto'
import { ObjectId } from 'mongodb'
import { logMonitoringEvent } from '@/lib/fraudDetection'

const CPALEAD_SECRET = process.env.POSTBACK_SECRET_CPALEAD || process.env.CPALEAD_SECRET || ''
const AUTO_APPROVE = process.env.AUTO_APPROVE_TRUSTED_POSTBACKS === 'true'

// POST /api/postback/cpalead - Handle CPALead postback with full idempotency
export async function POST(request: Request) {
  const startTime = Date.now()
  
  try {
    const body = await request.json()
    const { 
      user_id,       // subid (Clerk ID)
      transaction_id, // external_id
      amount, 
      currency,
      offer_name,
      signature 
    } = body

    // Log full postback payload for audit
    const db = await getDatabase()
    const postbackLogsCollection = db.collection('postback_logs')
    
    await postbackLogsCollection.insertOne({
      provider: 'cpalead',
      payload: body,
      receivedAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })

    // Validate required fields
    if (!user_id || !transaction_id || !amount) {
      await logMonitoringEvent('postback_invalid_params', 'warning', { body })
      return NextResponse.json(
        { success: false, error: 'Missing required fields: user_id, transaction_id, amount' },
        { status: 400 }
      )
    }

    // Validate signature (HMAC-SHA256)
    if (signature && CPALEAD_SECRET) {
      const expectedSignature = crypto
        .createHmac('sha256', CPALEAD_SECRET)
        .update(`${user_id}${transaction_id}${amount}`)
        .digest('hex')

      if (signature !== expectedSignature) {
        await logMonitoringEvent('postback_invalid_signature', 'error', {
          user_id,
          transaction_id,
          expected: expectedSignature,
          received: signature
        })
        
        return NextResponse.json(
          { success: false, error: 'Invalid signature' },
          { status: 403 }
        )
      }
    }

    const userTasksCollection = db.collection('user_tasks')
    const usersCollection = db.collection('users')

    // IDEMPOTENCY CHECK: Check if transaction already processed
    const existingTask = await userTasksCollection.findOne({
      externalTransactionId: transaction_id
    })

    if (existingTask) {
      return NextResponse.json({
        success: true,
        status: 'already_processed',
        message: 'Transaction already processed',
        data: {
          taskId: existingTask._id.toString(),
          status: existingTask.status,
          processedAt: existingTask.completedAt
        }
      })
    }

    // Get user
    const user = await usersCollection.findOne({ clerkId: user_id })

    if (!user) {
      await logMonitoringEvent('postback_user_not_found', 'warning', { user_id, transaction_id })
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    const earnedAmount = parseFloat(amount) || 0

    // Create task entry with status 'approved' (trusted postback)
    const newTask = {
      userId: user_id,
      adId: null, // External offer, no internal ad
      status: AUTO_APPROVE ? 'approved' : 'completed', // Auto-approve if enabled
      earnedAmount: AUTO_APPROVE ? earnedAmount : 0,
      proofImageUrl: null,
      externalTransactionId: transaction_id,
      provider: 'cpalead',
      offerName: offer_name || 'External Offer',
      currency: currency || 'USD',
      fraudScore: 0, // Trusted postback = 0 fraud score
      flagged: false,
      openedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    }

    // Insert task with unique constraint on externalTransactionId
    let taskResult
    try {
      taskResult = await userTasksCollection.insertOne(newTask)
    } catch (error: any) {
      // Duplicate key error (race condition) - treat as already processed
      if (error.code === 11000) {
        return NextResponse.json({
          success: true,
          status: 'already_processed',
          message: 'Transaction already processed (race condition caught)'
        })
      }
      throw error
    }

    // Update user balance (only if auto-approve enabled)
    if (AUTO_APPROVE) {
      await usersCollection.updateOne(
        { clerkId: user_id },
        {
          $inc: {
            balance: earnedAmount,
            totalEarnings: earnedAmount
          },
          $set: {
            updatedAt: new Date().toISOString()
          }
        }
      )
    }

    // Log successful postback
    await logMonitoringEvent('postback_success', 'info', {
      user_id,
      transaction_id,
      amount: earnedAmount,
      auto_approved: AUTO_APPROVE,
      processingTime: Date.now() - startTime
    })

    return NextResponse.json({
      success: true,
      status: AUTO_APPROVE ? 'approved' : 'pending_review',
      message: AUTO_APPROVE ? 'Postback processed and credited' : 'Postback received, pending review',
      data: {
        taskId: taskResult.insertedId.toString(),
        userId: user_id,
        transactionId: transaction_id,
        earnedAmount: AUTO_APPROVE ? earnedAmount : 0,
        newBalance: AUTO_APPROVE ? (user.balance + earnedAmount) : user.balance
      }
    })

  } catch (error) {
    console.error('Postback error:', error)
    await logMonitoringEvent('postback_error', 'critical', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/postback/cpalead - For testing (query params)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  
  const user_id = searchParams.get('user_id')
  const transaction_id = searchParams.get('transaction_id')
  const amount = searchParams.get('amount')
  const currency = searchParams.get('currency')
  const offer_name = searchParams.get('offer_name')
  const signature = searchParams.get('signature')

  if (!user_id || !transaction_id || !amount) {
    return NextResponse.json(
      { success: false, error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  // Process same as POST
  return POST(new Request(request.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, transaction_id, amount, currency, offer_name, signature })
  }))
}
