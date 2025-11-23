"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Share2, Users, TrendingUp, MessageCircle, Share } from "lucide-react"
import { useState } from "react"

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const [referralLink] = useState("https://earnxhub.com/ref/rajesh12345")

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const referrals = [
    { id: 1, name: "Priya Singh", earnings: "₹2,450", status: "Active", joinDate: "2 weeks ago" },
    { id: 2, name: "Amit Kumar", earnings: "₹890", status: "Active", joinDate: "1 month ago" },
    { id: 3, name: "Neha Patel", earnings: "₹1,230", status: "Active", joinDate: "3 weeks ago" },
    { id: 4, name: "Vikram Singh", earnings: "₹450", status: "Inactive", joinDate: "2 months ago" },
    { id: 5, name: "Ravi Gupta", earnings: "₹3,120", status: "Active", joinDate: "1 week ago" },
    { id: 6, name: "Anjali Sharma", earnings: "₹1,890", status: "Active", joinDate: "3 weeks ago" },
  ]

  const handleShare = (platform: string) => {
    const message = `Earn money online! Join and get bonus. Use my referral link: ${referralLink}`
    const encodedMessage = encodeURIComponent(message)

    const urls: { [key: string]: string } = {
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      instagram: `https://instagram.com`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodedMessage}`,
    }

    if (urls[platform]) {
      window.open(urls[platform], "_blank")
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Referral Program</h1>
        <p className="text-gray-400">Earn 20% lifetime commission from your referrals</p>
      </div>

      {/* Referral Link */}
      <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-4">Your Referral Link</h2>
        <div className="flex gap-4 items-center mb-4">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-gray-300 text-sm"
          />
          <Button onClick={copyToClipboard} className="bg-gradient-to-r from-cyan-500 to-blue-600 border-0 rounded-lg">
            <Copy size={18} className="mr-2" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            onClick={() => handleShare("whatsapp")}
            className="rounded-lg border-white/20 flex items-center justify-center gap-2 bg-transparent hover:bg-emerald-500/20"
          >
            <MessageCircle size={18} />
            WhatsApp
          </Button>
          <Button
            onClick={() => handleShare("facebook")}
            className="rounded-lg border-white/20 flex items-center justify-center gap-2 bg-transparent hover:bg-blue-500/20"
          >
            <Share2 size={18} />
            Facebook
          </Button>
          <Button
            onClick={() => handleShare("instagram")}
            className="rounded-lg border-white/20 flex items-center justify-center gap-2 bg-transparent hover:bg-pink-500/20"
          >
            <Share size={18} />
            Instagram
          </Button>
          <Button
            onClick={() => handleShare("telegram")}
            className="rounded-lg border-white/20 flex items-center justify-center gap-2 bg-transparent hover:bg-sky-500/20"
          >
            <Share2 size={18} />
            Telegram
          </Button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-cyan-400" size={20} />
            <p className="text-gray-400 text-sm">Total Referrals</p>
          </div>
          <p className="text-2xl font-bold text-white">12</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-green-400" size={20} />
            <p className="text-gray-400 text-sm">Active Referrals</p>
          </div>
          <p className="text-2xl font-bold text-white">11</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-purple-400">₹</span>
            <p className="text-gray-400 text-sm">Referral Earnings</p>
          </div>
          <p className="text-2xl font-bold text-white">₹4,900</p>
        </Card>
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="text-orange-400" size={20} />
            <p className="text-gray-400 text-sm">Commission Rate</p>
          </div>
          <p className="text-2xl font-bold text-white">20%</p>
        </Card>
      </div>

      {/* Referrals List */}
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white">Your Referrals</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-sm">Name</th>
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-sm">Earnings</th>
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-sm">Status</th>
                <th className="text-left px-6 py-3 text-gray-400 font-semibold text-sm">Join Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((ref) => (
                <tr key={ref.id} className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{ref.name}</td>
                  <td className="px-6 py-4 text-cyan-400 font-semibold">{ref.earnings}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${ref.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {ref.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{ref.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
