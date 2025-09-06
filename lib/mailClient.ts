// lib/mailClient.ts

console.log('📨 MAILERSEND_API_KEY:', process.env.MAILERSEND_API_KEY?.slice(0,10) + '…')

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

type SendParams = {
  from: string
  to: string
  subject: string
  body: string
}

export async function sendMail({ from, to, subject, body }: SendParams) {
  if (process.env.MAIL_PROVIDER !== 'mailersend') {
    throw new Error('MAIL_PROVIDER が mailersend に設定されていません')
  }

  if (!process.env.MAILERSEND_API_KEY) {
    throw new Error('MAILERSEND_API_KEY が設定されていません')
  }

  if (!process.env.MAILERSEND_FROM_EMAIL || !process.env.MAILERSEND_FROM_NAME) {
    throw new Error('MAILERSEND_FROM_EMAIL または MAILERSEND_FROM_NAME が設定されていません')
  }

  const ms = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY,
  })

  // 送信元（システム既定）
  const sender = new Sender(
    process.env.MAILERSEND_FROM_EMAIL,
    process.env.MAILERSEND_FROM_NAME,
  )

  // 宛先
  const toList = [ new Recipient(to) ]

  // Reply-To にユーザー入力のメールアドレスを設定
  const replyTo = new Recipient(from)

  const emailParams = new EmailParams()
    .setFrom(sender)
    .setTo(toList)
    .setSubject(subject)
    .setText(body)
    .setReplyTo(replyTo)

  // ← 注意：ここを .email.send に変える
  await ms.email.send(emailParams)
}

