'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../../lib/supabaseClient'

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

export default function PostDetailPage() {
  const { pref, id } = useParams() as { pref: string; id: string }
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    supabase
      .from('TBL_T_POSTS')
      .select('*')
      .eq('id', Number(id))
      .single()
      .then(({ data }) => {
        setPost(data ?? null)
      })
  }, [id])

  if (!post) {
    return (
      <div className="py-8">
        <div className="bg-white shadow-lg rounded-xl p-8 text-center">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <button
          onClick={() => router.push(`/02-community-board/${pref}`)}
          className="text-blue-500 hover:text-blue-700 mb-4 flex items-center"
        >
          ← 投稿一覧に戻る
        </button>

        <h1 className="text-2xl font-bold text-blue-700 mb-4">{post.title}</h1>
        <div className="text-sm text-gray-600 mb-4">
          {post.name || '匿名'} &middot; {new Date(post.insert_datetime).toLocaleString()}
        </div>
        {post.profile && (
          <p className="italic text-gray-700 mb-4">プロフィール: {post.profile}</p>
        )}
        <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>
        {post.line_id && (
          <p className="text-gray-800 mb-1">LINE ID: {post.line_id}</p>
        )}
        {post.kakao_id && (
          <p className="text-gray-800 mb-1">Kakao ID: {post.kakao_id}</p>
        )}
        {post.free && (
          <p className="text-gray-800 whitespace-pre-wrap">{post.free}</p>
        )}
      </div>
    </div>
  )
}
