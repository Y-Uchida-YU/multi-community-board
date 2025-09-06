// app/api/send-email/route.ts

import { NextResponse } from 'next/server'
import { sendMail } from '../../../lib/mailClient'
import { supabase } from '../../../lib/supabaseClient'

export async function POST(request: Request) {
  const { from, subject, body, postId } = await request.json()
  console.log('[send-email]', { from, postId, subject, body })

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
    await sendMail({ from, to: data.email, subject, body })
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Mail send error:', err)
    const errorMessage =
      err instanceof Error
        ? err.message
        : typeof err === 'object' && err && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'メール送信中に予期しないエラーが発生しました'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
