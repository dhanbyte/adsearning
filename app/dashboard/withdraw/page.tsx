"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function WithdrawPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [upiId, setUpiId] = useState("")
  const [paypalEmail, setPaypalEmail] = useState("")

  const withdrawMethods = [
    {
      id: "upi",
      name: "UPI",
      description: "Direct bank transfer via UPI",
      icon: "₹",
      minAmount: 100,
      processingTime: "Instant - 24 hours",
    },
    {
      id: "paytm",
      name: "Paytm Wallet",
      description: "Transfer to your Paytm account",
      icon: "₹",
      minAmount: 50,
      processingTime: "5 - 10 minutes",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Transfer to your PayPal account",
      icon: "P",
      minAmount: 100,
      processingTime: "24 - 48 hours",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Direct transfer to your bank account",
      icon: "₹",
      minAmount: 100,
      processingTime: "24 - 48 hours",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Withdraw Earnings</h1>
        <p className="text-gray-400">Choose a payment method and withdraw your money</p>
      </div>

      {/* Available Balance */}
      <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300 text-sm mb-1">Available Balance</p>
            <h2 className="text-4xl font-bold text-white">₹2,450</h2>
          </div>
          <div className="text-right">
            <p className="text-gray-300 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-cyan-400">₹500</p>
          </div>
        </div>
      </Card>

      {/* Withdraw Methods */}
      <h2 className="text-xl font-bold text-white mb-4">Select Payment Method</h2>
      <div className="grid grid-cols-1 gap-3 mb-8">
        {withdrawMethods.map((method) => (
          <Card
            key={method.id}
            className={`rounded-xl p-6 cursor-pointer transition-all ${
              selectedMethod === method.id
                ? "bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-cyan-500 border-2"
                : "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 hover:border-slate-600/50"
            }`}
            onClick={() => setSelectedMethod(method.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-slate-700/50 rounded-lg flex items-center justify-center text-xl font-bold text-cyan-400">
                  {method.icon}
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{method.name}</h3>
                  <p className="text-gray-400 text-sm">{method.description}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Min: ₹{method.minAmount} • {method.processingTime}
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`${selectedMethod === method.id ? "text-cyan-400" : "text-gray-500"}`}
                size={24}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Withdrawal Form */}
      {selectedMethod && (
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-4">Withdrawal Details</h3>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <p className="text-gray-400 text-xs mt-2">Available: ₹2,450</p>
            </div>

            {selectedMethod === "upi" && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">UPI ID *</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <p className="text-gray-500 text-xs mt-2">Enter your UPI ID for direct transfer</p>
              </div>
            )}

            {selectedMethod === "paytm" && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">Paytm Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            )}

            {selectedMethod === "paypal" && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">PayPal Email *</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="your.email@paypal.com"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <p className="text-gray-500 text-xs mt-2">Your PayPal account email address</p>
              </div>
            )}

            {selectedMethod === "bank" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Account Holder Name</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Account Number</label>
                  <input
                    type="text"
                    placeholder="12345678901234"
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">IFSC Code</label>
                  <input
                    type="text"
                    placeholder="SBIN0001234"
                    className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </>
            )}
          </div>

          {/* Info Card */}
          <Card className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="text-blue-300 text-sm font-semibold mb-1">Processing Information</p>
              <p className="text-blue-200/80 text-xs">
                Your withdrawal will be processed within 24 hours. You'll receive a confirmation email shortly.
              </p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button variant="outline" className="flex-1 rounded-lg border-white/20 bg-transparent">
              Cancel
            </Button>
            <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 border-0 rounded-lg font-semibold">
              Request Withdrawal
            </Button>
          </div>
        </Card>
      )}

      {/* Withdrawal Rules */}
      <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/30 rounded-xl p-6">
        <h3 className="text-white font-bold mb-3">Withdrawal Rules</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li>• Minimum withdrawal amount is ₹100</li>
          <li>• Maximum withdrawal amount is ₹50,000 per month</li>
          <li>• Withdrawals are processed within 24 hours</li>
          <li>• Ensure your payment details are correct before submitting</li>
          <li>• No withdrawal fees or hidden charges</li>
        </ul>
      </Card>
    </div>
  )
}
