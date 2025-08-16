// app/01-choice-prefectures/page.tsx
'use client';

import { useRouter } from 'next/navigation';

const REGIONS = [
  {
    name: '北海道・東北',
    prefectures: [
      '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県'
    ],
  },
  {
    name: '関東',
    prefectures: [
      '茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県'
    ],
  },
  {
    name: '中部',
    prefectures: [
      '新潟県','富山県','石川県','福井県','山梨県','長野県',
      '岐阜県','静岡県','愛知県'
    ],
  },
  {
    name: '近畿',
    prefectures: [
      '三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県'
    ],
  },
  {
    name: '中国',
    prefectures: [
      '鳥取県','島根県','岡山県','広島県','山口県'
    ],
  },
  {
    name: '四国',
    prefectures: [
      '徳島県','香川県','愛媛県','高知県'
    ],
  },
  {
    name: '九州・沖縄',
    prefectures: [
      '福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'
    ],
  },
];

export default function ChoicePrefecturesPage() {
  const router = useRouter();

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">
          Boys Matching
        </h1>
        <p className="text-lg text-gray-700">
          当サイトはゲイの出会いを目的としています。皆様に素敵な出会いがありますように
        </p>
      </div>
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        都道府県を選択してください
      </h2>

      {REGIONS.map(region => (
        <section key={region.name} className="mb-8">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            {region.name}
          </h3>
          <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {region.prefectures.map(pref => (
              <li key={pref}>
                <button
                  onClick={() =>
                    router.push(
                      `/02-community-board/${encodeURIComponent(pref)}`
                    )
                  }
                  className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow transition"
                >
                  {pref}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
