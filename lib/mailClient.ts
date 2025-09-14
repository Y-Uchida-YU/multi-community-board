// lib/mailClient.ts

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

type SendParams = {
  to: string
  subject: string
  body: string
  replyTo?: string
}

export async function sendMail({ to, subject, body, replyTo }: SendParams) {
  console.log('[mailClient:params]', { to, subject, body, replyTo })
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

  // メールパラメータの組み立て
  let emailParams = new EmailParams()
    .setFrom(sender)
    .setTo(toList)
    .setSubject(subject)
    .setText(body)

  // Reply-To にユーザー入力のメールアドレスを設定
  if (replyTo) {
    emailParams = emailParams.setReplyTo(new Recipient(replyTo))
  }

  // ← 注意：ここを .email.send に変える
  await ms.email.send(emailParams)
}

