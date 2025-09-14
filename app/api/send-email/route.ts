// app/api/send-email/route.ts

import { NextResponse } from 'next/server'
import { sendMail } from '../../../lib/mailClient'
import { supabase } from '../../../lib/supabaseClient'

export async function POST(request: Request) {
  const { from: replyTo, subject, body, postId } = await request.json()
  console.log('[send-email]', { replyTo, postId, subject, body })

  const { data, error } = await supabase
    .from('TBL_T_POSTS')
    .select('email')
    .eq('id', postId)
    .single()

  if (error || !data?.email) {
    console.error('Recipient email fetch error:', error)
    return NextResponse.json(
      { error: '宛先メールアドレスが取得できませんでした' },
      { status: 400 }
    )
  }

  try {
    console.log('[send-email] recipient', data.email)
    await sendMail({ to: data.email, subject, body, replyTo })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Mail send error:', err, {
      MAIL_PROVIDER: process.env.MAIL_PROVIDER,
    })
    const errorMessage =
      err instanceof Error
        ? err.message
        : typeof err === 'object' && err && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'メール送信中に予期しないエラーが発生しました'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
