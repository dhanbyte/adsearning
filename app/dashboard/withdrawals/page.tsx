"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WithdrawalsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Request Withdrawal</h1>
        <p className="text-gray-400">Easy and fast withdrawal to your bank account</p>
      </div>

      {/* Redirect to Withdraw Page */}
      <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/30 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Ready to withdraw?</h2>
        <p className="text-gray-300 mb-6">Choose your preferred payment method and proceed with withdrawal.</p>
        <Link href="/dashboard/withdraw">
          <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 border-0 rounded-lg px-8">
            Proceed to Withdrawal
          </Button>
        </Link>
      </Card>
    </div>
  )
}
