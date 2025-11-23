"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Star, Users } from "lucide-react"

export default function AppInstallsPage() {
  const apps = [
    {
      id: 1,
      name: "Money Manager Pro",
      category: "Finance",
      reward: "₹50",
      rating: 4.5,
      downloads: "1M+",
      img: "bg-blue-500",
    },
    {
      id: 2,
      name: "Gaming Hub",
      category: "Games",
      reward: "₹75",
      rating: 4.8,
      downloads: "5M+",
      img: "bg-purple-500",
    },
    {
      id: 3,
      name: "Video Player Pro",
      category: "Media",
      reward: "₹40",
      rating: 4.3,
      downloads: "2M+",
      img: "bg-red-500",
    },
    {
      id: 4,
      name: "Fitness Tracker",
      category: "Health",
      reward: "₹35",
      rating: 4.6,
      downloads: "500K+",
      img: "bg-green-500",
    },
    {
      id: 5,
      name: "Shopping Mall",
      category: "Shopping",
      reward: "₹60",
      rating: 4.4,
      downloads: "3M+",
      img: "bg-pink-500",
    },
    {
      id: 6,
      name: "Photo Editor Plus",
      category: "Photography",
      reward: "₹45",
      rating: 4.7,
      downloads: "2.5M+",
      img: "bg-orange-500",
    },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">App Install Earnings</h1>
        <p className="text-gray-400">Install apps and earn money. Payment verified after app opening.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {["All", "Finance", "Games", "Shopping", "Health"].map((category) => (
          <Button
            key={category}
            variant={category === "All" ? "default" : "outline"}
            className={`rounded-full whitespace-nowrap ${
              category === "All" ? "bg-gradient-to-r from-cyan-500 to-purple-600 border-0" : "border-white/20"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map((app) => (
          <Card
            key={app.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 hover:border-slate-600/50 transition-all rounded-xl overflow-hidden group"
          >
            {/* App Icon */}
            <div className={`${app.img} h-32 flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent group-hover:opacity-75 transition-opacity"></div>
              <Download className="h-12 w-12 text-white/50 relative z-10" />
            </div>

            <div className="p-4">
              <h3 className="text-white font-semibold mb-1 line-clamp-1">{app.name}</h3>
              <p className="text-gray-400 text-xs mb-3">{app.category}</p>

              {/* Rating & Downloads */}
              <div className="flex items-center gap-3 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-400">{app.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-gray-400">{app.downloads}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-cyan-400 font-bold">{app.reward}</span>
              </div>

              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 border-0 rounded-lg text-white font-semibold group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all">
                <Download size={16} className="mr-2" />
                Install Now
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
