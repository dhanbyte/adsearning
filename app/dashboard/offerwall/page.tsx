"use client"

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function OfferwallPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [iframeLoaded, setIframeLoaded] = useState(false)

  const cpaLeadPubId = process.env.NEXT_PUBLIC_CPALEAD_PUBID
  const userId = user?.id || ''

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login')
    }
  }, [isLoaded, user, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (!cpaLeadPubId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto pt-20">
          <Card className="bg-slate-800/50 border-slate-700/50 p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Offerwall Not Configured</h2>
            <p className="text-gray-400">Please contact administrator to set up CPALead integration.</p>
          </Card>
        </div>
      </div>
    )
  }

  const offerwallUrl = `https://www.cpalead.com/offerwall?pub=${cpaLeadPubId}&subid=${userId}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/40 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Offerwall
          </h1>

          <div className="w-32"></div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Card */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
              <ExternalLink className="h-6 w-6 text-cyan-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-2">Complete Offers & Earn More!</h3>
              <p className="text-gray-400 text-sm mb-3">
                Browse through various offers including app installs, surveys, and trials. Complete them to earn instant rewards!
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center text-green-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Instant Credit
                </div>
                <div className="flex items-center text-blue-400">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  High Payouts
                </div>
                <div className="flex items-center text-purple-400">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                  Multiple Offers
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Offerwall Iframe */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-4 overflow-hidden">
          {!iframeLoaded && (
            <div className="flex items-center justify-center h-[750px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading offerwall...</p>
              </div>
            </div>
          )}
          
          <iframe
            src={offerwallUrl}
            width="100%"
            height="750"
            frameBorder="0"
            className={`rounded-lg ${!iframeLoaded ? 'hidden' : ''}`}
            onLoad={() => setIframeLoaded(true)}
            title="CPALead Offerwall"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </Card>

        {/* Help Section */}
        <Card className="bg-slate-800/50 border-slate-700/50 p-6 mt-6">
          <h4 className="text-white font-semibold mb-3">How it works:</h4>
          <ol className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start">
              <span className="text-cyan-400 font-bold mr-2">1.</span>
              Browse available offers in the offerwall above
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 font-bold mr-2">2.</span>
              Click on an offer and complete the required action
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 font-bold mr-2">3.</span>
              Your earnings will be automatically credited to your balance
            </li>
            <li className="flex items-start">
              <span className="text-cyan-400 font-bold mr-2">4.</span>
              Check your wallet to see updated balance
            </li>
          </ol>
        </Card>
      </div>
    </div>
  )
}
