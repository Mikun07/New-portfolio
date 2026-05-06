import { createContext, useContext, useState, ReactNode } from 'react'
import type { Translations } from '../i18n/translations/en'
import en from '../i18n/translations/en'
import sv from '../i18n/translations/sv'
import fr from '../i18n/translations/fr'
import nl from '../i18n/translations/nl'

export type Locale = 'en' | 'sv' | 'fr' | 'nl'

export interface Language {
  code: Locale
  label: string
  flag: string
}

export const languages: Language[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'sv', label: 'Svenska', flag: '🇸🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
]

const translationMap: Record<Locale, Translations> = { en, sv, fr, nl }

interface LanguageContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem('locale') as Locale | null
    return stored && translationMap[stored] ? stored : 'en'
  })

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translationMap[locale] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
