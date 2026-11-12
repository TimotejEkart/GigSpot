import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Card, Empty, Field, Opozorilo, PageTitle, buttonClass, inputClass } from '../components/ui'
import { ApiNapaka, api } from '../lib/api'
import { formatDatum, formatRok, naciniPlacila, opisPlacila, statusiTermina, steviloBendov, type NacinPlacila, type Termin } from '../lib/termini'

type Prizorisce = { id: number; ime: string; mesto: string }
type Zanr = { id: number; ime: string }

const prazenObrazec = {
  prizorisceId: '',
  datum: '',
  stBendov: '2',
  nacinPlacila: 'BREZ' as NacinPlacila,
  znesek: '',
  rokPrijave: '',
  zanri: [] as number[],
}

const jutri = () => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toLocaleDateString('sv-SE')
}

// Organizatorjev pregled terminov in obrazec za razpis (US-02).
export default function MojiTermini() {
  const [termini, setTermini] = useState<Termin[] | null>(null)
  const [prizorisca, setPrizorisca] = useState<Prizorisce[]>([])
  const [zanri, setZanri] = useState<Zanr[]>([])
  const [napaka, setNapaka] = useState('')

  const [odprtObrazec, setOdprtObrazec] = useState(false)
  const [obrazec, setObrazec] = useState(prazenObrazec)
  const [polja, setPolja] = useState<Record<string, string>>({})
  const [posiljam, setPosiljam] = useState(false)

  useEffect(() => {
    Promise.all([
      api<{ termini: Termin[] }>('/slots/mine'),
      api<{ prizorisca: Prizorisce[] }>('/venues'),
      api<{ zanri: Zanr[] }>('/genres'),
    ])
      .then(([t, p, z]) => {
        setTermini(t.termini)
        setPrizorisca(p.prizorisca)
        setZanri(z.zanri)
      })
      .catch(() => setNapaka('Podatkov ni bilo mogoče naložiti.'))
  }, [])

  function nastavi<K extends keyof typeof prazenObrazec>(polje: K, vrednost: (typeof prazenObrazec)[K]) {
    setObrazec((o) => ({ ...o, [polje]: vrednost }))
  }

  function preklopiZanr(id: number) {
    nastavi('zanri', obrazec.zanri.includes(id) ? obrazec.zanri.filter((z) => z !== id) : [...obrazec.zanri, id])
  }

  function odpriObrazec() {
    setObrazec({ ...prazenObrazec, prizorisceId: prizorisca.length === 1 ? String(prizorisca[0].id) : '' })
    setOdprtObrazec(true)
  }

  async function razpisi(e: FormEvent) {
    e.preventDefault()
    setPolja({})
    setNapaka('')
    setPosiljam(true)
    try {
      const { termin } = await api<{ termin: Termin }>('/slots', {
        method: 'POST',
        body: {
          prizorisceId: obrazec.prizorisceId === '' ? undefined : Number(obrazec.prizorisceId),
          datum: obrazec.datum || undefined,
          stBendov: obrazec.stBendov === '' ? undefined : Number(obrazec.stBendov),
          nacinPlacila: obrazec.nacinPlacila,
          znesek: obrazec.nacinPlacila === 'HONORAR' && obrazec.znesek !== '' ? Number(obrazec.znesek) : null,
          rokPrijave: obrazec.rokPrijave || undefined,
          zanri: obrazec.zanri,
        },
      })
      setTermini((t) => [...(t ?? []), termin].sort((a, b) => a.datum.localeCompare(b.datum)))
      setOdprtObrazec(false)
    } catch (err) {
      if (err instanceof ApiNapaka && Object.keys(err.polja).length > 0) setPolja(err.polja)
      else setNapaka(err instanceof ApiNapaka ? err.message : 'Strežnik ni dosegljiv.')
    } finally {
      setPosiljam(false)
    }
  }

  const brezPrizorisc = prizorisca.length === 0 && termini !== null

  return (
    <>
      <PageTitle
        aside={
          !odprtObrazec &&
          !brezPrizorisc && (
            <button className={buttonClass} onClick={odpriObrazec}>
              Razpiši termin
            </button>
          )
        }
      >
        Moji termini
      </PageTitle>

      {napaka && (
        <div className="mb-6">
          <Opozorilo>{napaka}</Opozorilo>
        </div>
      )}

      {brezPrizorisc && (
        <Empty>
          Za razpis termina najprej dodaj prizorišče na strani{' '}
          <Link to="/prizorisca" className="text-accent hover:underline">
            Prizorišča
          </Link>
          .
        </Empty>
      )}

      {odprtObrazec && (
        <Card className="mb-8">
          <form onSubmit={razpisi} noValidate className="space-y-5">
            <h2 className="text-lg font-semibold">Nov termin</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Prizorišče" napaka={polja.prizorisceId}>
                <select className={inputClass} value={obrazec.prizorisceId} onChange={(e) => nastavi('prizorisceId', e.target.value)}>
                  <option value="">Izberi prizorišče</option>
                  {prizorisca.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.ime} ({p.mesto})
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Datum koncerta" napaka={polja.datum}>
                <input type="date" min={jutri()} className={inputClass} value={obrazec.datum} onChange={(e) => nastavi('datum', e.target.value)} />
              </Field>
              <Field label="Število bendov (1–6)" napaka={polja.stBendov}>
                <input type="number" min={1} max={6} className={inputClass} value={obrazec.stBendov} onChange={(e) => nastavi('stBendov', e.target.value)} />
              </Field>
              <Field label="Rok za prijave" napaka={polja.rokPrijave}>
                <input type="datetime-local" className={inputClass} value={obrazec.rokPrijave} onChange={(e) => nastavi('rokPrijave', e.target.value)} />
              </Field>
              <Field label="Način plačila" napaka={polja.nacinPlacila}>
                <select className={inputClass} value={obrazec.nacinPlacila} onChange={(e) => nastavi('nacinPlacila', e.target.value as NacinPlacila)}>
                  {Object.entries(naciniPlacila).map(([vrednost, ime]) => (
                    <option key={vrednost} value={vrednost}>
                      {ime}
                    </option>
                  ))}
                </select>
              </Field>
              {obrazec.nacinPlacila === 'HONORAR' && (
                <Field label="Znesek honorarja (€)" napaka={polja.znesek}>
                  <input type="number" min={1} className={inputClass} value={obrazec.znesek} onChange={(e) => nastavi('znesek', e.target.value)} />
                </Field>
              )}
            </div>
            <div className="text-sm">
              <span className="mb-1.5 block font-medium">Žanri</span>
              <div className="flex flex-wrap gap-2">
                {zanri.map((z) => {
                  const izbran = obrazec.zanri.includes(z.id)
                  return (
                    <button
                      key={z.id}
                      type="button"
                      onClick={() => preklopiZanr(z.id)}
                      className={`rounded-full border px-3 py-1 text-sm ${izbran ? 'border-accent bg-accent text-white' : 'border-line hover:border-accent'}`}
                    >
                      {z.ime}
                    </button>
                  )
                })}
              </div>
              {polja.zanri && <span className="mt-1 block text-xs text-red-600">{polja.zanri}</span>}
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
                {posiljam ? 'Shranjujem …' : 'Razpiši termin'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {termini !== null && termini.length === 0 && !brezPrizorisc && !odprtObrazec && <Empty>Nimaš še razpisanih terminov.</Empty>}

      {termini !== null && termini.length > 0 && (
        <div className="space-y-3">
          {termini.map((t) => (
            <Card key={t.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div>
                <p className="font-semibold">{formatDatum(t.datum)}</p>
                <p className="text-sm text-muted">
                  {t.prizorisce.ime} · iščejo {steviloBendov(t.stBendov)} · {opisPlacila(t)} · rok {formatRok(t.rokPrijave)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.zanri.map((z) => (
                    <span key={z.id} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                      {z.ime}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full border border-line px-2.5 py-0.5 text-xs">{statusiTermina[t.status]}</span>
                <Link to={`/termini/${t.id}`} className="text-sm text-accent hover:underline">
                  Podrobnosti
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
