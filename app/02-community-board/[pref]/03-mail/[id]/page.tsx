'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../../../../../lib/supabaseClient'

// メールアドレスをマスクするユーティリティ関数
function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  const maskedLocal = local.length > 1
    ? `${local[0]}***${local.slice(-1)}`
    : `${local[0]}***`
  const [d0, ...rest] = domain.split('.')
  const maskedDomain = `${d0[0]}***.${rest.join('.')}`
  return `${maskedLocal}@${maskedDomain}`
}

export default function MailPage() {
  const { id } = useParams() as { id: string }
  const postId = Number(id)
  const router = useRouter()

  const [maskedEmail, setMaskedEmail] = useState('Loading...')
  const [realEmail, setRealEmail]     = useState('')
  const [fromEmail, setFromEmail]     = useState('')
  const [subject, setSubject]         = useState('')
  const [body, setBody]               = useState('')
  const [errorMsg, setErrorMsg]       = useState('')

  // 投稿データからメールアドレスを取得し、表示用/送信用にセット
  useEffect(() => {
    supabase
      .from('TBL_T_POSTS')
      .select('email')
      .eq('id', postId)
      .single()
      .then(({ data, error }) => {
        if (error || !data?.email) {
          setMaskedEmail('不明')
        } else {
          setRealEmail(data.email)
          setMaskedEmail(maskEmail(data.email))
        }
      })
  }, [postId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(fromEmail)) {
      setErrorMsg('送信元のメールアドレスを正しく入力してください')
      return
    }

    if (!subject.trim() || !body.trim()) {
      setErrorMsg('件名と本文は必須です')
      return
    }

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromEmail, to: realEmail, subject, body })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || '送信に失敗しました')
      alert('メールを送信しました')
      router.back()
    } catch (err: unknown) {
      console.error('Mail send error', err)
      const message =
        err instanceof Error
          ? err.message
          : '送信中に予期しないエラーが発生しました'
      setErrorMsg(message)
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-semibold mb-4">
        メール送信
      </h1>
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            宛先（匿名表示）
          </label>
          <p className="mt-1 text-gray-900">{maskedEmail}</p>
        </div>

        <div>
          <label htmlFor="from" className="block text-sm font-medium text-gray-700">
            あなたのメールアドレス *
          </label>
          <input
            id="from"
            type="email"
            value={fromEmail}
            onChange={(e) => { setFromEmail(e.target.value); setErrorMsg('') }}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            件名 *
          </label>
          <input
            id="subject"
            type="text"
            value={subject}
            onChange={(e) => { setSubject(e.target.value); setErrorMsg('') }}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">
            本文 *
          </label>
          <textarea
            id="body"
            rows={6}
            value={body}
            onChange={(e) => { setBody(e.target.value); setErrorMsg('') }}
            className="mt-1 w-full p-2 border rounded"
            required
          />
        </div>

        {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            送信
          </button>
        </div>
      </form>
    </main>
  )
}
