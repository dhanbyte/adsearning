"use client"

import { Card } from "@/components/ui/card"
import { Check, X, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { toast } from "sonner"

interface Withdrawal {
  _id: string
  amount: number
  upiId: string
  status: string
  createdAt: string
  user: {
    firstName: string
    email: string
  }
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWithdrawals()
  }, [])

  const fetchWithdrawals = async () => {
    try {
      const response = await fetch('/api/admin/withdrawals')
      const data = await response.json()
      if (data.success) {
        setWithdrawals(data.withdrawals)
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error)
      toast.error('Failed to load withdrawals')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch(`/api/admin/withdrawals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      const data = await response.json()
      
      if (data.success) {
        toast.success(data.message)
        fetchWithdrawals()
      } else {
        toast.error(data.error || 'Action failed')
      }
    } catch (error) {
      toast.error('Error processing request')
    }
  }

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length
  const processedToday = withdrawals.filter(w => 
    w.status === 'completed' && 
    new Date(w.createdAt).toDateString() === new Date().toDateString()
  ).length
  const totalPayout = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + w.amount, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Manage Withdrawals</h1>
        <p className="text-gray-400">Process and approve user withdrawal requests</p>
      </div>

      {/* Pending Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 rounded-xl p-6">
          <p className="text-gray-300 text-sm mb-1">Pending Requests</p>
          <p className="text-3xl font-bold text-yellow-400">{pendingCount}</p>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 rounded-xl p-6">
          <p className="text-gray-300 text-sm mb-1">Processed Today</p>
          <p className="text-3xl font-bold text-green-400">{processedToday}</p>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 rounded-xl p-6">
          <p className="text-gray-300 text-sm mb-1">Total Payout</p>
          <p className="text-3xl font-bold text-cyan-400">₹{totalPayout.toLocaleString()}</p>
        </Card>
      </div>

      {/* Withdrawals Table */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50 bg-slate-700/20">
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">User</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Amount</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Method</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Details</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Date</th>
                <th className="text-left px-6 py-4 text-gray-400 font-semibold text-sm">Status</th>
                <th className="text-center px-6 py-4 text-gray-400 font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((withdrawal) => (
                <tr
                  key={withdrawal._id}
                  className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors"
                >
                  <td className="px-6 py-4 text-white font-medium">{withdrawal.user.firstName}</td>
                  <td className="px-6 py-4 text-cyan-400 font-semibold">₹{withdrawal.amount}</td>
                  <td className="px-6 py-4 text-gray-400">UPI</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {withdrawal.upiId}
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    {new Date(withdrawal.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        withdrawal.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : withdrawal.status === "rejected"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {withdrawal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {withdrawal.status === "pending" && (
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleAction(withdrawal._id, 'approve')}
                          className="p-2 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <Check size={18} className="text-green-400" />
                        </button>
                        <button 
                          onClick={() => handleAction(withdrawal._id, 'reject')}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <X size={18} className="text-red-400" />
                        </button>
                      </div>
                    )}
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
