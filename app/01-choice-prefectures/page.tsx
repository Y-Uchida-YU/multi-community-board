// app/01-choice-prefectures/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Prefectures grouped by region
const REGIONS = [
  {
    name: '北海道',
    prefectures: ['北海道'],
  },
  {
    name: '東北',
    prefectures: ['青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'],
  },
  {
    name: '甲信越',
    prefectures: ['新潟県', '長野県', '山梨県'],
  },
  {
    name: '北陸',
    prefectures: ['富山県', '石川県', '福井県'],
  },
  {
    name: '東京',
    prefectures: ['池袋', '新宿', '渋谷/品川', '都心', '区東部', '都下'],
  },
  {
    name: '関東',
    prefectures: ['神奈川県', '埼玉県', '千葉県', '茨城県', '栃木県', '群馬県'],
  },
  {
    name: '東海',
    prefectures: ['愛知県', '三重県', '岐阜県', '静岡県'],
  },
  {
    name: '関西',
    prefectures: ['大阪府', '京都府', '兵庫県', '滋賀県', '奈良県', '和歌山県'],
  },
  {
    name: '中国',
    prefectures: ['岡山県', '広島県', '鳥取県', '島根県', '山口県'],
  },
  {
    name: '四国',
    prefectures: ['香川県', '徳島県', '愛媛県', '高知県'],
  },
  {
    name: '九州',
    prefectures: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県'],
  },
  {
    name: '沖縄',
    prefectures: ['沖縄県'],
  },
];

export default function ChoicePrefecturesPage() {
  const router = useRouter();
  const [openRegion, setOpenRegion] = useState<string | null>(null);

  const handlePrefClick = (pref: string) => {
    router.push(`/02-community-board/${encodeURIComponent(pref)}`);
  };

  return (
    <div>
      <div className="bg-white shadow-lg rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">
            Boys Matching
          </h1>
          <p className="text-base md:text-lg text-gray-700">
            当サイトはゲイの出会いを目的としています。皆様に素敵な出会いがありますように
          </p>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-blue-700 mb-8 text-center">
          都道府県を選択してください
        </h2>

        {/* Mobile accordion */}
        <div className="md:hidden">
          {REGIONS.map(region => (
            <div key={region.name} className="mb-4">
              <button
                onClick={() =>
                  setOpenRegion(openRegion === region.name ? null : region.name)
                }
                className="w-full flex justify-between items-center py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow"
              >
                <span>{region.name}</span>
                <span>{openRegion === region.name ? '▲' : '▼'}</span>
              </button>
              <ul
                className={`${openRegion === region.name ? 'block' : 'hidden'} mt-2 grid grid-cols-2 gap-2`}
              >
                {region.prefectures.map(pref => (
                  <li key={pref}>
                    <button
                      onClick={() => handlePrefClick(pref)}
                      className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow transition"
                    >
                      {pref}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Desktop layout */}
        <div className="hidden md:block">
          {REGIONS.map(region => (
            <section key={region.name} className="mb-8">
              <h3 className="text-xl md:text-2xl font-semibold text-blue-600 mb-4">
                {region.name}
              </h3>
              <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {region.prefectures.map(pref => (
                  <li key={pref}>
                    <button
                      onClick={() => handlePrefClick(pref)}
                      className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow transition"
                    >
                      {pref}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
