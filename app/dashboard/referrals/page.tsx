"use client"

import { useEffect, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Copy, Share2, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface UserData {
  referralCode: string
  referrals: any[]
}

export default function ReferralsPage() {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

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

  const copyReferralCode = () => {
    if (userData?.referralCode) {
      navigator.clipboard.writeText(userData.referralCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareReferralLink = () => {
    const referralLink = `${window.location.origin}/register?ref=${userData?.referralCode}`
    if (navigator.share) {
      navigator.share({
        title: 'Join EarnX and Start Earning!',
        text: `Use my referral code ${userData?.referralCode} to join EarnX and start earning money online!`,
        url: referralLink
      })
    } else {
      navigator.clipboard.writeText(referralLink)
      alert('Referral link copied to clipboard!')
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
            <Link href="/dashboard" className="text-white hover:text-cyan-400 transition">
              Dashboard
            </Link>
            <Link href="/dashboard/earn" className="text-white hover:text-cyan-400 transition">
              Earn
            </Link>
            <Link href="/dashboard/wallet" className="text-white hover:text-cyan-400 transition">
              Wallet
            </Link>
            <Link href="/dashboard/referrals" className="text-cyan-400">
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Referral Program 🎁
          </h2>
          <p className="text-gray-300">Invite friends and earn 20% of their earnings forever!</p>
        </div>

        {/* Referral Code Card */}
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 p-8 mb-8">
          <div className="text-center">
            <h3 className="text-white text-2xl font-bold mb-4">Your Referral Code</h3>
            <div className="bg-slate-900/50 rounded-xl p-6 mb-6">
              <p className="text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
                {userData?.referralCode || 'LOADING'}
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={copyReferralCode}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              >
                <Copy className="h-5 w-5 mr-2" />
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
              <Button 
                onClick={shareReferralLink}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50 p-6">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-cyan-400 mr-3" />
              <h3 className="text-white font-semibold">Total Referrals</h3>
            </div>
            <p className="text-4xl font-bold text-white">{userData?.referrals?.length || 0}</p>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 p-6">
            <div className="flex items-center mb-4">
              <DollarSign className="h-8 w-8 text-green-400 mr-3" />
              <h3 className="text-white font-semibold">Referral Earnings</h3>
            </div>
            <p className="text-4xl font-bold text-white">₹0.00</p>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 p-6">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-purple-400 mr-3" />
              <h3 className="text-white font-semibold">Active Referrals</h3>
            </div>
            <p className="text-4xl font-bold text-white">{userData?.referrals?.length || 0}</p>
          </Card>
        </div>

        {/* How It Works */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">1</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Share Your Code</h4>
                <p className="text-gray-400 text-sm">Share your unique referral code with friends and family</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">2</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">They Sign Up</h4>
                <p className="text-gray-400 text-sm">Your friends register using your referral code</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Earn Commission</h4>
                <p className="text-gray-400 text-sm">You earn 20% of everything they earn, forever!</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Referral List */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-8">
          <h3 className="text-2xl font-bold text-white mb-6">Your Referrals</h3>
          
          {!userData?.referrals || userData.referrals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-400">No referrals yet</p>
              <p className="text-gray-500 text-sm mt-2">Start sharing your code to earn passive income!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userData.referrals.map((referral, index) => (
                <div key={index} className="bg-slate-700/30 rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="text-white font-semibold">User #{index + 1}</p>
                    <p className="text-gray-400 text-sm">Joined: {new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">₹0.00</p>
                    <p className="text-gray-400 text-sm">Earned from this referral</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
