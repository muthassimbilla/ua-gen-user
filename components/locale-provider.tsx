"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Locale, defaultLocale, getMessages } from '@/lib/i18n'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: ReturnType<typeof getMessages>
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

interface LocaleProviderProps {
  children: ReactNode
  initialLocale?: Locale
}

export function LocaleProvider({ children, initialLocale = defaultLocale }: LocaleProviderProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale)
  const [messages, setMessages] = useState(getMessages(initialLocale))

  useEffect(() => {
    setMessages(getMessages(locale))
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale)
    }
  }, [locale])

  useEffect(() => {
    // Load from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') as Locale
      if (savedLocale && savedLocale !== locale) {
        setLocale(savedLocale)
      }
    }
  }, [])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

