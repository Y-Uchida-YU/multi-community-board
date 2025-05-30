// app/layout.tsx

import './globals.css'
import { ReactNode } from 'react'
import Script from 'next/script'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* AdSense ライブラリを head で一度だけロード */}
        <Script
          id="adsense-init"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5397248117043431"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-blue-50 min-h-screen">
        <div className="flex h-full">
          {/* 左サイドバー広告 */}
          <aside className="hidden xl:flex w-60 p-4">
            <div className="w-full h-full flex items-center justify-center">
              {/* 左サイドバー01 */}
              <ins
                className="adsbygoogle block"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-5397248117043431"
                data-ad-slot="4769825920"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
              <Script id="ads-left" strategy="afterInteractive">
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
              </Script>
            </div>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1 p-6">{children}</main>

          {/* 右サイドバー広告 */}
          <aside className="hidden xl:flex w-60 p-4">
            <div className="w-full h-full flex items-center justify-center">
              {/* 右サイドバー用01 */}
              <ins
                className="adsbygoogle block"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-5397248117043431"
                data-ad-slot="6849803164"
                data-ad-format="auto"
                data-full-width-responsive="true"
              />
              <Script id="ads-right" strategy="afterInteractive">
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
              </Script>
            </div>
          </aside>
        </div>
      </body>
    </html>
  )
}
