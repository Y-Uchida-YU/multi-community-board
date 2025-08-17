// data/ads.ts
export type Ad = {
    id: string;
    imageUrl: string;   // 広告画像
    href: string;       // リンク先
    alt: string;        // altテキスト
    regions: ('left' | 'right' | 'inline')[];
    tags: string[];     // 広告ターゲット例: ['gay','pride','lgbtq+']
  }
  
  export const ADS: Ad[] = [
    {
      id: 'pride-tshirt',
      imageUrl: '/vercel.svg',
      href: 'https://yourshop.example.com/pride-tshirt',
      alt: 'プライドTシャツ',
      regions: ['inline'],
      tags: ['gay','pride','apparel']
    },
    {
      id: 'rainbow-party',
      imageUrl: '/globe.svg',
      href: 'https://event.example.com/rainbow-party',
      alt: 'レインボーパーティー',
      regions: ['inline'],
      tags: ['gay','event','party']
    },
    // …他にも追加…
  ]
  