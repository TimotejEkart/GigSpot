import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, Empty, Opozorilo, PageTitle, buttonClass } from '../components/ui'
import { ApiNapaka, api } from '../lib/api'
import { formatDatum, statusiPrijave, statusiTermina, type StatusPrijave, type StatusTermina } from '../lib/termini'

type Prijava = {
  id: number
  status: StatusPrijave
  sporocilo: string | null
  bend: { id: number; ime: string; mesto: string; zanri: { id: number; ime: string }[] }
  vodja: { prikaznoIme: string; email: string; telefon: string | null } | null
}

type Pregled = {
  termin: { id: number; datum: string; stBendov: number; status: StatusTermina; prizorisce: { ime: string }; sprejetih: number }
  prijave: Prijava[]
}

const barveStatusa: Partial<Record<StatusPrijave, string>> = {
  OZJI_IZBOR: 'bg-amber-50 text-amber-700',
  SPREJETA: 'bg-emerald-50 text-emerald-700',
  ZAVRNJENA: 'bg-red-50 text-red-700',
}

// pregled prijav in izbor zasedbe za organizatorja
export default function PrijaveNaTermin() {
  const { id } = useParams()
  const [pregled, setPregled] = useState<Pregled | null>(null)
  const [napaka, setNapaka] = useState('')
  const [obdelujem, setObdelujem] = useState<number | null>(null)
  const [osvezitev, setOsvezitev] = useState(0)

  useEffect(() => {
    api<Pregled>(`/slots/${id}/applications`)
      .then(setPregled)
      .catch((err) => setNapaka(err instanceof ApiNapaka ? err.message : 'Strežnik ni dosegljiv.'))
  }, [id, osvezitev])

  async function spremeni(prijavaId: number, status: 'OZJI_IZBOR' | 'SPREJETA' | 'ZAVRNJENA') {
    setNapaka('')
    setObdelujem(prijavaId)
    try {
      await api(`/applications/${prijavaId}/status`, { method: 'PATCH', body: { status } })
      setOsvezitev((n) => n + 1)
    } catch (err) {
      setNapaka(err instanceof ApiNapaka ? err.message : 'Strežnik ni dosegljiv.')
    } finally {
      setObdelujem(null)
    }
  }

  if (!pregled) return napaka ? <Empty>{napaka}</Empty> : null

  const { termin, prijave } = pregled
  const odprt = termin.status === 'ODPRT'
  const seEnoMesto = odprt && termin.sprejetih === termin.stBendov - 1

  return (
    <>
      <Link to={`/termini/${termin.id}`} className="mb-6 inline-block text-sm text-muted hover:text-ink">
        ← Nazaj na termin
      </Link>
      <PageTitle
        aside={
          <div className="flex items-center gap-3 text-sm">
            <span className="rounded-full border border-line px-2.5 py-0.5 text-xs">{statusiTermina[termin.status]}</span>
            <span>
              Zasedba <span className="font-semibold">{termin.sprejetih} / {termin.stBendov}</span>
            </span>
          </div>
        }
      >
        Prijave na termin
      </PageTitle>
      <p className="-mt-6 mb-8 text-sm text-muted">
        {termin.prizorisce.ime} · {formatDatum(termin.datum)}
      </p>

      {napaka && (
        <div className="mb-6">
          <Opozorilo>{napaka}</Opozorilo>
        </div>
      )}

      {prijave.length === 0 ? (
        <Empty>Na ta termin še ni prijav.</Empty>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Bend</th>
                <th className="px-5 py-3 font-medium">Sporočilo</th>
                <th className="px-5 py-3 font-medium">Kontakt vodje</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {prijave.map((p) => {
                const odprta = odprt && (p.status === 'ODDANA' || p.status === 'OZJI_IZBOR')
                return (
                  <tr key={p.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium">{p.bend.ime}</p>
                      <p className="text-xs text-muted">{p.bend.mesto}</p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {p.bend.zanri.map((z) => (
                          <span key={z.id} className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                            {z.ime}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="max-w-xs px-5 py-4 text-muted">{p.sporocilo ?? '—'}</td>
                    <td className="px-5 py-4">
                      {p.vodja ? (
                        <>
                          <p>{p.vodja.prikaznoIme}</p>
                          <p className="text-xs text-muted">{p.vodja.email}</p>
                          {p.vodja.telefon && <p className="text-xs text-muted">{p.vodja.telefon}</p>}
                        </>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs ${barveStatusa[p.status] ?? 'border border-line'}`}>
                        {statusiPrijave[p.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {odprta && (
                        <div className="flex justify-end gap-2">
                          {p.status === 'ODDANA' && (
                            <button
                              className="whitespace-nowrap rounded-md border border-line px-3 py-1.5 text-xs hover:bg-paper disabled:opacity-40"
                              disabled={obdelujem !== null}
                              onClick={() => spremeni(p.id, 'OZJI_IZBOR')}
                            >
                              Ožji izbor
                            </button>
                          )}
                          <button
                            className="whitespace-nowrap rounded-md border border-line px-3 py-1.5 text-xs hover:bg-paper disabled:opacity-40"
                            disabled={obdelujem !== null}
                            onClick={() => spremeni(p.id, 'ZAVRNJENA')}
                          >
                            Zavrni
                          </button>
                          <button className={`${buttonClass} px-3 py-1.5 text-xs`} disabled={obdelujem !== null} onClick={() => spremeni(p.id, 'SPREJETA')}>
                            Sprejmi
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      )}

      {seEnoMesto && prijave.some((p) => p.status === 'ODDANA' || p.status === 'OZJI_IZBOR') && (
        <p className="mt-4 text-sm text-muted">
          Ob naslednjem sprejemu bo zasedba polna. Termin se bo zaprl, ostale prijave pa se bodo samodejno zavrnile.
        </p>
      )}
      {termin.status === 'ZAPRT' && <p className="mt-4 text-sm text-muted">Zasedba je polna, termin je zaprt.</p>}

      <div className="mt-6 flex justify-end">
        <button className={buttonClass} disabled>
          Objavi koncert
        </button>
      </div>
    </>
  )
}
