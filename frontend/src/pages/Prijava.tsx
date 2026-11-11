import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Card, Field, Opozorilo, buttonClass, inputClass } from '../components/ui'
import { useAuth } from '../auth/kontekst'
import { ApiNapaka } from '../lib/api'

export default function Prijava() {
  const { uporabnik, prijava } = useAuth()
  const navigate = useNavigate()
  const lokacija = useLocation()
  const iz = (lokacija.state as { iz?: string } | null)?.iz ?? '/'

  const [email, setEmail] = useState('')
  const [geslo, setGeslo] = useState('')
  const [napaka, setNapaka] = useState('')
  const [polja, setPolja] = useState<Record<string, string>>({})
  const [posiljam, setPosiljam] = useState(false)

  if (uporabnik) return <Navigate to={iz} replace />

  async function oddaj(e: FormEvent) {
    e.preventDefault()
    setNapaka('')
    setPolja({})
    setPosiljam(true)
    try {
      await prijava(email, geslo)
      navigate(iz, { replace: true })
    } catch (err) {
      if (err instanceof ApiNapaka) {
        setPolja(err.polja)
        if (Object.keys(err.polja).length === 0) setNapaka(err.message)
      } else {
        setNapaka('Strežnik ni dosegljiv.')
      }
    } finally {
      setPosiljam(false)
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <form onSubmit={oddaj} className="space-y-5" noValidate>
        <h1 className="text-2xl font-semibold">Prijava</h1>
        {napaka && <Opozorilo>{napaka}</Opozorilo>}
        <Field label="E-pošta" napaka={polja.email}>
          <input type="email" autoComplete="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Geslo" napaka={polja.geslo}>
          <input type="password" autoComplete="current-password" className={inputClass} value={geslo} onChange={(e) => setGeslo(e.target.value)} />
        </Field>
        <button type="submit" className={`${buttonClass} w-full`} disabled={posiljam}>
          {posiljam ? 'Prijavljam …' : 'Prijava'}
        </button>
        <p className="text-center text-sm text-muted">
          Še nimaš računa?{' '}
          <Link to="/registracija" className="text-accent hover:underline">
            Registracija
          </Link>
        </p>
      </form>
    </Card>
  )
}
