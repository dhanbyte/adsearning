"use client"

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { TrendingUp, Target } from 'lucide-react'

interface DailyEarningMeterProps {
  userId?: string
}

export default function DailyEarningMeter({ userId }: DailyEarningMeterProps) {
  const [stats, setStats] = useState({
    current: 0,
    limit: 1000,
    percentage: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDailyStats()
  }, [userId])

  const fetchDailyStats = async () => {
    try {
      const response = await fetch('/api/user/overview')
      const data = await response.json()
      
      if (data.success) {
        setStats({
          current: data.data.dailyCap.current,
          limit: data.data.dailyCap.limit,
          percentage: data.data.dailyCap.percentage
        })
      }
    } catch (error) {
      console.error('Error fetching daily stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-700 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-slate-700 rounded w-full"></div>
        </div>
      </Card>
    )
  }

  const isNearLimit = stats.percentage >= 80
  const isAtLimit = stats.percentage >= 100

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${isAtLimit ? 'bg-red-500/20' : isNearLimit ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
            {isAtLimit ? (
              <Target className="h-5 w-5 text-red-400" />
            ) : (
              <TrendingUp className={`h-5 w-5 ${isNearLimit ? 'text-orange-400' : 'text-green-400'}`} />
            )}
          </div>
          <div>
            <p className="text-gray-400 text-xs">Today's Earnings</p>
            <p className="text-white font-bold text-lg">
              ₹{stats.current.toFixed(2)} / ₹{stats.limit}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-2xl font-bold ${isAtLimit ? 'text-red-400' : isNearLimit ? 'text-orange-400' : 'text-green-400'}`}>
            {stats.percentage.toFixed(0)}%
          </p>
          <p className="text-gray-500 text-xs">of daily limit</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-500 ${
            isAtLimit 
              ? 'bg-gradient-to-r from-red-500 to-red-600' 
              : isNearLimit 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                : 'bg-gradient-to-r from-green-500 to-emerald-600'
          }`}
          style={{ width: `${Math.min(100, stats.percentage)}%` }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </div>
      </div>

      {/* Status Message */}
      {isAtLimit && (
        <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
          <span>⚠️</span>
          <span>Daily limit reached. Come back tomorrow!</span>
        </p>
      )}
      {isNearLimit && !isAtLimit && (
        <p className="text-orange-400 text-xs mt-2 flex items-center gap-1">
          <span>⏰</span>
          <span>Almost at your daily limit!</span>
        </p>
      )}
      {!isNearLimit && stats.current > 0 && (
        <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
          <span>🎯</span>
          <span>Keep earning! ₹{(stats.limit - stats.current).toFixed(2)} remaining today</span>
        </p>
      )}
    </Card>
  )
}
