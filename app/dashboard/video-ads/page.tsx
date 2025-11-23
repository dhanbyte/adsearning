"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, Maximize } from "lucide-react"
import { useState } from "react"

export default function VideoAdsPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  const videoAds = [
    { id: 1, title: "Premium Product Ad", duration: 30, earning: 15 },
    { id: 2, title: "Mobile Game Install", duration: 20, earning: 12 },
    { id: 3, title: "E-commerce Campaign", duration: 30, earning: 15 },
    { id: 4, title: "Finance App Promotion", duration: 25, earning: 10 },
  ]

  return (
    <div className="w-full">
      <div className="mb-6 px-3 sm:px-0">
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">Video Ads</h1>
        <p className="text-xs sm:text-sm text-gray-400">Watch for higher earnings</p>
      </div>

      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-lg sm:rounded-xl overflow-hidden mb-6">
        <div className="relative bg-gradient-to-br from-cyan-500/20 to-purple-500/20 aspect-video flex items-center justify-center">
          {isPlaying ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white font-semibold text-sm sm:text-base mb-2 sm:mb-4">Playing...</p>
                <p className="text-cyan-400 text-2xl sm:text-3xl font-bold">{timeLeft}s</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm w-14 h-14 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all"
            >
              <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-white" />
            </button>
          )}
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 flex items-center gap-2">
            <div className="flex-1 bg-slate-700/50 h-1 rounded-full">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-600 h-full rounded-full"
                style={{ width: `${((30 - timeLeft) / 30) * 100}%` }}
              ></div>
            </div>
            <div className="flex gap-1 sm:gap-2">
              <button className="p-1.5 sm:p-2 hover:bg-white/20 rounded transition-colors">
                <Volume2 size={16} className="text-white" />
              </button>
              <button className="p-1.5 sm:p-2 hover:bg-white/20 rounded transition-colors">
                <Maximize size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-white font-semibold text-sm sm:text-base mb-0.5">Current</h3>
              <p className="text-gray-400 text-xs sm:text-sm">Premium Product</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs mb-1">Earn</p>
              <p className="text-cyan-400 text-lg sm:text-2xl font-bold">₹15</p>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-4 text-sm">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              className="flex-1 rounded-lg border-white/20 text-xs sm:text-sm py-1.5 sm:py-2"
            >
              {isPlaying ? (
                <Pause className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Play className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              )}
              {isPlaying ? "Pause" : "Resume"}
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 border-0 rounded-lg text-xs sm:text-sm py-1.5 sm:py-2">
              Skip
            </Button>
          </div>
        </div>
      </Card>

      <h2 className="text-base sm:text-xl font-bold text-white mb-3 px-3 sm:px-0">Available</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {videoAds.map((video) => (
          <Card
            key={video.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 hover:border-cyan-500/50 transition-all rounded-lg sm:rounded-xl overflow-hidden group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 h-16 sm:h-24 flex items-center justify-center relative">
              <button className="bg-white/20 hover:bg-white/30 w-7 h-7 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all">
                <Play className="h-3 w-3 sm:h-4 sm:w-4 text-white fill-white" />
              </button>
            </div>
            <div className="p-2 sm:p-4">
              <h3 className="text-white font-semibold mb-1 line-clamp-1 text-xs sm:text-sm">{video.title}</h3>
              <div className="flex items-center justify-between text-xs">
                <p className="text-gray-400">{video.duration}s</p>
                <p className="text-cyan-400 font-bold">₹{video.earning}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
