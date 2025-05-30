// app/layout.tsx

import './globals.css'
import { ReactNode } from 'react'
import Head from 'next/head'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <Head>
        {/* AdSense ライブラリをプレーン<script>で一度だけ読み込み */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5397248117043431"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body className="bg-blue-50 min-h-screen">
        <div className="flex h-full">
          {/* 左サイドバー広告 */}
          <aside className="hidden xl:flex w-60 p-4">
            <div className="flex items-center justify-center w-full h-full">
              <ins
                className="adsbygoogle block"
                style={{ display: 'inline-block', width: 160, height: 600 }}
                data-ad-client="ca-pub-5397248117043431"
                data-ad-slot="4769825920"
                data-ad-format="auto"
                data-full-width-responsive="false"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `(adsbygoogle=window.adsbygoogle||[]).push({});`,
                }}
              />
            </div>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1 p-6">{children}</main>

          {/* 右サイドバー広告 */}
          <aside className="hidden xl:flex w-60 p-4">
            <div className="flex items-center justify-center w-full h-full">
              <ins
                className="adsbygoogle block"
                style={{ display: 'inline-block', width: 160, height: 600 }}
                data-ad-client="ca-pub-5397248117043431"
                data-ad-slot="6849803164"
                data-ad-format="auto"
                data-full-width-responsive="false"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `(adsbygoogle=window.adsbygoogle||[]).push({});`,
                }}
              />
            </div>
          </aside>
        </div>
      </body>
    </html>
  )
}
