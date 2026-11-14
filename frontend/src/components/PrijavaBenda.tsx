import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Card, Field, Opozorilo, buttonClass, inputClass } from './ui'
import { ApiNapaka, api } from '../lib/api'
import { statusiPrijave, type PrijavaBenda as Prijava, type Termin } from '../lib/termini'

type MojBend = { id: number; ime: string; jeVodja: boolean }

// prijava benda na termin, oddati jo lahko samo vodja
export default function PrijavaBenda({ termin }: { termin: Termin }) {
  const [bendi, setBendi] = useState<MojBend[] | null>(null)
  const [bendId, setBendId] = useState('')
  const [prijava, setPrijava] = useState<Prijava | null>(null)
  const [konflikt, setKonflikt] = useState<string | null>(null)
  const [sporocilo, setSporocilo] = useState('')
  const [napaka, setNapaka] = useState('')
  const [posiljam, setPosiljam] = useState(false)
  const [osvezitev, setOsvezitev] = useState(0)
  const [zdaj] = useState(() => Date.now())

  useEffect(() => {
    api<{ bendi: MojBend[] }>('/bands/mine')
      .then((o) => {
        setBendi(o.bendi)
        const privzet = o.bendi.find((b) => b.jeVodja) ?? o.bendi[0]
        if (privzet) setBendId(String(privzet.id))
      })
      .catch(() => setBendi([]))
  }, [])

  // ali je izbrani bend že prijavljen in ali ima kateri član konflikt
  useEffect(() => {
    if (!bendId) return
    api<{ prijave: Prijava[] }>(`/bands/${bendId}/applications`)
      .then((o) => setPrijava(o.prijave.find((p) => p.termin.id === termin.id) ?? null))
      .catch(() => setPrijava(null))
    api<{ sporocilo: string | null }>(`/slots/${termin.id}/conflicts?bandId=${bendId}`)
      .then((o) => setKonflikt(o.sporocilo))
      .catch(() => setKonflikt(null))
  }, [bendId, termin.id, osvezitev])

  async function oddaj(e: FormEvent) {
    e.preventDefault()
    setNapaka('')
    setPosiljam(true)
    try {
      await api(`/slots/${termin.id}/applications`, { method: 'POST', body: { bendId: Number(bendId), sporocilo } })
      setSporocilo('')
      setOsvezitev((n) => n + 1)
    } catch (err) {
      if (err instanceof ApiNapaka) setNapaka(err.polja.sporocilo ?? err.message)
      else setNapaka('Strežnik ni dosegljiv.')
    } finally {
      setPosiljam(false)
    }
  }

  if (bendi === null) return null

  const bend = bendi.find((b) => String(b.id) === bendId)
  const rokPotekel = termin.status !== 'ODPRT' || new Date(termin.rokPrijave).getTime() <= zdaj

  return (
    <Card className="h-fit space-y-5">
      <h2 className="text-xl font-semibold">Prijava benda</h2>

      {bendi.length === 0 ? (
        <p className="text-sm text-muted">
          Za prijavo moraš biti član benda.{' '}
          <Link to="/bendi" className="text-accent hover:underline">
            Ustvari bend
          </Link>
        </p>
      ) : (
        <>
          <Field label="Bend">
            <select className={inputClass} value={bendId} onChange={(e) => setBendId(e.target.value)}>
              {bendi.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.ime} {b.jeVodja ? '(vodja)' : ''}
                </option>
              ))}
            </select>
          </Field>

          {prijava ? (
            <div className="rounded-lg border border-line px-4 py-3 text-sm">
              Bend je na ta termin že prijavljen. Status: <span className="font-semibold">{statusiPrijave[prijava.status]}</span>
              {prijava.sporocilo && <p className="mt-2 text-muted">„{prijava.sporocilo}"</p>}
            </div>
          ) : rokPotekel ? (
            <p className="text-sm text-muted">Rok za prijave je potekel.</p>
          ) : !bend?.jeVodja ? (
            <p className="text-sm text-muted">Prijavo lahko odda samo vodja benda.</p>
          ) : (
            <form onSubmit={oddaj} noValidate className="space-y-5">
              {konflikt && <Opozorilo>{konflikt}</Opozorilo>}
              <Field label="Sporočilo organizatorju (neobvezno)">
                <textarea rows={4} maxLength={500} className={inputClass} value={sporocilo} onChange={(e) => setSporocilo(e.target.value)} />
                <span className="mt-1 block text-right text-xs text-muted">{sporocilo.length}/500</span>
              </Field>
              {napaka && <Opozorilo>{napaka}</Opozorilo>}
              <button type="submit" className={`${buttonClass} w-full`} disabled={posiljam || konflikt !== null}>
                {posiljam ? 'Pošiljam …' : 'Prijavi bend'}
              </button>
            </form>
          )}
        </>
      )}
    </Card>
  )
}
