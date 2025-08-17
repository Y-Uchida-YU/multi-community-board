// components/AdBanner.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ADS, Ad } from '../data/ads'

type Props = {
  region: 'left' | 'right' | 'inline'
  tagFilter?: string[]  // タグで絞り込みたい場合
}

export default function AdBanner({ region, tagFilter }: Props) {
  // region にマッチする広告を抽出
  let candidates = ADS.filter(ad => ad.regions.includes(region))
  // タグで更に絞る場合
  if (tagFilter && tagFilter.length > 0) {
    candidates = candidates.filter(ad =>
      ad.tags.some(tag => tagFilter.includes(tag))
    )
  }
  // ランダムに１つ選ぶ
  const ad = candidates[Math.floor(Math.random() * candidates.length)] as Ad

  if (!ad) return null

  const { width, height } =
    region === 'inline' ? { width: 300, height: 250 } : { width: 160, height: 600 }

  return (
    <Link href={ad.href} target="_blank" rel="noopener noreferrer">
      <div className="w-full h-full overflow-hidden rounded-lg shadow hover:opacity-90 transition flex justify-center">
        <Image
          src={ad.imageUrl}
          alt={ad.alt}
          width={width}
          height={height}
          className="object-cover w-full h-full"
        />
      </div>
    </Link>
  )
}
