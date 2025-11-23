"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useState } from "react"

export default function WatchAdsPage() {
  const [activeAd, setActiveAd] = useState<number | null>(null)

  const ads = Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i,
      title: `Ad Campaign ${i + 1}`,
      earning: Math.floor(Math.random() * 5) + 1,
      duration: "10 sec",
      category: ["Display", "Video", "Banner"][Math.floor(Math.random() * 3)],
    }))

  return (
    <div className="w-full">
      <div className="mb-6 px-3 sm:px-0">
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">Watch Ads</h1>
        <p className="text-xs sm:text-sm text-gray-400">Earn money instantly!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {ads.map((ad) => (
          <Card
            key={ad.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 hover:border-cyan-500/50 transition-all rounded-lg sm:rounded-xl overflow-hidden group cursor-pointer"
          >
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 h-20 sm:h-32 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 group-hover:opacity-75 transition-opacity"></div>
              <button className="relative z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm w-9 h-9 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all">
                <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-white" />
              </button>
            </div>

            <div className="p-3 sm:p-4">
              <p className="text-gray-400 text-xs mb-1.5">{ad.category}</p>
              <h3 className="text-white font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{ad.title}</h3>

              <div className="flex items-center justify-between mb-3 text-xs sm:text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Duration</p>
                  <p className="text-white font-semibold">{ad.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs">Earn</p>
                  <p className="text-cyan-400 font-bold">₹{ad.earning}</p>
                </div>
              </div>

              <Button
                onClick={() => setActiveAd(ad.id)}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 border-0 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-xs sm:text-sm py-1.5 sm:py-2"
              >
                Watch
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {activeAd !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-xl max-w-2xl w-full p-4 sm:p-6">
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg h-40 sm:h-96 flex items-center justify-center mb-4">
              <div className="text-center">
                <Play className="h-12 w-12 sm:h-16 sm:w-16 text-cyan-400 mx-auto mb-2 sm:mb-4 fill-cyan-400" />
                <p className="text-white font-semibold text-sm sm:text-base">Ad Playing...</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">Time: 10 sec</p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <Button
                onClick={() => setActiveAd(null)}
                variant="outline"
                className="flex-1 rounded-lg border-white/20 text-xs sm:text-sm"
              >
                Close
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 border-0 rounded-lg text-xs sm:text-sm">
                Completed ✓
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
