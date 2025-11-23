"use client"

import { useState, useEffect, Suspense } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import AdCategoryBadge from '@/components/ads/AdCategoryBadge'
import AutoAd from '@/components/AutoAd'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Clock, DollarSign, Filter, Search, Zap } from 'lucide-react'
import Link from 'next/link'

interface Ad {
  _id: string
  title: string
  description: string
  rewardAmount: number
  duration: number
  category: string
  difficulty: string
  imageUrl?: string
}

function AdsListContent() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setFilter(categoryParam)
    }
    fetchAds()
  }, [searchParams])

  const fetchAds = async () => {
    try {
      const response = await fetch('/api/ads')
      const data = await response.json()
      if (data.success) {
        setAds(data.ads)
      }
    } catch (error) {
      console.error('Error fetching ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAds = ads.filter(ad => {
    const matchesFilter = filter === 'all' || ad.category === filter
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ad.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  }).sort((a, b) => {
    if (sortBy === 'payout_high') return b.rewardAmount - a.rewardAmount
    if (sortBy === 'payout_low') return a.rewardAmount - b.rewardAmount
    if (sortBy === 'duration_short') return a.duration - b.duration
    return 0
  })

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
            <Link href="/dashboard/ads" className="text-cyan-400 hidden sm:block">
              Earn
            </Link>
            <Link href="/dashboard/wallet" className="text-white hover:text-cyan-400 transition hidden sm:block">
              Wallet
            </Link>
            <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Available Tasks</h1>
              <p className="text-gray-400">Complete tasks to earn real money</p>
            </div>

            {/* Filters */}
            <Card className="bg-slate-800/50 border-slate-700/50 p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    placeholder="Search tasks..." 
                    className="pl-10 bg-slate-900/50 border-slate-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-slate-900/50 border-slate-700">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="watch_earn">Watch & Earn</SelectItem>
                    <SelectItem value="install_earn">Install & Earn</SelectItem>
                    <SelectItem value="survey">Surveys</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-[180px] bg-slate-900/50 border-slate-700">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="payout_high">Highest Payout</SelectItem>
                    <SelectItem value="payout_low">Lowest Payout</SelectItem>
                    <SelectItem value="duration_short">Shortest Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Ads Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="bg-slate-800 border-slate-700 p-4 h-48 animate-pulse" />
                ))}
              </div>
            ) : filteredAds.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
                <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-white">No tasks found</h3>
                <p className="text-gray-400">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAds.map((ad) => (
                  <Card 
                    key={ad._id} 
                    className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <AdCategoryBadge category={ad.category} />
                        <Badge variant="outline" className="bg-slate-900/50 border-slate-600 text-cyan-400">
                          {ad.difficulty || 'Easy'}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {ad.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                        {ad.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-green-400 font-bold">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ₹{ad.rewardAmount}
                          </div>
                          <div className="flex items-center text-gray-400 text-sm">
                            <Clock className="h-3 w-3 mr-1" />
                            {ad.duration}s
                          </div>
                        </div>
                        
                        <Link href={`/dashboard/tasks/${ad._id}`}>
                          <Button size="sm" className="bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-white border border-cyan-500/50">
                            Start <Zap className="h-3 w-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Ads - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block w-[300px] shrink-0">
            <div className="sticky top-6">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Sponsored</h3>
              
              {/* Sidebar Tall Ad 160x600 */}
              <AutoAd codeId="side1" keyCode="a92ad5f59508221ed462446239af22e5" width={160} height={600} />

              {/* Square 160x300 */}
              <AutoAd codeId="sq160" keyCode="e8f5c4bf8d231af11a2a1bbab185a7ef" width={160} height={300} />

              {/* Horizontal 468x60 */}
              <AutoAd codeId="h468" keyCode="e2f0c7b8f8e8b3cb19025da393d28a52" width={468} height={60} />
              
              {/* Button Ad */}
              <div className="mt-4 text-center">
                <Button className="btn w-full mb-2 bg-gradient-to-r from-cyan-500 to-purple-600">View Offers</Button>
                <AutoAd codeId="btn2" keyCode="76d089bf9465d6453c0a73e0808b0f37" width={320} height={50} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function AdsListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      <AdsListContent />
    </Suspense>
  )
}
