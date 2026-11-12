import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Empty, Opozorilo, PageTitle, inputClass } from '../components/ui'
import { ApiNapaka, api } from '../lib/api'
import { formatDatum, formatRok, opisPlacila, steviloBendov, type Termin } from '../lib/termini'

type NajdenTermin = Termin & { ujemaSe: boolean }
type MojBend = { id: number; ime: string }

const prazniFiltri = { mesto: '', od: '', do: '' }

// Iskanje odprtih terminov za glasbenika (US-03).
export default function ProstiTermini() {
  const [termini, setTermini] = useState<NajdenTermin[] | null>(null)
  const [mesta, setMesta] = useState<string[]>([])
  const [bendi, setBendi] = useState<MojBend[]>([])
  const [bendId, setBendId] = useState('')
  const [filtri, setFiltri] = useState(prazniFiltri)
  const [napaka, setNapaka] = useState('')

  useEffect(() => {
    api<{ bendi: MojBend[] }>('/bands/mine')
      .then((o) => {
        setBendi(o.bendi)
        if (o.bendi.length > 0) setBendId(String(o.bendi[0].id))
      })
      .catch(() => setBendi([]))
  }, [])

  useEffect(() => {
    const parametri = new URLSearchParams()
    if (filtri.mesto) parametri.set('mesto', filtri.mesto)
    if (filtri.od) parametri.set('od', filtri.od)
    if (filtri.do) parametri.set('do', filtri.do)
    if (bendId) parametri.set('bandId', bendId)

    api<{ termini: NajdenTermin[]; mesta: string[] }>(`/slots?${parametri}`)
      .then((o) => {
        setTermini(o.termini)
        setMesta(o.mesta)
        setNapaka('')
      })
      .catch((err) => setNapaka(err instanceof ApiNapaka ? err.message : 'Strežnik ni dosegljiv.'))
  }, [filtri, bendId])

  const imaFiltre = filtri.mesto || filtri.od || filtri.do

  return (
    <>
      <PageTitle>Prosti termini</PageTitle>

      <Card className="mb-6 grid gap-4 p-5 sm:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Mesto</span>
          <select className={inputClass} value={filtri.mesto} onChange={(e) => setFiltri({ ...filtri, mesto: e.target.value })}>
            <option value="">Vsa mesta</option>
            {mesta.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Od</span>
          <input type="date" className={inputClass} value={filtri.od} onChange={(e) => setFiltri({ ...filtri, od: e.target.value })} />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Do</span>
          <input type="date" className={inputClass} value={filtri.do} onChange={(e) => setFiltri({ ...filtri, do: e.target.value })} />
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium">Žanri benda</span>
          <select className={inputClass} value={bendId} onChange={(e) => setBendId(e.target.value)}>
            <option value="">Brez benda</option>
            {bendi.map((b) => (
              <option key={b.id} value={b.id}>
                {b.ime}
              </option>
            ))}
          </select>
        </label>
        {imaFiltre && (
          <button className="text-left text-sm text-accent hover:underline sm:col-span-4" onClick={() => setFiltri(prazniFiltri)}>
            Počisti filtre
          </button>
        )}
      </Card>

      {napaka && (
        <div className="mb-6">
          <Opozorilo>{napaka}</Opozorilo>
        </div>
      )}

      {termini !== null && termini.length === 0 && <Empty>Ni odprtih terminov za izbrane filtre</Empty>}

      {termini !== null && termini.length > 0 && (
        <div className="space-y-3">
          {termini.map((t) => (
            <Link key={t.id} to={`/termini/${t.id}`} className="block">
              <Card className={`py-4 transition hover:border-accent ${t.ujemaSe ? 'border-accent/40' : ''}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {t.prizorisce.ime} <span className="font-normal text-muted">· {t.prizorisce.mesto}</span>
                    </p>
                    <p className="text-sm">{formatDatum(t.datum)}</p>
                  </div>
                  {t.ujemaSe && (
                    <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-white">Ujema se z žanrom</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted">
                  Iščejo {steviloBendov(t.stBendov)} · {opisPlacila(t)} · rok za prijave {formatRok(t.rokPrijave)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.zanri.map((z) => (
                    <span key={z.id} className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                      {z.ime}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
