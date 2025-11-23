"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, DollarSign, Eye, CheckCircle, LogOut } from 'lucide-react'

interface Stats {
  totalUsers: number
  totalEarnings: number
  totalAdsWatched: number
  totalTasksCompleted: number
  pendingWithdrawals: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      } else if (data.error === 'Unauthorized') {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
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
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Dashboard Overview
          </h2>
          <p className="text-gray-300">Manage your earning platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-cyan-400" />
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Total Earnings Paid</h3>
            <p className="text-3xl font-bold text-white">₹{stats?.totalEarnings.toFixed(2) || '0.00'}</p>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Total Ads Watched</h3>
            <p className="text-3xl font-bold text-white">{stats?.totalAdsWatched || 0}</p>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Tasks Completed</h3>
            <p className="text-3xl font-bold text-white">{stats?.totalTasksCompleted || 0}</p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/users">
            <Card className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-cyan-500/50 transition-all cursor-pointer">
              <h3 className="text-white font-semibold text-lg mb-2">Manage Users</h3>
              <p className="text-gray-400 text-sm mb-4">View and manage all registered users</p>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600">
                View Users
              </Button>
            </Card>
          </Link>

          <Link href="/admin/ads">
            <Card className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-cyan-500/50 transition-all cursor-pointer">
              <h3 className="text-white font-semibold text-lg mb-2">Manage Ads</h3>
              <p className="text-gray-400 text-sm mb-4">Create and manage earning ads</p>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600">
                Manage Ads
              </Button>
            </Card>
          </Link>

          <Link href="/admin/tasks">
            <Card className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-cyan-500/50 transition-all cursor-pointer">
              <h3 className="text-white font-semibold text-lg mb-2">Approve Tasks</h3>
              <p className="text-gray-400 text-sm mb-4">Review and approve user tasks</p>
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600">
                Review Tasks
              </Button>
            </Card>
          </Link>
        </div>

        <div className="mt-6">
          <Link href="/admin/withdrawals">
            <Card className="bg-slate-800/50 border-slate-700/50 p-6 hover:border-cyan-500/50 transition-all cursor-pointer">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">Withdrawals</h3>
                  <p className="text-gray-400 text-sm">Process pending withdrawal requests</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-300 text-sm block mb-2">Pending:</span>
                  <span className="bg-red-500/20 text-red-400 px-4 py-2 rounded-full text-lg font-bold">
                    {stats?.pendingWithdrawals || 0}
                  </span>
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600">
                Process Withdrawals
              </Button>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
