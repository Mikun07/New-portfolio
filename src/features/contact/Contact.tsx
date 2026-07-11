import { useReducer, type ChangeEvent, type FormEvent } from 'react'
import { useLanguage } from '../../core/providers/LanguageProvider'
import { useToast } from '../../core/providers/ToastProvider'
import { sendContactEmail } from '../../infrastructure/email/emailService'
import { formReducer, initialFormState, type FormField } from './formReducer'

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

const socialLinks = [
  {
    id: 1,
    icon: 'logo-linkedin',
    href: 'https://www.linkedin.com/in/ayomikun-festus-olaleye-bab137249/',
    label: 'LinkedIn',
  },
  {
    id: 2,
    icon: 'logo-github',
    href: 'https://github.com/Mikun07',
    label: 'GitHub',
  },
]

function Contact() {
  const { t } = useLanguage()
  const { showToast } = useToast()
  const [state, dispatch] = useReducer(formReducer, initialFormState)
  const { name, email, subject, message, sending } = state

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name as FormField,
      value: e.target.value,
    })
  }

  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    dispatch({ type: 'SET_SENDING', value: true })

    sendContactEmail({ user_name: name, user_email: email, user_subject: subject, user_message: message })
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
      style={{ backgroundColor: 'var(--bg-section)' }}
    >
      <div className="section-wrap">
        {/* Header */}
        <div className="mb-12">
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            {t.contact.heading}
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: contact info + social */}
          <div className="flex flex-col gap-6 lg:w-[300px] shrink-0">
            <p className="text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
              {t.contact.intro}
            </p>

            {/* Contact detail cards */}
            <div className="flex flex-col gap-3">
              {contactDetails.map(({ id, icon, label, value, href }) => (
                <div
                  key={id}
                  className="clay-card-sm p-4 flex items-center gap-4"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg clay-card-sm"
                    style={{
                      backgroundColor: 'var(--accent-dim)',
                      color: 'var(--accent)',
                    }}
                  >
                    <ion-icon name={icon}></ion-icon>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {label}
                    </span>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium transition-colors duration-200"
                        style={{ color: 'var(--text-primary)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {value}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map(({ id, icon, href, label }) => (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg clay-card-sm transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  <ion-icon name={icon}></ion-icon>
                </a>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <form
            onSubmit={sendMessage}
            className="clay-card p-6 sm:p-8 flex-1 flex flex-col gap-5"
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
                  className="clay-input"
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
                  className="clay-input"
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
                className="clay-input"
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
                className="clay-input resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={sending}
              className="clay-btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ion-icon name={sending ? 'reload-outline' : 'paper-plane-outline'}></ion-icon>
              {sending ? t.contact.sending : t.contact.send}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
