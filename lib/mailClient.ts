// lib/mailClient.ts

// lib/mailClient.ts
console.log('📨 MAILERSEND_API_KEY:', process.env.MAILERSEND_API_KEY?.slice(0,10) + '…')

import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'

type SendParams = {
  to: string
  subject: string
  body: string
}

export async function sendMail({ to, subject, body }: SendParams) {
  if (process.env.MAIL_PROVIDER !== 'mailersend') {
    throw new Error('MAIL_PROVIDER が mailersend に設定されていません')
  }

  const ms = new MailerSend({
    apiKey: process.env.MAILERSEND_API_KEY!,
  })

  // 送信元
  const from = new Sender(
    process.env.MAILERSEND_FROM_EMAIL!,
    process.env.MAILERSEND_FROM_NAME!
  )

  // 宛先
  const toList = [ new Recipient(to) ]

  const emailParams = new EmailParams()
    .setFrom(from)
    .setTo(toList)
    .setSubject(subject)
    .setText(body)

  // ← 注意：ここを .email.send に変える
  await ms.email.send(emailParams)
}
