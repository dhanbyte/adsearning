"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, MoreHorizontal, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  balance: number
  totalEarnings: number
  createdAt: string
  clerkId: string
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manage Users</h1>
          <p className="text-gray-400">View and manage all user accounts</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 border-0 rounded-lg">
          Total Users: {users.length}
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3 bg-slate-700/50 rounded-lg px-4 py-3">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-700/20">
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Name</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Email</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Joined</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Balance</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Total Earnings</th>
                <th className="text-center px-6 py-4 text-gray-400 font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {(user.firstName || 'U').charAt(0)}
                      </div>
                      <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{user.email}</td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-green-400 font-semibold">₹{user.balance.toFixed(2)}</td>
                  <td className="px-6 py-4 text-cyan-400 font-semibold">₹{user.totalEarnings.toFixed(2)}</td>
                  <td className="px-6 py-4 text-center">
                    <button className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors">
                      <MoreHorizontal size={18} className="text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
