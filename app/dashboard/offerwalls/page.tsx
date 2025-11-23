"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, TrendingUp } from "lucide-react"
import { useState } from "react"

export default function OfferwallsPage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = ["All", "Finance", "Games", "Shopping", "Health"]

  const offerwalls = [
    {
      name: "AdGate Media",
      logo: "AG",
      offers: 234,
      earning: "₹10-500",
      color: "from-blue-500/20 to-cyan-500/20",
      description: "High-paying surveys and offers",
      category: "all",
    },
    {
      name: "CPALead",
      logo: "CP",
      offers: 189,
      earning: "₹5-200",
      color: "from-purple-500/20 to-pink-500/20",
      description: "CPA & CPI offers",
      category: "finance",
    },
    {
      name: "OGAds",
      logo: "OG",
      offers: 156,
      earning: "₹10-300",
      color: "from-orange-500/20 to-red-500/20",
      description: "App installs & surveys",
      category: "games",
    },
    {
      name: "TimeWall",
      logo: "TW",
      offers: 267,
      earning: "₹15-400",
      color: "from-green-500/20 to-emerald-500/20",
      description: "Timed offers & tasks",
      category: "shopping",
    },
    {
      name: "OfferToro",
      logo: "OT",
      offers: 201,
      earning: "₹20-600",
      color: "from-indigo-500/20 to-purple-500/20",
      description: "Premium surveys",
      category: "health",
    },
    {
      name: "AdGem",
      logo: "AG",
      offers: 178,
      earning: "₹10-250",
      color: "from-rose-500/20 to-pink-500/20",
      description: "Multi-format campaigns",
      category: "all",
    },
    {
      name: "FinanceHub",
      logo: "FH",
      offers: 312,
      earning: "₹25-800",
      color: "from-emerald-500/20 to-teal-500/20",
      description: "Financial offers & investments",
      category: "finance",
    },
    {
      name: "GamersReward",
      logo: "GR",
      offers: 445,
      earning: "₹5-300",
      color: "from-pink-500/20 to-rose-500/20",
      description: "Gaming rewards platform",
      category: "games",
    },
    {
      name: "ShopEarn",
      logo: "SE",
      offers: 298,
      earning: "₹15-500",
      color: "from-amber-500/20 to-yellow-500/20",
      description: "Shopping cashback offers",
      category: "shopping",
    },
    {
      name: "HealthPlus",
      logo: "HP",
      offers: 156,
      earning: "₹10-350",
      color: "from-cyan-500/20 to-blue-500/20",
      description: "Health & wellness rewards",
      category: "health",
    },
  ]

  const filteredOffers =
    activeCategory === "all" ? offerwalls : offerwalls.filter((o) => o.category === activeCategory.toLowerCase())

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Offerwalls</h1>
        <p className="text-gray-400">Complete surveys, trials, and special offers</p>
      </div>

      <div className="mb-8 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <Button
            key={cat}
            onClick={() => setActiveCategory(cat.toLowerCase())}
            className={`rounded-lg transition-all ${
              activeCategory === cat.toLowerCase()
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50"
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Top Offerwalls */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-cyan-400" />
          Trending Now
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOffers.slice(0, 3).map((wall, idx) => (
            <Card
              key={idx}
              className={`bg-gradient-to-br ${wall.color} border-slate-700/50 hover:border-slate-600/50 transition-all rounded-xl p-6 group cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-slate-700/50 w-14 h-14 rounded-lg flex items-center justify-center font-bold text-lg text-cyan-400 group-hover:bg-slate-600/50 transition-colors">
                  {wall.logo}
                </div>
                <ExternalLink size={18} className="text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h3 className="text-white font-semibold mb-1">{wall.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{wall.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-500 text-xs">Offers</p>
                  <p className="text-white font-semibold">{wall.offers}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs">Earning</p>
                  <p className="text-cyan-400 font-bold">{wall.earning}</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 border-0 rounded-lg text-white font-semibold group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all">
                Start Offers
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* All Offerwalls */}
      <h2 className="text-xl font-bold text-white mb-4">All Offerwalls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOffers.map((wall, idx) => (
          <Card
            key={idx}
            className={`bg-gradient-to-br ${wall.color} border-slate-700/50 hover:border-slate-600/50 transition-all rounded-xl p-6 group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-slate-700/50 w-12 h-12 rounded-lg flex items-center justify-center font-semibold text-cyan-400 group-hover:bg-slate-600/50 transition-colors">
                {wall.logo}
              </div>
              <span className="bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1 rounded-full">
                {wall.offers} offers
              </span>
            </div>
            <h3 className="text-white font-semibold mb-1">{wall.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{wall.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-cyan-400 font-bold">{wall.earning}</p>
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-600 border-0 rounded-lg text-xs">
                Open
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
