// app/02-community-board/[pref]/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

type Post = {
  id: number
  name: string | null
  profile: string | null
  title: string
  content: string
  insert_datetime: string
}

export default function PostsListPage() {
  const { pref } = useParams() as { pref: string }
  const decodedPref = decodeURIComponent(pref)
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    supabase
      .from<Post>('TBL_T_POSTS')
      .select('*')
      .eq('prefecture', decodedPref)
      .order('insert_datetime', { ascending: false })
      .then(({ data }) => setPosts(data || []))
  }, [decodedPref])

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white shadow-lg rounded-xl p-8">
        {/* 戻るボタン */}
        <button
          onClick={() => router.push('/01-choice-prefectures')}
          className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
        >
          ← 都道府県を選び直す
        </button>

        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          {decodedPref} の掲示板
        </h1>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push(`/02-community-board/${pref}/01-new`)}
            className="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow transition"
          >
            新規投稿
          </button>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500 py-12">
            まだ投稿がありません。<br/>
            ぜひ最初の投稿をしてみましょう！
          </p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li
                key={post.id}
                className="border border-gray-200 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-blue-800">
                    {post.title}
                  </h2>
                  <button
                    onClick={() =>
                      router.push(`/02-community-board/${pref}/03-mail/${post.id}`)
                    }
                    className="text-blue-500 hover:text-blue-700 text-2xl"
                    aria-label="メール送信"
                  >
                    📧
                  </button>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  {post.name || '匿名'} &middot;{' '}
                  {new Date(post.insert_datetime).toLocaleString()}
                </div>

                {post.profile && (
                  <p className="italic text-gray-700 mb-4">プロフィール: {post.profile}</p>
                )}

                <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() =>
                      router.push(
                        `/02-community-board/${pref}/02-delete/${post.id}`
                      )
                    }
                    className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
