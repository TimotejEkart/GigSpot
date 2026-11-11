import { useEffect, useState, type ReactNode } from 'react'
import { api, type Uporabnik } from '../lib/api'
import { AuthContext, type PodatkiRegistracije } from './kontekst'

type Odgovor = { uporabnik: Uporabnik }

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [uporabnik, setUporabnik] = useState<Uporabnik | null>(null)
  const [nalagam, setNalagam] = useState(true)

  // ob nalaganju strani preveri, će je uporabnik že prijavljen z cookiem
  useEffect(() => {
    api<Odgovor>('/auth/me')
      .then((o) => setUporabnik(o.uporabnik))
      .catch(() => setUporabnik(null))
      .finally(() => setNalagam(false))
  }, [])

  async function prijava(email: string, geslo: string) {
    const o = await api<Odgovor>('/auth/login', { method: 'POST', body: { email, geslo } })
    setUporabnik(o.uporabnik)
  }

  async function registracija(podatki: PodatkiRegistracije) {
    const o = await api<Odgovor>('/auth/register', { method: 'POST', body: podatki })
    setUporabnik(o.uporabnik)
  }

  async function odjava() {
    await api('/auth/logout', { method: 'POST' })
    setUporabnik(null)
  }

  return (
    <AuthContext.Provider value={{ uporabnik, nalagam, prijava, registracija, odjava }}>
      {children}
    </AuthContext.Provider>
  )
}
