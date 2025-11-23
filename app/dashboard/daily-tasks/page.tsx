"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Flame, Gift } from "lucide-react"
import { useState } from "react"

export default function DailyTasksPage() {
  const [completedTasks, setCompletedTasks] = useState([0, 2])

  const tasks = [
    { id: 0, title: "Watch 5 Ads", reward: "₹25", type: "daily" },
    { id: 1, title: "Complete 1 Offer", reward: "₹50", type: "daily" },
    { id: 2, title: "Install 1 App", reward: "₹30", type: "daily" },
  ]

  const weeklyTasks = [
    { id: "w1", title: "7-Day Login Streak", reward: "₹100", progress: 5 },
    { id: "w2", title: "Earn ₹500 This Week", reward: "₹75", progress: 320 },
    { id: "w3", title: "Refer 3 Friends", reward: "₹300", progress: 1 },
  ]

  return (
    <div className="w-full">
      <div className="mb-6 px-3 sm:px-0">
        <h1 className="text-xl sm:text-3xl font-bold text-white mb-1">Daily Tasks</h1>
        <p className="text-xs sm:text-sm text-gray-400">Complete & earn bonuses</p>
      </div>

      <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center">
              <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm sm:text-lg">Streak Bonus</h3>
              <p className="text-gray-300 text-xs sm:text-sm">5 days</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-orange-400 text-base sm:text-2xl font-bold">₹25</p>
            <p className="text-gray-400 text-xs">/day</p>
          </div>
        </div>
      </Card>

      <div className="mb-6">
        <h2 className="text-base sm:text-xl font-bold text-white mb-3">Today</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-slate-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {completedTasks.includes(task.id) ? (
                    <CheckCircle2 size={20} className="text-green-500" />
                  ) : (
                    <Circle size={20} />
                  )}
                </button>
                <span className="text-cyan-400 font-bold text-sm">{task.reward}</span>
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">{task.title}</h3>
              <div className="w-full bg-slate-700/50 h-1.5 rounded-full mb-3">
                <div
                  className={`h-full rounded-full transition-all ${completedTasks.includes(task.id) ? "bg-gradient-to-r from-green-500 to-emerald-600 w-full" : "bg-gradient-to-r from-cyan-500 to-purple-600 w-1/3"}`}
                ></div>
              </div>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 border-0 rounded-lg text-white font-semibold text-xs sm:text-sm py-1.5 sm:py-2">
                Start
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base sm:text-xl font-bold text-white mb-3 flex items-center gap-2">
          <Gift size={18} className="text-purple-400" />
          Weekly
        </h2>
        <div className="space-y-2 sm:space-y-4">
          {weeklyTasks.map((challenge) => (
            <Card
              key={challenge.id}
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h3 className="text-white font-semibold text-sm sm:text-base">{challenge.title}</h3>
                <p className="text-purple-400 font-bold text-sm">{challenge.reward}</p>
              </div>
              <div className="w-full bg-slate-700/50 h-1.5 rounded-full">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all"
                  style={{
                    width: `${(challenge.progress / (challenge.id === "w1" ? 7 : challenge.id === "w2" ? 500 : 3)) * 100}%`,
                  }}
                ></div>
              </div>
              <p className="text-gray-400 text-xs mt-1.5">
                {challenge.progress} / {challenge.id === "w1" ? "7" : challenge.id === "w2" ? "₹500" : "3"}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
