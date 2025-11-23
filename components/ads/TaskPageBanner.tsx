"use client"

import Script from 'next/script'

export default function TaskPageBanner() {
  return (
    <div className="ad-box flex justify-center my-4">
      {/* Task Page Banner 320x50 */}
      <div>
        <Script id="adTask" strategy="lazyOnload">
          {`
            atOptions = {
              'key' : '76d089bf9465d6453c0a73e0808b0f37',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          `}
        </Script>
        <Script
          async
          src="//nervesweedefeat.com/76d089bf9465d6453c0a73e0808b0f37/invoke.js"
          strategy="lazyOnload"
        />
      </div>
    </div>
  )
}
