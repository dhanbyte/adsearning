// Fraud Scoring Engine
// Computes fraud score (0-100) for tasks based on multiple signals

import { getDatabase } from './mongodb'

interface FraudScoreParams {
  userId: string
  taskId: string
  elapsedSeconds: number
  expectedSeconds: number
  ipAddress: string
  deviceHash: string
  hasProof: boolean
  userAgeDays: number
  verifiedTasksCount: number
}

export async function computeFraudScore(params: FraudScoreParams): Promise<number> {
  const {
    userId,
    elapsedSeconds,
    expectedSeconds,
    ipAddress,
    deviceHash,
    hasProof,
    userAgeDays,
    verifiedTasksCount
  } = params

  let score = 0
  const db = await getDatabase()

  // Rule 1: Task completed too quickly (+40 points)
  if (elapsedSeconds < expectedSeconds * 0.3) {
    score += 40
  }

  // Rule 2: Same IP used for multiple accounts (+30 points)
  const sameIpCount = await db.collection('user_devices').countDocuments({
    ip: ipAddress,
    lastSeen: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24h
  })
  if (sameIpCount > 5) {
    score += 30
  }

  // Rule 3: Device fingerprint reused across accounts (+20 points)
  const deviceReuseCount = await db.collection('user_devices').countDocuments({
    deviceHash: deviceHash,
    lastSeen: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
  })
  if (deviceReuseCount > 10) {
    score += 20
  }

  // Rule 4: Missing proof for conditional ads (+10 points)
  if (!hasProof) {
    score += 10
  }

  // Rule 5: Trusted user bonus (-15 points)
  if (userAgeDays > 7 && verifiedTasksCount > 50) {
    score -= 15
  }

  // Clamp score between 0 and 100
  return Math.max(0, Math.min(100, score))
}

// Check if user exceeded daily cap for new users
export async function checkNewUserDailyCap(userId: string, userAgeDays: number): Promise<{ exceeded: boolean; currentTotal: number; limit: number }> {
  const dailyCap = parseInt(process.env.NEW_USER_DAILY_CAP || '200')
  
  // Only apply to users < 48 hours old
  if (userAgeDays >= 2) {
    return { exceeded: false, currentTotal: 0, limit: dailyCap }
  }

  const db = await getDatabase()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Sum earnings from today
  const result = await db.collection('user_tasks').aggregate([
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

  const currentTotal = result[0]?.total || 0

  return {
    exceeded: currentTotal >= dailyCap,
    currentTotal,
    limit: dailyCap
  }
}

// Get average fraud score for a user
export async function getUserFraudScoreAvg(userId: string): Promise<number> {
  const db = await getDatabase()
  
  const result = await db.collection('user_tasks').aggregate([
    {
      $match: {
        userId: userId,
        fraudScore: { $exists: true }
      }
    },
    {
      $group: {
        _id: null,
        avgScore: { $avg: '$fraudScore' }
      }
    }
  ]).toArray()

  return result[0]?.avgScore || 0
}

// Store device fingerprint
export async function storeDeviceFingerprint(
  userId: string,
  ipAddress: string,
  userAgent: string,
  deviceHash: string
): Promise<void> {
  const db = await getDatabase()
  const userDevicesCollection = db.collection('user_devices')

  const uaHash = createSimpleHash(userAgent)

  await userDevicesCollection.updateOne(
    { userId, deviceHash },
    {
      $set: {
        ip: ipAddress,
        uaHash,
        lastSeen: new Date().toISOString()
      },
      $setOnInsert: {
        firstSeen: new Date().toISOString(),
        count: 0
      },
      $inc: { count: 1 }
    },
    { upsert: true }
  )
}

// Simple hash function for UA
function createSimpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(36)
}

// Check if task should be flagged
export function shouldFlagTask(fraudScore: number): boolean {
  const threshold = parseInt(process.env.FRAUD_SCORE_THRESHOLD || '60')
  return fraudScore >= threshold
}

// Log monitoring event
export async function logMonitoringEvent(
  eventType: string,
  severity: 'info' | 'warning' | 'error' | 'critical',
  details: any
): Promise<void> {
  const db = await getDatabase()
  
  await db.collection('monitoring_logs').insertOne({
    eventType,
    severity,
    details,
    timestamp: new Date().toISOString()
  })

  // Send alert for critical events
  if (severity === 'critical') {
    console.error(`[CRITICAL ALERT] ${eventType}:`, details)
    // TODO: Send webhook/email/Slack notification
  }
}

// Check for suspicious traffic spike
export async function checkTrafficSpike(): Promise<{ spike: boolean; increase: number }> {
  const db = await getDatabase()
  
  const now = new Date()
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000)
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000)

  const recentCount = await db.collection('user_tasks').countDocuments({
    openedAt: { $gte: fiveMinutesAgo.toISOString() }
  })

  const previousCount = await db.collection('user_tasks').countDocuments({
    openedAt: { 
      $gte: tenMinutesAgo.toISOString(),
      $lt: fiveMinutesAgo.toISOString()
    }
  })

  if (previousCount === 0) {
    return { spike: false, increase: 0 }
  }

  const increase = ((recentCount - previousCount) / previousCount) * 100

  return {
    spike: increase > 100, // 100% increase = spike
    increase
  }
}
