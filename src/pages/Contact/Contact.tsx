import { useReducer } from 'react'
import emailjs from 'emailjs-com'
import { useLanguage } from '../../context/LanguageContext'
import { useToast } from '../../context/ToastContext'

interface FormState {
  name: string
  email: string
  subject: string
  message: string
  sending: boolean
}

type FormAction =
  | { type: 'SET_FIELD'; field: keyof Omit<FormState, 'sending'>; value: string }
  | { type: 'SET_SENDING'; value: boolean }
  | { type: 'RESET' }

const initialState: FormState = {
  name: '',
  email: '',
  subject: '',
  message: '',
  sending: false,
}

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'SET_SENDING':
      return { ...state, sending: action.value }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const contactDetails = [
  {
    id: 1,
    icon: 'mail-outline',
    label: 'Email',
    value: 'ayomikunolaleye@gmail.com',
    href: 'mailto:ayomikunolaleye@gmail.com',
  },
  {
    id: 2,
    icon: 'call-outline',
    label: 'Phone',
    value: '(+46) 76 264 0140',
    href: 'tel:+46762640140',
  },
  {
    id: 3,
    icon: 'location-outline',
    label: 'Location',
    value: 'Karlskrona, Sweden',
    href: null,
  },
]

function Contact() {
  const { t } = useLanguage()
  const { showToast } = useToast()
  const [state, dispatch] = useReducer(formReducer, initialState)
  const { name, email, subject, message, sending } = state

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name as keyof Omit<FormState, 'sending'>,
      value: e.target.value,
    })
  }

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    dispatch({ type: 'SET_SENDING', value: true })

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          user_name: name,
          user_email: email,
          user_subject: subject,
          user_message: message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        showToast(t.contact.successToast, 'success')
        dispatch({ type: 'RESET' })
      })
      .catch(() => {
        showToast(t.contact.errorToast, 'error')
      })
      .finally(() => dispatch({ type: 'SET_SENDING', value: false }))
  }

  return (
    <section
      name="contact"
      className="min-h-screen flex flex-col justify-center px-6 lg:px-10 py-24"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* ── Section header ── */}
      <div className="mb-10">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--accent)' }}
        >
          {t.contact.eyebrow}
        </p>
        <h2
          className="text-3xl font-bold"
          style={{ color: 'var(--text-primary)' }}
        >
          {t.contact.heading}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">

        {/* ── Left — contact info ── */}
        <div className="flex flex-col gap-6 lg:w-[280px] shrink-0">
          <p
            className="text-sm leading-7"
            style={{ color: 'var(--text-secondary)' }}
          >
            {t.contact.intro}
          </p>

          <div className="flex flex-col gap-3">
            {contactDetails.map(({ id, icon, label, value, href }) => (
              <div
                key={id}
                className="flex items-center gap-4 p-4 rounded-xl border"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-base"
                  style={{
                    backgroundColor: 'var(--accent-dim)',
                    color: 'var(--accent)',
                  }}
                >
                  <ion-icon name={icon}></ion-icon>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {label}
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: 'var(--text-primary)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    >
                      {value}
                    </a>
                  ) : (
                    <span
                      className="text-sm font-medium"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right — form ── */}
        <form
          onSubmit={sendMessage}
          className="flex-1 flex flex-col gap-5 p-6 rounded-xl border"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          {/* Name + Email row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="name"
                className="text-xs font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t.contact.name}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder={t.contact.namePlaceholder}
                required
                value={name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors duration-200 font-medium"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-semibold"
                style={{ color: 'var(--text-secondary)' }}
              >
                {t.contact.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder={t.contact.emailPlaceholder}
                required
                value={email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors duration-200 font-medium"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg)',
                  color: 'var(--text-primary)',
                  fontFamily: 'Inter, sans-serif',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="subject"
              className="text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t.contact.subject}
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder={t.contact.subjectPlaceholder}
              required
              value={subject}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors duration-200 font-medium"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text-primary)',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="message"
              className="text-xs font-semibold"
              style={{ color: 'var(--text-secondary)' }}
            >
              {t.contact.message}
            </label>
            <textarea
              id="message"
              name="message"
              placeholder={t.contact.messagePlaceholder}
              required
              rows={6}
              value={message}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border text-sm outline-none transition-colors duration-200 font-medium resize-none"
              style={{
                borderColor: 'var(--border)',
                backgroundColor: 'var(--bg)',
                color: 'var(--text-primary)',
                fontFamily: 'Inter, sans-serif',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={sending}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: 'var(--accent)' }}
            onMouseEnter={(e) => {
              if (!sending) e.currentTarget.style.backgroundColor = 'var(--accent-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent)'
            }}
          >
            <ion-icon name={sending ? 'reload-outline' : 'paper-plane-outline'}></ion-icon>
            {sending ? t.contact.sending : t.contact.send}
          </button>
        </form>
      </div>
    </section>
  )
}

export default Contact
