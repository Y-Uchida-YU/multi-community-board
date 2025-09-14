'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
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
  const [fromEmail, setFromEmail]     = useState('')
  const [subject, setSubject]         = useState('')
  const [body, setBody]               = useState('')
  const [errorMsg, setErrorMsg]       = useState('')
  const [captcha, setCaptcha]         = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateCaptcha = () => {
    const newCaptcha = Math.floor(10000 + Math.random() * 90000).toString()
    setCaptcha(newCaptcha)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#f0f0f0'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < 5; i++) {
          ctx.strokeStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
          ctx.beginPath()
          ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
          ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
          ctx.stroke()
        }
        ctx.font = '24px sans-serif'
        for (let i = 0; i < newCaptcha.length; i++) {
          const char = newCaptcha[i]
          const x = 10 + i * 20 + Math.random() * 5
          const y = 25 + Math.random() * 5
          const angle = ((Math.random() * 30) - 15) * (Math.PI / 180)
          ctx.save()
          ctx.translate(x, y)
          ctx.rotate(angle)
          ctx.fillStyle = 'black'
          ctx.fillText(char, 0, 0)
          ctx.restore()
        }
      }
    }
  }

  useEffect(() => {
    generateCaptcha()
  }, [])

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

    if (!captchaInput.trim()) {
      setErrorMsg('認証キーは必須です')
      return
    }

    if (captchaInput !== captcha) {
      setErrorMsg('認証キーが正しくありません')
      generateCaptcha()
      return
    }

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromEmail, subject, body, postId })
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
    <main className="p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
        メール送信
      </h1>
      <form onSubmit={handleSend} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            宛先（匿名表示）
          </label>
          <p className="mt-1 text-gray-800">{maskedEmail}</p>
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
            className="mt-1 w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
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
            className="mt-1 w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
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
            className="mt-1 w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
            required
          />
        </div>

        <div>
          <label htmlFor="captcha" className="block text-sm font-medium text-gray-700">
            認証キー(必須)
          </label>
          <div className="flex items-center space-x-2">
            <canvas ref={canvasRef} width={120} height={40} className="border bg-white" />
            <button
              type="button"
              onClick={generateCaptcha}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded"
            >
              再生成
            </button>
          </div>
          <input
            id="captcha"
            type="text"
            value={captchaInput}
            onChange={(e) => { setCaptchaInput(e.target.value); setErrorMsg('') }}
            required
            className="mt-1 w-full p-2 border border-gray-300 rounded text-gray-700 bg-gray-50"
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
