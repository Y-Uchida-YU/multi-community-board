// app/api/send-email/route.ts

import { NextResponse } from 'next/server'
import { sendMail } from '../../../lib/mailClient'

export async function POST(request: Request) {
  const { from, to, subject, body } = await request.json()
  console.log('[send-email]', { from, to, subject, body })

  try {
    await sendMail({ from, to, subject, body })
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
