import { useEffect, useState, type FormEvent } from 'react'
import { Card, Empty, Field, Opozorilo, PageTitle, buttonClass, inputClass } from '../components/ui'
import { ApiNapaka, api } from '../lib/api'

type Prizorisce = {
  id: number
  ime: string
  mesto: string
  naslov: string
  kapaciteta: number | null
  kontaktTelefon: string | null
  kontaktEmail: string | null
}

const prazenObrazec = { ime: '', mesto: '', naslov: '', kapaciteta: '', kontaktTelefon: '', kontaktEmail: '' }

export default function Prizorisca() {
  const [prizorisca, setPrizorisca] = useState<Prizorisce[] | null>(null)
  const [odprtObrazec, setOdprtObrazec] = useState(false)
  const [obrazec, setObrazec] = useState(prazenObrazec)
  const [polja, setPolja] = useState<Record<string, string>>({})
  const [napaka, setNapaka] = useState('')
  const [posiljam, setPosiljam] = useState(false)

  useEffect(() => {
    api<{ prizorisca: Prizorisce[] }>('/venues')
      .then((o) => setPrizorisca(o.prizorisca))
      .catch(() => setNapaka('Prizorišč ni bilo mogoče naložiti.'))
  }, [])

  function nastavi(polje: keyof typeof prazenObrazec, vrednost: string) {
    setObrazec((o) => ({ ...o, [polje]: vrednost }))
  }

  async function shrani(e: FormEvent) {
    e.preventDefault()
    setPolja({})
    setNapaka('')
    setPosiljam(true)
    try {
      const { prizorisce } = await api<{ prizorisce: Prizorisce }>('/venues', {
        method: 'POST',
        body: { ...obrazec, kapaciteta: obrazec.kapaciteta === '' ? null : Number(obrazec.kapaciteta) },
      })
      setPrizorisca((p) => [...(p ?? []), prizorisce].sort((a, b) => a.ime.localeCompare(b.ime)))
      setObrazec(prazenObrazec)
      setOdprtObrazec(false)
    } catch (err) {
      if (err instanceof ApiNapaka && Object.keys(err.polja).length > 0) setPolja(err.polja)
      else setNapaka(err instanceof ApiNapaka ? err.message : 'Strežnik ni dosegljiv.')
    } finally {
      setPosiljam(false)
    }
  }

  return (
    <>
      <PageTitle
        aside={
          !odprtObrazec && (
            <button className={buttonClass} onClick={() => setOdprtObrazec(true)}>
              Novo prizorišče
            </button>
          )
        }
      >
        Moja prizorišča
      </PageTitle>

      {napaka && <div className="mb-6"><Opozorilo>{napaka}</Opozorilo></div>}

      {odprtObrazec && (
        <Card className="mb-8">
          <form onSubmit={shrani} noValidate className="space-y-5">
            <h2 className="text-lg font-semibold">Novo prizorišče</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Ime" napaka={polja.ime}>
                <input className={inputClass} value={obrazec.ime} onChange={(e) => nastavi('ime', e.target.value)} />
              </Field>
              <Field label="Mesto" napaka={polja.mesto}>
                <input className={inputClass} value={obrazec.mesto} onChange={(e) => nastavi('mesto', e.target.value)} />
              </Field>
              <Field label="Naslov" napaka={polja.naslov}>
                <input className={inputClass} value={obrazec.naslov} onChange={(e) => nastavi('naslov', e.target.value)} />
              </Field>
              <Field label="Kapaciteta (neobvezno)" napaka={polja.kapaciteta}>
                <input type="number" min={1} className={inputClass} value={obrazec.kapaciteta} onChange={(e) => nastavi('kapaciteta', e.target.value)} />
              </Field>
              <Field label="Kontaktni telefon (neobvezno)" napaka={polja.kontaktTelefon}>
                <input type="tel" className={inputClass} value={obrazec.kontaktTelefon} onChange={(e) => nastavi('kontaktTelefon', e.target.value)} />
              </Field>
              <Field label="Kontaktni e-naslov (neobvezno)" napaka={polja.kontaktEmail}>
                <input type="email" className={inputClass} value={obrazec.kontaktEmail} onChange={(e) => nastavi('kontaktEmail', e.target.value)} />
              </Field>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded-md border border-line px-4 py-2 text-sm hover:bg-paper"
                onClick={() => {
                  setOdprtObrazec(false)
                  setPolja({})
                }}
              >
                Prekliči
              </button>
              <button type="submit" className={buttonClass} disabled={posiljam}>
                {posiljam ? 'Shranjujem …' : 'Shrani prizorišče'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {prizorisca === null ? null : prizorisca.length === 0 ? (
        !odprtObrazec && <Empty>Nimaš še dodanih prizorišč.</Empty>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {prizorisca.map((p) => (
            <Card key={p.id}>
              <h3 className="font-semibold">{p.ime}</h3>
              <p className="text-sm text-muted">
                {p.naslov}, {p.mesto}
              </p>
              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-muted">Kapaciteta</dt><dd>{p.kapaciteta ?? '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">Telefon</dt><dd>{p.kontaktTelefon ?? '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-muted">E-pošta</dt><dd>{p.kontaktEmail ?? '—'}</dd></div>
              </dl>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
