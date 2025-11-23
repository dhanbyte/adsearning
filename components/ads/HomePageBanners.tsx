"use client"

import Script from 'next/script'

export default function HomePageBanners() {
  return (
    <>
      {/* TOP Banner 728x90 */}
      <div className="ad-box flex justify-center my-4">
        <div>
          <Script id="banner72890" strategy="lazyOnload">
            {`
              atOptions = {
                'key' : 'b08fb6b8e9559715f42f6c7e66e97293',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            `}
          </Script>
          <Script
            async
            src="//nervesweedefeat.com/b08fb6b8e9559715f42f6c7e66e97293/invoke.js"
            strategy="lazyOnload"
          />
        </div>
      </div>

      {/* Middle Banner 300x250 */}
      <div className="ad-box flex justify-center my-4" style={{ marginTop: 20 }}>
        <div>
          <Script id="banner300250" strategy="lazyOnload">
            {`
              atOptions = {
                'key' : 'e35abebc542f6f383ec0fec194d6f5a5',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            `}
          </Script>
          <Script
            async
            src="//nervesweedefeat.com/e35abebc542f6f383ec0fec194d6f5a5/invoke.js"
            strategy="lazyOnload"
          />
        </div>
      </div>
    </>
  )
}
