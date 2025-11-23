"use client"

import { useEffect, useState } from 'react'
import { useUser, UserButton } from '@clerk/nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  Eye, 
  CheckCircle, 
  Users, 
  TrendingUp,
  Play,
  Clock,
  Gift,
  Smartphone,
  Target,
  Zap,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import DailyEarningMeter from '@/components/DailyEarningMeter'
import Banner728x90 from '@/components/ads/Banner728x90'

interface UserData {
  balance: number
  totalEarnings: number
  adsWatched: number
  tasksCompleted: number
  referralCode: string
  referrals: any[]
}

interface Category {
  id: string
  name: string
  description: string
  count: number
  icon: string
  color: string
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData()
      fetchCategories()
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/ads/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'earnable': return Zap
      case 'conditional': return Smartphone
      case 'high_paying': return DollarSign
      case 'surveys': return FileText
      default: return Target
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
            <Link href="/dashboard/wallet" className="text-white hover:text-cyan-400 transition hidden sm:block">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.firstName || 'User'}! 👋
            </h2>
            <p className="text-gray-300">Here's your earning overview</p>
          </div>
          <div className="w-full md:w-auto">
             <DailyEarningMeter userId={user?.id} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-cyan-400" />
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Current Balance</h3>
            <p className="text-3xl font-bold text-white">₹{userData?.balance.toFixed(2) || '0.00'}</p>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Gift className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Total Earnings</h3>
            <p className="text-3xl font-bold text-white">₹{userData?.totalEarnings.toFixed(2) || '0.00'}</p>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Ads Watched</h3>
            <p className="text-3xl font-bold text-white">{userData?.adsWatched || 0}</p>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="h-8 w-8 text-orange-400" />
            </div>
            <h3 className="text-gray-300 text-sm mb-1">Tasks Completed</h3>
            <p className="text-3xl font-bold text-white">{userData?.tasksCompleted || 0}</p>
          </Card>
        </div>

        {/* Ad Banner */}
        <div className="mb-8">
          <Banner728x90 />
        </div>

        {/* Earning Categories */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-6">Ways to Earn</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.id)
              return (
                <Link href={`/dashboard/ads?category=${category.id}`} key={category.id}>
                  <Card className={`bg-gradient-to-br ${category.color || 'from-slate-800 to-slate-900'} border-slate-700/50 hover:border-white/20 transition-all duration-300 p-6 h-full group cursor-pointer`}>
                    <div className="bg-white/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2">{category.name}</h4>
                    <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-xs font-semibold bg-black/30 px-2 py-1 rounded text-white">
                        {category.count} Tasks
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Referral Section */}
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center mb-4">
                <Users className="h-8 w-8 text-cyan-400 mr-3" />
                <h3 className="text-2xl font-bold text-white">Refer & Earn</h3>
              </div>
              <p className="text-gray-300 mb-4 max-w-xl">
                Share your referral code and earn 20% of your friends' earnings forever!
                Build your passive income stream today.
              </p>
              <div className="flex gap-4">
                <div className="bg-slate-700/50 rounded-lg px-4 py-2">
                  <p className="text-gray-400 text-xs">Your Code</p>
                  <p className="text-xl font-bold text-cyan-400">{userData?.referralCode || '...'}</p>
                </div>
                <div className="bg-slate-700/50 rounded-lg px-4 py-2">
                  <p className="text-gray-400 text-xs">Total Referrals</p>
                  <p className="text-xl font-bold text-white">{userData?.referrals?.length || 0}</p>
                </div>
              </div>
            </div>
            
            <Link href="/dashboard/referrals">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 shadow-lg shadow-cyan-500/20">
                View Referral Details
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
