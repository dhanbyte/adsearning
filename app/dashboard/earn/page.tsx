"use client"

import { useEffect, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface Task {
  id: string
  title: string
  description: string
  type: string
  reward: number
  duration: number
  url?: string
  imageUrl?: string
}

export default function EarnPage() {
  const { user, isLoaded } = useUser()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if (isLoaded && user) {
      fetchTasks()
      fetchBalance()
    }
  }, [isLoaded, user])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks')
      const data = await response.json()
      if (data.success) {
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/user')
      const data = await response.json()
      if (data.success) {
        setBalance(data.user.balance)
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId })
      })
      const data = await response.json()
      if (data.success) {
        alert(data.message)
        fetchTasks()
        fetchBalance()
      } else {
        alert(data.error || 'Failed to complete task')
      }
    } catch (error) {
      console.error('Error completing task:', error)
      alert('Failed to complete task')
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              EarnX
            </h1>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-cyan-500/30">
              <span className="text-gray-400 text-sm mr-2">Balance:</span>
              <span className="text-cyan-400 font-bold">₹{balance.toFixed(2)}</span>
            </div>
            <Link href="/dashboard" className="text-white hover:text-cyan-400 transition">
              Dashboard
            </Link>
            <Link href="/dashboard/earn" className="text-cyan-400">
              Earn
            </Link>
            <Link href="/dashboard/wallet" className="text-white hover:text-cyan-400 transition">
              Wallet
            </Link>
            <Link href="/dashboard/referrals" className="text-white hover:text-cyan-400 transition">
              Referrals
            </Link>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Available Tasks 🎯
          </h2>
          <p className="text-gray-300">Complete tasks and earn money instantly!</p>
        </div>

        {tasks.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50 p-12 text-center">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Tasks Available</h3>
            <p className="text-gray-400 mb-6">Check back later for new earning opportunities!</p>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600">
                Back to Dashboard
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <Card 
                key={task.id} 
                className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center">
                    <Play className="h-7 w-7 text-cyan-400" />
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    +₹{task.reward}
                  </div>
                </div>
                
                <h4 className="text-white font-bold text-xl mb-2">{task.title}</h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{task.description}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="h-4 w-4 mr-2 text-cyan-400" />
                    {task.duration}s
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <DollarSign className="h-4 w-4 mr-1 text-green-400" />
                    {task.type}
                  </div>
                </div>

                <Button 
                  onClick={() => handleCompleteTask(task.id)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 font-semibold"
                >
                  Start Task & Earn
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
