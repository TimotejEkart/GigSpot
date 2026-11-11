import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Card, Field, Opozorilo, buttonClass, inputClass } from '../components/ui'
import { useAuth, type PodatkiRegistracije } from '../auth/kontekst'
import { ApiNapaka } from '../lib/api'

const zacetno: PodatkiRegistracije = { email: '', geslo: '', prikaznoIme: '', telefon: '', vloga: 'GLASBENIK' }

export default function Registracija() {
  const { uporabnik, registracija } = useAuth()
  const navigate = useNavigate()

  const [podatki, setPodatki] = useState(zacetno)
  const [napaka, setNapaka] = useState('')
  const [polja, setPolja] = useState<Record<string, string>>({})
  const [posiljam, setPosiljam] = useState(false)

  if (uporabnik) return <Navigate to="/" replace />

  function nastavi<K extends keyof PodatkiRegistracije>(polje: K, vrednost: PodatkiRegistracije[K]) {
    setPodatki((p) => ({ ...p, [polje]: vrednost }))
  }

  async function oddaj(e: FormEvent) {
    e.preventDefault()
    setNapaka('')
    setPolja({})
    setPosiljam(true)
    try {
      await registracija(podatki)
      navigate('/', { replace: true })
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
        <h1 className="text-2xl font-semibold">Registracija</h1>
        {napaka && <Opozorilo>{napaka}</Opozorilo>}
        <Field label="Ime in priimek" napaka={polja.prikaznoIme}>
          <input autoComplete="name" className={inputClass} value={podatki.prikaznoIme} onChange={(e) => nastavi('prikaznoIme', e.target.value)} />
        </Field>
        <Field label="E-pošta" napaka={polja.email}>
          <input type="email" autoComplete="email" className={inputClass} value={podatki.email} onChange={(e) => nastavi('email', e.target.value)} />
        </Field>
        <Field label="Telefon (neobvezno)" napaka={polja.telefon}>
          <input type="tel" autoComplete="tel" className={inputClass} value={podatki.telefon} onChange={(e) => nastavi('telefon', e.target.value)} />
        </Field>
        <Field label="Geslo" napaka={polja.geslo}>
          <input type="password" autoComplete="new-password" className={inputClass} value={podatki.geslo} onChange={(e) => nastavi('geslo', e.target.value)} />
        </Field>
        <Field label="Vloga" napaka={polja.vloga}>
          <select className={inputClass} value={podatki.vloga} onChange={(e) => nastavi('vloga', e.target.value as PodatkiRegistracije['vloga'])}>
            <option value="GLASBENIK">Glasbenik</option>
            <option value="ORGANIZATOR">Organizator</option>
            <option value="OBISKOVALEC">Obiskovalec</option>
          </select>
        </Field>
        <button type="submit" className={`${buttonClass} w-full`} disabled={posiljam}>
          {posiljam ? 'Ustvarjam račun …' : 'Ustvari račun'}
        </button>
        <p className="text-center text-sm text-muted">
          Že imaš račun?{' '}
          <Link to="/prijava" className="text-accent hover:underline">
            Prijava
          </Link>
        </p>
      </form>
    </Card>
  )
}
