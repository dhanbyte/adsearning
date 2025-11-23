"use client"

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react'

interface TaskHistory {
  _id: string
  amount: number
  status: 'completed' | 'pending_review' | 'approved' | 'rejected'
  completedAt: string
  adTitle?: string
}

export default function HistoryPage() {
  const { user, isLoaded } = useUser()
  const [tasks, setTasks] = useState<TaskHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchHistory()
    }
  }, [isLoaded, user])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/tasks/user/${user?.id}`)
      const data = await response.json()
      if (data.success) {
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>
      case 'completed':
      case 'pending_review':
        return <Badge className="bg-yellow-500">Pending</Badge>
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading history...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Earning History</h1>

        {tasks.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center">
            <Clock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">No history yet</h3>
            <p className="text-gray-400">Start completing tasks to see them here.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task._id} className="bg-slate-800/50 border-slate-700/50 p-4 hover:border-cyan-500/30 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-medium mb-1">
                      {task.adTitle || 'Task Completion'}
                    </h3>
                    <p className="text-gray-400 text-sm flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(task.completedAt).toLocaleDateString()} at {new Date(task.completedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold text-lg mb-1">+₹{task.amount}</p>
                    {getStatusBadge(task.status)}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
