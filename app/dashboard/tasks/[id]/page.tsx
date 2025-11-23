"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, CheckCircle, Clock, ExternalLink, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import AutoAd from '@/components/AutoAd'
import { useUser } from '@clerk/nextjs'

interface TaskPageProps {
  params: {
    id: string
  }
}

export default function TaskPage({ params }: TaskPageProps) {
  const { id: adId } = params
  const router = useRouter()
  const { user } = useUser()
  
  const [loading, setLoading] = useState(true)
  const [ad, setAd] = useState<any>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [timer, setTimer] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [status, setStatus] = useState<'loading' | 'ready' | 'running' | 'completed' | 'submitting'>('loading')
  const [error, setError] = useState<string | null>(null)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchAdDetails()
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [adId])

  const fetchAdDetails = async () => {
    try {
      const response = await fetch(`/api/ads/${adId}`)
      const data = await response.json()
      
      if (data.success) {
        setAd(data.ad)
        setTimer(data.ad.timeRequired || 30)
        setTimeLeft(data.ad.timeRequired || 30)
        setStatus('ready')
      } else {
        setError(data.error || 'Failed to load task')
      }
    } catch (err) {
      setError('Failed to load task details')
    } finally {
      setLoading(false)
    }
  }

  const getDeviceFingerprint = async () => {
    // Simple client-side fingerprint
    const ua = navigator.userAgent
    const screenRes = `${window.screen.width}x${window.screen.height}`
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const fingerprint = `${ua}-${screenRes}-${timezone}`
    
    // Hash it
    const msgBuffer = new TextEncoder().encode(fingerprint)
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    return hashHex
  }

  const startTask = async () => {
    if (!user) return

    try {
      setStatus('loading')
      const deviceHash = await getDeviceFingerprint()

      const response = await fetch('/api/tasks/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          adId,
          deviceHash 
        })
      })

      const data = await response.json()

      if (data.success) {
        setTaskId(data.taskId)
        setStatus('running')
        
        // Open ad in new tab
        window.open(data.ad.link, '_blank')
        
        // Start timer
        startTimer()
        
        toast.success('Task started! Watch the ad to earn.')
      } else {
        if (response.status === 429) {
          setError(`Rate limit exceeded. Try again in ${Math.ceil(data.resetIn / 60000)} minutes.`)
        } else {
          setError(data.error || 'Failed to start task')
        }
        setStatus('ready')
      }
    } catch (err) {
      setError('Failed to start task')
      setStatus('ready')
    }
  }

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setStatus('completed')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const completeTask = async () => {
    if (!taskId) return

    try {
      setStatus('submitting')
      
      const response = await fetch('/api/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskId
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success(`Task completed! You earned ₹${data.payout}`)
        router.push('/dashboard/wallet')
      } else {
        setError(data.error || 'Failed to complete task')
        setStatus('completed')
      }
    } catch (err) {
      setError('Failed to submit task')
      setStatus('completed')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6">
        <Card className="bg-red-900/20 border-red-500/50 p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Button onClick={() => router.back()} variant="outline">
            Go Back
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6">
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">{ad.title}</h1>
            <p className="text-gray-400">{ad.description}</p>
          </div>

          {/* Ad Banner Section */}
          <div className="mb-8 flex flex-col items-center gap-4">
            {/* Top Ad 320x50 */}
            <AutoAd codeId="t1" keyCode="76d089bf9465d6453c0a73e0808b0f37" width={320} height={50} />

            {/* Video Ad Placeholder */}
            <div className="video-box w-full max-w-sm aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-700">
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Video Ad Loading...</p>
              </div>
              {/* Reward Ad 300x250 */}
              <div className="z-10">
                <AutoAd codeId="reward1" keyCode="e35abebc542f6f383ec0fec194d6f5a5" width={300} height={250} />
              </div>
            </div>
          </div>

          {/* Timer / Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Time Remaining</span>
              <span className="text-cyan-400 font-mono">{timeLeft}s</span>
            </div>
            <Progress value={((timer - timeLeft) / timer) * 100} className="h-2" />
          </div>

          {/* Actions */}
          <div className="flex justify-center">
            {status === 'ready' && (
              <Button 
                onClick={startTask} 
                size="lg"
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8"
              >
                Start Task <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}

            {status === 'running' && (
              <Button disabled size="lg" className="bg-slate-700 text-gray-300">
                <Clock className="mr-2 h-4 w-4 animate-pulse" />
                Watch Ad ({timeLeft}s)
              </Button>
            )}

            {status === 'completed' && (
              <Button 
                onClick={completeTask} 
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white px-8 animate-pulse"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Claim Reward (₹{ad.payout})
              </Button>
            )}

            {status === 'submitting' && (
              <Button disabled size="lg" className="bg-green-700 text-white">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </Button>
            )}
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>Keep the ad tab open until the timer finishes.</p>
            <p>Closing the tab early may result in task failure.</p>
          </div>

          {/* Bottom Ad 160x300 */}
          <div className="mt-8 flex justify-center">
            <AutoAd codeId="t2" keyCode="e8f5c4bf8d231af11a2a1bbab185a7ef" width={160} height={300} />
          </div>
        </div>
      </Card>
    </div>
  )
}
