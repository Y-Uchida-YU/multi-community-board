// app/layout.tsx

import './globals.css'
import { ReactNode } from 'react'
import Script from 'next/script'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* Google AdSense ライブラリ（テスト用クライアントID） */}
        <Script
          id="adsense-init"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          data-ad-client="ca-pub-3940256099942544"
        />
      </head>
      <body className="bg-blue-50 min-h-screen">
        <div className="flex h-full">
          {/* 左サイド広告 */}
          <aside className="hidden xl:flex w-60 p-4">
            <div className="w-full h-full bg-white rounded-lg shadow flex items-center justify-center">
              <ins
                className="adsbygoogle block"
                style={{ display: 'inline-block', width: 160, height: 600 }}
                data-ad-client="ca-pub-3940256099942544"
                data-ad-slot="6300978111"
                data-ad-format="auto"
                data-full-width-responsive="false"
              />
              <Script id="adsense-left" strategy="afterInteractive">
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
              </Script>
            </div>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1 p-6">{children}</main>

          {/* 右サイド広告 */}
          <aside className="hidden xl:flex w-60 p-4">
            <div className="w-full h-full bg-white rounded-lg shadow flex items-center justify-center">
              <ins
                className="adsbygoogle block"
                style={{ display: 'inline-block', width: 160, height: 600 }}
                data-ad-client="ca-pub-3940256099942544"
                data-ad-slot="6300978111"
                data-ad-format="auto"
                data-full-width-responsive="false"
              />
              <Script id="adsense-right" strategy="afterInteractive">
                {`(adsbygoogle = window.adsbygoogle || []).push({});`}
              </Script>
            </div>
          </aside>
        </div>
      </body>
    </html>
  )
}
