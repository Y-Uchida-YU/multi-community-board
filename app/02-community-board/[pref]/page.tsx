// app/02-community-board/[pref]/page.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import AdBanner from '../../../components/AdBanner'

type Post = {
  id: number
  prefecture: string
  name: string | null
  profile: string | null
  title: string
  content: string
  line_id: string | null
  kakao_id: string | null
  free: string | null
  delete_key: string
  insert_datetime: string
  insert_program: string
  update_datetime: string
  update_program: string
}

export default function PostsListPage() {
  const { pref } = useParams() as { pref: string }
  const decodedPref = decodeURIComponent(pref)
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list')

  useEffect(() => {
    supabase
      .from('TBL_T_POSTS')          // ← ジェネリックを外しました
      .select('*')
      .eq('prefecture', decodedPref)
      .order('insert_datetime', { ascending: false })
      .then(({ data }) => {
        setPosts(data ?? [])
      })
  }, [decodedPref])

  return (
    <div className="py-8">
      <div className="bg-white shadow-lg rounded-xl p-4 sm:p-8">
        <button
          onClick={() => router.push('/01-choice-prefectures')}
          className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
        >
          ← 都道府県を選び直す
        </button>

        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
          {decodedPref} の掲示板
        </h1>

        <div className="flex justify-end mb-6 space-x-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            一覧表示
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`px-4 py-2 rounded-lg ${
              viewMode === 'tree'
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            ツリー表示
          </button>
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
        ) : viewMode === 'list' ? (
          <ul className="space-y-6">
            {posts.flatMap((post, index) => {
              const items = [
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
                      className="flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm"
                      aria-label="メール送信"
                    >
                      <span className="mr-1">📧</span>
                      <span>メールする</span>
                    </button>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    {post.name || '匿名'} &middot;{' '}
                    {new Date(post.insert_datetime).toLocaleString()}
                  </div>

                  {post.profile && (
                    <p className="italic text-gray-700 mb-4">
                      プロフィール: {post.profile}
                    </p>
                  )}

                  <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() =>
                        router.push(`/02-community-board/${pref}/02-delete/${post.id}`)
                      }
                      className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      削除
                    </button>
                  </div>
                </li>,
              ]

              if ((index + 1) % 5 === 0) {
                items.push(
                  <li key={`ad-${index}`} className="lg:hidden my-4">
                    <AdBanner region="inline" />
                  </li>
                )
              }

              return items
            })}
          </ul>
        ) : (
          <ul className="space-y-4">
            {posts.flatMap((post, index) => {
              const items = [
                <li
                  key={post.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <button
                    onClick={() =>
                      router.push(`/02-community-board/${pref}/post/${post.id}`)
                    }
                    className="w-full flex justify-between items-start hover:underline text-left"
                  >
                    <span className="text-blue-800">{post.title}</span>
                    <span className="ml-4 text-sm text-gray-600 text-right">
                      {post.name || '匿名'}
                      {post.profile ? ` (${post.profile})` : ''}
                      <br />
                      {new Date(post.insert_datetime).toLocaleString()}
                    </span>
                  </button>
                </li>,
              ]

              if ((index + 1) % 5 === 0) {
                items.push(
                  <li key={`ad-${index}`} className="lg:hidden my-4">
                    <AdBanner region="inline" />
                  </li>
                )
              }

              return items
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
