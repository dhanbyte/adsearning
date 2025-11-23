"use client"

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

export default function Banner300x250() {
  const adContainerRef = useRef<HTMLDivElement>(null)
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)

  const adScript = process.env.NEXT_PUBLIC_ADSTERRA_300X250

  useEffect(() => {
    if (adLoaded && adContainerRef.current) {
      // Ad script loaded successfully
      const timer = setTimeout(() => {
        if (adContainerRef.current && !adContainerRef.current.querySelector('iframe, ins')) {
          setAdError(true)
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [adLoaded])

  const handleRetry = () => {
    setAdError(false)
    setAdLoaded(false)
    window.location.reload()
  }

  if (!adScript) {
    return null // Don't show anything if ad script not configured
  }

  return (
    <div className="flex flex-col items-center justify-center my-4">
      <div 
        ref={adContainerRef}
        className="relative"
        style={{ width: 300, height: 250, minHeight: 250 }}
      >
        {!adError ? (
          <>
            <Script
              src={adScript}
              strategy="lazyOnload"
              onLoad={() => setAdLoaded(true)}
              onError={() => setAdError(true)}
            />
            {!adLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-lg">
                <div className="text-gray-400 text-sm">Loading ad...</div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-gray-400 text-sm mb-3">Ad failed to load</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm rounded-lg transition"
            >
              Retry
            </button>
          </div>
        )}
      </div>
      <p className="text-gray-500 text-xs mt-2">Advertisement</p>
    </div>
  )
}
