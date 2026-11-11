import { createContext, useContext } from 'react'
import type { Uporabnik, Vloga } from '../lib/api'

export type PodatkiRegistracije = {
  email: string
  geslo: string
  prikaznoIme: string
  telefon?: string
  vloga: Exclude<Vloga, 'ADMIN'>
}

export type AuthKontekst = {
  uporabnik: Uporabnik | null
  nalagam: boolean
  prijava: (email: string, geslo: string) => Promise<void>
  registracija: (podatki: PodatkiRegistracije) => Promise<void>
  odjava: () => Promise<void>
}

export const AuthContext = createContext<AuthKontekst | null>(null)

export function useAuth(): AuthKontekst {
  const kontekst = useContext(AuthContext)
  if (!kontekst) throw new Error('useAuth se uporablja znotraj AuthProvider')
  return kontekst
}
