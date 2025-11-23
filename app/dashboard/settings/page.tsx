"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, Lock, LogOut, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    earnings: true,
    withdrawals: true,
    offers: true,
    promotions: false,
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-700/50 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            RK
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Rajesh Kumar</h2>
            <p className="text-gray-400">rajesh@email.com</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="Rajesh Kumar"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              defaultValue="rajesh@email.com"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Phone</label>
            <input
              type="tel"
              defaultValue="+91 98765 43210"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 border-0 rounded-lg">
            Update Profile
          </Button>
        </div>
      </Card>

      {/* Security Section */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Lock size={20} className="text-cyan-400" />
          Security Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <Button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 border-0 rounded-lg">
            Change Password
          </Button>
        </div>
      </Card>

      {/* Notifications Section */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Bell size={20} className="text-purple-400" />
          Notification Preferences
        </h3>

        <div className="space-y-4">
          {[
            { key: "earnings", label: "Earnings Notifications", desc: "Get notified when you earn money" },
            { key: "withdrawals", label: "Withdrawal Updates", desc: "Receive withdrawal status updates" },
            { key: "offers", label: "New Offers", desc: "Get notified about new offers" },
            { key: "promotions", label: "Promotions", desc: "Receive promotional messages" },
          ].map((notif) => (
            <div
              key={notif.key}
              className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div>
                <p className="text-white font-medium">{notif.label}</p>
                <p className="text-gray-400 text-sm">{notif.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[notif.key as keyof typeof notifications]}
                  onChange={(e) => setNotifications({ ...notifications, [notif.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-600 peer-checked:bg-cyan-500 rounded-full peer transition-colors"></div>
                <span className="absolute left-1 w-4 h-4 bg-white rounded-full peer-checked:left-6 transition-all"></span>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-6">Saved Payment Methods</h3>

        <div className="space-y-3 mb-6">
          <div className="p-4 bg-slate-700/30 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-white font-medium">UPI</p>
              <p className="text-gray-400 text-sm">rajesh@upi</p>
            </div>
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">Default</span>
          </div>
        </div>

        <Button variant="outline" className="w-full rounded-lg border-white/20 bg-transparent">
          Add Payment Method
        </Button>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <LogOut size={20} className="text-red-400" />
          Danger Zone
        </h3>

        <div className="space-y-3">
          <div className="p-4 bg-slate-700/30 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Logout</p>
              <p className="text-gray-400 text-sm">End your current session</p>
            </div>
            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent">
              Logout
            </Button>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Delete Account</p>
              <p className="text-gray-400 text-sm">Permanently delete your account and data</p>
            </div>
            <Button variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent">
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
