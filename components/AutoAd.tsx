"use client";
import { useEffect, useState } from "react";
import Script from "next/script";

interface AutoAdProps {
  codeId: string;
  keyCode: string;
  width: number;
  height: number;
}

export default function AutoAd({ codeId, keyCode, width, height }: AutoAdProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, 45000); // Refresh every 45 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div key={refreshKey} className="flex justify-center items-center my-4 w-full overflow-hidden">
      <div style={{ width: width, height: height, position: 'relative' }}>
        <Script id={`${codeId}-${refreshKey}`} strategy="lazyOnload">
          {`
            atOptions = {
              'key': '${keyCode}',
              'format': 'iframe',
              'height': ${height},
              'width': ${width},
              'params': {}
            };
          `}
        </Script>

        <Script
          async
          src={`//nervesweedefeat.com/${keyCode}/invoke.js`}
          strategy="lazyOnload"
        />
      </div>
    </div>
  );
}
