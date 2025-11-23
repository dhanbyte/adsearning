"use client"

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle, Clock, User } from 'lucide-react'
import { toast } from 'sonner'

interface Task {
  _id: string
  taskId: string
  amount: number
  status: string
  completedAt: string
  fraudScore: number
  user: {
    firstName: string
    email: string
    clerkId: string
  }
}

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/admin/tasks')
      const data = await response.json()
      if (data.success) {
        setTasks(data.tasks)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (taskId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/tasks/${action}/${taskId}`, {
        method: 'PUT'
      })
      const data = await response.json()
      
      if (data.success) {
        toast.success(`Task ${action}d successfully`)
        fetchTasks() // Refresh list
      } else {
        toast.error(data.error || `Failed to ${action} task`)
      }
    } catch (error) {
      toast.error('Error processing request')
    }
  }

  if (loading) {
    return <div className="p-8 text-white text-center">Loading tasks...</div>
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Task Review Queue</h1>
          <Badge variant="outline" className="text-white border-white/20">
            {tasks.length} Pending
          </Badge>
        </div>

        {tasks.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white">All caught up!</h3>
            <p className="text-gray-400">No pending tasks to review.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tasks.map((task) => (
              <Card key={task._id} className="bg-slate-800 border-slate-700 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={task.fraudScore > 50 ? 'bg-red-500' : 'bg-green-500'}>
                        Fraud Score: {task.fraudScore}
                      </Badge>
                      <span className="text-gray-400 text-sm flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(task.completedAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-cyan-400" />
                      <span className="text-white font-medium">{task.user.firstName}</span>
                      <span className="text-gray-500 text-sm">({task.user.email})</span>
                    </div>
                    
                    <p className="text-gray-300">
                      Claimed Amount: <span className="text-green-400 font-bold">₹{task.amount}</span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleAction(task._id, 'reject')}
                      variant="destructive"
                      className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button 
                      onClick={() => handleAction(task._id, 'approve')}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                </div>
                
                {task.fraudScore > 50 && (
                  <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded p-3 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                    <div>
                      <p className="text-red-200 text-sm font-medium">High Fraud Risk Detected</p>
                      <p className="text-red-300/70 text-xs">
                        This user has a high fraud score. Please review their activity carefully before approving.
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
