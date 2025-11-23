"use client"

import { useEffect, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Wallet, TrendingUp, ArrowDownToLine, History } from 'lucide-react'
import Link from 'next/link'
import AutoAd from '@/components/AutoAd'

interface UserData {
  balance: number
  totalEarnings: number
}

export default function WalletPage() {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [upiId, setUpiId] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData()
    }
  }, [isLoaded, user])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user')
      const data = await response.json()
      if (data.success) {
        setUserData(data.user)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount)
    
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    if (amount > (userData?.balance || 0)) {
      alert('Insufficient balance')
      return
    }

    if (amount < 200) {
      alert('Minimum withdrawal amount is ₹200')
      return
    }

    if (!upiId) {
      alert('Please enter your UPI ID')
      return
    }

    try {
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, upiId })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Withdrawal request submitted successfully! You will receive payment within 24 hours.')
        setWithdrawAmount('')
        setUpiId('')
        fetchUserData()
      } else {
        alert(data.error || 'Withdrawal failed')
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error)
      alert('Failed to process withdrawal')
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
            <Link href="/dashboard" className="text-white hover:text-cyan-400 transition hidden sm:block">
              Dashboard
            </Link>
            <Link href="/dashboard/ads" className="text-white hover:text-cyan-400 transition hidden sm:block">
              Earn
            </Link>
            <Link href="/dashboard/wallet" className="text-cyan-400 hidden sm:block">
              Wallet
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-white mb-2">
            My Wallet 💰
          </h2>
          <p className="text-gray-300">Manage your earnings and withdrawals</p>
          
          {/* Top Ad 300x250 */}
          <AutoAd codeId="walletTop" keyCode="e35abebc542f6f383ec0fec194d6f5a5" width={300} height={250} />
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 p-8">
            <div className="flex items-center mb-4">
              <Wallet className="h-10 w-10 text-cyan-400 mr-3" />
              <h3 className="text-white text-lg font-semibold">Available Balance</h3>
            </div>
            <p className="text-5xl font-bold text-white mb-2">
              ₹{userData?.balance.toFixed(2) || '0.00'}
            </p>
            <p className="text-cyan-300 text-sm">Ready to withdraw</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 p-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-10 w-10 text-purple-400 mr-3" />
              <h3 className="text-white text-lg font-semibold">Total Earnings</h3>
            </div>
            <p className="text-5xl font-bold text-white mb-2">
              ₹{userData?.totalEarnings.toFixed(2) || '0.00'}
            </p>
            <p className="text-purple-300 text-sm">Lifetime earnings</p>
          </Card>
        </div>

        {/* Middle Ad 320x50 */}
        <div className="flex justify-center mb-8">
          <AutoAd codeId="walletMid" keyCode="76d089bf9465d6453c0a73e0808b0f37" width={320} height={50} />
        </div>

        {/* Withdrawal Form */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-8 mb-8">
          <div className="flex items-center mb-6">
            <ArrowDownToLine className="h-8 w-8 text-green-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">Withdraw Funds</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Withdrawal Amount (Min: ₹200)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white text-lg h-12"
                min="200"
                step="0.01"
              />
              <p className="text-gray-400 text-sm mt-2">
                Available: ₹{userData?.balance.toFixed(2) || '0.00'}
              </p>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">UPI ID / Phone Number</label>
              <Input
                type="text"
                placeholder="example@upi or 9876543210"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white text-lg h-12"
              />
              <p className="text-gray-400 text-sm mt-2">
                Enter your UPI ID or phone number linked to UPI
              </p>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleWithdraw}
                className="btn w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 h-12 text-lg font-semibold"
                disabled={!withdrawAmount || !upiId}
              >
                Request Withdrawal
              </Button>
              
              {/* Bottom Ad 468x60 */}
              <AutoAd codeId="walletBottom" keyCode="e2f0c7b8f8e8b3cb19025da393d28a52" width={468} height={60} />
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Note:</strong> Withdrawals are processed within 24 hours. Minimum withdrawal amount is ₹200.
              </p>
            </div>
          </div>
        </Card>

        {/* Transaction History */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-8">
          <div className="flex items-center mb-6">
            <History className="h-8 w-8 text-orange-400 mr-3" />
            <h3 className="text-2xl font-bold text-white">Transaction History</h3>
          </div>

          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-400">No transactions yet</p>
            <p className="text-gray-500 text-sm mt-2">Your withdrawal history will appear here</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
