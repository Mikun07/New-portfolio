import emailjs from 'emailjs-com'

export interface EmailPayload {
  user_name: string
  user_email: string
  user_subject: string
  user_message: string
  [key: string]: unknown
}

export function sendContactEmail(payload: EmailPayload): Promise<void> {
  return emailjs
    .send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      payload,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    )
    .then(() => undefined)
}
