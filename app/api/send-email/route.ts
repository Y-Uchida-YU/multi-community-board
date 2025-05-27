// app/api/send-email/route.ts

import { NextResponse } from 'next/server'
import { sendMail } from '../../../lib/mailClient'

export async function POST(request: Request) {
  const { to, subject, body } = await request.json()
  console.log('[send-email]', { to, subject, body })

  try {
    await sendMail({ to, subject, body })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Mail send error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
