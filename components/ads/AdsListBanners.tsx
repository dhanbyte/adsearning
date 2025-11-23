"use client"

import Script from 'next/script'

export default function AdsListBanners() {
  return (
    <div className="space-y-4">
      {/* Sidebar 160x600 */}
      <div className="ad-box">
        <Script id="ad160600" strategy="lazyOnload">
          {`
            atOptions = {
              'key' : 'a92ad5f59508221ed462446239af22e5',
              'format' : 'iframe',
              'height' : 600,
              'width' : 160,
              'params' : {}
            };
          `}
        </Script>
        <Script
          async
          src="//nervesweedefeat.com/a92ad5f59508221ed462446239af22e5/invoke.js"
          strategy="lazyOnload"
        />
      </div>

      {/* Square Ad 160x300 */}
      <div className="ad-box" style={{ marginTop: 20 }}>
        <Script id="ad160300" strategy="lazyOnload">
          {`
            atOptions = {
              'key' : 'e8f5c4bf8d231af11a2a1bbab185a7ef',
              'format' : 'iframe',
              'height' : 300,
              'width' : 160,
              'params' : {}
            };
          `}
        </Script>
        <Script
          async
          src="//nervesweedefeat.com/e8f5c4bf8d231af11a2a1bbab185a7ef/invoke.js"
          strategy="lazyOnload"
        />
      </div>

      {/* Banner 468x60 */}
      <div className="ad-box" style={{ marginTop: 20 }}>
        <Script id="ad46860" strategy="lazyOnload">
          {`
            atOptions = {
              'key' : 'e2f0c7b8f8e8b3cb19025da393d28a52',
              'format' : 'iframe',
              'height' : 60,
              'width' : 468,
              'params' : {}
            };
          `}
        </Script>
        <Script
          async
          src="//nervesweedefeat.com/e2f0c7b8f8e8b3cb19025da393d28a52/invoke.js"
          strategy="lazyOnload"
        />
      </div>
    </div>
  )
}
