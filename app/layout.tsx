import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ClerkProvider } from '@clerk/nextjs'
import Script from 'next/script'
import './globals.css'

const geist = Geist({ subsets: ["latin"] });
const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'EarnX - Earn Money Online',
  description: 'Watch ads, complete tasks, and earn real money. Join thousands earning daily!',
  keywords: 'earn money online, watch ads, complete tasks, referral program, passive income',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Adsterra SocialBar - Global */}
          {process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR && (
            <Script
              src={process.env.NEXT_PUBLIC_ADSTERRA_SOCIALBAR}
              strategy="afterInteractive"
              data-cfasync="false"
            />
          )}
          
          {/* PropellerAds MultiTag - Global */}
          {process.env.NEXT_PUBLIC_PROPELLER_ID && (
            <Script
              src={`https://powerad.ai/multitag/${process.env.NEXT_PUBLIC_PROPELLER_ID}.js`}
              strategy="afterInteractive"
            />
          )}
        </head>
        <body className={`${geist.className} font-sans antialiased`}>
          {children}
          <Analytics />

          {/* ⭐ MONETAG GLOBAL ADS - Load on every page */}
          
          {/* Popunder Ad */}
          <Script
            async
            src="//nervesweedefeat.com/64/56/a8/6456a885c82b26fec79e420f9f8ab7cc.js"
            strategy="afterInteractive"
          />

          {/* In-Page Push (Monetag) */}
          <Script
            async
            data-cfasync="false"
            src="//nervesweedefeat.com/08e83aa60d59f6fc77e7eadc23b87210/invoke.js"
            strategy="afterInteractive"
          />
          <div id="container-08e83aa60d59f6fc77e7eadc23b87210"></div>

          {/* Direct Link Ads */}
          <a 
            href="https://nervesweedefeat.com/wmqkxi2r1r?key=efc75042575d7be56ae61001ae54d101" 
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'none' }}
          ></a>

          {/* Service Worker Registration for Push Ads */}
          <Script id="sw-register" strategy="afterInteractive">
            {`
              if ("serviceWorker" in navigator) {
                navigator.serviceWorker.register("/sw.js").catch(function(err) {
                  console.log("Service Worker registration failed:", err);
                });
              }
            `}
          </Script>
        </body>
      </html>
    </ClerkProvider>
  )
}
