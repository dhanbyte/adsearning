// Rate limiting utility for anti-fraud protection
// Max 10 task-start per 10 minutes per user

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

const RATE_LIMIT_WINDOW = 10 * 60 * 1000 // 10 minutes in milliseconds
const MAX_REQUESTS = 10

export function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now()
  const entry = rateLimitMap.get(userId)

  // If no entry or reset time passed, create new entry
  if (!entry || now >= entry.resetTime) {
    rateLimitMap.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    
    return {
      allowed: true,
      remaining: MAX_REQUESTS - 1,
      resetIn: RATE_LIMIT_WINDOW
    }
  }

  // Check if limit exceeded
  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now
    }
  }

  // Increment count
  entry.count++
  rateLimitMap.set(userId, entry)

  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetIn: entry.resetTime - now
  }
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [userId, entry] of rateLimitMap.entries()) {
    if (now >= entry.resetTime) {
      rateLimitMap.delete(userId)
    }
  }
}, 60 * 1000) // Clean up every minute

// IP-based rate limiting
const ipRateLimitMap = new Map<string, RateLimitEntry>()

export function checkIPRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const entry = ipRateLimitMap.get(ip)

  if (!entry || now >= entry.resetTime) {
    ipRateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    })
    return { allowed: true, remaining: MAX_REQUESTS - 1 }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  ipRateLimitMap.set(ip, entry)

  return { allowed: true, remaining: MAX_REQUESTS - entry.count }
}

// Task completion time validation (anti-fraud)
const taskStartTimes = new Map<string, number>()

export function recordTaskStart(taskId: string): void {
  taskStartTimes.set(taskId, Date.now())
}

export function validateTaskCompletion(taskId: string, minDuration: number = 3000): { valid: boolean; duration: number } {
  const startTime = taskStartTimes.get(taskId)
  
  if (!startTime) {
    return { valid: false, duration: 0 }
  }

  const duration = Date.now() - startTime
  taskStartTimes.delete(taskId) // Clean up

  return {
    valid: duration >= minDuration,
    duration
  }
}

// Clean up task start times periodically
setInterval(() => {
  const now = Date.now()
  const maxAge = 30 * 60 * 1000 // 30 minutes
  
  for (const [taskId, startTime] of taskStartTimes.entries()) {
    if (now - startTime > maxAge) {
      taskStartTimes.delete(taskId)
    }
  }
}, 5 * 60 * 1000) // Clean up every 5 minutes
